import Database from 'better-sqlite3'
import { consola } from 'consola'
import path from 'path'
import fs from 'fs'

let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (db) {
    return db
  }

  // Ensure .data directory exists
  const dataDir = path.resolve(process.cwd(), '.data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const dbPath = path.join(dataDir, 'prices.db')
  consola.info(`Initializing database at ${dbPath}`)

  db = new Database(dbPath)
  
  initializeTables()
  
  consola.success('Database initialized successfully')
  
  return db
}

function initializeTables(): void {
  if (!db) return
  
  // Create price_history table
  db.exec(`
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
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_symbol_time 
    ON price_history(symbol, created_at)
  `)
  
  // Create alert_logs table for cooldown tracking
  db.exec(`
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

export function getRecentPrices(symbol: string, limit: number = 5): Array<{ price: number, created_at: number }> {
  if (!db) return []
  
  const stmt = db.prepare(`
    SELECT price, created_at 
    FROM price_history 
    WHERE symbol = ? 
    ORDER BY created_at DESC 
    LIMIT ?
  `)
  
  return stmt.all(symbol, limit) as Array<{ price: number, created_at: number }>
}

export function getTodayRange(symbol: string): { max: number | null, min: number | null } {
  if (!db) return { max: null, min: null }
  
  // Get start of today in UTC+8 timezone
  const now = new Date()
  const utc8Offset = 8 * 60 * 60 * 1000
  const todayStart = new Date(now.getTime() + utc8Offset)
  todayStart.setUTCHours(0, 0, 0, 0)
  const todayStartTimestamp = todayStart.getTime() - utc8Offset
  
  const stmt = db.prepare(`
    SELECT MAX(price) as max, MIN(price) as min
    FROM price_history
    WHERE symbol = ? AND created_at >= ?
  `)
  
  const result = stmt.get(symbol, todayStartTimestamp) as { max: number | null, min: number | null } | undefined
  
  return result || { max: null, min: null }
}

export function checkAlertCooldown(
  alertType: string, 
  symbol: string, 
  cooldownMs: number = 15 * 60 * 1000
): boolean {
  if (!db) return true
  
  const stmt = db.prepare(`
    SELECT last_sent_at 
    FROM alert_logs 
    WHERE alert_type = ? AND symbol = ?
  `)
  
  const result = stmt.get(alertType, symbol) as { last_sent_at: number } | undefined
  
  if (!result) {
    return true // No record, can send
  }
  
  const timeSinceLastAlert = Date.now() - result.last_sent_at
  return timeSinceLastAlert >= cooldownMs
}

export function insertPrice(record: {
  symbol: string
  price: number
  price_open: number | null
  price_high: number | null
  price_low: number | null
  created_at: number
}): void {
  if (!db) return
  
  const stmt = db.prepare(`
    INSERT INTO price_history (symbol, price, price_open, price_high, price_low, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  
  stmt.run(
    record.symbol,
    record.price,
    record.price_open,
    record.price_high,
    record.price_low,
    record.created_at
  )
}

export function updateAlertLog(alertType: string, symbol: string): void {
  if (!db) return
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO alert_logs (alert_type, symbol, last_sent_at)
    VALUES (?, ?, ?)
  `)
  
  stmt.run(alertType, symbol, Date.now())
}

export function getRecordCount(): number {
  if (!db) return 0
  
  const stmt = db.prepare('SELECT COUNT(*) as count FROM price_history')
  const result = stmt.get() as { count: number }
  
  return result.count
}

export function getAllPrices(): Array<{ symbol: string, price: number, timestamp: string }> {
  const database = getDatabase()
  
  const stmt = database.prepare(`
    SELECT symbol, price, created_at 
    FROM price_history 
    ORDER BY created_at DESC 
    LIMIT 200
  `)
  
  const rows = stmt.all() as Array<{ symbol: string, price: number, created_at: number }>
  
  return rows.map(row => ({
    symbol: row.symbol,
    price: row.price,
    timestamp: new Date(row.created_at).toISOString()
  }))
}
