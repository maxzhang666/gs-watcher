## ADDED Requirements

### Requirement: Start background task on server initialization
The system SHALL start a periodic monitoring task when the Nuxt server starts.

#### Scenario: Server startup
- **WHEN** Nuxt server finishes initialization
- **THEN** system registers a setInterval task in server/plugins/scheduler.ts

#### Scenario: Task runs at configured interval
- **WHEN** scheduler is configured with interval of 60000ms (1 minute)
- **THEN** system executes the monitoring flow every 60 seconds

### Requirement: Execute complete monitoring cycle
The system SHALL run the full monitoring flow in each scheduled iteration: fetch → store → analyze → notify.

#### Scenario: Successful monitoring cycle
- **WHEN** timer triggers
- **THEN** system:
  1. Fetches price data via data-fetcher
  2. Stores records via price-storage
  3. Runs alert checks via alert-engine
  4. Sends notifications via notification-service
  5. Logs completion with timestamp

#### Scenario: Partial failure does not stop scheduler
- **WHEN** data fetch fails in one cycle
- **THEN** system logs the error and continues to next cycle (timer keeps running)

### Requirement: Configurable scan interval
The system SHALL allow configuration of the monitoring interval via runtime config.

#### Scenario: Override default interval
- **WHEN** environment variable `NUXT_MONITOR_INTERVAL=30000` is set
- **THEN** system runs monitoring every 30 seconds instead of default 60 seconds

#### Scenario: Use default interval
- **WHEN** no interval configuration is provided
- **THEN** system uses default interval of 60000ms (1 minute)

### Requirement: Log each cycle execution
The system SHALL log the start and completion of each monitoring cycle with structured information.

#### Scenario: Cycle start log
- **WHEN** monitoring cycle begins
- **THEN** system logs: "[Scheduler] Starting cycle at <timestamp>"

#### Scenario: Cycle completion log
- **WHEN** monitoring cycle completes successfully
- **THEN** system logs: "[Scheduler] Cycle completed. Fetched <N> symbols, triggered <M> alerts"

#### Scenario: Cycle error log
- **WHEN** monitoring cycle encounters an error
- **THEN** system logs error details with ERROR level and continues to next cycle

### Requirement: Prevent concurrent executions
The system SHALL ensure only one monitoring cycle runs at a time.

#### Scenario: Previous cycle still running
- **WHEN** timer triggers but previous cycle has not finished
- **THEN** system skips the new trigger and logs a warning

#### Scenario: Quick cycle completion
- **WHEN** cycle completes in 5 seconds and interval is 60 seconds
- **THEN** system waits remaining 55 seconds before starting next cycle
