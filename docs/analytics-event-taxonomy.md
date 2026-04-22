# Analytics Event Taxonomy

The Gold IRA Guide uses Google Analytics, Vercel Analytics, and Amplitude when
the corresponding deployment environment variables are configured.

## Collection Rules

- Do not send names, email addresses, phone numbers, quote request details, or
  exact financial inputs to analytics.
- Bucket calculator amounts, years, percentages, and ratios before tracking.
- Use analytics for product improvement, compliance visibility, and content
  quality. Do not use analytics activity for outbound sales calls.
- Track source domains for outbound source clicks, not full personal URLs or
  query strings.

## Events

| Event | Purpose | Required Properties |
| --- | --- | --- |
| `tool_input_changed` | A calculator or tool input was edited and blurred. | `tool_id`, `field_key`, `value_bucket` |
| `tool_prefill_used` | A live-market or preset prefill was applied. | `tool_id`, `source` |
| `tool_reset` | A tool was reset to defaults. | `tool_id` |
| `friction_acknowledged` | A user passed a high-cost or high-risk friction step. | `tool_id`, `friction_type` |
| `comparison_filter_changed` | Written-estimate comparison filters changed. | `tool_id`, filter bucket |
| `comparison_sort_changed` | Written-estimate comparison sort changed. | `tool_id`, `sort_key` |
| `dealer_source_clicked` | A source document link was opened. | `tool_id`, `source_domain` |

## Tool IDs

| Tool ID | Page |
| --- | --- |
| `roi_calculator` | `/tools/roi-calculator` |
| `fee_drag_analyzer` | `/tools/fee-drag-analyzer` |
| `written_estimate_checklist` | `/tools/written-estimate-checklist` |
| `spread_markup_calculator` | `/tools/spread-markup-calculator` |
| `rmd_estimator` | `/tools/rmd-estimator` |
| `correlation_matrix` | `/tools/correlation-matrix` |
