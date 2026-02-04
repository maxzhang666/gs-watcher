## ADDED Requirements

### Requirement: Fetch price data from external source
The system SHALL fetch gold and silver price data from `https://www.guojijinjia.com/d/gold.js` at configured intervals.

#### Scenario: Successful data fetch
- **WHEN** the scheduler triggers a fetch operation
- **THEN** system retrieves the JS file content within 5 seconds

#### Scenario: Network timeout
- **WHEN** the data source does not respond within 5 seconds
- **THEN** system retries up to 3 times with exponential backoff (2s, 5s, 10s)

#### Scenario: All retries fail
- **WHEN** all 3 retry attempts fail
- **THEN** system logs the error and continues without crashing the scheduler

### Requirement: Parse multiple price symbols
The system SHALL parse data for multiple precious metal symbols from the fetched content.

#### Scenario: Parse RMB gold price
- **WHEN** content contains `var hq_str_gds_AUTD="1067.12,0,1067.11,..."`
- **THEN** system extracts symbol `gds_AUTD` and price `1067.12`

#### Scenario: Parse multiple symbols in one request
- **WHEN** content contains multiple `var hq_str_` declarations
- **THEN** system extracts all configured symbols (gds_AUTD, gds_AGTD, hf_XAU, etc.)

#### Scenario: Invalid data format
- **WHEN** a variable's value cannot be parsed (missing quotes, malformed)
- **THEN** system logs a warning and skips that symbol without affecting others

### Requirement: Extract OHLC data
The system SHALL extract open, high, low, and current price from each symbol's data string.

#### Scenario: Extract complete OHLC
- **WHEN** parsing `"1067.12,0,1067.11,1069.00,1089.99,1032.99,..."`
- **THEN** system extracts:
  - current price: field[0] = 1067.12
  - open: field[2] = 1067.11
  - high: field[4] = 1089.99
  - low: field[5] = 1032.99

#### Scenario: Missing fields
- **WHEN** data string has fewer than 6 fields
- **THEN** system uses current price only and sets OHLC to null

### Requirement: Report consecutive fetch failures
The system SHALL send an alert when data fetching fails consecutively 5 times.

#### Scenario: Fifth consecutive failure triggers alert
- **WHEN** fetch operation fails for the 5th time in a row
- **THEN** system sends a notification "Data source unavailable"

#### Scenario: Successful fetch resets counter
- **WHEN** a fetch succeeds after previous failures
- **THEN** system resets the consecutive failure counter to 0
