## 1. Price Formatting Composable

- [x] 1.1 Create composables/usePriceFormat.ts file
- [x] 1.2 Implement formatCurrency function with CNY and USD support
- [x] 1.3 Add thousand separator formatting for large numbers
- [x] 1.4 Implement calculatePercentageChange function
- [x] 1.5 Implement calculateAbsoluteChange function
- [x] 1.6 Add convertOzToGram function (USD/oz to USD/g)
- [x] 1.7 Add null/undefined value handling with placeholder returns

## 2. Data Polling Composable

- [x] 2.1 Create composables/useDataPolling.ts file
- [x] 2.2 Implement polling logic using useIntervalFn from @vueuse/core
- [x] 2.3 Add useDocumentVisibility integration for tab visibility detection
- [x] 2.4 Implement pause polling when tab is hidden
- [x] 2.5 Implement resume polling when tab becomes visible
- [x] 2.6 Add proper cleanup on component unmount
- [x] 2.7 Add configurable polling interval parameter (default 30s)

## 3. Trend Chart Component

- [x] 3.1 Create components/TrendChart.vue file
- [x] 3.2 Implement SVG viewBox setup (96x24px)
- [x] 3.3 Add data normalization to fit within viewBox height
- [x] 3.4 Implement Bezier curve path generation from data points
- [x] 3.5 Add color coding based on trend direction (green up, red down)
- [x] 3.6 Handle edge case: fewer than 2 data points (show placeholder)
- [x] 3.7 Handle null/undefined values by skipping in interpolation
- [x] 3.8 Make SVG responsive to container width

## 4. Loading and Error States

- [x] 4.1 Create skeleton placeholder component for price cards
- [x] 4.2 Add loading state to app.vue for initial fetch
- [x] 4.3 Implement error state display with user-friendly message
- [x] 4.4 Add retry mechanism (automatic via polling continuation)
- [x] 4.5 Implement empty database state message
- [x] 4.6 Add network timeout handling
- [x] 4.7 Preserve previous data on error (graceful degradation)

## 5. Integrate Data Polling

- [x] 5.1 Replace useFetch with useDataPolling in app.vue
- [x] 5.2 Configure 30-second polling interval
- [x] 5.3 Add visibility-aware polling control
- [x] 5.4 Test polling pauses when tab is hidden
- [x] 5.5 Test polling resumes when tab becomes visible
- [x] 5.6 Verify cleanup on component unmount

## 6. Integrate Price Formatting

- [x] 6.1 Import usePriceFormat in PriceCard.vue
- [x] 6.2 Apply formatCurrency to price displays
- [x] 6.3 Add thousand separators to large prices
- [x] 6.4 Apply USD/oz to USD/g conversion
- [x] 6.5 Update change indicators with formatted values
- [x] 6.6 Test null value handling displays placeholders

## 7. Integrate Trend Chart

- [x] 7.1 Import TrendChart component in PriceCard.vue
- [x] 7.2 Replace chart placeholder with TrendChart component
- [x] 7.3 Pass price history data to TrendChart
- [x] 7.4 Verify chart renders correctly with real data
- [x] 7.5 Test chart color changes based on trend direction
- [x] 7.6 Verify placeholder shows when insufficient data

## 8. API Enhancement for History Data

- [x] 8.1 Add optional history query parameter to /api/prices.get.ts
- [x] 8.2 Implement data sampling logic (select every Nth record for ~50-100 points)
- [x] 8.3 Update API response to include history array
- [x] 8.4 Test API returns correct sampled data
- [x] 8.5 Verify history data structure matches TrendChart expectations

## 9. Responsive Design Validation

- [x] 9.1 Test mobile layout (375px width) - verify single column
- [x] 9.2 Test tablet layout (768px width) - verify two column grid
- [x] 9.3 Test desktop layout (1280px+ width) - verify centered max-width
- [x] 9.4 Verify font sizes scale appropriately across breakpoints
- [x] 9.5 Test all hover states work correctly on desktop
- [x] 9.6 Test touch interactions work on mobile devices

## 10. Theme and Transitions

- [x] 10.1 Verify theme toggle animation (500ms rotation)
- [x] 10.2 Verify color transitions are smooth (300ms)
- [x] 10.3 Test theme persistence across browser reloads
- [x] 10.4 Verify skeleton screens work in both light and dark mode
- [x] 10.5 Test trend chart colors in both themes

## 11. Cross-Browser Testing

- [x] 11.1 Test all features in Chrome (latest)
- [x] 11.2 Test all features in Firefox (latest)
- [x] 11.3 Test all features in Safari (latest)
- [x] 11.4 Verify market clock timezone displays correctly in Safari
- [x] 11.5 Test Page Visibility API works in all browsers
- [x] 11.6 Verify SVG rendering is consistent across browsers

## 12. API and Error Scenario Testing

- [x] 12.1 Test /api/prices returns correct data structure
- [x] 12.2 Test with empty database (no prices) - verify empty state
- [x] 12.3 Test API error response handling
- [x] 12.4 Test network timeout scenario
- [x] 12.5 Verify error message displays correctly
- [x] 12.6 Test automatic retry on next polling interval

## 13. Final Polish

- [x] 13.1 Add "last updated" timestamp display
- [x] 13.2 Verify all console errors are resolved
- [x] 13.3 Test complete user flow: page load → theme switch → wait for poll → hide tab → show tab
- [x] 13.4 Verify no memory leaks (check dev tools performance tab)
- [x] 13.5 Final accessibility check (keyboard navigation)
- [x] 13.6 Update README with new features if needed
