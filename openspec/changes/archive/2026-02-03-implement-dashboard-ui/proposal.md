## Why

当前系统只有后端监控和数据采集功能，缺少用户界面来实时查看金银价格和监控状态。需要一个现代化的仪表盘UI，让用户可以直观地查看价格数据、趋势变化和系统健康状态，提升产品的可用性和用户体验。

## What Changes

- 实现响应式的金银价格仪表盘页面，支持深色/浅色主题切换
- 展示实时人民币和国际市场价格数据
- 显示24小时价格变化趋势和涨跌幅
- 集成全球市场时钟（纽约、伦敦、北京）
- 添加实时数据刷新和WebSocket连接
- 配置Tailwind CSS和字体资源
- 实现组件化的Vue UI架构

## Capabilities

### New Capabilities

- `dashboard-layout`: 仪表盘整体布局，包含header、主要内容区和响应式设计
- `theme-toggle`: 深色/浅色主题切换功能，带有平滑过渡动画
- `price-cards`: 金银价格卡片组件，展示人民币和国际市场价格
- `market-clock`: 全球市场时钟组件，显示NY/LDN/BJ时区时间
- `real-time-data`: 实时数据获取和刷新机制，连接后端API
- `trend-visualization`: 价格趋势可视化，展示24小时变化曲线

### Modified Capabilities

- `health-monitoring`: 需要在API中添加价格数据查询接口，返回最新价格和历史数据

## Impact

- **前端代码**: 需要修改 `app.vue`，创建新的组件目录结构
- **依赖**: 添加 `@nuxtjs/tailwindcss`, `@nuxtjs/color-mode` 等UI相关依赖
- **API**: 需要在 `server/api/` 下新增价格查询端点
- **配置**: 修改 `nuxt.config.ts` 添加Tailwind和主题配置
- **资源**: 引入Google Fonts (Inter, JetBrains Mono)
- **无破坏性变更**: 不影响现有的监控和通知功能
