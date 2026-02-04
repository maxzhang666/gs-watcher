## ADDED Requirements

### Requirement: API endpoint for price data

The system SHALL provide a `/api/prices` endpoint that returns current and historical price data for gold and silver.

#### Scenario: Successful data retrieval
- **WHEN** client requests GET /api/prices
- **THEN** server SHALL return JSON with gold and silver prices in CNY and USD formats

#### Scenario: Response data structure
- **WHEN** API responds successfully
- **THEN** response SHALL include cny_per_gram, usd_per_oz, usd_per_gram, change_24h, and change_percent for each metal

#### Scenario: No data available
- **WHEN** database has no price records
- **THEN** API SHALL return 200 status with null values or empty object with appropriate message

### Requirement: Automatic data refresh

The dashboard SHALL automatically fetch updated price data at regular intervals.

#### Scenario: Polling interval
- **WHEN** dashboard is loaded and visible
- **THEN** price data SHALL be fetched every 30 seconds

#### Scenario: Background tab behavior
- **WHEN** user switches to another browser tab
- **THEN** polling SHALL pause to save resources

#### Scenario: Return to active tab
- **WHEN** user returns to the dashboard tab
- **THEN** polling SHALL resume immediately and fetch fresh data

### Requirement: Loading states

The dashboard SHALL indicate when data is being loaded or refreshed.

#### Scenario: Initial load
- **WHEN** page first loads with no cached data
- **THEN** price cards SHALL display a loading skeleton or spinner

#### Scenario: Background refresh
- **WHEN** data is being refreshed in the background (after initial load)
- **THEN** existing prices SHALL remain visible and a subtle refresh indicator SHALL appear

#### Scenario: Error handling
- **WHEN** API request fails
- **THEN** an error message SHALL be displayed and previous data SHALL remain visible

### Requirement: Data transformation

The dashboard SHALL calculate and display change values from raw price data.

#### Scenario: Change percentage calculation
- **WHEN** current and previous prices are available
- **THEN** system SHALL calculate percentage change as ((current - previous) / previous) * 100

#### Scenario: Absolute change calculation
- **WHEN** current and previous prices are available
- **THEN** system SHALL calculate absolute change as (current - previous) with proper currency unit

#### Scenario: Missing historical data
- **WHEN** no previous price data is available
- **THEN** change indicators SHALL display "0.00%" or be hidden
