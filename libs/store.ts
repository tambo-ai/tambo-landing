import { create } from 'zustand'
import type { MagneticScroll } from '~/app/(pages)/_components/lenis/magnetic-scroll'

type Store = {
  isNavOpened: boolean
  setIsNavOpened: (value: boolean) => void
  magneticScroll: MagneticScroll | null
  setMagneticScroll: (value: MagneticScroll) => void
  hasAppeared: boolean
  setHasAppeared: (value: boolean) => void
  isMobileNavOpened: boolean
  setIsMobileNavOpened: (value: boolean) => void
}

export const useStore = create<Store>((set) => ({
  isNavOpened: false,
  setIsNavOpened: (value: boolean) => set({ isNavOpened: value }),
  magneticScroll: null,
  setMagneticScroll: (value: MagneticScroll) => set({ magneticScroll: value }),
  hasAppeared: true,
  setHasAppeared: (value: boolean) => set({ hasAppeared: value }),
  isMobileNavOpened: false,
  setIsMobileNavOpened: (value: boolean) => set({ isMobileNavOpened: value }),
}))
