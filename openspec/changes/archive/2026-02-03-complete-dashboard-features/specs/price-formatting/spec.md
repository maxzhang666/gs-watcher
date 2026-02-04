## ADDED Requirements

### Requirement: Currency Formatting
The system SHALL format price values with appropriate currency symbols and decimal precision.

#### Scenario: Format CNY prices
- **WHEN** displaying CNY prices
- **THEN** system formats with ¥ symbol and 2 decimal places

#### Scenario: Format USD prices
- **WHEN** displaying USD prices
- **THEN** system formats with $ symbol and 2 decimal places

### Requirement: Large Number Formatting
The system SHALL add thousand separators to large price values for readability.

#### Scenario: Format prices over 1000
- **WHEN** price value exceeds 999
- **THEN** system adds comma separators (e.g., 1,234.56)

### Requirement: Price Change Calculation
The system SHALL calculate percentage and absolute price changes accurately.

#### Scenario: Calculate percentage change
- **WHEN** current and previous prices are available
- **THEN** system calculates percentage change: ((current - previous) / previous) * 100

#### Scenario: Handle zero previous price
- **WHEN** previous price is zero or null
- **THEN** system displays "N/A" instead of attempting calculation

### Requirement: Unit Conversion
The system SHALL convert between USD per ounce and USD per gram using accurate conversion factors.

#### Scenario: Convert USD/oz to USD/g
- **WHEN** displaying price per gram
- **THEN** system divides USD/oz by 31.1035 (troy ounce to gram)

### Requirement: Null Data Handling
The system SHALL handle null or undefined price values gracefully in all formatting operations.

#### Scenario: Format null price
- **WHEN** price value is null or undefined
- **THEN** system displays "—" or appropriate placeholder
