# Symbol Threshold Configuration

This document explains the recommended threshold values for different precious metal symbols.

## Threshold Purpose

Thresholds determine when a price fluctuation is significant enough to trigger an alert. Different symbols have different price scales, so thresholds must be adjusted accordingly.

## Recommended Thresholds

### RMB-Denominated Symbols (Chinese Market)

| Symbol | Name | Price Range | Threshold | Reason |
|--------|------|-------------|-----------|---------|
| `gds_AUTD` | 黄金延期 (Gold T+D) | ¥500-600 | ±5 yuan | Typical daily range ~10-20 yuan |
| `gds_AGTD` | 白银延期 (Silver T+D) | ¥20,000-25,000 | ±50 yuan | More volatile, larger absolute movements |

### USD-Denominated Symbols (International Market)

| Symbol | Name | Price Range | Threshold | Reason |
|--------|------|-------------|-----------|---------|
| `hf_XAU` | 伦敦金 (London Gold) | $2,000-3,000 | ±20 USD | Large absolute price, needs higher threshold |
| `hf_XAG` | 伦敦银 (London Silver) | $25-35 | ±0.5 USD | Smaller price scale, sensitive movements |

## Adjusting Thresholds

### When to Increase Threshold

- Too many false alerts (normal market fluctuations triggering notifications)
- During high volatility periods (e.g., major economic announcements)
- If you only want to catch major movements

### When to Decrease Threshold

- Missing important price movements
- During quiet market periods
- If you want more sensitive monitoring

## Configuration

Set thresholds in `.env` file:

```bash
# RMB symbols - adjust based on yuan price movements
NUXT_THRESHOLD_GDS_AUTD=5      # Gold T+D: ±5 yuan
NUXT_THRESHOLD_GDS_AGTD=50     # Silver T+D: ±50 yuan

# USD symbols - adjust based on dollar price movements  
NUXT_THRESHOLD_HF_XAU=20       # London Gold: ±20 USD
NUXT_THRESHOLD_HF_XAG=0.5      # London Silver: ±0.5 USD
```

## Example Scenarios

### Conservative (Fewer Alerts)
```
NUXT_THRESHOLD_GDS_AUTD=10     # Only alert on ±10 yuan moves
NUXT_THRESHOLD_HF_XAU=50       # Only alert on ±50 USD moves
```

### Aggressive (More Alerts)
```
NUXT_THRESHOLD_GDS_AUTD=2      # Alert on ±2 yuan moves
NUXT_THRESHOLD_HF_XAU=10       # Alert on ±10 USD moves
```

## Notes

- Thresholds only affect **fluctuation alerts** (sudden price changes)
- Peak/valley and trend alerts are NOT affected by these thresholds
- Monitor your alerts for the first few days and adjust accordingly
- Different symbols can have different sensitivity levels
