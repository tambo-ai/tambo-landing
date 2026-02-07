import { useEffect, useState } from 'react'
import { useStore } from '~/libs/store'

export function useLenisSnap(
  snap?: ('start' | 'end' | 'center')[] | 'start' | 'end' | 'center' | false
) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const magneticScroll = useStore((state) => state.magneticScroll)

  useEffect(() => {
    if (snap && magneticScroll && element) {
      return magneticScroll.addElement(element, {
        align: snap,
      })
    }
    return undefined
  }, [magneticScroll, element, snap])

  return setElement
}
