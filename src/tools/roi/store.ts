import { create } from 'zustand'
import { ROI_DEFAULTS, type RoiInput } from '@/finance/roi/schema'

type Store = {
  input: RoiInput
  setInput: (patch: Partial<RoiInput>) => void
  reset: () => void
}

export const useRoiStore = create<Store>((set) => ({
  input: ROI_DEFAULTS,
  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),
  reset: () => set({ input: ROI_DEFAULTS }),
}))
