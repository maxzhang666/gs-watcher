## MODIFIED Requirements

### Requirement: Trend visualization

Price cards SHALL include an integrated trend chart component displaying smooth 24-hour price movement with Bezier interpolation.

#### Scenario: Trend chart integration
- **WHEN** card renders with historical price data
- **THEN** TrendChart component SHALL be embedded displaying smooth price movement over last 24 hours

#### Scenario: Chart responsiveness
- **WHEN** card width changes across breakpoints
- **THEN** trend chart SHALL scale proportionally within its container

#### Scenario: Trend color coding
- **WHEN** overall trend is upward (latest > first price)
- **THEN** trend line SHALL be rendered in green color (green-500)

#### Scenario: Downward trend
- **WHEN** overall trend is downward (latest < first price)
- **THEN** trend line SHALL be rendered in red color (red-500)

#### Scenario: Insufficient data
- **WHEN** fewer than 2 data points are available
- **THEN** trend chart SHALL display placeholder message instead of chart

### Requirement: Price display formatting

Prices SHALL be displayed with enhanced formatting utilities including thousand separators and unit conversions.

#### Scenario: CNY price with thousand separator
- **WHEN** CNY price exceeds 999
- **THEN** price SHALL be formatted with comma separators (e.g., "1,234.56")

#### Scenario: USD per gram conversion
- **WHEN** displaying USD per gram
- **THEN** value SHALL be calculated by dividing USD per oz by 31.1035

#### Scenario: Null price handling
- **WHEN** price data is null or undefined
- **THEN** price display SHALL show "—" placeholder

#### Scenario: Price magnitude emphasis
- **WHEN** price has more than 2 digits before decimal
- **THEN** integer part SHALL be in 6xl-7xl font size and decimal part SHALL be in 4xl font size with reduced opacity
