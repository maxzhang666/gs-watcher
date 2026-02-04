## ADDED Requirements

### Requirement: Automatic Polling Interval
The system SHALL automatically fetch fresh price data every 30 seconds using a configurable polling interval.

#### Scenario: Start polling on mount
- **WHEN** component mounts
- **THEN** system starts polling API every 30 seconds

#### Scenario: Continue polling while tab is active
- **WHEN** user keeps the browser tab active
- **THEN** system continues polling at regular intervals

### Requirement: Visibility-Aware Polling
The system SHALL pause polling when the browser tab becomes hidden and resume when visible again.

#### Scenario: Pause on tab hidden
- **WHEN** browser tab becomes hidden (Page Visibility API)
- **THEN** system pauses polling immediately

#### Scenario: Resume on tab visible
- **WHEN** hidden tab becomes visible again
- **THEN** system resumes polling within next interval

### Requirement: Polling Cleanup
The system SHALL properly cleanup polling intervals when component unmounts to prevent memory leaks.

#### Scenario: Stop polling on unmount
- **WHEN** component is unmounted
- **THEN** system clears all polling intervals and listeners
