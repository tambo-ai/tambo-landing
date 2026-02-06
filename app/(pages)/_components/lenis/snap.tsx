import { useEffect, useState } from 'react'
import { useStore } from '~/libs/store'

export function useLenisSnap(
  snap?: ('start' | 'end' | 'center')[] | 'start' | 'end' | 'center' | false
) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const lenisSnap = useStore((state) => state.lenisSnap)

  useEffect(() => {
    if (snap && lenisSnap && element) {
      return lenisSnap.addElement(element, {
        align: snap,
      })
    }

    return undefined
  }, [lenisSnap, element, snap])

  return setElement
}
