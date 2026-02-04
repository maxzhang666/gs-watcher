## 1. Project Dependencies and Configuration

- [x] 1.1 Install @nuxtjs/tailwindcss module
- [x] 1.2 Install @nuxtjs/color-mode module
- [x] 1.3 Install @vueuse/core for utility composables
- [x] 1.4 Configure Tailwind CSS in nuxt.config.ts with dark mode class strategy
- [x] 1.5 Configure color-mode module in nuxt.config.ts
- [x] 1.6 Add Google Fonts (Inter, JetBrains Mono) to app.head in nuxt.config.ts
- [x] 1.7 Create tailwind.config.ts with custom theme configuration

## 2. Layout and Theme Infrastructure

- [x] 2.1 Create ThemeToggle.vue component with sun/moon icons
- [x] 2.2 Implement theme toggle logic using useColorMode composable
- [x] 2.3 Add rotation animation for theme toggle icons
- [x] 2.4 Create app.vue with main layout structure
- [x] 2.5 Implement responsive header with market indicator
- [x] 2.6 Add background visual effects (gradient orbs and grid pattern)
- [x] 2.7 Configure theme transition animations in global CSS

## 3. Market Clock Component

- [x] 3.1 Create MarketClock.vue component
- [x] 3.2 Implement timezone display for NY, London, Beijing using Intl.DateTimeFormat
- [x] 3.3 Add real-time clock update interval (1 second)
- [x] 3.4 Implement market hours detection logic
- [x] 3.5 Add visual indicators for active/inactive markets (green dot vs gray dot)
- [x] 3.6 Make clock responsive for mobile screens

## 4. Price Card Component

- [x] 4.1 Create PriceCard.vue component with props for metal type
- [x] 4.2 Implement element symbol badge (Au/Ag) with themed colors
- [x] 4.3 Add large price display with monospace font and decimal formatting
- [x] 4.4 Implement change indicator with color coding (red=up, green=down)
- [x] 4.5 Add international price section (USD per oz and per gram)
- [x] 4.6 Implement hover effects with border glow
- [x] 4.7 Add background blur orb effect per card

## 5. Trend Visualization Component

- [ ] 5.1 Create TrendChart.vue component
- [ ] 5.2 Implement SVG path generation from data points
- [ ] 5.3 Add Bezier curve interpolation for smooth lines
- [ ] 5.4 Implement color coding based on trend direction
- [ ] 5.5 Handle edge cases (insufficient data, null values)
- [ ] 5.6 Make SVG responsive within 96x24px viewBox

## 6. API Endpoint for Price Data

- [x] 6.1 Create server/api/prices.get.ts file
- [x] 6.2 Implement query to get latest prices for monitored symbols from database
- [x] 6.3 Calculate 24-hour change (absolute and percentage)
- [x] 6.4 Format response data structure (gold, silver, updated_at)
- [x] 6.5 Add error handling for empty database
- [ ] 6.6 Implement optional history query parameter for trend data
- [ ] 6.7 Add data point sampling logic for 24-hour trends

## 7. Real-time Data Integration

- [x] 7.1 Implement useFetch composable in app.vue for /api/prices
- [x] 7.2 Configure client-side only fetching (server: false)
- [ ] 7.3 Add 30-second polling interval using useIntervalFn
- [ ] 7.4 Implement Page Visibility API to pause polling when tab is hidden
- [ ] 7.5 Add loading state handling with skeleton screens
- [ ] 7.6 Implement error state handling with fallback messages
- [x] 7.7 Pass fetched data to PriceCard components via props

## 8. Data Transformation and Formatting

- [ ] 8.1 Create composable for price formatting (currency symbols, decimals)
- [ ] 8.2 Implement change calculation logic (percentage and absolute)
- [ ] 8.3 Add number formatting for large prices (thousands separators if needed)
- [ ] 8.4 Create helper for converting USD/oz to USD/gram
- [ ] 8.5 Handle null/undefined data gracefully in formatters

## 9. Responsive Design and Polish

- [ ] 9.1 Test layout on mobile (< 768px) - verify single column grid
- [ ] 9.2 Test layout on tablet and desktop (>= 768px) - verify two column grid
- [ ] 9.3 Verify font sizes scale appropriately across breakpoints
- [ ] 9.4 Test theme transitions for smoothness (300ms colors, 500ms icons)
- [ ] 9.5 Verify all hover states work correctly
- [ ] 9.6 Test clock updates in real-time across all timezones
- [ ] 9.7 Check accessibility (keyboard navigation, focus states)

## 10. Testing and Validation

- [ ] 10.1 Verify API returns correct data structure
- [ ] 10.2 Test with empty database (no prices available)
- [ ] 10.3 Test theme persistence across browser sessions
- [ ] 10.4 Verify polling pauses when tab is hidden
- [ ] 10.5 Test trend visualization with various data sets
- [ ] 10.6 Verify change indicators show correct colors and values
- [ ] 10.7 Test in Chrome, Firefox, Safari for cross-browser compatibility
