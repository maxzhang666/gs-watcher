# GS-Watcher - 金银价格监控系统

基于 Nuxt 3 的金银价格实时监控系统，支持飞书通知、多维度报警、Docker 部署。

## 功能特性

- 🔔 **实时监控**: 每分钟自动抓取金银价格数据
- 📊 **多维报警**: 
  - 价格剧烈波动检测
  - 日内极值突破提醒（新高/新低）
  - 连续趋势识别（连续上涨/下跌）
- 🔕 **智能去重**: 15分钟冷却机制，避免重复通知
- 📱 **飞书集成**: 通过 Webhook 推送报警消息
- 💾 **数据持久化**: SQLite 存储历史数据，支持未来可视化
- 🐳 **容器化部署**: Docker 一键部署，数据卷持久化
- 🏥 **健康检查**: API 接口监控系统运行状态

## 快速开始

### 前置要求

- Node.js 20+
- pnpm 或 Docker

### 方式一：Docker 部署（推荐）

1. **克隆项目**
```bash
git clone <repository-url>
cd gs-watcher
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，设置飞书 Webhook URL
```

3. **启动容器**
```bash
docker-compose up -d
```

4. **查看日志**
```bash
docker-compose logs -f
```

5. **健康检查**
```bash
curl http://localhost:3000/api/health
```

### 方式二：本地开发

1. **安装依赖**
```bash
pnpm install
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件
```

3. **启动开发服务器**
```bash
pnpm dev
```

4. **构建生产版本**
```bash
pnpm build
pnpm preview
```

## 配置说明

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NUXT_FEISHU_WEBHOOK` | 飞书机器人 Webhook URL | 必填 |
| `NUXT_MONITOR_SCAN_INTERVAL` | 扫描间隔（毫秒） | 60000 (1分钟) |
| `NUXT_MONITOR_SYMBOLS` | 监控品种（逗号分隔） | `gds_AUTD,gds_AGTD,hf_XAU` |
| `NUXT_THRESHOLD_GDS_AUTD` | 黄金延期波动阈值（元） | 5 |
| `NUXT_THRESHOLD_GDS_AGTD` | 白银延期波动阈值（元） | 50 |
| `NUXT_THRESHOLD_HF_XAU` | 伦敦金波动阈值（美元） | 20 |
| `NUXT_THRESHOLD_HF_XAG` | 伦敦银波动阈值（美元） | 0.5 |

### 支持的监控品种

| 代码 | 名称 | 市场 |
|------|------|------|
| `gds_AUTD` | 黄金延期 | 人民币 |
| `gds_AGTD` | 白银延期 | 人民币 |
| `hf_XAU` | 伦敦金（现货黄金） | 美元 |
| `hf_XAG` | 伦敦银（现货白银） | 美元 |
| `hf_GC` | 纽约黄金 | 美元 |
| `hf_SI` | 纽约白银 | 美元 |

详细配置说明见 [docs/threshold-config.md](docs/threshold-config.md)

## 飞书机器人配置

1. 在飞书群聊中添加「自定义机器人」
2. 获取 Webhook URL（格式：`https://open.feishu.cn/open-apis/bot/v2/hook/xxx`）
3. 将 URL 设置到 `.env` 文件的 `NUXT_FEISHU_WEBHOOK` 变量

## 报警类型说明

### 1. 剧烈波动 (fluctuation)
当价格相比上一次记录的变化超过阈值时触发。

**示例**: `⚡ 【黄金延期】价格剧烈波动: +5.2 (从 1065 到 1070.2)`

### 2. 日内新高 (peak)
当前价格突破今日最高价。

**示例**: `📈 【黄金延期】创日内新高: 1090 (前高: 1085)`

### 3. 日内新低 (valley)
当前价格跌破今日最低价。

**示例**: `📉 【黄金延期】创日内新低: 1030 (前低: 1035)`

### 4. 持续上涨 (trend_up)
连续5次价格上涨。

**示例**: `🔥 【黄金延期】持续上涨趋势 (连续5次上涨)`

### 5. 持续下跌 (trend_down)
连续5次价格下跌。

**示例**: `❄️ 【黄金延期】持续下跌趋势 (连续5次下跌)`

## 数据存储

- 数据库文件: `.data/prices.db` (SQLite)
- Docker 部署时自动挂载到宿主机 `./data` 目录
- 包含两张表:
  - `price_history`: 价格历史记录（支持 OHLC 数据）
  - `alert_logs`: 报警去重日志

## API 接口

### 健康检查

```bash
GET /api/health
```

**响应示例**:
```json
{
  "status": "healthy",
  "lastFetchTime": 1675404000000,
  "recordCount": 12458,
  "schedulerRunning": true
}
```

## 维护与监控

### 查看日志
```bash
# Docker
docker-compose logs -f gs-watcher

# 本地
pnpm dev
```

### 数据库备份
```bash
# Docker
docker cp gs-watcher:/app/.data/prices.db ./backup/prices-$(date +%Y%m%d).db

# 本地
cp .data/prices.db ./backup/prices-$(date +%Y%m%d).db
```

### 重启服务
```bash
# Docker
docker-compose restart

# 修改配置后
docker-compose down
docker-compose up -d
```

## 故障排查

### 1. 没有收到通知
- 检查 `NUXT_FEISHU_WEBHOOK` 是否配置正确
- 查看日志确认是否有报警触发
- 检查阈值设置是否过高

### 2. 数据源异常
- 系统会在连续5次抓取失败后发送预警
- 检查网络连接

### 3. 数据库错误
- 确保 `.data` 目录有写权限
- 检查磁盘空间
- 查看 `/api/health` 接口状态

## 技术栈

- **框架**: Nuxt 3
- **数据库**: SQLite (better-sqlite3)
- **日志**: consola
- **部署**: Docker + Docker Compose
- **语言**: TypeScript

## 项目结构

```
gs-watcher/
├── server/
│   ├── api/
│   │   └── health.get.ts       # 健康检查接口
│   ├── plugins/
│   │   └── scheduler.ts        # 定时任务调度器
│   ├── services/
│   │   └── monitor.ts          # 监控逻辑引擎
│   └── utils/
│       ├── db.ts               # 数据库操作
│       ├── fetcher.ts          # 数据抓取
│       └── notify.ts           # 飞书通知
├── .data/                      # SQLite 数据库目录
├── docs/                       # 文档
├── Dockerfile                  # Docker 镜像
├── docker-compose.yml          # Docker Compose 配置
└── nuxt.config.ts              # Nuxt 配置
```

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
