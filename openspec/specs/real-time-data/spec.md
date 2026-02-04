## MODIFIED Requirements

### Requirement: Automatic data refresh

The dashboard SHALL automatically fetch updated price data at regular intervals with visibility-aware polling control.

#### Scenario: Polling interval
- **WHEN** dashboard is loaded and visible
- **THEN** price data SHALL be fetched every 30 seconds using useIntervalFn composable

#### Scenario: Background tab behavior
- **WHEN** user switches to another browser tab (Page Visibility API detects hidden state)
- **THEN** polling SHALL pause immediately to save resources

#### Scenario: Return to active tab
- **WHEN** user returns to the dashboard tab (Page Visibility API detects visible state)
- **THEN** polling SHALL resume immediately and fetch fresh data

#### Scenario: Component cleanup
- **WHEN** component unmounts
- **THEN** all polling intervals and visibility listeners SHALL be properly cleaned up

### Requirement: Loading states

The dashboard SHALL indicate when data is being loaded or refreshed with skeleton screens and error messages.

#### Scenario: Initial load
- **WHEN** page first loads with no cached data
- **THEN** price cards SHALL display animated skeleton placeholders

#### Scenario: Background refresh
- **WHEN** data is being refreshed in the background (after initial load)
- **THEN** existing prices SHALL remain visible without showing loading state

#### Scenario: Error handling
- **WHEN** API request fails
- **THEN** error message SHALL be displayed with retry option and previous data SHALL remain visible

#### Scenario: Network timeout
- **WHEN** API request times out
- **THEN** timeout message SHALL be displayed and polling SHALL continue on next interval

#### Scenario: Empty database state
- **WHEN** API returns no price data
- **THEN** appropriate empty state message SHALL be displayed indicating data collection is starting
