## Context

构建一个基于 Nuxt 3 的金银价格监控系统，需要在服务端长期运行定时任务。当前使用 Docker 部署，数据源为第三方 JS 文件（`https://www.guojijinjia.com/d/gold.js`），返回格式为全局变量赋值语句。系统需要支持多品种监控（人民币金银 T+D、国际市场伦敦金银等）并通过飞书 Webhook 推送通知。

**约束条件**：
- 使用 pnpm 包管理器
- 部署环境：Docker 容器（需持久化数据）
- 数据源格式：JS 变量赋值（需正则解析，不能使用 eval）
- 监控频率：每分钟一次（避免过高频率导致 IP 封禁）
- 数据库：SQLite（单文件、轻量级、无需额外服务）

## Goals / Non-Goals

**Goals:**
- 实现稳定的后台定时监控（利用 Nuxt Server Plugin 常驻进程）
- 支持多维度报警逻辑（波动/极值/趋势），配合去重防骚扰
- 数据结构设计兼顾监控和未来可视化需求（存储开高低收）
- 生产级稳定性（容错重试、日志分级、健康检查）
- Docker 一键部署，数据持久化

**Non-Goals:**
- 前端可视化界面（初期仅做监控，UI 留待后期迭代）
- 复杂的数据分析（如技术指标计算、机器学习预测）
- 多用户系统（初期单用户使用，无需认证授权）
- 分布式部署（单机 Docker 足够，无需考虑集群）

## Decisions

### 1. 使用 Nuxt Server Plugin 实现定时任务
**决策**：在 `server/plugins/scheduler.ts` 中使用 `setInterval` 挂载定时任务，而非依赖外部 CRON。

**理由**：
- Nuxt/Nitro 支持服务端插件在进程启动时初始化
- `setInterval` 代码简单，无需额外依赖
- Docker 环境下进程常驻，无需系统级 CRON
- 可直接访问 Nuxt 上下文（如 `useRuntimeConfig`）

**替代方案**：
- ❌ 系统 CRON + API 调用：需要暴露接口，增加安全风险
- ❌ node-schedule：额外依赖，功能对本场景过重
- ❌ Vercel Cron：本项目使用 Docker 部署，非 Serverless

### 2. SQLite 作为存储方案
**决策**：使用 `better-sqlite3` 同步 API，数据库文件存储在 `.data/prices.db`。

**理由**：
- 轻量级：无需独立数据库服务，减少 Docker Compose 复杂度
- 同步 API：避免异步回调地狱，代码清晰
- SQL 支持：方便查询"最近 5 条记录"、"今日最高价"等
- 单文件：Docker 卷挂载简单

**替代方案**：
- ❌ PostgreSQL/MySQL：过重，需要独立容器
- ❌ LowDB (JSON)：无法高效做时间序列查询和聚合
- ❌ Redis：内存数据库，不适合长期存储

**表结构设计**：
```sql
-- 价格历史表
CREATE TABLE price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL,           -- 品种代码 (gds_AUTD, hf_XAU)
  price REAL NOT NULL,             -- 当前价
  price_open REAL,                 -- 开盘价
  price_high REAL,                 -- 最高价
  price_low REAL,                  -- 最低价
  created_at INTEGER NOT NULL      -- 时间戳 (ms)
);
CREATE INDEX idx_symbol_time ON price_history(symbol, created_at);

-- 通知去重表
CREATE TABLE alert_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alert_type TEXT NOT NULL,        -- 报警类型 (fluctuation, peak, valley, trend_up, trend_down)
  symbol TEXT NOT NULL,
  last_sent_at INTEGER NOT NULL,   -- 最后发送时间戳
  UNIQUE(alert_type, symbol)
);
```

### 3. 正则解析数据源而非 eval
**决策**：使用正则表达式提取 `var hq_str_<symbol>="..."` 中的字符串，再按逗号分割字段。

**理由**：
- 安全：避免执行任意代码（eval 风险）
- 可控：只提取需要的字段（第 0 位价格等）
- 容错：解析失败不会导致进程崩溃

**示例代码**：
```typescript
const regex = /var hq_str_(\w+)="([^"]+)"/g;
const matches = [...text.matchAll(regex)];
const data = matches.map(([, symbol, values]) => {
  const fields = values.split(',');
  return { symbol, price: parseFloat(fields[0]) };
});
```

### 4. 多品种差异化阈值
**决策**：在 `runtimeConfig` 中为不同品种定义不同的波动阈值。

