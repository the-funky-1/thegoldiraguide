import type {
  FinancialProduct,
  MonetaryAmount,
  WithContext,
} from 'schema-dts'

type Input = {
  name: string
  url: string
  description: string
  setupFeeUsd?: number
  annualAdminFeeUsd?: number
  storageModel: 'flat' | 'scaling'
  storageFlatFeeUsd?: number
  storageScalingPercent?: number
  typicalPurchaseSpreadPercent: number
  typicalLiquidationSpreadPercent: number
  minimumInvestmentUsd?: number
}

// schema-dts omits `amount` from FinancialProduct; Google Structured Data
// recognizes it as a MonetaryAmount representing the minimum investment.
type ConcreteFinancialProduct = Exclude<FinancialProduct, string> & {
  amount?: Exclude<MonetaryAmount, string>
}

export function buildFinancialProduct(
  input: Input,
): WithContext<ConcreteFinancialProduct> {
  const feesAndCommissionsSpecification = JSON.stringify({
    setupFeeUsd: input.setupFeeUsd ?? 0,
    annualAdminFeeUsd: input.annualAdminFeeUsd ?? 0,
    storageModel: input.storageModel,
    storageFlatFeeUsd: input.storageFlatFeeUsd,
    storageScalingPercent: input.storageScalingPercent,
    typicalPurchaseSpreadPercent: input.typicalPurchaseSpreadPercent,
    typicalLiquidationSpreadPercent: input.typicalLiquidationSpreadPercent,
  })

  const out: WithContext<ConcreteFinancialProduct> = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: input.name,
    url: input.url,
    description: input.description,
    feesAndCommissionsSpecification,
  }
  if (input.minimumInvestmentUsd !== undefined) {
    out.amount = {
      '@type': 'MonetaryAmount',
      minValue: input.minimumInvestmentUsd,
      currency: 'USD',
    }
  }
  return out
}
