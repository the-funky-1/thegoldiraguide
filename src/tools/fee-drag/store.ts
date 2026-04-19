import { create } from 'zustand'
import { FEE_DRAG_DEFAULTS, type FeeDragInput } from '@/finance/fee-drag/schema'

type Store = {
  input: FeeDragInput
  setInput: (patch: Partial<FeeDragInput>) => void
  reset: () => void
}

export const useFeeDragStore = create<Store>((set) => ({
  input: FEE_DRAG_DEFAULTS,
  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),
  reset: () => set({ input: FEE_DRAG_DEFAULTS }),
}))
