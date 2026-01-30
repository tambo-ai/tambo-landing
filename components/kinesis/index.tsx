import cn from 'clsx'
import gsap from 'gsap'
import { useRef } from 'react'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { useMouseMove } from '~/hooks/use-mouse-move'

export function Kinesis({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { isDesktop } = useDeviceDetection()

  useMouseMove((x, y) => {
    if (!isDesktop) return

    gsap.to(mouseRef.current, {
      x: x,
      y: y,
      duration: 4,
      ease: 'expo.out',
    })
  })

  return (
    <div
      ref={elementRef}
      className={cn(className, 'max-dt:transform-[unset]!')}
    >
      {children}
    </div>
  )
}
