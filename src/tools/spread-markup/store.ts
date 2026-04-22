import { create } from 'zustand'
import {
  SPREAD_MARKUP_DEFAULTS,
  type SpreadMarkupInput,
} from '@/finance/spread-markup/schema'

type Store = {
  input: SpreadMarkupInput
  setInput: (patch: Partial<SpreadMarkupInput>) => void
  reset: () => void
}

export const useSpreadMarkupStore = create<Store>((set) => ({
  input: SPREAD_MARKUP_DEFAULTS,
  setInput: (patch) => set((s) => ({ input: { ...s.input, ...patch } })),
  reset: () => set({ input: SPREAD_MARKUP_DEFAULTS }),
}))
