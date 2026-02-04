## Why

The initial dashboard UI implementation (archived as 2026-02-03-implement-dashboard-ui) successfully delivered core functionality including layout, theme switching, market clocks, and price cards. However, several important features remain unimplemented that are necessary for a production-ready monitoring dashboard: trend visualization, real-time data polling, error handling, and comprehensive testing. Completing these features will provide users with a fully functional and reliable price monitoring interface.

## What Changes

- Add trend chart visualization component to display price history graphs
- Implement real-time data polling with 30-second intervals and automatic pause on tab visibility change
- Add loading and error state handling with skeleton screens and fallback messages
- Create data transformation utilities for price formatting and conversion
- Complete responsive design validation across breakpoints
- Add comprehensive testing coverage for all UI components and API endpoints

## Capabilities

### New Capabilities
- `trend-chart-component`: SVG-based line chart with Bezier interpolation for smooth price trend visualization
- `data-polling`: Automatic real-time data refresh with visibility-aware polling control
- `error-handling`: Comprehensive error and loading state management across the application
- `price-formatting`: Utility composables for currency formatting, conversion, and display
- `responsive-validation`: Systematic testing and validation of responsive behavior
- `comprehensive-testing`: Test suite covering API, components, and cross-browser compatibility

### Modified Capabilities
- `real-time-data`: Add polling interval, visibility API integration, and state management (extends existing capability)
- `price-cards`: Integrate trend chart component and enhanced data formatting (extends existing capability)

## Impact

**Affected Components**:
- `components/PriceCard.vue`: Will integrate trend chart and enhanced formatting
- `app.vue`: Will add polling logic, loading states, and error boundaries
- `server/api/prices.get.ts`: Will add history query parameter support

**New Files**:
- `components/TrendChart.vue`: New chart component
- `composables/usePriceFormat.ts`: Formatting utilities
- `composables/useDataPolling.ts`: Polling logic with visibility control

**Dependencies**:
- No new external dependencies required (using native SVG and existing @vueuse/core)

**Testing Requirements**:
- Mobile/tablet/desktop responsive testing
- Theme transition validation
- Cross-browser compatibility (Chrome, Firefox, Safari)
- API error scenario testing
