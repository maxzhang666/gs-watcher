## ADDED Requirements

### Requirement: Send notification via Feishu Webhook
The system SHALL send notifications to Feishu (Lark) using configured Webhook URL.

#### Scenario: Send text message
- **WHEN** alert engine triggers a notification with message "Price alert: gds_AUTD +5"
- **THEN** system sends POST request to Feishu Webhook with JSON payload:
  ```json
  {
    "msg_type": "text",
    "content": { "text": "Price alert: gds_AUTD +5" }
  }
  ```

#### Scenario: Send rich card message
- **WHEN** alert engine triggers with alert type "fluctuation" and details
- **THEN** system sends POST request with rich card format including title, price, trend, and timestamp

#### Scenario: Webhook URL not configured
- **WHEN** notification is triggered but FEISHU_WEBHOOK environment variable is empty
- **THEN** system logs a warning and skips sending (does not crash)

### Requirement: Include context in notifications
The system SHALL include symbol name, current price, alert type, and timestamp in every notification.

#### Scenario: Fluctuation alert content
- **WHEN** sending fluctuation alert for `gds_AUTD` at price 1070 (change: +5)
- **THEN** message includes: "【黄金延期】当前价格: 1070 | 波动: +5 | 时间: 2026-02-03 10:20"

#### Scenario: Peak alert content
- **WHEN** sending peak alert for `gds_AUTD` at price 1090 (previous high: 1085)
- **THEN** message includes: "【黄金延期】新高: 1090 (前高: 1085) | 时间: 2026-02-03 10:20"

### Requirement: Handle webhook failures gracefully
The system SHALL retry failed webhook requests and log errors without blocking the monitoring loop.

#### Scenario: Webhook timeout
- **WHEN** Feishu webhook does not respond within 5 seconds
- **THEN** system logs the error and continues (does not retry to avoid delay in next monitoring cycle)

#### Scenario: Webhook returns error status
- **WHEN** Feishu webhook returns HTTP 400 or 500
- **THEN** system logs the error response and continues

### Requirement: Send data source failure alerts
The system SHALL notify when the data source becomes unavailable.

#### Scenario: Fifth consecutive fetch failure
- **WHEN** data fetcher reports 5 consecutive failures
- **THEN** system sends notification: "⚠️ 数据源异常: 连续5次获取失败,请检查 https://www.guojijinjia.com/d/gold.js"

#### Scenario: Data source recovered
- **WHEN** data fetcher succeeds after being in failed state
- **THEN** system sends notification: "✅ 数据源已恢复正常"
