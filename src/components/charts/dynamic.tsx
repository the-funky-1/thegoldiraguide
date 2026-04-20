'use client'

import dynamic from 'next/dynamic'

export const ReactECharts = dynamic(
  async () => {
    const [echarts, core] = await Promise.all([
      import('echarts-for-react'),
      import('echarts/core'),
    ])
    const { LineChart, BarChart } = await import('echarts/charts')
    const {
      GridComponent,
      TooltipComponent,
      TitleComponent,
      LegendComponent,
      DataZoomComponent,
    } = await import('echarts/components')
    const { CanvasRenderer } = await import('echarts/renderers')
    core.use([
      LineChart,
      BarChart,
      GridComponent,
      TooltipComponent,
      TitleComponent,
      LegendComponent,
      DataZoomComponent,
      CanvasRenderer,
    ])
    return echarts.default
  },
  { ssr: false, loading: () => <div className="h-64" aria-hidden /> },
)
