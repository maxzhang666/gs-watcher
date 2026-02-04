## ADDED Requirements

### Requirement: SVG trend line rendering

The system SHALL generate a smooth SVG path representing 24-hour price movement.

#### Scenario: Path generation from data points
- **WHEN** trend visualization receives price history data
- **THEN** an SVG path SHALL be generated connecting all data points with smooth curves

#### Scenario: Trend line styling
- **WHEN** trend line renders
- **THEN** it SHALL use stroke-width of 2px with rounded line caps and no fill

#### Scenario: Responsive sizing
- **WHEN** card size changes
- **THEN** trend line SHALL maintain aspect ratio and fit within a 96x24px viewBox

### Requirement: Color-coded trend indication

Trend lines SHALL use colors that indicate overall price direction.

#### Scenario: Upward trend color
- **WHEN** current price is higher than starting price of the period
- **THEN** trend line SHALL be displayed in red-500 color

#### Scenario: Downward trend color
- **WHEN** current price is lower than starting price of the period
- **THEN** trend line SHALL be displayed in green-500 color

#### Scenario: Neutral trend color
- **WHEN** current price equals starting price (no change)
- **THEN** trend line SHALL be displayed in gray-500 color

### Requirement: Data point sampling

For 24-hour period, the system SHALL sample price data at appropriate intervals to generate smooth trends.

#### Scenario: Data point selection
- **WHEN** generating trend for 24 hours
- **THEN** system SHALL use up to 24 evenly spaced data points (1 per hour)

#### Scenario: Insufficient data points
- **WHEN** fewer than 10 data points are available for the period
- **THEN** trend line SHALL either use all available points or display a placeholder message

#### Scenario: Interpolation
- **WHEN** data points are sparse
- **THEN** SVG path SHALL use Bezier curves for smooth interpolation between points
