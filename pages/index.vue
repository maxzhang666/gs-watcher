<template>
  <div class="flex-grow flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
    <!-- Background Effects -->
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500">
    </div>
    <div
      class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500">
    </div>

    <!-- Grid Pattern -->
    <div class="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.02]"
      style="background-image: linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px); background-size: 40px 40px;">
    </div>

    <!-- Price Cards Grid -->
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 z-10">
      <PriceCard metal="gold" :data="priceData?.gold" />
      <PriceCard metal="silver" :data="priceData?.silver" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Inject refresh function and price data from parent layout
const { priceData, refreshData } = inject('priceContext', {
  priceData: ref(null),
  refreshData: () => {}
})
</script>
