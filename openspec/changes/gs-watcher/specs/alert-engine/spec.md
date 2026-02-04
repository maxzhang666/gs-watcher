## ADDED Requirements

### Requirement: Detect significant price fluctuation
The system SHALL detect when current price changes significantly from the previous record.

#### Scenario: Fluctuation exceeds threshold
- **WHEN** current price for `gds_AUTD` is 1070 and previous price was 1065 (threshold: 5)
- **THEN** system triggers a "fluctuation" alert with message "Price changed by +5 (from 1065 to 1070)"

#### Scenario: Fluctuation within threshold
- **WHEN** current price for `gds_AUTD` is 1066 and previous price was 1065 (threshold: 5)
- **THEN** system does not trigger any alert

#### Scenario: Use symbol-specific thresholds
- **WHEN** checking fluctuation for `gds_AUTD` (RMB, threshold: 5) vs `hf_XAU` (USD, threshold: 20)
- **THEN** system applies different thresholds based on symbol configuration

### Requirement: Detect intraday high/low breakout
The system SHALL detect when current price breaks today's highest or lowest price.

#### Scenario: New intraday high
- **WHEN** current price for `gds_AUTD` is 1090 and today's previous max was 1085
- **THEN** system triggers a "peak" alert with message "New intraday high: 1090"

#### Scenario: New intraday low
- **WHEN** current price for `gds_AUTD` is 1030 and today's previous min was 1035
- **THEN** system triggers a "valley" alert with message "New intraday low: 1030"

#### Scenario: Price within today's range
- **WHEN** current price for `gds_AUTD` is 1060, today's range is [1030, 1090]
- **THEN** system does not trigger any peak/valley alert

### Requirement: Detect continuous price trend
The system SHALL detect when price moves in the same direction for N consecutive records.

#### Scenario: Continuous upward trend
- **WHEN** last 5 prices for `gds_AUTD` are [1050, 1052, 1055, 1058, 1060] (strictly increasing)
- **THEN** system triggers a "trend_up" alert with message "Continuous upward trend (5 consecutive rises)"

#### Scenario: Continuous downward trend
- **WHEN** last 5 prices for `gds_AUTD` are [1060, 1058, 1055, 1052, 1050] (strictly decreasing)
- **THEN** system triggers a "trend_down" alert with message "Continuous downward trend (5 consecutive drops)"

#### Scenario: Mixed trend
- **WHEN** last 5 prices for `gds_AUTD` are [1050, 1052, 1051, 1055, 1060] (not strictly monotonic)
- **THEN** system does not trigger any trend alert

### Requirement: Enforce alert cooldown period
The system SHALL not send duplicate alerts of the same type for the same symbol within 15 minutes.

#### Scenario: Alert within cooldown period
- **WHEN** a "fluctuation" alert for `gds_AUTD` was sent 10 minutes ago
- **THEN** system skips sending another "fluctuation" alert even if triggered

#### Scenario: Alert after cooldown expires
- **WHEN** a "fluctuation" alert for `gds_AUTD` was sent 16 minutes ago
- **THEN** system sends a new "fluctuation" alert if triggered

#### Scenario: Different alert types are independent
- **WHEN** a "fluctuation" alert for `gds_AUTD` was sent 5 minutes ago
- **THEN** system can still send a "peak" alert for the same symbol

### Requirement: Run all checks on each new price
The system SHALL execute all monitoring checks (fluctuation, peak/valley, trend) whenever new price data is stored.

#### Scenario: Multiple alerts can trigger simultaneously
- **WHEN** a new price triggers both "fluctuation" (big jump) and "peak" (new high)
- **THEN** system sends both alerts (subject to individual cooldown checks)

#### Scenario: No alerts triggered
- **WHEN** a new price passes all checks without exceeding any thresholds
- **THEN** system completes silently without sending notifications
