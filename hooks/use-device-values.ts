import { useWindowSize } from 'hamo'
import { useEffectEvent } from 'react'
import { desktopVW } from '~/libs/utils'

export function useDesktopVW() {
  const { width: windowWidth = 0 } = useWindowSize()

  const callback = useEffectEvent((value: number, ignoreMaxWidth = false) => {
    return desktopVW(value, windowWidth, ignoreMaxWidth)
  })

  return callback
}
