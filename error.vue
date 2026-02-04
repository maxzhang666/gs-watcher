<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] transition-colors duration-300 flex items-center justify-center p-4">
    <!-- Background Effects -->
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-50 transition-opacity duration-500">
    </div>

    <!-- Error Card -->
    <div class="max-w-md w-full text-center relative z-10">
      <div class="bg-white dark:bg-[#181818] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl">
        <!-- Error Code -->
        <div class="mb-6">
          <h1 class="text-8xl font-bold font-mono text-gray-900 dark:text-white mb-2">
            {{ error?.statusCode || 404 }}
          </h1>
          <div class="h-1 w-20 bg-gradient-to-r from-yellow-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <!-- Error Message -->
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {{ errorTitle }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          {{ error?.message || 'The page you are looking for does not exist.' }}
        </p>

        <!-- Action Button -->
        <NuxtLink to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </NuxtLink>
      </div>

      <!-- Debug Info (development only) -->
      <div v-if="isDev && error?.stack" class="mt-4 text-left">
        <details class="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-xs">
          <summary class="cursor-pointer font-mono text-gray-600 dark:text-gray-400 mb-2">
            Debug Info (Dev Only)
          </summary>
          <pre class="text-red-600 dark:text-red-400 overflow-x-auto">{{ error.stack }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const isDev = process.dev

const errorTitle = computed(() => {
  const code = props.error?.statusCode || 404
  
  const titles: Record<number, string> = {
    404: 'Page Not Found',
    500: 'Internal Server Error',
    403: 'Forbidden',
    401: 'Unauthorized'
  }
  
  return titles[code] || 'Something went wrong'
})

// Clear error on mount to prevent stale error state
onMounted(() => {
  // Optional: Add analytics or error reporting here
})
</script>
