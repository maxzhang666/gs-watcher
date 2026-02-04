import initSqlJs from 'sql.js'
import { consola } from 'consola'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

let db: any = null
let SQL: any = null

export async function getDatabase(): Promise<any> {
  if (db) {
    return db
  }

  // Initialize SQL.js
  if (!SQL) {
    // In production, wasm file is in node_modules/sql.js/dist
    const wasmBinary = fs.readFileSync(
      path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm')
    )
    SQL = await initSqlJs({ wasmBinary })
  }

  // Ensure .data directory exists
  const dataDir = path.resolve(process.cwd(), '.data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const dbPath = path.join(dataDir, 'prices.db')
  consola.info(`Initializing database at ${dbPath}`)

  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }
  
  initializeTables()
  
  consola.success('Database initialized successfully')
  
  return db
}

export function saveDatabase(): void {
  if (!db) return
  
  const dataDir = path.resolve(process.cwd(), '.data')
  const dbPath = path.join(dataDir, 'prices.db')
  
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbPath, buffer)
}

function initializeTables(): void {
  if (!db) return
  
  // Create price_history table
  db.run(`
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
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_symbol_time 
    ON price_history(symbol, created_at)
  `)
  
  // Create alert_logs table for cooldown tracking
  db.run(`
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
  
  const result = db.exec(`
    SELECT price, created_at 
    FROM price_history 
    WHERE symbol = '${symbol}' 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `)
  
  if (result.length === 0) return []
  
  const rows = result[0].values
  return rows.map((row: any) => ({
    price: row[0],
    created_at: row[1]
  }))
}

export function getTodayRange(symbol: string): { max: number | null, min: number | null } {
  if (!db) return { max: null, min: null }
  
  // Get start of today in UTC+8 timezone
  const now = new Date()
  const utc8Offset = 8 * 60 * 60 * 1000
  const todayStart = new Date(now.getTime() + utc8Offset)
  todayStart.setUTCHours(0, 0, 0, 0)
  const todayStartTimestamp = todayStart.getTime() - utc8Offset
  
  const result = db.exec(`
    SELECT MAX(price) as max, MIN(price) as min
    FROM price_history
    WHERE symbol = '${symbol}' AND created_at >= ${todayStartTimestamp}
  `)
  
  if (result.length === 0 || result[0].values.length === 0) {
    return { max: null, min: null }
  }
  
  const row = result[0].values[0]
  return { max: row[0], min: row[1] }
}

export function checkAlertCooldown(
  alertType: string, 
  symbol: string, 
  cooldownMs: number = 15 * 60 * 1000
): boolean {
  if (!db) return true
  
  const result = db.exec(`
    SELECT last_sent_at 
    FROM alert_logs 
    WHERE alert_type = '${alertType}' AND symbol = '${symbol}'
  `)
  
  if (result.length === 0 || result[0].values.length === 0) {
    return true // No record, can send
  }
  
  const lastSentAt = result[0].values[0][0]
  const timeSinceLastAlert = Date.now() - lastSentAt
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
  
  db.run(`
    INSERT INTO price_history (symbol, price, price_open, price_high, price_low, created_at)
    VALUES (
      '${record.symbol}',
      ${record.price},
      ${record.price_open},
      ${record.price_high},
      ${record.price_low},
      ${record.created_at}
    )
  `)
  
  saveDatabase()
}

export function updateAlertLog(alertType: string, symbol: string): void {
  if (!db) return
  
  db.run(`
    INSERT OR REPLACE INTO alert_logs (alert_type, symbol, last_sent_at)
    VALUES ('${alertType}', '${symbol}', ${Date.now()})
  `)
  
  saveDatabase()
}

export function getRecordCount(): number {
  if (!db) return 0
  
  const result = db.exec('SELECT COUNT(*) as count FROM price_history')
  
  if (result.length === 0 || result[0].values.length === 0) {
    return 0
  }
  
  return result[0].values[0][0] as number
}

export async function getAllPrices(): Promise<Array<{ symbol: string, price: number, timestamp: string }>> {
  const database = await getDatabase()
  
  const result = database.exec(`
    SELECT symbol, price, created_at 
    FROM price_history 
    ORDER BY created_at DESC 
    LIMIT 200
  `)
  
  if (result.length === 0) return []
  
  const rows = result[0].values
  return rows.map((row: any) => ({
    symbol: row[0],
    price: row[1],
    timestamp: new Date(row[2]).toISOString()
  }))
}
