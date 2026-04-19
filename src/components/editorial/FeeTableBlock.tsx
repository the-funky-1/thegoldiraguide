import { formatPercent, formatUsd } from '@/finance/decimal'

type Row = {
  _id: string
  dealerName: string
  setupFeeUsd?: number
  annualAdminFeeUsd?: number
  storageModel: 'flat' | 'scaling'
  storageFlatFeeUsd?: number
  storageScalingPercent?: number
  typicalPurchaseSpreadPercent: number
  typicalLiquidationSpreadPercent: number
  mandatorySalesCall: boolean
}

export function FeeTableBlock({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null
  return (
    <figure className="my-6 overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="text-left font-semibold">
          Fee schedule comparison
        </caption>
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Dealer</th>
            <th className="p-2 text-right">Setup</th>
            <th className="p-2 text-right">Admin/yr</th>
            <th className="p-2 text-right">Storage</th>
            <th className="p-2 text-right">Purchase spread</th>
            <th className="p-2 text-right">Liquidation spread</th>
            <th className="p-2 text-left">Sales call req.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-b">
              <td className="p-2">{r.dealerName}</td>
              <td className="p-2 text-right">
                {formatUsd(r.setupFeeUsd ?? 0)}
              </td>
              <td className="p-2 text-right">
                {formatUsd(r.annualAdminFeeUsd ?? 0)}
              </td>
              <td className="p-2 text-right">
                {r.storageModel === 'flat'
                  ? `${formatUsd(r.storageFlatFeeUsd ?? 0)}/yr`
                  : formatPercent((r.storageScalingPercent ?? 0) / 100)}
              </td>
              <td className="p-2 text-right">
                {formatPercent(r.typicalPurchaseSpreadPercent / 100)}
              </td>
              <td className="p-2 text-right">
                {formatPercent(r.typicalLiquidationSpreadPercent / 100)}
              </td>
              <td className="p-2">{r.mandatorySalesCall ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
