## ADDED Requirements

### Requirement: Price query API endpoint

The system SHALL provide a GET endpoint at `/api/prices` that returns the latest price data for monitored symbols.

#### Scenario: Successful price query
- **WHEN** client sends GET request to `/api/prices`
- **THEN** system SHALL return JSON with current prices for gold and silver in multiple formats

#### Scenario: Response data structure
- **WHEN** API responds successfully
- **THEN** response SHALL include the following structure:
  ```json
  {
    "gold": {
      "cny_per_gram": 475.21,
      "usd_per_oz": 2024.50,
      "usd_per_gram": 65.10,
      "change_24h": 5.85,
      "change_percent": 1.24,
      "symbol": "gds_AUTD"
    },
    "silver": {
      "cny_per_gram": 5.45,
      "usd_per_oz": 22.85,
      "usd_per_gram": 0.73,
      "change_24h": -0.02,
      "change_percent": -0.45,
      "symbol": "gds_AGTD"
    },
    "updated_at": 1675404000000
  }
  ```

#### Scenario: No data available
- **WHEN** database has no price records for monitored symbols
- **THEN** API SHALL return 200 status with message indicating no data

### Requirement: Historical price trend data

The system SHALL provide price history for trend visualization.

#### Scenario: 24-hour price history
- **WHEN** client requests GET `/api/prices?history=24h`
- **THEN** system SHALL return up to 24 hourly price points for each symbol

#### Scenario: Trend data structure
- **WHEN** history parameter is provided
- **THEN** response SHALL include a `trend` array with timestamp and price pairs

#### Scenario: Insufficient history
- **WHEN** database has fewer than 24 hours of data
- **THEN** system SHALL return all available data points
