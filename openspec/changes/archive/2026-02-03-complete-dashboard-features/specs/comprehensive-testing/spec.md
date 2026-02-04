## ADDED Requirements

### Requirement: API Data Structure Validation
The system SHALL verify API endpoints return correct data structures with expected fields.

#### Scenario: Validate /api/prices response
- **WHEN** calling /api/prices endpoint
- **THEN** response contains gold, silver, and updatedAt fields with correct types

#### Scenario: Validate price data fields
- **WHEN** inspecting price data objects
- **THEN** each contains current, previous, high, low, avg, and timestamp fields

### Requirement: Empty Database Testing
The system SHALL handle empty database scenarios gracefully.

#### Scenario: No prices recorded
- **WHEN** database has no price records
- **THEN** API returns empty data structure without errors

#### Scenario: Display empty state
- **WHEN** API returns empty data
- **THEN** UI displays appropriate empty state message

### Requirement: Theme Persistence Testing
The system SHALL persist theme preference across browser sessions.

#### Scenario: Save theme preference
- **WHEN** user changes theme
- **THEN** preference is saved to localStorage

#### Scenario: Restore theme on reload
- **WHEN** page is reloaded
- **THEN** previously selected theme is restored

### Requirement: Polling Visibility Testing
The system SHALL verify polling pauses correctly when tab is hidden.

#### Scenario: Pause polling verification
- **WHEN** tab is hidden
- **THEN** no API requests are made during hidden period

#### Scenario: Resume polling verification
- **WHEN** tab becomes visible again
- **THEN** API requests resume immediately

### Requirement: Cross-Browser Compatibility
The system SHALL function correctly in Chrome, Firefox, and Safari browsers.

#### Scenario: Chrome compatibility
- **WHEN** application is loaded in Chrome
- **THEN** all features work without errors

#### Scenario: Firefox compatibility
- **WHEN** application is loaded in Firefox
- **THEN** all features work without errors

#### Scenario: Safari compatibility
- **WHEN** application is loaded in Safari
- **THEN** all features work without errors including time zone displays
