## ADDED Requirements

### Requirement: Price card layout

Each price card SHALL display metal name, element symbol, current price, change percentage, and international prices in a structured card format.

#### Scenario: Gold card visual identity
- **WHEN** gold price card renders
- **THEN** card SHALL display "Au" symbol in a yellow-themed box and "黄金 GOLD" as the title

#### Scenario: Silver card visual identity
- **WHEN** silver price card renders
- **THEN** card SHALL display "Ag" symbol in a cyan-themed box and "白银 SILVER" as the title

#### Scenario: Hover effect
- **WHEN** user hovers over a price card
- **THEN** card border SHALL highlight with the metal's accent color and glow effect SHALL intensify

### Requirement: Price display formatting

Prices SHALL be displayed in a large, monospace font with clear currency symbols and decimal precision.

#### Scenario: CNY price display
- **WHEN** card renders
- **THEN** CNY price per gram SHALL be shown with "¥" symbol prefix and 2 decimal places

#### Scenario: Price magnitude emphasis
- **WHEN** price has more than 2 digits before decimal
- **THEN** integer part SHALL be in 6xl-7xl font size and decimal part SHALL be in 4xl font size with reduced opacity

#### Scenario: International price section
- **WHEN** card renders
- **THEN** USD per oz and USD per gram SHALL be displayed in a grid layout below the main price

### Requirement: Change indicator

Price cards SHALL display 24-hour price change with percentage and absolute value, color-coded by direction.

#### Scenario: Positive change (increase)
- **WHEN** price has increased in the last 24 hours
- **THEN** change SHALL be displayed in red color with upward triangle (▲) prefix

#### Scenario: Negative change (decrease)
- **WHEN** price has decreased in the last 24 hours
- **THEN** change SHALL be displayed in green color with downward triangle (▼) prefix

#### Scenario: Change details
- **WHEN** change indicator renders
- **THEN** both percentage and absolute value SHALL be shown (e.g., "▲ 1.24%" and "+5.85 ¥/g")

### Requirement: Trend visualization

Price cards SHALL include a simple 24-hour trend line visualization.

#### Scenario: Trend line rendering
- **WHEN** card renders with trend data
- **THEN** an SVG path SHALL display the price movement pattern over the last 24 hours

#### Scenario: Trend color coding
- **WHEN** overall trend is upward
- **THEN** trend line SHALL be red color (red-500)

#### Scenario: Downward trend
- **WHEN** overall trend is downward
- **THEN** trend line SHALL be green color (green-500)
