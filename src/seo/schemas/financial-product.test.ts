import { describe, expect, it } from 'vitest'
import { buildFinancialProduct } from './financial-product'

describe('buildFinancialProduct', () => {
  it('encodes fees into feesAndCommissionsSpecification as JSON', () => {
    const fp = buildFinancialProduct({
      name: 'LGS Flat-Rate IRA',
      url: 'https://x.test/products/flat',
      description: 'Flat-rate storage, transparent spread.',
      setupFeeUsd: 75,
      annualAdminFeeUsd: 100,
      storageModel: 'flat',
      storageFlatFeeUsd: 125,
      typicalPurchaseSpreadPercent: 4,
      typicalLiquidationSpreadPercent: 1,
    })
    const parsed = JSON.parse(fp.feesAndCommissionsSpecification as string)
    expect(parsed).toMatchObject({
      setupFeeUsd: 75,
      annualAdminFeeUsd: 100,
      storageModel: 'flat',
      typicalPurchaseSpreadPercent: 4,
    })
  })

  it('omits amount when there is no minimum investment', () => {
    const fp = buildFinancialProduct({
      name: 'x',
      url: 'https://x.test',
      description: 'y',
      storageModel: 'flat',
      typicalPurchaseSpreadPercent: 5,
      typicalLiquidationSpreadPercent: 1,
    })
    expect(fp.amount).toBeUndefined()
  })
})
