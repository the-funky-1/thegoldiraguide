export const analyticsEvents = {
  comparisonFilterChanged: 'comparison_filter_changed',
  comparisonSortChanged: 'comparison_sort_changed',
  dealerSourceClicked: 'dealer_source_clicked',
  frictionAcknowledged: 'friction_acknowledged',
  toolInputChanged: 'tool_input_changed',
  toolPrefillUsed: 'tool_prefill_used',
  toolReset: 'tool_reset',
} as const

export const analyticsToolIds = {
  correlationMatrix: 'correlation_matrix',
  feeDragAnalyzer: 'fee_drag_analyzer',
  roiCalculator: 'roi_calculator',
  rmdEstimator: 'rmd_estimator',
  spreadMarkupCalculator: 'spread_markup_calculator',
  writtenEstimateChecklist: 'written_estimate_checklist',
} as const

export type AnalyticsEventName =
  (typeof analyticsEvents)[keyof typeof analyticsEvents]

export type AnalyticsToolId =
  (typeof analyticsToolIds)[keyof typeof analyticsToolIds]
