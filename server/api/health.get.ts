import { consola } from 'consola'
import { getDatabase, getRecordCount } from '../utils/db'
import { getSchedulerStatus } from '../plugins/scheduler'

// Global state to track last fetch time
let lastFetchTime: number | null = null

export function updateLastFetchTime(timestamp: number): void {
  lastFetchTime = timestamp
}

export default defineEventHandler(async (event) => {
  try {
    await getDatabase()
    
    // Query total record count
    const recordCount = getRecordCount()
    
    // Get scheduler status
    const scheduler = getSchedulerStatus()
    const schedulerRunning = scheduler.running
    
    // Check if data is stale (more than 5 minutes old)
    const now = Date.now()
    const isStale = lastFetchTime !== null && (now - lastFetchTime) > 5 * 60 * 1000
    
    const response: any = {
      status: 'healthy',
      lastFetchTime,
      recordCount,
      schedulerRunning
    }
    
    if (isStale) {
      response.warning = 'Data may be stale (no fetch in last 5 minutes)'
    }
    
    setResponseStatus(event, 200)
    return response
    
  } catch (error) {
    consola.error('Health check failed:', error)
    
    setResponseStatus(event, 503)
    return {
      status: 'unhealthy',
      error: 'Database connection failed'
    }
  }
})
