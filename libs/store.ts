import type LenisSnap from 'lenis/snap'
import { create } from 'zustand'

type Store = {
  isNavOpened: boolean
  setIsNavOpened: (value: boolean) => void
  lenisSnap: LenisSnap | null
  setLenisSnap: (value: LenisSnap) => void
  hasAppeared: boolean
  setHasAppeared: (value: boolean) => void
  isMobileNavOpened: boolean
  setIsMobileNavOpened: (value: boolean) => void
}

export const useStore = create<Store>((set) => ({
  isNavOpened: false,
  setIsNavOpened: (value: boolean) => set({ isNavOpened: value }),
  lenisSnap: null,
  setLenisSnap: (value: LenisSnap) => set({ lenisSnap: value }),
  hasAppeared: true,
  setHasAppeared: (value: boolean) => set({ hasAppeared: value }),
  isMobileNavOpened: false,
  setIsMobileNavOpened: (value: boolean) => set({ isMobileNavOpened: value }),
}))
