## ADDED Requirements

### Requirement: Responsive layout structure

The dashboard SHALL use a responsive grid layout that adapts to different screen sizes, with a maximum width of 5xl (1280px) and centered content.

#### Scenario: Desktop view
- **WHEN** viewport width is >= 768px
- **THEN** price cards SHALL be displayed in a 2-column grid layout

#### Scenario: Mobile view
- **WHEN** viewport width is < 768px
- **THEN** price cards SHALL be displayed in a single-column layout

#### Scenario: Content centering
- **WHEN** viewport width exceeds max-width
- **THEN** content SHALL be centered horizontally with equal margins on both sides

### Requirement: Header with market indicator

The dashboard SHALL display a header bar with CNY market focus indicator and global market clocks.

#### Scenario: Market status indicator
- **WHEN** page loads
- **THEN** header SHALL show "CNY_MARKET_FOCUS" with a pulsing green dot indicating active status

#### Scenario: Theme toggle button placement
- **WHEN** user views header on any screen size
- **THEN** theme toggle button SHALL be visible and accessible in the top-right corner

### Requirement: Background visual effects

The dashboard SHALL include decorative background elements for visual depth without interfering with content readability.

#### Scenario: Dark mode gradient orbs
- **WHEN** dark theme is active
- **THEN** two gradient orbs (yellow and cyan) SHALL be visible with blur effect in the background

#### Scenario: Grid pattern overlay
- **WHEN** page renders
- **THEN** a subtle grid pattern SHALL overlay the background with low opacity

#### Scenario: Light mode background
- **WHEN** light theme is active
- **THEN** background SHALL be solid gray-50 color without gradient orbs
