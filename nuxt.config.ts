// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark'
  },
  
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap'
        }
      ]
    }
  },
  
  runtimeConfig: {
    // Private keys (server-side only)
    feishuWebhook: process.env.NUXT_FEISHU_WEBHOOK || '',
    
    monitor: {
      scanInterval: parseInt(process.env.NUXT_MONITOR_SCAN_INTERVAL || '60000'),
      symbols: (process.env.NUXT_MONITOR_SYMBOLS || 'gds_AUTD,gds_AGTD,hf_XAU').split(','),
      thresholds: {
        gds_AUTD: parseFloat(process.env.NUXT_THRESHOLD_GDS_AUTD || '5'),
        gds_AGTD: parseFloat(process.env.NUXT_THRESHOLD_GDS_AGTD || '50'),
        hf_XAU: parseFloat(process.env.NUXT_THRESHOLD_HF_XAU || '20'),
        hf_XAG: parseFloat(process.env.NUXT_THRESHOLD_HF_XAG || '0.5'),
      }
    },
    
    // Public keys (exposed to client)
    public: {}
  }
})
