<template>
  <div class="group relative bg-white dark:bg-[#181818] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-all duration-300 shadow-xl shadow-gray-200/50 dark:shadow-none"
    :class="metal === 'gold' ? 'hover:border-yellow-500/50' : 'hover:border-cyan-500/50'">
    
    <!-- Glow Effect -->
    <div class="absolute -top-10 -right-10 w-40 h-40 blur-[50px] rounded-full transition-all duration-500 opacity-0 dark:opacity-100 group-hover:w-56 group-hover:h-56"
      :class="metal === 'gold' ? 'bg-yellow-500/20' : 'bg-cyan-500/20'"></div>

    <!-- Header -->
    <div class="flex justify-between items-start mb-6 relative">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
          :class="metal === 'gold' 
            ? 'bg-yellow-50 text-yellow-600 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-500 dark:border-yellow-500/30' 
            : 'bg-cyan-50 text-cyan-600 border border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-500/30'">
          {{ metal === 'gold' ? 'Au' : 'Ag' }}
        </div>
        <div>
          <h2 class="text-gray-900 dark:text-white font-bold text-xl tracking-wide">
            <span class="text-sm font-normal text-gray-400 ml-1">{{ metal === 'gold' ? 'GOLD' : 'SILVER' }}</span>
          </h2>
        </div>
      </div>
      <div class="text-right" v-if="trendPercent !== null">
        <div class="font-mono font-bold text-lg leading-none"
          :class="trendPercent > 0 ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'">
          {{ trendPercent > 0 ? '▲' : '▼' }} {{ formatNumber(Math.abs(trendPercent), 2) }}%
        </div>
        <div class="text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-1">
          {{ trendPercent > 0 ? '+' : '' }}{{ formatNumber(priceChange, 2) }} ¥/g
        </div>
      </div>
    </div>

    <!-- Price Display -->
    <div class="mb-8 relative">
      <div class="text-[10px] mb-1 font-mono uppercase tracking-widest font-bold flex items-center gap-1"
        :class="metal === 'gold' ? 'text-yellow-600 dark:text-yellow-500/80' : 'text-cyan-600 dark:text-cyan-500/80'">
        <span class="w-1 h-1 rounded-full animate-pulse"
          :class="metal === 'gold' ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-cyan-600 dark:bg-cyan-500'"></span>
        CNY Spot Price (Per Gram)
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl md:text-4xl text-gray-400 dark:text-gray-500 font-light">¥</span>
        <span v-if="currentPrice > 0" class="text-6xl md:text-7xl font-mono font-bold text-gray-900 dark:text-white tracking-tighter drop-shadow-sm dark:drop-shadow-2xl transition-colors">
          {{ Math.floor(currentPrice) }}<span class="text-4xl text-gray-300 dark:text-gray-500">.{{ (currentPrice % 1).toFixed(2).substring(2) }}</span>
        </span>
        <span v-else class="text-6xl md:text-7xl font-mono font-bold text-gray-300 dark:text-gray-700">
          --<span class="text-4xl">.--</span>
        </span>
      </div>
    </div>

    <!-- Stats Box -->
    <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm transition-colors">
      <div class="grid grid-cols-2 gap-4">
        <div class="border-r border-gray-200 dark:border-gray-800 pr-4">
          <div class="text-[10px] text-gray-400 dark:text-gray-500 mb-1 font-mono uppercase">{{ metal === 'gold' ? 'NY Gold' : 'NY Silver' }}</div>
          <div class="text-xl font-mono text-gray-700 dark:text-gray-200 font-bold">
            {{ newyorkPrice > 0 ? formatCurrency(newyorkPrice, 'USD', 2) + '/oz' : '--' }}
          </div>
        </div>
        <div>
          <div class="text-[10px] text-gray-400 dark:text-gray-500 mb-1 font-mono uppercase">{{ metal === 'gold' ? 'LDN Gold' : 'LDN Silver' }}</div>
          <div class="text-xl font-mono text-gray-500 dark:text-gray-400">
            {{ londonPrice > 0 ? formatCurrency(londonPrice, 'USD', 2) + '/oz' : '--' }}
          </div>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800/50 flex items-center justify-between">
        <span class="text-[10px] text-gray-400 dark:text-gray-600">24H Trend</span>
        <div class="w-24 h-6">
          <TrendChart :data="historyData" :color="metal === 'gold' ? 'red' : 'green'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PriceData {
  current?: number
  previous?: number
  change?: number  // 涨跌金额 (¥/g)
  high?: number
  low?: number
  london?: number  // 伦敦金/银 ($/oz)
  newyork?: number // 纽约金/银 ($/oz)
  timestamp?: string
  history?: Array<{ value: number; timestamp: string }>
}

interface Props {
  metal: 'gold' | 'silver'
  data?: PriceData
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({})
})

const { formatCurrency, calculatePercentageChange, formatNumber } = usePriceFormat()

const currentPrice = computed(() => props.data?.current ?? 0)
const previousPrice = computed(() => props.data?.previous ?? 0)
const priceChange = computed(() => props.data?.change ?? 0)
const newyorkPrice = computed(() => props.data?.newyork ?? 0)
const londonPrice = computed(() => props.data?.london ?? 0)

const trendPercent = computed(() => 
  calculatePercentageChange(currentPrice.value, previousPrice.value)
)

const formattedPrice = computed(() => 
  formatCurrency(currentPrice.value, 'CNY', 2)
)

const stats = computed(() => ({
  high: props.data?.high ?? null,
  low: props.data?.low ?? null
}))

const historyData = computed(() => {
  if (!props.data?.history || props.data.history.length === 0) {
    return []
  }
  return props.data.history
})

const formattedTime = computed(() => {
  if (!props.data?.timestamp) return '--:--:--'
  return new Date(props.data.timestamp).toLocaleTimeString('zh-CN')
})
</script>