**理由**：
- 人民币金银（几百~几千元）与美元（几千美元）价格基数不同
- 固定阈值会导致误报或漏报
- 配置驱动，方便调整

**配置示例**：
```typescript
runtimeConfig: {
  monitor: {
    thresholds: {
      gds_AUTD: 5,    // 人民币黄金 ±5 元
      gds_AGTD: 50,   // 人民币白银 ±50 元
      hf_XAU: 20,     // 美元黄金 ±20 美元
      hf_XAG: 0.5,    // 美元白银 ±0.5 美元
    }
  }
}
```

### 5. 通知去重与冷却时间
**决策**：在 `alert_logs` 表中记录每种报警类型的最后发送时间，15 分钟内不重复发送相同类型的通知。

**理由**：
- 防止持续上涨时每分钟都发送"连续上涨"通知
- 用户体验：避免消息轰炸
- 数据库驱动：重启容器后状态不丢失

**逻辑**：
```typescript
const canSend = (type: string, symbol: string) => {
  const lastSent = db.prepare('SELECT last_sent_at FROM alert_logs WHERE alert_type=? AND symbol=?')
    .get(type, symbol);
  if (!lastSent) return true;
  return Date.now() - lastSent.last_sent_at > 15 * 60 * 1000;
};
```

### 6. 容错与重试策略
**决策**：数据抓取失败时重试 3 次（间隔 2s、5s、10s），全部失败后记录日志并跳过本轮，不中断定时器。

**理由**：
- 网络抖动不应导致监控停止
- 递增间隔避免瞬时压力
- 连续 5 轮失败时发送"数据源异常"预警

**实现**：
```typescript
async function fetchWithRetry(url: string, retries = 3) {
  const delays = [2000, 5000, 10000];
  for (let i = 0; i < retries; i++) {
    try {
      return await $fetch(url, { timeout: 5000 });
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, delays[i]));
    }
  }
}
```

## Risks / Trade-offs

**风险 1：数据源格式变化**  
→ **缓解**：保留原始响应文本到日志，方便问题排查。增加格式验证（如检查字段数量），解析失败时报警。

**风险 2：SQLite 文件锁（并发写入）**  
→ **缓解**：本项目单进程单线程写入（定时器串行执行），无并发问题。使用 `better-sqlite3` 的 WAL 模式提升读性能。

**风险 3：Docker 容器重启导致定时器中断**  
→ **缓解**：健康检查接口返回最后抓取时间，可配合外部监控（UptimeRobot）检测异常。重启后定时器自动恢复。

**风险 4：时区问题（"今日"定义）**  
→ **缓解**：统一使用 UTC 时间戳存储，查询"今日最高价"时转为本地时间（中国时区 UTC+8）。

**权衡 1：SQLite vs 云数据库**  
- 选择 SQLite：牺牲了跨机器访问能力，但换来部署简单和零运维成本
- 适用场景：单机监控，数据量小（每分钟 1 条 × 10 品种 = 1.4 万条/天）

**权衡 2：定时器 vs Serverless Cron**  
- 选择定时器：依赖进程常驻，但避免了冷启动延迟和 Serverless 平台限制
- 适用场景：Docker 部署，非 Serverless 环境

## Migration Plan

**初始部署**：
1. 构建 Docker 镜像：`docker build -t gs-watcher .`
2. 创建数据卷：`docker volume create gs-watcher-data`
3. 启动容器：`docker-compose up -d`（自动初始化数据库表）
4. 验证健康：`curl http://localhost:3000/api/health`

**配置更新**（修改阈值、Webhook 等）：
1. 修改 `docker-compose.yml` 中的环境变量
2. 重启容器：`docker-compose restart`

**回滚策略**：
- 数据库向后兼容：新版本不破坏旧表结构
- 保留前一版本镜像：`docker tag gs-watcher:latest gs-watcher:backup`
- 出现问题时切换镜像版本重新部署

**数据备份**：
- SQLite 文件位于 Docker 卷，定期备份：`docker cp <container>:/app/.data/prices.db ./backup/`

## Open Questions

1. **监控品种优先级**：初期监控哪些品种？建议人民币金银（`gds_AUTD`, `gds_AGTD`）+ 伦敦金（`hf_XAU`），共 3 个。
2. **数据归档策略**：何时实施？建议 MVP 稳定 1 个月后，根据实际数据量决定。
3. **多飞书群通知**：是否需要支持发送到多个 Webhook？初期单群即可，预留扩展性（配置为数组）。
4. **日志输出方式**：Docker logs 还是文件？建议初期用 console（Docker logs 查看），后期增加文件输出。
