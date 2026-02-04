export function usePriceFormat() {
  /**
   * Format price with currency symbol and thousand separators
   * @param value - Price value
   * @param currency - Currency code ('CNY' or 'USD')
   * @param decimals - Number of decimal places (default: 2)
   */
  function formatCurrency(value: number | null | undefined, currency: 'CNY' | 'USD' = 'CNY', decimals: number = 2): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '—'
    }

    const symbol = currency === 'CNY' ? '¥' : '$'
    const formatted = value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
    
    return `${symbol}${formatted}`
  }

  /**
   * Calculate percentage change between two values
   * @param current - Current value
   * @param previous - Previous value
   */
  function calculatePercentageChange(current: number | null | undefined, previous: number | null | undefined): number | null {
    if (current === null || current === undefined || previous === null || previous === undefined) {
      return null
    }
    
    if (previous === 0) {
      return null
    }
    
    return ((current - previous) / previous) * 100
  }

  /**
   * Calculate absolute change between two values
   * @param current - Current value
   * @param previous - Previous value
   */
  function calculateAbsoluteChange(current: number | null | undefined, previous: number | null | undefined): number | null {
    if (current === null || current === undefined || previous === null || previous === undefined) {
      return null
    }
    
    return current - previous
  }

  /**
   * Convert USD per ounce to USD per gram
   * @param usdPerOz - Price in USD per troy ounce
   */
  function convertOzToGram(usdPerOz: number | null | undefined): number | null {
    if (usdPerOz === null || usdPerOz === undefined || isNaN(usdPerOz)) {
      return null
    }
    
    // 1 troy ounce = 31.1035 grams
    return usdPerOz / 31.1035
  }

  /**
   * Format number with thousand separators
   * @param value - Numeric value
   * @param decimals - Number of decimal places (default: 2)
   */
  function formatNumber(value: number | null | undefined, decimals: number = 2): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '—'
    }
    
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  return {
    formatCurrency,
    calculatePercentageChange,
    calculateAbsoluteChange,
    convertOzToGram,
    formatNumber
  }
}
