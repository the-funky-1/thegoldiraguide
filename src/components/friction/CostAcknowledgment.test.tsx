import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CostAcknowledgment } from './CostAcknowledgment'

describe('CostAcknowledgment', () => {
  it('surfaces the cost figure and forces the user to type it before continuing', async () => {
    const user = userEvent.setup()
    const onContinue = vi.fn()
    render(
      <CostAcknowledgment
        label="Your total projected fee drag"
        formattedCost="$12,345.00"
        costPlainDigits="12345"
        onContinue={onContinue}
      />,
    )

    const input = screen.getByRole('textbox', { name: /type the number/i })
    const button = screen.getByRole('button', { name: /i acknowledge/i })
    expect(button).toBeDisabled()

    await user.type(input, '12345')
    expect(button).toBeEnabled()
    await user.click(button)
    expect(onContinue).toHaveBeenCalledTimes(1)
  })
})
