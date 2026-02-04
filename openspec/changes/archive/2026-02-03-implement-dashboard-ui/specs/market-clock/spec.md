## ADDED Requirements

### Requirement: Multi-timezone display

The market clock SHALL display current time in three major trading markets: New York, London, and Beijing.

#### Scenario: All three timezones visible
- **WHEN** header renders
- **THEN** clocks for NY, London (LDN), and Beijing (BJ) SHALL be displayed side by side

#### Scenario: Time format
- **WHEN** any clock displays time
- **THEN** time SHALL be in 24-hour format (HH:MM) with timezone abbreviation prefix

#### Scenario: Real-time updates
- **WHEN** page is active
- **THEN** all clocks SHALL update every second to reflect current time

### Requirement: Market hours indication

The market clock SHALL visually distinguish between active and inactive market hours.

#### Scenario: Active market indicator
- **WHEN** a market is within trading hours (approximate: 9:00-17:00 local time)
- **THEN** that market's clock SHALL be displayed in bold with a green pulsing dot

#### Scenario: Inactive market indicator
- **WHEN** a market is outside trading hours
- **THEN** that market's clock SHALL be displayed with reduced opacity and a gray dot

#### Scenario: Mobile responsiveness
- **WHEN** viewport width is < 768px
- **THEN** clock labels SHALL use smaller font size but remain readable

### Requirement: Timezone accuracy

Clock times SHALL be accurate regardless of user's local timezone.

#### Scenario: Correct timezone conversion
- **WHEN** user is in any timezone
- **THEN** each clock SHALL display the correct time for its respective timezone using Intl.DateTimeFormat

#### Scenario: Daylight saving time handling
- **WHEN** daylight saving time is in effect in any market
- **THEN** clock SHALL automatically adjust to the correct offset
