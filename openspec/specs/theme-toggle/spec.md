## ADDED Requirements

### Requirement: Theme persistence

The system SHALL persist the user's theme preference across browser sessions using localStorage.

#### Scenario: Initial load with saved preference
- **WHEN** user returns to the dashboard with a saved theme preference
- **THEN** system SHALL load the previously selected theme automatically

#### Scenario: Initial load without preference
- **WHEN** user visits dashboard for the first time
- **THEN** system SHALL default to dark theme

### Requirement: Theme toggle interaction

The system SHALL provide a button to toggle between light and dark themes with smooth transitions.

#### Scenario: Toggle from dark to light
- **WHEN** user clicks the theme toggle button in dark mode
- **THEN** system SHALL switch to light theme with a 300ms transition on all color properties

#### Scenario: Toggle from light to dark
- **WHEN** user clicks the theme toggle button in light mode
- **THEN** system SHALL switch to dark theme with a 300ms transition on all color properties

#### Scenario: Icon rotation animation
- **WHEN** user clicks the theme toggle button
- **THEN** the sun/moon icon SHALL rotate 180 degrees over 500ms

### Requirement: Theme-aware component styling

All UI components SHALL adapt their colors and styles based on the active theme.

#### Scenario: Dark theme colors
- **WHEN** dark theme is active
- **THEN** background SHALL be #0d0d0d, cards SHALL be #181818, and text SHALL be white

#### Scenario: Light theme colors
- **WHEN** light theme is active
- **THEN** background SHALL be gray-50, cards SHALL be white, and text SHALL be gray-900

#### Scenario: Accent color consistency
- **WHEN** theme changes
- **THEN** gold accent SHALL remain yellow-500 and silver accent SHALL remain cyan-500 in both themes
