import { consola } from 'consola'
import type { Alert } from '../services/monitor'

const SYMBOL_NAMES: Record<string, string> = {
  gds_AUTD: '黄金延期',
  gds_AGTD: '白银延期',
  hf_XAU: '伦敦金',
  hf_XAG: '伦敦银',
  hf_GC: '纽约黄金',
  hf_SI: '纽约白银',
  AU0: '黄金连续',
  AG0: '白银连续'
}

export async function sendFeishuNotification(alerts: Alert[], webhookUrl?: string): Promise<void> {
  if (!webhookUrl) {
    consola.warn('Feishu webhook not configured, skipping notification')
    return
  }
  
  for (const alert of alerts) {
    try {
      const message = formatAlertMessage(alert)
      
      await $fetch(webhookUrl, {
        method: 'POST',
        timeout: 5000,
        body: {
          msg_type: 'text',
          content: {
            text: message
          }
        }
      })
      
      consola.success(`Notification sent for ${alert.symbol}: ${alert.type}`)
    } catch (error) {
      consola.error(`Failed to send Feishu notification for ${alert.symbol}:`, error)
      // Continue with next alert instead of throwing
    }
  }
}

export async function sendDataSourceAlert(status: 'failure' | 'recovered', webhookUrl?: string): Promise<void> {
  if (!webhookUrl) {
    consola.warn('Feishu webhook not configured, skipping data source alert')
    return
  }
  
  const messages = {
    failure: '⚠️ 数据源异常: 连续5次获取失败，请检查 https://www.guojijinjia.com/d/gold.js',
    recovered: '✅ 数据源已恢复正常'
  }
  
  try {
    await $fetch(webhookUrl, {
      method: 'POST',
      timeout: 5000,
      body: {
        msg_type: 'text',
        content: {
          text: messages[status]
        }
      }
    })
    
    consola.success(`Data source ${status} alert sent`)
  } catch (error) {
    consola.error(`Failed to send data source alert:`, error)
  }
}

function formatAlertMessage(alert: Alert): string {
  const symbolName = SYMBOL_NAMES[alert.symbol] || alert.symbol
  const timestamp = new Date().toLocaleString('zh-CN', { 
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const alertTypeEmoji: Record<Alert['type'], string> = {
    fluctuation: '⚡',
    peak: '📈',
    valley: '📉',
    trend_up: '🔥',
    trend_down: '❄️'
  }
  
  const emoji = alertTypeEmoji[alert.type] || '⚠️'
  
  return `${emoji} 【${symbolName}】${alert.message}\n当前价格: ${alert.price}\n时间: ${timestamp}`
}
