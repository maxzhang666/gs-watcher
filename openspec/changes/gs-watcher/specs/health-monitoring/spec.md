## ADDED Requirements

### Requirement: Expose health check endpoint
The system SHALL provide a GET endpoint at `/api/health` returning system status.

#### Scenario: Successful health check
- **WHEN** client sends GET request to `/api/health`
- **THEN** system returns JSON with status 200:
  ```json
  {
    "status": "healthy",
    "lastFetchTime": 1675404000000,
    "recordCount": 12458,
    "schedulerRunning": true
  }
  ```

#### Scenario: Database unavailable
- **WHEN** health check cannot query database
- **THEN** system returns status 503 with:
  ```json
  {
    "status": "unhealthy",
    "error": "Database connection failed"
  }
  ```

### Requirement: Report last successful fetch time
The system SHALL track and report when data was last successfully fetched.

#### Scenario: Recent fetch
- **WHEN** last fetch was 30 seconds ago
- **THEN** health endpoint returns lastFetchTime with timestamp in milliseconds

#### Scenario: No fetch yet
- **WHEN** server just started and no fetch has occurred
- **THEN** health endpoint returns lastFetchTime as null

#### Scenario: Stale data detection
- **WHEN** last fetch was more than 5 minutes ago (3x expected interval)
- **THEN** health endpoint includes warning: "Data may be stale"

### Requirement: Report database statistics
The system SHALL report total record count and oldest record timestamp.

#### Scenario: Database has records
- **WHEN** database contains 12458 price records
- **THEN** health endpoint returns recordCount: 12458

#### Scenario: Empty database
- **WHEN** database has no records (fresh installation)
- **THEN** health endpoint returns recordCount: 0

### Requirement: Report scheduler status
The system SHALL indicate whether the background scheduler is active.

#### Scenario: Scheduler running normally
- **WHEN** scheduler setInterval is active
- **THEN** health endpoint returns schedulerRunning: true

#### Scenario: Scheduler stopped
- **WHEN** scheduler has been cleared or failed to start
- **THEN** health endpoint returns schedulerRunning: false

### Requirement: Enable external monitoring integration
The system SHALL provide a simple status check suitable for uptime monitoring services.

#### Scenario: UptimeRobot integration
- **WHEN** UptimeRobot pings `/api/health` every 5 minutes
- **THEN** system returns 200 status if healthy, 503 if unhealthy

#### Scenario: Response time monitoring
- **WHEN** health check endpoint is called
- **THEN** system responds within 500ms (does not run heavy queries)
