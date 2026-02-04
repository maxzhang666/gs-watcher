<template>
  <div class="bg-[#1E1E1E] rounded-xl border border-gray-800 p-6 shadow-2xl relative overflow-hidden group hover:border-gray-700 transition-colors duration-300">
    
    <div 
      class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-bl-full pointer-events-none"
      :class="variant === 'gold' ? 'from-yellow-400 to-transparent' : 'from-cyan-400 to-transparent'"
    ></div>

    <div class="flex justify-between items-start mb-6">
      <div class="flex items-center gap-3">
        <div 
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border border-opacity-20"
            :class="variant === 'gold' ? 'bg-yellow-900/30 text-yellow-500 border-yellow-500' : 'bg-cyan-900/30 text-cyan-400 border-cyan-400'"
        >
          {{ symbol }}
        </div>
        <div>
          <h2 class="text-gray-100 font-bold text-xl tracking-wider">{{ name }}</h2>
          <p class="text-xs text-gray-500 font-mono">SPOT MARKET</p>
        </div>
      </div>
      
      <div 
        class="px-3 py-1 rounded font-mono font-bold text-sm flex items-center gap-1"
        :class="Number(changePercent) >= 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'"
      >
        <span v-if="Number(changePercent) >= 0">▲</span>
        <span v-else>▼</span>
        {{ changePercent }}%
      </div>
    </div>

    <div class="mb-8">
      <div class="text-xs text-gray-500 mb-1 font-mono uppercase">USD / Ounce (Intl.)</div>
      <div class="text-5xl font-mono font-bold text-white tracking-tighter">
        ${{ formatPrice(priceUsdOz) }}
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 border-t border-gray-800 pt-6">
      <div class="col-span-1">
        <div class="text-[10px] text-gray-500 mb-1 font-mono">RMB / Gram</div>
        <div 
            class="text-2xl font-mono font-bold"
            :class="variant === 'gold' ? 'text-yellow-500' : 'text-cyan-400'"
        >
          ¥{{ formatPrice(priceCnyG) }}
        </div>
      </div>

      <div class="col-span-1 text-right md:text-left">
        <div class="text-[10px] text-gray-600 mb-1 font-mono">RMB / Ounce</div>
        <div class="text-lg font-mono text-gray-400">
          ¥{{ formatPrice(priceCnyOz) }}
        </div>
      </div>

      <div class="col-span-1">
        <div class="text-[10px] text-gray-600 mb-1 font-mono">USD / Gram</div>
        <div class="text-lg font-mono text-gray-400">
          ${{ formatPrice(priceUsdG) }}
        </div>
      </div>
      
      <div class="col-span-1 flex items-end justify-end opacity-50">
        <svg class="w-full h-8 stroke-current" :class="Number(changePercent) >= 0 ? 'text-red-800' : 'text-green-800'" fill="none" viewBox="0 0 100 20">
             <path d="M0 10 Q 25 20, 50 10 T 100 5" stroke-width="2" stroke-linecap="round" />
         </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义接收的数据
defineProps({
  variant: { type: String, default: 'gold' }, // 'gold' or 'silver'
  name: String,
  symbol: String,
  priceUsdOz: [Number, String],
  priceCnyG: [Number, String],
  priceCnyOz: [Number, String],
  priceUsdG: [Number, String],
  changePercent: [Number, String]
})

// 简单的价格格式化工具
const formatPrice = (val) => {
  if (!val) return '0.00'
  return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>