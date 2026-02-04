## 1. Project Setup

- [x] 1.1 Initialize Nuxt 3 project with pnpm
- [x] 1.2 Install core dependencies: better-sqlite3, consola
- [x] 1.3 Configure nuxt.config.ts with runtimeConfig (Feishu Webhook, scan interval, thresholds)
- [x] 1.4 Create .data directory for SQLite database storage

## 2. Database Layer (price-storage)

- [x] 2.1 Create server/utils/db.ts with SQLite connection setup
- [x] 2.2 Implement price_history table creation (symbol, price, price_open, price_high, price_low, created_at)
- [x] 2.3 Implement alert_logs table creation (alert_type, symbol, last_sent_at, UNIQUE constraint)
- [x] 2.4 Enable WAL mode with PRAGMA journal_mode=WAL
- [x] 2.5 Create query functions: getRecentPrices(symbol, limit), getTodayRange(symbol), checkAlertCooldown(type, symbol)
- [x] 2.6 Create insert functions: insertPrice(record), updateAlertLog(type, symbol)

## 3. Data Fetcher (data-fetcher)

- [x] 3.1 Create server/utils/fetcher.ts with fetchGoldData() function
- [x] 3.2 Implement retry logic with exponential backoff (3 retries: 2s, 5s, 10s)
- [x] 3.3 Implement regex parser for var hq_str_(\w+)="([^"]+)" pattern
- [x] 3.4 Extract OHLC data from parsed fields (field[0]=price, field[2]=open, field[4]=high, field[5]=low)
- [x] 3.5 Add timeout handling (5 seconds per request)
- [x] 3.6 Implement consecutive failure counter (track last 5 results)
- [x] 3.7 Return standardized data structure: { symbol, price, price_open, price_high, price_low }[]

## 4. Alert Engine (alert-engine)

- [x] 4.1 Create server/services/monitor.ts with analyzePrice() function
- [x] 4.2 Implement fluctuation detection: abs(current - previous) > threshold
- [x] 4.3 Implement peak detection: current > today's max
- [x] 4.4 Implement valley detection: current < today's min
- [x] 4.5 Implement trend detection: check last 5 prices for strict monotonicity
- [x] 4.6 Integrate cooldown check before triggering alerts (15 minutes)
- [x] 4.7 Return alert array: { type, symbol, message, price }[]

## 5. Notification Service (notification-service)

- [x] 5.1 Create server/utils/notify.ts with sendFeishuNotification() function
- [x] 5.2 Implement text message format with symbol, price, alert type, timestamp
- [x] 5.3 Add symbol name mapping (gds_AUTD → "黄金延期", hf_XAU → "伦敦金")
- [x] 5.4 Implement error handling (timeout, non-200 status) with logging
- [x] 5.5 Add data source failure notification templates
- [x] 5.6 Implement graceful degradation when FEISHU_WEBHOOK is not configured

## 6. Scheduler (scheduler)

- [x] 6.1 Create server/plugins/scheduler.ts with Nitro plugin export
- [x] 6.2 Implement setInterval with configurable interval (default: 60000ms)
- [x] 6.3 Implement monitoring cycle: fetch → store → analyze → notify
- [x] 6.4 Add concurrency lock to prevent overlapping executions
- [x] 6.5 Add structured logging for cycle start, completion, and errors
- [x] 6.6 Implement global failure counter for data source unavailable alerts

## 7. Health Monitoring (health-monitoring)

- [x] 7.1 Create server/api/health.get.ts API route
- [x] 7.2 Query database for total record count
- [x] 7.3 Retrieve last fetch timestamp from global state or database
- [x] 7.4 Check scheduler status (track interval ID in plugin)
- [x] 7.5 Return JSON response with status, lastFetchTime, recordCount, schedulerRunning
- [x] 7.6 Add stale data warning (if lastFetchTime > 5 minutes ago)
- [x] 7.7 Return 503 status if database query fails

## 8. Configuration & Environment

- [x] 8.1 Define runtimeConfig schema in nuxt.config.ts (feishuWebhook, scanInterval, symbols, thresholds)
- [x] 8.2 Create .env.example with all required environment variables
- [x] 8.3 Document symbol-specific threshold configuration (gds_AUTD: 5, hf_XAU: 20, etc.)
- [x] 8.4 Add TypeScript types for config structure

## 9. Docker Deployment

- [x] 9.1 Create Dockerfile with Node.js base image
- [x] 9.2 Configure build steps: pnpm install, nuxt build
- [x] 9.3 Create docker-compose.yml with volume mount for .data directory
- [x] 9.4 Add environment variable definitions in docker-compose.yml
- [x] 9.5 Document deployment steps in README.md

## 10. Testing & Validation

- [x] 10.1 Test fetcher with real data source URL
- [x] 10.2 Verify database table creation and WAL mode
- [x] 10.3 Test fluctuation alert with threshold boundary conditions
- [x] 10.4 Test peak/valley detection with simulated daily data
- [x] 10.5 Test trend detection with 5 consecutive rising/falling prices
- [x] 10.6 Verify cooldown mechanism prevents duplicate alerts within 15 minutes
- [x] 10.7 Test Feishu notification with actual webhook (or mock)
- [x] 10.8 Verify health check endpoint returns correct data
- [x] 10.9 Test scheduler runs at configured interval
- [x] 10.10 Test data source failure handling (disconnect network temporarily)
