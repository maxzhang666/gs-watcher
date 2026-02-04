import { consola } from 'consola'
import { fetchGoldData, getConsecutiveFailures } from '../utils/fetcher'
import { insertPrice } from '../utils/db'
import { analyzePrice } from '../services/monitor'
import { sendFeishuNotification, sendDataSourceAlert } from '../utils/notify'
import { updateLastFetchTime } from '../api/health.get'

let schedulerIntervalId: NodeJS.Timeout | null = null
let isRunning = false
let lastDataSourceFailureAlertSent = false

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  const scanInterval = config.monitor.scanInterval
  const symbolsRaw = config.monitor.symbols
  // Ensure symbols is always an array
  const symbols = Array.isArray(symbolsRaw) ? symbolsRaw : String(symbolsRaw).split(',').map(s => s.trim())
  const thresholds = config.monitor.thresholds
  const webhookUrl = config.feishuWebhook
  
  // Initialize database
  const { getDatabase } = await import('../utils/db')
  await getDatabase()
  
  consola.info(`Starting scheduler with interval: ${scanInterval}ms`)
  consola.info(`Monitoring symbols: ${symbols.join(', ')}`)
  
  // Run once immediately on startup
  await runMonitoringCycle(symbols, thresholds, webhookUrl)
  
  // Start monitoring cycle
  schedulerIntervalId = setInterval(async () => {
    await runMonitoringCycle(symbols, thresholds, webhookUrl)
  }, scanInterval)
  
  consola.success('Scheduler initialized successfully')
})

async function runMonitoringCycle(
  symbols: string[], 
  thresholds: Record<string, number>,
  webhookUrl: string
): Promise<void> {
  // Prevent concurrent executions
  if (isRunning) {
    consola.warn('Previous monitoring cycle still running, skipping this iteration')
    return
  }
  
  isRunning = true
  const cycleStartTime = Date.now()
  
  consola.info('[Scheduler] Starting monitoring cycle')
  
  try {
    // Step 1: Fetch data
    const goldData = await fetchGoldData()
    
    // Update last fetch time
    if (goldData.length > 0) {
      updateLastFetchTime(Date.now())
    }
    
    // Check for consecutive failures
    const failures = getConsecutiveFailures()
    if (failures >= 5 && !lastDataSourceFailureAlertSent) {
      await sendDataSourceAlert('failure', webhookUrl)
      lastDataSourceFailureAlertSent = true
    } else if (failures === 0 && lastDataSourceFailureAlertSent) {
      await sendDataSourceAlert('recovered', webhookUrl)
      lastDataSourceFailureAlertSent = false
    }
    
    if (goldData.length === 0) {
      consola.warn('[Scheduler] No data fetched, skipping cycle')
      return
    }
    
    // Filter to only monitored symbols
    const filteredData = goldData.filter(item => symbols.includes(item.symbol))
    
    if (filteredData.length === 0) {
      consola.warn(`[Scheduler] None of the monitored symbols found in fetched data`)
      return
    }
    
    let totalAlerts = 0
    
    // Step 2-4: Store, Analyze, Notify for each symbol
    for (const data of filteredData) {
      try {
        // Store price data
        insertPrice({
          symbol: data.symbol,
          price: data.price,
          price_open: data.price_open,
          price_high: data.price_high,
          price_low: data.price_low,
          created_at: Date.now()
        })
        
        // Analyze and get alerts
        const threshold = thresholds[data.symbol] || 5 // Default threshold
        const alerts = await analyzePrice({
          symbol: data.symbol,
          currentPrice: data.price,
          threshold
        })
        
        // Send notifications
        if (alerts.length > 0) {
          await sendFeishuNotification(alerts, webhookUrl)
          totalAlerts += alerts.length
        }
      } catch (error) {
        consola.error(`[Scheduler] Error processing symbol ${data.symbol}:`, error)
        // Continue with next symbol
      }
    }
    
    const cycleDuration = Date.now() - cycleStartTime
    consola.success(`[Scheduler] Cycle completed in ${cycleDuration}ms. Fetched ${filteredData.length} symbols, triggered ${totalAlerts} alerts`)
    
  } catch (error) {
    consola.error('[Scheduler] Cycle error:', error)
  } finally {
    isRunning = false
  }
}

export function getSchedulerStatus(): { running: boolean, intervalId: NodeJS.Timeout | null } {
  return {
    running: schedulerIntervalId !== null,
    intervalId: schedulerIntervalId
  }
}
