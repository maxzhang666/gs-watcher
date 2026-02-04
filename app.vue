<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] transition-colors duration-300 flex flex-col">
    <!-- Header -->
    <header class="bg-white/80 dark:bg-[#121212] backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between z-30 relative transition-colors duration-300 shadow-sm dark:shadow-none">
      <div class="hidden md:flex items-center gap-2 text-gray-400 dark:text-gray-500 font-bold tracking-widest text-xs">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        CNY_MARKET_FOCUS
      </div>
      <MarketClock />
      <div class="flex items-center gap-3">
        <!-- Refresh Timer -->
        <button 
          @click="handleRefresh"
          @mouseenter="isHovering = true"
          @mouseleave="isHovering = false"
          class="relative w-10 h-10 flex items-center justify-center group"
          title="Click to refresh now"
        >
          <!-- Circular Progress -->
          <svg class="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="16"
              class="stroke-gray-200 dark:stroke-gray-700"
              stroke-width="2"
              fill="none"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              class="stroke-green-500 dark:stroke-green-400 transition-all duration-1000 ease-linear"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="100"
              :stroke-dashoffset="100 - (countdown / 5) * 100"
            />
          </svg>
          
          <!-- Content -->
          <div class="relative z-10 flex items-center justify-center w-full h-full">
            <!-- Countdown Number -->
            <span 
              v-show="!isHovering"
              class="text-xs font-mono font-bold text-gray-600 dark:text-gray-400 transition-opacity"
            >
              {{ countdown }}
            </span>
            
            <!-- Refresh Icon on Hover -->
            <svg 
              v-show="isHovering"
              class="w-5 h-5 text-green-500 dark:text-green-400 transition-opacity"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </div>
        </button>
        
        <ThemeToggle />
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <!-- Background Effects -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500"></div>
      
      <!-- Grid Pattern -->
      <div class="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.02]" 
           style="background-image: linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px); background-size: 40px 40px;">
      </div>

      <!-- Price Cards Grid -->
      <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 z-10">
        <PriceCard metal="gold" :data="priceData?.gold" />
        <PriceCard metal="silver" :data="priceData?.silver" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import type { SerializeObject } from 'nitropack'

useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap'
    }
  ]
})

const { data: priceData, error, pending, refresh } = await useFetch('/api/prices', {
  query: { history: true },
  key: 'prices-data'
})

// Create a unified loading state that respects hydration
const isLoading = computed(() => pending.value && !priceData.value)

// Refresh countdown state
const countdown = ref(5)
const isHovering = ref(false)
const isMounted = ref(false)

// Manual refresh function
function handleRefresh() {
  console.log('[App] Manual refresh triggered')
  countdown.value = 5
  refresh()
}

// Polling logic - use watchEffect to ensure it runs on client
onMounted(() => {
  isMounted.value = true
  console.log('[App] Component mounted on client')
})

watchEffect(() => {
  if (!isMounted.value) return
  
  console.log('[App] Starting countdown timer')
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      console.log('[App] Auto refreshing price data...')
      refresh()
      countdown.value = 5
    }
  }, 1000)
  
  // Cleanup
  return () => clearInterval(timer)
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.font-mono {
  font-family: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;
}
</style>