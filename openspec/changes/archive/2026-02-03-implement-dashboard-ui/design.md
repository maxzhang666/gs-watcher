## Context

当前系统已经实现了后端价格数据采集、存储和监控功能，使用 Nuxt 3 框架，sql.js 数据库。现在需要添加前端UI层来展示这些数据。参考的设计文件 `design.html` 提供了完整的视觉设计规范，采用现代化的卡片式布局、深色主题支持和响应式设计。

技术栈：Nuxt 3, Vue 3, Tailwind CSS, TypeScript

## Goals / Non-Goals

**Goals:**
- 实现与 design.html 视觉一致的仪表盘UI
- 支持深色/浅色主题切换，配置持久化
- 实时显示金银价格数据（从后端API获取）
- 响应式设计，支持移动端和桌面端
- 组件化架构，便于后续扩展

**Non-Goals:**
- 不实现用户认证功能（当前版本）
- 不添加历史数据图表（仅显示24h趋势）
- 不支持自定义主题颜色
- 不实现价格预警设置界面

## Decisions

### 1. 使用 Tailwind CSS + @nuxtjs/color-mode 实现主题切换

**决策**: 采用 Tailwind CSS 的 dark mode 类名策略 + Nuxt 官方的 color-mode 模块

**理由**:
- Tailwind 提供完整的 `dark:` 前缀支持，与设计文件中的实现方式一致
- `@nuxtjs/color-mode` 自动处理主题持久化和SSR兼容
- 避免手动管理 localStorage 和初始化逻辑
- 与 Nuxt 生态整合良好

**替代方案**: 
- 自定义 CSS variables：需要更多手动配置
- Vuetify/Element Plus：过于重量级，不符合设计风格

### 2. 组件拆分策略

**决策**: 按功能模块拆分为独立的 Vue 组件

组件结构：
```
components/
├── PriceCard.vue          # 单个价格卡片（黄金/白银）
├── MarketClock.vue        # 全球市场时钟
├── ThemeToggle.vue        # 主题切换按钮
└── TrendChart.vue         # 简单趋势线SVG
```

**理由**:
- 每个组件职责单一，便于测试和复用
- PriceCard 可通过 props 区分黄金/白银
- 组件可独立获取数据或接收 props

### 3. 数据获取方式：Client-side Fetching

**决策**: 使用 `useFetch` 或 `useAsyncData` 在客户端定时轮询 `/api/prices` 端点

实现方案：
```typescript
const { data, refresh } = useFetch('/api/prices', {
  server: false, // 仅客户端
  lazy: true
})

// 每30秒刷新一次
useIntervalFn(refresh, 30000)
```

**理由**:
- 简单直接，符合当前系统架构（无WebSocket需求）
- 30秒轮询间隔对服务器压力小
- 数据实时性要求不高（价格数据本身每2秒采集一次）

**替代方案**:
- WebSocket: 过度设计，增加复杂度
- SSR: 不必要，仪表盘无SEO需求

### 4. 字体和资源加载

**决策**: 使用 Google Fonts CDN 加载 Inter 和 JetBrains Mono 字体

配置方式：
```typescript
// nuxt.config.ts
app: {
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap'
      }
    ]
  }
}
```

**理由**:
- 设计文件已使用这两种字体
- Google Fonts CDN 性能优秀且可靠
- `font-display: swap` 避免FOIT问题

### 5. API端点设计

**决策**: 新增 `/api/prices.get.ts` 端点返回最新价格数据

返回数据结构：
```typescript
{
  gold: {
    cny_per_gram: number,
    usd_per_oz: number,
    usd_per_gram: number,
    change_24h: number,
    change_percent: number
  },
  silver: { /* 同上 */ },
  updated_at: number
}
```

**理由**:
- 前端所需的所有数据在一个请求中返回
- 后端负责计算涨跌幅，前端直接展示
- 符合RESTful设计原则

### 6. 响应式断点策略

**决策**: 使用 Tailwind 默认断点 (`md:` 768px)

布局变化：
- 移动端 (<768px): 单列布局，较小字号
- 桌面端 (≥768px): 双列网格布局

**理由**:
- 设计文件已考虑移动端适配（`grid-cols-1 md:grid-cols-2`）
- Tailwind 默认断点覆盖主流设备

## Risks / Trade-offs

### 1. 轮询可能导致不必要的请求

**风险**: 用户不在当前标签页时仍会轮询

**缓解**: 使用 Page Visibility API 检测标签页状态，隐藏时停止轮询
```typescript
const { pause, resume } = useIntervalFn(refresh, 30000)
document.addEventListener('visibilitychange', () => {
  document.hidden ? pause() : resume()
})
```

### 2. 首次加载可能无数据

**风险**: 数据库为空或后端未启动时前端无数据展示

**缓解**: 
- 显示骨架屏或加载状态
- 添加错误提示："数据加载失败，请稍后重试"

### 3. 时钟可能不准确

**风险**: 客户端时钟依赖用户本地时间

**缓解**: 使用 `Intl.DateTimeFormat` 的 `timeZone` 参数确保正确时区转换

### 4. 深色主题可能需要调整

**风险**: 设计文件的颜色在实际应用中可能不够协调

**缓解**: 遵循设计文件的配色方案，如需调整可通过 Tailwind 配置统一修改

## Migration Plan

N/A - 这是新增功能，不涉及数据迁移

## Open Questions

- [ ] 是否需要添加价格预警规则的查看界面？（当前仅通过飞书通知）
- [ ] 是否需要显示系统健康状态指示器？（可从 `/api/health` 获取）
- [ ] 24小时趋势线是否需要使用真实历史数据？（当前设计为静态SVG）
