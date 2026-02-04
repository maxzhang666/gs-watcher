## Why

金银价格波动对投资决策影响重大，但缺乏实时监控工具。当前依赖人工刷新网页查看价格，容易错过关键买卖时机（大幅波动、突破极值、趋势形成）。需要一个自动化监控系统，在价格异动时主动推送通知，让用户第一时间掌握市场动态。

## What Changes

- **新增**：基于 Nuxt 3 的价格监控服务（优先人民币金银品种）
- **新增**：定时数据采集器（每分钟抓取 https://www.guojijinjia.com/d/gold.js）
- **新增**：三层监控逻辑引擎（波动/极值/趋势检测）
- **新增**：飞书 Webhook 通知集成
- **新增**：SQLite 数据存储（支持历史数据分析和未来可视化）
- **新增**：Docker 容器化部署支持

## Capabilities

### New Capabilities
- `data-fetcher`: 从外部数据源抓取金银价格，支持多品种（人民币/美元计价）、容错重试、数据解析与标准化
- `price-storage`: SQLite 数据库存储历史价格数据（开高低收），支持时间序列查询和日内极值计算
- `alert-engine`: 多维度监控引擎，检测剧烈波动、日内突破、连续趋势，配合冷却机制防止重复通知
- `notification-service`: 飞书 Webhook 通知服务，支持文本和富文本卡片格式，包含数据源异常预警
- `scheduler`: 后台定时任务调度器（Nuxt Server Plugin），每分钟执行完整监控流程
- `health-monitoring`: 健康检查接口，暴露系统运行状态（最后抓取时间、数据量、定时器状态）

### Modified Capabilities
<!-- 无现有能力需要修改 -->

## Impact

- **新增依赖**: `better-sqlite3`（数据库）、`consola`（日志）
- **新增配置**: `nuxt.config.ts` 需配置 `runtimeConfig`（飞书 Webhook、扫描频率、监控品种、波动阈值）
- **新增文件**: 
  - `server/utils/db.ts` - 数据库初始化
  - `server/utils/fetcher.ts` - 数据抓取
  - `server/services/monitor.ts` - 监控逻辑
  - `server/utils/notify.ts` - 通知服务
  - `server/plugins/scheduler.ts` - 定时任务
  - `server/api/health.get.ts` - 健康检查
  - `Dockerfile`, `docker-compose.yml` - 容器化
- **部署要求**: 需要 Docker 环境，SQLite 数据文件需挂载持久化卷
- **外部依赖**: 依赖 `https://www.guojijinjia.com/d/gold.js` 数据源可用性
