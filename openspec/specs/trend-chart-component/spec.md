## ADDED Requirements

### Requirement: SVG Path Generation
The system SHALL generate smooth SVG paths from price data points using Bezier curve interpolation.

#### Scenario: Generate path from data points
- **WHEN** component receives an array of price data points
- **THEN** system generates a smooth SVG path string with Bezier interpolation

#### Scenario: Handle insufficient data
- **WHEN** component receives fewer than 2 data points
- **THEN** system renders a placeholder message instead of a chart

### Requirement: Trend Direction Color Coding
The system SHALL apply color coding to the trend line based on overall price direction.

#### Scenario: Upward trend
- **WHEN** latest price is higher than first price in dataset
- **THEN** trend line is rendered in green color

#### Scenario: Downward trend
- **WHEN** latest price is lower than first price in dataset
- **THEN** trend line is rendered in red color

### Requirement: Responsive Chart Sizing
The system SHALL render the chart responsively within a 96x24px viewBox that scales to container width.

#### Scenario: Chart scales to container
- **WHEN** parent container width changes
- **THEN** SVG chart scales proportionally while maintaining aspect ratio

### Requirement: Null Value Handling
The system SHALL handle null or undefined price values gracefully without breaking chart rendering.

#### Scenario: Skip null values
- **WHEN** dataset contains null or undefined values
- **THEN** system interpolates between valid data points, skipping null values
