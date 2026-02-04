<template>
  <div class="w-full h-full">
    <svg
      v-if="hasEnoughData"
      viewBox="0 0 96 24"
      class="w-full h-full"
      preserveAspectRatio="none"
    >
      <path
        :d="pathData"
        fill="none"
        :stroke="trendColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <div
      v-else
      class="w-full h-full flex items-center justify-center text-xs text-gray-400 dark:text-gray-500"
    >
      <span>—</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface DataPoint {
  value: number
  timestamp?: string | number
}

interface Props {
  data: DataPoint[]
  color?: 'red' | 'green' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'auto'
})

const hasEnoughData = computed(() => {
  const validPoints = props.data.filter(p => p.value !== null && p.value !== undefined && !isNaN(p.value))
  return validPoints.length >= 2
})

const validData = computed(() => {
  return props.data.filter(p => p.value !== null && p.value !== undefined && !isNaN(p.value))
})

const trendColor = computed(() => {
  if (!hasEnoughData.value) return '#9ca3af'
  
  if (props.color === 'red') return '#ef4444'
  if (props.color === 'green') return '#10b981'
  
  const first = validData.value[0].value
  const last = validData.value[validData.value.length - 1].value
  
  return last >= first ? '#10b981' : '#ef4444' // green if up, red if down
})

const pathData = computed(() => {
  if (!hasEnoughData.value) return ''
  
  const points = validData.value
  const values = points.map(p => p.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue || 1 // Avoid division by zero
  
  // Normalize points to fit in viewBox (96x24)
  const normalizedPoints = points.map((point, index) => ({
    x: (index / (points.length - 1)) * 96,
    y: 24 - ((point.value - minValue) / range) * 20 - 2 // 2px padding top/bottom
  }))
  
  if (normalizedPoints.length === 0) return ''
  
  // Generate smooth path using quadratic Bezier curves
  let path = `M ${normalizedPoints[0].x} ${normalizedPoints[0].y}`
  
  for (let i = 0; i < normalizedPoints.length - 1; i++) {
    const current = normalizedPoints[i]
    const next = normalizedPoints[i + 1]
    
    // Control point for smooth curve
    const controlX = (current.x + next.x) / 2
    const controlY = (current.y + next.y) / 2
    
    path += ` Q ${controlX} ${current.y}, ${controlX} ${controlY}`
    path += ` Q ${controlX} ${next.y}, ${next.x} ${next.y}`
  }
  
  return path
})
</script>
