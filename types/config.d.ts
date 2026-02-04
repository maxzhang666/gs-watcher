// Type definitions for runtime configuration

export interface MonitorConfig {
  scanInterval: number
  symbols: string[]
  thresholds: Record<string, number>
}

export interface RuntimeConfig {
  feishuWebhook: string
  monitor: MonitorConfig
  public: Record<string, any>
}

declare module '#app' {
  interface RuntimeConfig {
    feishuWebhook: string
    monitor: MonitorConfig
  }
}

export {}
