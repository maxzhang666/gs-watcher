<template>
  <div class="flex flex-col md:flex-row items-center justify-between bg-gray-900 border-b border-gray-800 px-6 py-3 text-sm font-mono tracking-wide select-none">
    <div class="hidden md:block text-gray-500 font-bold tracking-widest">
      MARKET_WATCH //
    </div>

    <div class="flex gap-6 md:gap-12 w-full md:w-auto justify-center md:justify-end">
      <div v-for="clock in clocks" :key="clock.city" class="flex items-center gap-2">
        <span class="relative flex h-2 w-2">
           <span v-if="clock.isOpen" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
           <span :class="clock.isOpen ? 'bg-green-500' : 'bg-gray-600'" class="relative inline-flex rounded-full h-2 w-2"></span>
        </span>
        
        <div class="flex flex-col leading-none">
          <span class="text-[10px] text-gray-500 uppercase">{{ clock.city }}</span>
          <span class="text-gray-200 font-bold">{{ clock.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const clocks = ref([
  { city: 'New York', zone: 'America/New_York', time: '--:--:--', isOpen: false },
  { city: 'London', zone: 'Europe/London', time: '--:--:--', isOpen: true },
  { city: 'Beijing', zone: 'Asia/Shanghai', time: '--:--:--', isOpen: true },
])

let timer = null

// 简单的开市时间判断逻辑 (示例)
// 实际项目中建议由后端返回 MarketStatus，因为涉及到节假日
const checkMarketStatus = (hour, zone) => {
  // 这里只是伪代码逻辑，为了演示绿灯效果
  if (zone.includes('New_York') && (hour >= 9 && hour < 16)) return true
  if (zone.includes('London') && (hour >= 8 && hour < 16)) return true
  if (zone.includes('Shanghai') && (hour >= 9 && hour < 15)) return true
  return false
}

const updateTime = () => {
  const now = new Date()
  
  clocks.value = clocks.value.map(clock => {
    // 获取当地时间对象
    const timeString = new Intl.DateTimeFormat('en-US', {
      timeZone: clock.zone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now)

    // 获取当地具体小时用于判断状态
    const hour = parseInt(timeString.split(':')[0])

    return {
      ...clock,
      time: timeString,
      isOpen: checkMarketStatus(hour, clock.zone)
    }
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>