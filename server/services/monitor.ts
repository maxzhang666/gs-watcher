import { consola } from 'consola'
import { getRecentPrices, getTodayRange, checkAlertCooldown, updateAlertLog } from '../utils/db'

export interface Alert {
  type: 'fluctuation' | 'peak' | 'valley' | 'trend_up' | 'trend_down'
  symbol: string
  message: string
  price: number
}

export interface AnalyzeOptions {
  symbol: string
  currentPrice: number
  threshold: number
}

export async function analyzePrice(options: AnalyzeOptions): Promise<Alert[]> {
  const { symbol, currentPrice, threshold } = options
  const alerts: Alert[] = []
  
  try {
    // Check fluctuation
    const fluctuationAlert = await checkFluctuation(symbol, currentPrice, threshold)
    if (fluctuationAlert) alerts.push(fluctuationAlert)
    
    // Check peak/valley
    const peakValleyAlerts = await checkPeakValley(symbol, currentPrice)
    alerts.push(...peakValleyAlerts)
    
    // Check trend
    const trendAlert = await checkTrend(symbol, currentPrice)
    if (trendAlert) alerts.push(trendAlert)
    
    // Apply cooldown filter and update logs
    const filteredAlerts: Alert[] = []
    for (const alert of alerts) {
      const canSend = await checkAlertCooldown(alert.type, alert.symbol)
      if (canSend) {
        await updateAlertLog(alert.type, alert.symbol)
        filteredAlerts.push(alert)
      } else {
        consola.debug(`Alert ${alert.type} for ${alert.symbol} suppressed by cooldown`)
      }
    }
    
    return filteredAlerts
  } catch (error) {
    consola.error(`Error analyzing price for ${symbol}:`, error)
    return []
  }
}

async function checkFluctuation(symbol: string, currentPrice: number, threshold: number): Promise<Alert | null> {
  const recent = await getRecentPrices(symbol, 1)
  
  if (recent.length === 0 || !recent[0]) {
    // No previous data, cannot detect fluctuation
    return null
  }
  
  const previousPrice = recent[0].price
  const change = currentPrice - previousPrice
  const absChange = Math.abs(change)
  
  if (absChange >= threshold) {
    const direction = change > 0 ? '+' : ''
    return {
      type: 'fluctuation',
      symbol,
      message: `价格剧烈波动: ${direction}${change.toFixed(2)} (从 ${previousPrice} 到 ${currentPrice})`,
      price: currentPrice
    }
  }
  
  return null
}

async function checkPeakValley(symbol: string, currentPrice: number): Promise<Alert[]> {
  const alerts: Alert[] = []
  const todayRange = await getTodayRange(symbol)
  
  if (todayRange.max !== null && currentPrice > todayRange.max) {
    alerts.push({
      type: 'peak',
      symbol,
      message: `创日内新高: ${currentPrice} (前高: ${todayRange.max})`,
      price: currentPrice
    })
  }
  
  if (todayRange.min !== null && currentPrice < todayRange.min) {
    alerts.push({
      type: 'valley',
      symbol,
      message: `创日内新低: ${currentPrice} (前低: ${todayRange.min})`,
      price: currentPrice
    })
  }
  
  return alerts
}

async function checkTrend(symbol: string, currentPrice: number): Promise<Alert | null> {
  const recent = await getRecentPrices(symbol, 5)
  
  if (recent.length < 4) {
    // Need at least 4 historical + 1 current = 5 total for trend detection
    return null
  }
  
  // Build array with current price at front and recent prices
  const prices = [currentPrice, ...recent.map(r => r.price)]
  
  // Check for strictly increasing (upward trend)
  const isUpTrend = prices.every((price, idx) => {
    if (idx === 0) return true
    const prevPrice = prices[idx - 1]
    return prevPrice !== undefined && price > prevPrice
  })
  
  if (isUpTrend) {
    return {
      type: 'trend_up',
      symbol,
      message: `持续上涨趋势 (连续${prices.length}次上涨)`,
      price: currentPrice
    }
  }
  
  // Check for strictly decreasing (downward trend)
  const isDownTrend = prices.every((price, idx) => {
    if (idx === 0) return true
    const prevPrice = prices[idx - 1]
    return prevPrice !== undefined && price < prevPrice
  })
  
  if (isDownTrend) {
    return {
      type: 'trend_down',
      symbol,
      message: `持续下跌趋势 (连续${prices.length}次下跌)`,
      price: currentPrice
    }
  }
  
  return null
}
