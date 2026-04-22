import { create } from 'zustand'
import { RMD_DEFAULTS, type RmdInput } from '@/finance/rmd/schema'

type Store = {
  input: RmdInput
  setInput: (patch: Partial<RmdInput>) => void
  reset: () => void
}

export const useRmdStore = create<Store>((set) => ({
  input: RMD_DEFAULTS,
  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),
  reset: () => set({ input: RMD_DEFAULTS }),
}))
