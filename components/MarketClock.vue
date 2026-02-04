<template>
  <div class="flex gap-4 md:gap-6 mx-auto md:mx-0 text-xs md:text-sm font-mono text-gray-600 dark:text-gray-400">
    <div v-for="market in markets" :key="market.id" class="flex items-center gap-2"
      :class="market.isActive ? 'font-bold text-gray-800 dark:text-gray-200' : 'opacity-50'">
      <span class="w-1.5 h-1.5 rounded-full"
        :class="market.isActive ? 'bg-green-500 shadow-green-500/50' : 'bg-gray-400 dark:bg-gray-500'"></span>
      <span>{{ market.label }} {{ market.time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useIntervalFn } from '@vueuse/core'

interface Market {
    id: string
    label: string
    timezone: string
    time: string
    isActive: boolean
}

const markets = ref<Market[]>([
    { id: 'ny', label: 'NY', timezone: 'America/New_York', time: '--:--', isActive: false },
    { id: 'ldn', label: 'LDN', timezone: 'Europe/London', time: '--:--', isActive: true },
    { id: 'bj', label: 'BJ', timezone: 'Asia/Shanghai', time: '--:--', isActive: true }
])

const isMounted = ref(false)

function updateClocks() {
    const now = new Date()

    markets.value.forEach(market => {
        try {
            const timeString = new Intl.DateTimeFormat('en-US', {
                timeZone: market.timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(now)

            market.time = timeString
            market.isActive = isMarketActive(market.timezone, now)
        } catch (e) {
            console.error(`Error updating clock for ${market.id}:`, e)
            market.time = '00:00'
        }
    })
}

function isMarketActive(timezone: string, now: Date): boolean {
    try {
        const hour = parseInt(new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            hour12: false
        }).format(now))

        // Approximate market hours: 9:00 - 17:00 local time
        return hour >= 9 && hour < 17
    } catch (e) {
        return false
    }
}

// Update every second (only on client)
onMounted(() => {
  isMounted.value = true
  console.log('[MarketClock] Component mounted on client')
})

watch(isMounted, (mounted) => {
  if (!mounted) return
  
  console.log('[MarketClock] Starting clock timer')
  updateClocks()
  setInterval(updateClocks, 1000)
})
</script>
