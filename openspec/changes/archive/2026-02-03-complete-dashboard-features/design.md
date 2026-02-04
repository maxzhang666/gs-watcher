## Context

The initial dashboard implementation established the foundation with layout, theme system, market clocks, and basic price display. The current codebase uses Nuxt 3 with Tailwind CSS for styling, sql.js for database operations, and @vueuse/core for reactive utilities. The system already has working API endpoints and data fetching, but lacks trend visualization, robust error handling, and comprehensive testing.

This design addresses the completion of production-ready features including trend charts, real-time polling with visibility awareness, error/loading states, and systematic validation across browsers and devices.

**Constraints**:
- No new external dependencies for charts (use native SVG)
- Maintain existing design system (Tailwind + color-mode)
- Keep bundle size minimal (no Chart.js or similar libraries)
- Preserve existing component structure and API contracts

## Goals / Non-Goals

**Goals:**
- Add smooth SVG-based trend visualization using Bezier interpolation
- Implement visibility-aware polling that respects browser tab state
- Provide comprehensive error/loading state handling with user-friendly messages
- Create reusable formatting utilities for currency and price conversion
- Validate responsive behavior systematically across breakpoints
- Ensure cross-browser compatibility (Chrome, Firefox, Safari)

**Non-Goals:**
- Interactive chart features (zoom, pan, tooltips on hover) - out of scope for v1
- Historical data export functionality
- Advanced analytics or comparison tools
- Real-time WebSocket connections (polling is sufficient)
- Backend optimization or database schema changes

## Decisions

### Decision 1: Native SVG for Trend Charts

**Choice**: Use native SVG with manually calculated Bezier curves instead of Chart.js or similar charting libraries.

**Rationale**:
- Zero additional bundle size (no external dependencies)
- Full control over styling and dark mode integration
- Simple use case doesn't require complex chart library features
- SVG scales perfectly across all screen sizes

**Alternatives Considered**:
- **Chart.js**: Popular but adds ~200KB to bundle, overkill for simple line chart
- **Recharts**: React-specific, not ideal for Vue ecosystem
- **Canvas API**: Less accessible than SVG, harder to style

**Trade-off**: Manual path calculation requires more implementation work but results in lighter, more maintainable code.

---

### Decision 2: Composable-Based Architecture for Polling and Formatting

**Choice**: Create dedicated composables (`useDataPolling.ts`, `usePriceFormat.ts`) rather than embedding logic in components.

**Rationale**:
- Reusability across multiple components
- Easier to test in isolation
- Follows Vue 3 composition API best practices
- Clear separation of concerns

**Alternatives Considered**:
- **Component-embedded logic**: Simpler initially but leads to duplication
- **Vuex/Pinia store**: Overkill for straightforward polling and formatting utilities

**Implementation**: Composables will use @vueuse/core utilities (useIntervalFn, useDocumentVisibility) for polling control.

---

### Decision 3: Skeleton Screens for Initial Load Only

**Choice**: Display skeleton placeholders only during initial page load; subsequent polling updates happen silently.

**Rationale**:
- Avoids jarring UI flicker during background refreshes
- Maintains data continuity for users monitoring prices
- Common pattern in modern dashboards (e.g., stock tickers)

**Alternatives Considered**:
- **Loading spinner on every refresh**: Distracting and breaks visual continuity
- **Subtle refresh indicator**: Added complexity for minimal user benefit

**Edge case**: If data fetch fails completely on initial load, show error state instead of skeleton.

---

### Decision 4: Page Visibility API for Polling Control

**Choice**: Use native Page Visibility API to pause/resume polling when tab is hidden/visible.

**Rationale**:
- Reduces unnecessary API calls when user isn't viewing dashboard
- Browser-native API with excellent compatibility
- @vueuse/core provides `useDocumentVisibility()` wrapper for cleaner code

**Alternatives Considered**:
- **Continue polling regardless**: Wastes server resources and battery on mobile
- **WebSocket connection**: Over-engineered for 30-second polling interval

**Implementation**: Combine useIntervalFn with useDocumentVisibility to conditionally execute fetch.

---

### Decision 5: Graceful Degradation for Error States

**Choice**: Display errors non-intrusively while preserving last known good data.

**Rationale**:
- Users can still view previous prices even if refresh fails
- Reduces panic from transient network issues
- Automatic retry on next polling cycle handles temporary failures

**Alternatives Considered**:
- **Clear data on error**: Too aggressive, loses context
- **Modal error dialogs**: Disruptive user experience

**Error hierarchy**:
1. Network errors: Show message, keep polling
2. API errors: Log to console, show message, retry
3. Empty database: Show "collecting data..." message

---

### Decision 6: Manual Responsive Testing Over Automated

**Choice**: Systematic manual testing across breakpoints and browsers rather than automated visual regression tests.

**Rationale**:
- Faster to implement for small UI surface area
- Catches subjective visual issues (spacing, alignment) better than screenshots
- No additional testing infrastructure needed

**Alternatives Considered**:
- **Percy/Chromatic visual regression**: Expensive for open-source project
- **Playwright visual tests**: Setup overhead not justified for current scope

**Testing checklist**: Mobile (375px), tablet (768px), desktop (1280px+) on Chrome/Firefox/Safari.

## Risks / Trade-offs

**Risk**: SVG path calculation may be complex for edge cases (null values, single data point)  
**Mitigation**: Handle edge cases explicitly with fallback to placeholder message. Validate with various data scenarios during implementation.

**Risk**: Polling may miss updates if tab is kept hidden for extended periods  
**Mitigation**: Document that updates resume immediately when tab becomes active. Consider adding "last updated X minutes ago" indicator in future iteration.

**Risk**: Timezone display accuracy across browsers (Safari quirks)  
**Mitigation**: Use Intl.DateTimeFormat API which is well-supported. Test specifically on Safari to verify Asia/Shanghai, America/New_York, and Europe/London zones.

**Risk**: Theme transition performance on lower-end devices  
**Mitigation**: Use CSS transforms and opacity (GPU-accelerated) rather than color transitions on large elements. Keep transition duration to 300ms.

**Trade-off**: Manual testing requires discipline but saves setup time for limited feature set.

## Migration Plan

**Phase 1: Non-breaking additions**
- Create new composables (useDataPolling, usePriceFormat)
- Create TrendChart component
- Add error/loading state handling to app.vue

**Phase 2: Component integration**
- Integrate TrendChart into PriceCard
- Switch app.vue from useFetch to useDataPolling composable
- Apply formatting utilities across price displays

**Phase 3: Validation**
- Manual responsive testing checklist
- Cross-browser validation
- Theme transition verification

**Rollback**: All changes are additive except switching useFetch to useDataPolling. If issues arise, reverting app.vue to previous useFetch implementation restores functionality.

**No database migrations required** - all changes are frontend-only.

## Open Questions

1. Should we add a manual "refresh now" button for users who want immediate updates?  
   → Decision: Defer to future iteration. Automatic polling is sufficient for v1.

2. How many data points should trend chart display (24 hours of data = 43,200 points at 2-second monitoring)?  
   → Decision: Sample to ~50-100 points by selecting every Nth record. Will be implemented in API endpoint.

3. Should we display "last updated" timestamp?  
   → Decision: Yes, add to footer or near market clocks. Helps users understand data freshness.
