import { consola } from 'consola'

export interface GoldDataResult {
  symbol: string
  price: number
  price_open: number | null
  price_high: number | null
  price_low: number | null
}

let consecutiveFailures = 0

export async function fetchGoldData(): Promise<GoldDataResult[]> {
  const url = 'https://www.guojijinjia.com/d/gold.js'
  
  try {
    const response = await fetchWithRetry(url, 3)
    
    if (!response) {
      consecutiveFailures++
      consola.error(`Failed to fetch data after retries. Consecutive failures: ${consecutiveFailures}`)
      return []
    }
    
    const data = parseGoldJS(response)
    
    if (data.length > 0) {
      consecutiveFailures = 0 // Reset on success
      consola.success(`Fetched ${data.length} symbols successfully`)
    }
    
    return data
  } catch (error) {
    consecutiveFailures++
    consola.error('Error fetching gold data:', error)
    return []
  }
}

async function fetchWithRetry(url: string, retries: number): Promise<string | null> {
  const delays = [2000, 5000, 10000]
  
  for (let i = 0; i < retries; i++) {
    try {
      consola.info(`Fetching data from ${url} (attempt ${i + 1}/${retries})`)
      
      const response = await $fetch<string>(url, {
        timeout: 5000,
        responseType: 'text'
      })
      
      return response
    } catch (error) {
      console.error(`[Fetcher] Attempt ${i + 1} failed:`, error)
      consola.warn(`Fetch attempt ${i + 1} failed:`, error)
      
      if (i === retries - 1) {
        // Last attempt failed
        return null
      }
      
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delays[i]))
    }
  }
  
  return null
}

function parseGoldJS(text: string): GoldDataResult[] {
  const results: GoldDataResult[] = []
  
  // Regex to match: var hq_str_<symbol>="<values>"
  const regex = /var hq_str_(\w+)="([^"]+)"/g
  const matches = [...text.matchAll(regex)]
  
  for (const match of matches) {
    try {
      const symbol = match[1]
      const values = match[2]
      
      if (!symbol || !values) continue
      
      const fields = values.split(',')
      
      if (fields.length < 6) {
        consola.warn(`Symbol ${symbol} has insufficient fields (${fields.length}), using price only`)
        results.push({
          symbol,
          price: parseFloat(fields[0] || '0') || 0,
          price_open: null,
          price_high: null,
          price_low: null
        })
        continue
      }
      
      // Extract OHLC data based on field positions
      results.push({
        symbol,
        price: parseFloat(fields[0] || '0') || 0,           // Current price
        price_open: parseFloat(fields[2] || '0') || null,   // Open price
        price_high: parseFloat(fields[4] || '0') || null,   // High price
        price_low: parseFloat(fields[5] || '0') || null     // Low price
      })
    } catch (error) {
      consola.warn(`Failed to parse symbol:`, error)
    }
  }
  
  return results
}

export function getConsecutiveFailures(): number {
  return consecutiveFailures
}

export function resetConsecutiveFailures(): void {
  consecutiveFailures = 0
}
