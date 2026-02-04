import { getAllPrices } from '../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const includeHistory = query.history === 'true'
  
  const prices = await getAllPrices()
  
  // Map symbols to metal type based on symbol patterns
  // Gold symbols: gds_AUTD (Au9999), hf_XAU (international gold)
  // Silver symbols: gds_AGTD (Ag9999), hf_XAG (international silver)
  const goldSymbols = ['gds_AUTD', 'hf_XAU']
  const silverSymbols = ['gds_AGTD', 'hf_XAG']
  
  // Calculate stats for gold and silver
  const goldPrices = prices.filter(p => goldSymbols.includes(p.symbol))
  const silverPrices = prices.filter(p => silverSymbols.includes(p.symbol))
  
  function calculateStats(priceList: typeof prices, type: 'gold' | 'silver') {
    if (priceList.length === 0) {
      return { 
        current: 0, 
        previous: 0, 
        high: 0, 
        low: 0, 
        avg: 0, 
        timestamp: new Date().toISOString(),
        history: []
      }
    }
    
    const latest = priceList[0]
    const previous = priceList[1]

    const allPrices = priceList.map(p => p.price)
    
    // Sample history data for trend chart (~50-100 points)
    let history: Array<{ value: number; timestamp: string }> = []
    
    if (includeHistory && priceList.length > 0) {
      const targetPoints = 50
      const step = Math.max(1, Math.floor(priceList.length / targetPoints))
      
      history = priceList
        .filter((_, index) => index % step === 0)
        .reverse() // Oldest first
        .map(p => ({
          value: p.price,
          timestamp: p.timestamp
        }))
    }
    
    return {
      current: latest?.price ?? 0,
      previous: previous?.price ?? 0,
      high: Math.max(...allPrices),
      low: Math.min(...allPrices),
      avg: allPrices.reduce((a, b) => a + b, 0) / allPrices.length,
      timestamp: latest?.timestamp ?? new Date().toISOString(),
      history
    }
  }
  
  return {
    gold: calculateStats(goldPrices, 'gold'),
    silver: calculateStats(silverPrices, 'silver'),
    updatedAt: new Date().toISOString()
  }
})
