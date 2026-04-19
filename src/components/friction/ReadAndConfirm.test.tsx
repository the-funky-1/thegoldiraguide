import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReadAndConfirm } from './ReadAndConfirm'

describe('ReadAndConfirm', () => {
  it('disables the confirm button until the checkbox is checked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ReadAndConfirm title="Important" body="Read me." onConfirm={onConfirm} />,
    )
    const confirm = screen.getByRole('button', { name: /confirm/i })
    expect(confirm).toBeDisabled()

    await user.click(
      screen.getByRole('checkbox', { name: /i have read and understood/i }),
    )
    expect(confirm).toBeEnabled()

    await user.click(confirm)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
