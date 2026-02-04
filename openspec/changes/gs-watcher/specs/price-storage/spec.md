## ADDED Requirements

### Requirement: Initialize SQLite database
The system SHALL create a SQLite database file at `.data/prices.db` if it does not exist.

#### Scenario: First run initialization
- **WHEN** the application starts and no database file exists
- **THEN** system creates the database file and all required tables

#### Scenario: Database already exists
- **WHEN** the application starts and database file exists
- **THEN** system connects to the existing database without recreating tables

### Requirement: Store price records with OHLC data
The system SHALL store each price fetch result with open, high, low, current price, and timestamp.

#### Scenario: Insert new price record
- **WHEN** fetcher successfully retrieves price data for symbol `gds_AUTD`
- **THEN** system inserts a record with: symbol, price, price_open, price_high, price_low, created_at (timestamp in ms)

#### Scenario: Store multiple symbols in one cycle
- **WHEN** fetcher returns data for 3 symbols (gds_AUTD, gds_AGTD, hf_XAU)
- **THEN** system inserts 3 separate records, each with its own symbol and prices

### Requirement: Query recent price history
The system SHALL provide queries to retrieve recent price records for trend analysis.

#### Scenario: Get last N records for a symbol
- **WHEN** monitor requests last 5 records for `gds_AUTD`
- **THEN** system returns 5 most recent records ordered by created_at descending

#### Scenario: Get today's price range
- **WHEN** monitor requests today's high/low for `gds_AUTD`
- **THEN** system returns MAX(price_high) and MIN(price_low) for records created today (using local timezone UTC+8)

### Requirement: Maintain alert log for deduplication
The system SHALL track when each alert type was last sent for each symbol.

#### Scenario: Record alert send time
- **WHEN** system sends a "fluctuation" alert for `gds_AUTD`
- **THEN** system inserts/updates alert_logs with alert_type="fluctuation", symbol="gds_AUTD", last_sent_at=<current timestamp>

#### Scenario: Check alert cooldown
- **WHEN** monitor checks if "fluctuation" alert can be sent for `gds_AUTD`
- **THEN** system queries alert_logs and returns true if last_sent_at is more than 15 minutes ago (or no record exists)

### Requirement: Use WAL mode for concurrent reads
The system SHALL enable SQLite WAL (Write-Ahead Logging) mode for better read performance.

#### Scenario: Enable WAL on initialization
- **WHEN** database is created or connected
- **THEN** system executes `PRAGMA journal_mode=WAL`

#### Scenario: Allow reads during write
- **WHEN** scheduler is inserting a new price record
- **THEN** health check API can still query database without blocking
