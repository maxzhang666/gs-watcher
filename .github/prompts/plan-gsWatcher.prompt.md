# Plan: 金银价格监控系统（生产级完整方案）

构建基于 Nuxt 3 + SQLite 的金银价格监控服务，优先监控人民币金银品种（黄金T+D、白银T+D），兼顾国际市场。通过定时抓取数据源、多维度分析、飞书通知实现全自动监控。系统设计兼顾生产环境稳定性（容错、日志、健康检查）和未来扩展性（数据可视化）。

## Steps

1. **项目初始化与配置中心**
   创建 Nuxt 3 项目，配置 [nuxt.config.ts](nuxt.config.ts) 的 `runtimeConfig`（飞书 Webhook、扫描频率、监控品种列表、各品种波动阈值）。安装 `better-sqlite3`、`consola`。

2. **设计存储层与数据模型**
   创建 [server/utils/db.ts](server/utils/db.ts)，初始化 SQLite。设计表 `price_history`（包含 `symbol`、`price`、`price_open`、`price_high`、`price_low`、`created_at`）和 `alert_logs`（通知去重表，含 `alert_type`、`symbol`、`last_sent_at`）。

3. **构建容错数据采集器**
   创建 [server/utils/fetcher.ts](server/utils/fetcher.ts)，实现请求 `gold.js` 并用正则解析多品种数据（`gds_AUTD`、`gds_AGTD`、`hf_XAU` 等）。实现 3 次重试机制与超时控制，失败时记录日志并返回空值（不中断流程）。

4. **实现三层监控引擎**
   创建 [server/services/monitor.ts](server/services/monitor.ts)，实现剧烈波动检测（差价超阈值）、日内极值突破（刷新 `daily_high/low`）、连续趋势判断（读取最近 5 条记录验证单调性）。每个逻辑配合 `alert_logs` 实现 15 分钟冷却时间。

5. **定时任务与飞书通知集成**
   创建 [server/plugins/scheduler.ts](server/plugins/scheduler.ts) 启动后台任务（每分钟执行：抓取→入库→分析→通知）。创建 [server/utils/notify.ts](server/utils/notify.ts) 封装飞书 Webhook，支持富文本卡片格式。使用 `consola` 分级别记录所有关键操作。

6. **健康监控与 Docker 化**
   创建 API 路由 [server/api/health.get.ts](server/api/health.get.ts)，返回最后抓取时间、数据库记录数、定时器状态。编写 [Dockerfile](Dockerfile) 和 [docker-compose.yml](docker-compose.yml)，配置数据卷挂载（持久化 SQLite）。

## Further Considerations

1. **多货币阈值差异化**：人民币品种（如 `gds_AUTD`）建议设置 ±2-5 元波动阈值；美元品种（如 `hf_XAU`）建议 ±10-20 美元。需在配置中分品种定义。

2. **数据源异常预警**：如果连续 5 次抓取失败，向飞书发送"数据源不可用"警报，避免您误以为"没波动"而错过行情。

3. **日志持久化**：Docker 运行时建议将日志输出到文件（如 `logs/monitor.log`），并挂载到宿主机，方便排查历史问题。

4. **后期优化空间**：数据归档策略（保留原始数据 7 天，之后按小时/日聚合）、配置热更新接口（无需重启修改阈值）可在 MVP 稳定后迭代。
