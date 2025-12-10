'use client'

import cn from 'clsx'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import s from './hash-pattern.module.css'

export function HashPattern({ className }: { className?: string }) {
  const { dpr } = useDeviceDetection()

  return <div className={cn(s.hashed, dpr === 1 && s.dpr1, className)} />
}
