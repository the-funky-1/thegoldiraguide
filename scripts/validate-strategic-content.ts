import { ALL_SEEDS } from '../src/content/strategic/index'
import { ArticleSeedSchema } from '../src/content/strategic/types'
import { extractPlainText, fleschKincaidGrade } from '../src/content/strategic/reading-level'

const errors: string[] = []

for (const seed of ALL_SEEDS) {
  const parsed = ArticleSeedSchema.safeParse(seed)
  if (!parsed.success) {
    errors.push(`${seed._id}: ${parsed.error.message}`)
    continue
  }
  const grade = fleschKincaidGrade(extractPlainText(seed.body))
  if (grade < 6.5 || grade > 8.5) {
    errors.push(`${seed._id}: reading level ${grade.toFixed(2)} outside [6.5, 8.5]`)
  }
}

if (errors.length > 0) {
  console.error('validate-strategic-content: FAIL')
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(`validate-strategic-content: ${ALL_SEEDS.length} seeds OK`)
