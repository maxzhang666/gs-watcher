import { getAllPrices } from '../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const includeHistory = query.history === 'true'
  
  const prices = await getAllPrices()
  
  // Symbol mapping:
  // Gold: gds_AUTD (国内Au9999人民币/克), hf_XAU (伦敦金美元/盎司), hf_GC (纽约金美元/盎司)
  // Silver: gds_AGTD (国内Ag9999人民币/千克!), hf_XAG (伦敦银美元/盎司), hf_SI (纽约银美元/盎司)
  
  const goldCNY = prices.filter(p => p.symbol === 'gds_AUTD')  // 人民币/克
  const goldLondon = prices.filter(p => p.symbol === 'hf_XAU')  // 美元/盎司
  const goldNY = prices.filter(p => p.symbol === 'hf_GC')       // 美元/盎司
  const silverCNY = prices.filter(p => p.symbol === 'gds_AGTD') // 人民币/千克 (需要转换为克)
  const silverLondon = prices.filter(p => p.symbol === 'hf_XAG') // 美元/盎司
  const silverNY = prices.filter(p => p.symbol === 'hf_SI')      // 美元/盎司
  
  function calculateStats(
    cnyPrices: typeof prices, 
    londonPrices: typeof prices, 
    nyPrices: typeof prices,
    isSilver: boolean = false  // 白银需要转换单位
  ) {
    if (cnyPrices.length === 0) {
      return { 
        current: 0, 
        previous: 0,
        change: 0,
        high: 0, 
        low: 0,
        london: 0,
        newyork: 0,
        timestamp: new Date().toISOString(),
        history: []
      }
    }
    
    const latest = cnyPrices[0]
    const previous = cnyPrices[1]
    const latestLondon = londonPrices[0]
    const latestNY = nyPrices[0]

    // 白银价格需要从千克转换为克
    const convertPrice = (price: number) => isSilver ? price / 1000 : price
    
    const allPrices = cnyPrices.map(p => convertPrice(p.price))
    
    // Sample history data for trend chart (~50-100 points)
    let history: Array<{ value: number; timestamp: string }> = []
    
    if (includeHistory && cnyPrices.length > 0) {
      const targetPoints = 50
      const step = Math.max(1, Math.floor(cnyPrices.length / targetPoints))
      
      history = cnyPrices
        .filter((_, index) => index % step === 0)
        .reverse() // Oldest first
        .map(p => ({
          value: convertPrice(p.price),
          timestamp: p.timestamp
        }))
    }
    
    const currentPrice = convertPrice(latest?.price ?? 0)
    const previousPrice = convertPrice(previous?.price ?? 0)
    
    return {
      current: currentPrice,
      previous: previousPrice,
      change: currentPrice - previousPrice,  // 涨跌金额 (¥/g)
      high: Math.max(...allPrices),
      low: Math.min(...allPrices),
      london: latestLondon?.price ?? 0,  // 伦敦金/银 美元/盎司
      newyork: latestNY?.price ?? 0,      // 纽约金/银 美元/盎司
      timestamp: latest?.timestamp ?? new Date().toISOString(),
      history
    }
  }
  
  return {
    gold: calculateStats(goldCNY, goldLondon, goldNY, false),
    silver: calculateStats(silverCNY, silverLondon, silverNY, true),  // true = 白银需要单位转换
    updatedAt: new Date().toISOString()
  }
})
