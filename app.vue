<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] transition-colors duration-300 flex flex-col"
    style="min-height: 100vh;">
    <!-- Loading Overlay -->
    <Transition name="fade">
      <div v-if="isInitialLoading"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 dark:bg-[#0d0d0d]">
        <div class="text-center">
          <!-- Animated Logo/Icon -->
          <div class="mb-6 relative">
            <div class="w-20 h-20 mx-auto">
              <div
                class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-cyan-500 rounded-2xl animate-pulse opacity-20">
              </div>
              <div class="absolute inset-2 bg-white dark:bg-[#181818] rounded-xl flex items-center justify-center">
                <div
                  class="text-2xl font-bold font-mono bg-gradient-to-r from-yellow-500 to-cyan-500 bg-clip-text text-transparent">
                  Au
                </div>
              </div>
            </div>
          </div>

          <!-- Loading Text -->
          <div class="text-sm font-mono text-gray-400 dark:text-gray-600 animate-pulse">
            Loading market data...
          </div>

          <!-- Loading Bar -->
          <div class="mt-4 w-48 h-1 mx-auto bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-yellow-500 to-cyan-500 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header -->
    <header
      class="bg-white/80 dark:bg-[#121212] backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between z-30 relative transition-colors duration-300 shadow-sm dark:shadow-none">
      <div class="hidden md:flex items-center gap-2 text-gray-400 dark:text-gray-500 font-bold tracking-widest text-xs">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        CNY_MARKET_FOCUS
      </div>
      <MarketClock />
      <div class="flex items-center gap-3">
        <!-- Refresh Timer -->
        <button @click="handleRefresh" @mouseenter="isHovering = true" @mouseleave="isHovering = false"
          class="relative w-10 h-10 flex items-center justify-center group" title="Click to refresh now">
          <!-- Circular Progress -->
          <svg class="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" class="stroke-gray-200 dark:stroke-gray-700" stroke-width="2" fill="none" />
            <circle cx="20" cy="20" r="16"
              :class="['stroke-green-500 dark:stroke-green-400', { 'transition-all duration-1000 ease-linear': !noTransition }]" stroke-width="2"
              fill="none" stroke-linecap="round" :stroke-dasharray="100" :stroke-dashoffset="progressOffset" />
          </svg>

          <!-- Content -->
          <div class="relative z-10 flex items-center justify-center w-full h-full">
            <!-- Countdown Number -->
            <span v-show="!isHovering"
              class="text-xs font-mono font-bold text-gray-600 dark:text-gray-400 transition-opacity">
              {{ countdown }}
            </span>

            <!-- Refresh Icon on Hover -->
            <svg v-show="isHovering" class="w-5 h-5 text-green-500 dark:text-green-400 transition-opacity" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </button>

        <ThemeToggle />
      </div>
    </header>

    <!-- Page Content -->
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    style: 'background-color: #f9fafb;' // 防止FOUC的内联样式
  },
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
  ],
  script: [
    {
      // 在Tailwind CSS加载前立即应用背景色，防止白屏
      innerHTML: `
        (function() {
          const isDark = localStorage.getItem('nuxt-color-mode') === 'dark' || 
                        (!localStorage.getItem('nuxt-color-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
          document.documentElement.style.backgroundColor = isDark ? '#0d0d0d' : '#f9fafb';
        })();
      `,
      type: 'text/javascript',
      tagPosition: 'head'
    }
  ]
})

// Fetch price data at layout level
const { data: priceData, error, pending, refresh } = useFetch('/api/prices', {
  query: { history: true },
  key: 'prices-data',
  lazy: true,
  server: false,
  onRequest({ request, options }) {
    console.log('[Fetch] Request starting:', request)
  },
  onResponse({ request, response }) {
    console.log('[Fetch] Response received:', response.status)
  },
  onRequestError({ request, error }) {
    console.error('[Fetch] Request error:', error)
  }
})

// Refresh countdown state
const countdown = ref(5)
const isHovering = ref(false)
const noTransition = ref(false)

const isFilling = ref(true)  // true=空到满, false=满到空

// 计算进度条offset
const progressOffset = computed(() => {
  return ((6 - countdown.value) / 5) * 100
})

// Initial loading state (for FOUC prevention)
const isInitialLoading = ref(true)

// Manual refresh function
function handleRefresh() {
  console.log('[App] Manual refresh triggered')
  noTransition.value = true
  countdown.value = 6  // 先设为6使offset=0
  refresh()
  setTimeout(() => {
    countdown.value = 5  // 然后设为5开始倒计时
    noTransition.value = false
  }, 50)
}

// Provide price context to child pages
provide('priceContext', {
  priceData,
  refreshData: handleRefresh
})

// Polling logic - start on client mount
onMounted(() => {
  console.log('[App] ========== MOUNTED ==========')
  console.log('[App] Starting price polling every 5 seconds')
  // conHide loading after a short delay to ensure styles are loaded
  setTimeout(() => {
    isInitialLoading.value = false
  }, 600)

  // sole.log('[App] priceData:', priceData.value)
  console.log('[App] Calling refresh()...')

  // Initial fetch
  refresh().then(() => {
    console.log('[App] Initial refresh completed')
  }).catch(err => {
    console.error('[App] Initial refresh failed:', err)
  })

  // Countdown timer
  const timer = setInterval(() => {
    countdown.value--
    console.log('[App] Countdown:', countdown.value)

    if (countdown.value <= 0) {
      console.log('[App] Auto refreshing price data...')
      noTransition.value = true
      countdown.value = 6  // 先设为6使offset=0
      refresh()
      setTimeout(() => {
        countdown.value = 5  // 然后设为5开始倒计时
        noTransition.value = false
      }, 50)
    }
  }, 1000)

  console.log('[App] Timer started, ID:', timer)
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

/* Loading animations */
@keyframes loading-bar {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(400%);
  }
}

.animate-loading-bar {
  animation: loading-bar 1.5s ease-in-out infinite;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>