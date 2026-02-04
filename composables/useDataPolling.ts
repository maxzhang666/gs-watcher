import { useIntervalFn, useDocumentVisibility } from '@vueuse/core'
import { ref, watch } from 'vue'

interface UseDataPollingOptions {
  interval?: number // Polling interval in milliseconds (default: 30000)
  immediate?: boolean // Start polling immediately (default: true)
}

export function useDataPolling<T>(
  fetchFn: () => Promise<T>,
  options: UseDataPollingOptions = {}
) {
  const { interval = 30000, immediate = true } = options
  
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)
  const visibility = useDocumentVisibility()
  
  async function fetch() {
    // Don't fetch if tab is hidden (Client only)
    if (import.meta.client && visibility.value === 'hidden') {
      console.log('[useDataPolling] Skipping fetch - tab hidden')
      return
    }
    
    console.log('[useDataPolling] Starting fetch...')
    try {
      isLoading.value = true
      error.value = null
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Fetch timeout')), 10000)
      )
      
      const result = await Promise.race([
        fetchFn(),
        timeoutPromise
      ]) as T
      
      console.log('[useDataPolling] Fetch success:', result)
      data.value = result
    } catch (e) {
      console.error('[useDataPolling] Fetch error:', e)
      error.value = e as Error
      // Keep previous data on error (graceful degradation)
    } finally {
      isLoading.value = false
    }
  }
  
  // Create interval function
  const { pause, resume, isActive } = useIntervalFn(
    fetch,
    interval,
    { immediate: false } // Don't use immediate, we'll call fetch() manually
  )
  
  // Initial fetch if immediate is true
  if (immediate) {
    fetch()
  }
  
  // Watch visibility changes
  watch(visibility, (current) => {
    if (current === 'hidden') {
      // Pause polling when tab is hidden
      pause()
    } else if (current === 'visible') {
      // Resume polling when tab becomes visible
      resume()
      // Fetch immediately when returning to tab
      fetch()
    }
  })
  
  return {
    data,
    error,
    isLoading,
    pause,
    resume,
    isActive,
    refresh: fetch
  }
}
