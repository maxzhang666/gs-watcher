import { createClient } from '@libsql/client'
import { consola } from 'consola'
import path from 'path'
import fs from 'fs'

let client: ReturnType<typeof createClient> | null = null

export function getDatabase() {
  if (client) {
    return client
  }

  // Ensure .data directory exists
  const dataDir = path.resolve(process.cwd(), '.data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const dbPath = path.join(dataDir, 'prices.db')
  consola.info(`Initializing database at ${dbPath}`)

  client = createClient({
    url: `file:${dbPath}`
  })
  
  initializeTables()
  
  consola.success('Database initialized successfully')
  
  return client
}

async function initializeTables(): Promise<void> {
  if (!client) return
  
  // Create price_history table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      price REAL NOT NULL,
      price_open REAL,
      price_high REAL,
      price_low REAL,
      created_at INTEGER NOT NULL
    )
  `)
  
  // Create index for efficient queries
  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_symbol_time 
    ON price_history(symbol, created_at)
  `)
  
  // Create alert_logs table for cooldown tracking
  await client.execute(`
    CREATE TABLE IF NOT EXISTS alert_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alert_type TEXT NOT NULL,
      symbol TEXT NOT NULL,
      last_sent_at INTEGER NOT NULL,
      UNIQUE(alert_type, symbol)
    )
  `)
  
  consola.info('Database tables initialized')
}

export async function getRecentPrices(symbol: string, limit: number = 5): Promise<Array<{ price: number, created_at: number }>> {
  if (!client) return []
  
  const result = await client.execute({
    sql: `SELECT price, created_at FROM price_history WHERE symbol = ? ORDER BY created_at DESC LIMIT ?`,
    args: [symbol, limit]
  })
  
  return result.rows.map(row => ({
    price: row.price as number,
    created_at: row.created_at as number
  }))
}

export async function getTodayRange(symbol: string): Promise<{ max: number | null, min: number | null }> {
  if (!client) return { max: null, min: null }
  
  // Get start of today in UTC+8 timezone
  const now = new Date()
  const utc8Offset = 8 * 60 * 60 * 1000
  const todayStart = new Date(now.getTime() + utc8Offset)
  todayStart.setUTCHours(0, 0, 0, 0)
  const todayStartTimestamp = todayStart.getTime() - utc8Offset
  
  const result = await client.execute({
    sql: `SELECT MAX(price) as max, MIN(price) as min FROM price_history WHERE symbol = ? AND created_at >= ?`,
    args: [symbol, todayStartTimestamp]
  })
  
  if (result.rows.length === 0) {
    return { max: null, min: null }
  }
  
  const row = result.rows[0]
  return { 
    max: row.max as number | null, 
    min: row.min as number | null 
  }
}

export async function checkAlertCooldown(
  alertType: string, 
  symbol: string, 
  cooldownMs: number = 15 * 60 * 1000
): Promise<boolean> {
  if (!client) return true
  
  const result = await client.execute({
    sql: `SELECT last_sent_at FROM alert_logs WHERE alert_type = ? AND symbol = ?`,
    args: [alertType, symbol]
  })
  
  if (result.rows.length === 0) {
    return true // No record, can send
  }
  
  const lastSentAt = result.rows[0].last_sent_at as number
  const timeSinceLastAlert = Date.now() - lastSentAt
  return timeSinceLastAlert >= cooldownMs
}

export async function insertPrice(record: {
  symbol: string
  price: number
  price_open: number | null
  price_high: number | null
  price_low: number | null
  created_at: number
}): Promise<void> {
  if (!client) return
  
  await client.execute({
    sql: `INSERT INTO price_history (symbol, price, price_open, price_high, price_low, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      record.symbol,
      record.price,
      record.price_open,
      record.price_high,
      record.price_low,
      record.created_at
    ]
  })
}

export async function updateAlertLog(alertType: string, symbol: string): Promise<void> {
  if (!client) return
  
  await client.execute({
    sql: `INSERT OR REPLACE INTO alert_logs (alert_type, symbol, last_sent_at) VALUES (?, ?, ?)`,
    args: [alertType, symbol, Date.now()]
  })
}

export async function getRecordCount(): Promise<number> {
  if (!client) return 0
  
  const result = await client.execute('SELECT COUNT(*) as count FROM price_history')
  
  if (result.rows.length === 0) {
    return 0
  }
  
  return result.rows[0].count as number
}

export async function getAllPrices(): Promise<Array<{ symbol: string, price: number, timestamp: string }>> {
  const database = getDatabase()
  
  const result = await database.execute(`
    SELECT symbol, price, created_at 
    FROM price_history 
    ORDER BY created_at DESC 
    LIMIT 200
  `)
  
  return result.rows.map(row => ({
    symbol: row.symbol as string,
    price: row.price as number,
    timestamp: new Date(row.created_at as number).toISOString()
  }))
}
