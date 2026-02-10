import type Lenis from 'lenis'

const __DEV__ =
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'

const DEFAULT_MIN_IMMEDIATE_ADJUSTMENT_PX = 0.25

type Align = 'start' | 'end' | 'center'

type ResizeObserverHandle = Pick<
  ResizeObserver,
  'observe' | 'unobserve' | 'disconnect'
>

function createNoopResizeObserver(): ResizeObserverHandle {
  return {
    observe: () => undefined,
    unobserve: () => undefined,
    disconnect: () => undefined,
  }
}

type SnapElement = {
  element: HTMLElement
  align: Align[]
  unobserve: () => void
}

type MagneticScrollOptions = {
  velocityThreshold?: number
  distanceThreshold?: number
  pullStrength?: number

  /** Minimum pixel delta before applying an immediate scroll adjustment. */
  minImmediateAdjustmentPx?: number
}

export class MagneticScroll {
  private lenis: Lenis
  private elements: Map<HTMLElement, SnapElement> = new Map()
  private snapPoints: number[] = []
  private velocityThreshold: number
  private distanceThreshold: number
  private pullStrength: number
  private resizeObserver: ResizeObserverHandle
  private lastDirection = 0
  private recomputeRafId: number | null = null
  private unsupported = false
  private destroyed = false
  private attracting = false
  private minImmediateAdjustmentPx: number

  private onWindowResize = () => {
    this.scheduleRecompute()
  }

  private get isActive() {
    // Invariant: async callbacks (ResizeObserver, rAF, window events) must gate
    // on `isActive` before mutating instance state.
    return !(this.unsupported || this.destroyed)
  }

  constructor(lenis: Lenis, options: MagneticScrollOptions = {}) {
    this.lenis = lenis
    this.velocityThreshold = options.velocityThreshold ?? 4
    this.distanceThreshold = options.distanceThreshold ?? 1000
    this.pullStrength = options.pullStrength ?? 0.06
    this.minImmediateAdjustmentPx =
      options.minImmediateAdjustmentPx ?? DEFAULT_MIN_IMMEDIATE_ADJUSTMENT_PX

    if (typeof window === 'undefined') {
      this.unsupported = true
      this.resizeObserver = createNoopResizeObserver()
      return
    }

    if (typeof ResizeObserver === 'undefined') {
      if (__DEV__) {
        console.warn(
          'MagneticScroll: ResizeObserver is not available; magnetic snapping is disabled.'
        )
      }

      this.unsupported = true
      this.resizeObserver = createNoopResizeObserver()
      return
    }

    this.resizeObserver = new ResizeObserver(() => {
      // Safe even during teardown; `scheduleRecompute()` is gated by `isActive`.
      this.scheduleRecompute()
    })

    window.addEventListener('resize', this.onWindowResize, { passive: true })
    window.addEventListener('orientationchange', this.onWindowResize, {
      passive: true,
    })
  }

  addElement(
    element: HTMLElement,
    options: { align?: Align | Align[] } = {}
  ): () => void {
    if (!this.isActive) {
      if (__DEV__ && this.destroyed) {
        console.warn('MagneticScroll.addElement called after destroy()')
      }

      return () => undefined
    }

    const align = Array.isArray(options.align)
      ? options.align
      : [options.align ?? 'start']

    const unobserve = () => this.resizeObserver.unobserve(element)

    this.elements.set(element, { element, align, unobserve })
    this.resizeObserver.observe(element)
    this.scheduleRecompute()

    return () => {
      unobserve()
      this.elements.delete(element)
      this.scheduleRecompute()
    }
  }

  private scheduleRecompute() {
    if (!this.isActive) return
    if (this.recomputeRafId !== null) return

    if (typeof window.requestAnimationFrame !== 'function') {
      this.computeSnapPoints()
      return
    }

    this.recomputeRafId = window.requestAnimationFrame(() => {
      this.recomputeRafId = null
      if (!this.isActive) return
      this.computeSnapPoints()
    })
  }

  private computeSnapPoints() {
    if (!this.isActive || typeof window === 'undefined') return

    const points: number[] = []
    const viewportHeight = window.innerHeight

    this.elements.forEach(({ element, align }) => {
      const rect = element.getBoundingClientRect()
      const scrollTop = this.lenis.scroll

      for (const a of align) {
        let point: number
        if (a === 'start') {
          point = scrollTop + rect.top
        } else if (a === 'end') {
          point = scrollTop + rect.bottom - viewportHeight
        } else {
          point = scrollTop + rect.top + rect.height / 2 - viewportHeight / 2
        }
        points.push(Math.max(0, point))
      }
    })

    this.snapPoints = [...new Set(points)].sort((a, b) => a - b)
  }

  update() {
    if (typeof window === 'undefined' || !this.isActive) return
    if (this.snapPoints.length === 0) return

    const velocity = this.lenis.velocity
    const absVelocity = Math.abs(velocity)
    const currentScroll = this.lenis.scroll

    // Track scroll direction whenever there's meaningful movement
    if (absVelocity > 0.5) {
      this.lastDirection = Math.sign(velocity)
    }

    // Find the nearest snap point ahead of us
    const approachingSnap = this.findApproachingSnapPoint(
      currentScroll,
      velocity
    )

    // Apply resistance when approaching a snap point at higher speeds
    if (approachingSnap !== null && absVelocity > this.velocityThreshold) {
      const distance = Math.abs(approachingSnap - currentScroll)

      if (distance < this.distanceThreshold * 0.5) {
        // Apply resistance - stronger when closer
        const resistanceZone = this.distanceThreshold * 0.5
        const resistance = 1 - distance / resistanceZone
        const drag = resistance * 0.15

        // Slow down by moving slightly against velocity
        const slowdown = -Math.sign(velocity) * absVelocity * drag

        if (Math.abs(slowdown) >= this.minImmediateAdjustmentPx) {
          this.lenis.scrollTo(currentScroll + slowdown, {
            immediate: true,
          })
        }
        return
      }
    }

    // Hysteresis: enter attraction at a lower velocity and exit at a higher one
    // to avoid flickering near the threshold.
    const enterAttract = this.velocityThreshold
    const exitAttract = this.velocityThreshold * 1.25

    if (!this.attracting && absVelocity <= enterAttract) {
      this.attracting = true
    } else if (this.attracting && absVelocity >= exitAttract) {
      this.attracting = false
    }

    if (!this.attracting) return

    // Avoid ambiguous attraction before the user establishes a direction.
    if (this.lastDirection === 0) return

    // Find snap point in the direction we were scrolling
    const nearestSnap = this.findDirectionalSnapPoint(
      currentScroll,
      this.lastDirection
    )
    if (nearestSnap === null) return

    const distance = Math.abs(nearestSnap - currentScroll)

    // Only attract within threshold distance; dead zone near snap point
    if (distance > this.distanceThreshold || distance < 100) return

    // Exponential falloff - stronger when closer
    const strength = Math.exp(-distance / (this.distanceThreshold * 0.3))
    const pull = strength * this.pullStrength

    // Calculate adjustment toward snap point
    const direction = nearestSnap > currentScroll ? 1 : -1
    const adjustment = direction * distance * pull

    if (Math.abs(adjustment) < this.minImmediateAdjustmentPx) return

    this.lenis.scrollTo(currentScroll + adjustment, {
      immediate: true,
    })
  }

  private findApproachingSnapPoint(
    scroll: number,
    velocity: number
  ): number | null {
    if (this.snapPoints.length === 0) return null

    const direction = Math.sign(velocity)
    if (direction === 0) return null

    let nearest: number | null = null
    let minDistance = Number.POSITIVE_INFINITY

    for (const point of this.snapPoints) {
      const diff = point - scroll

      // Only consider points we're moving toward
      // direction > 0 (scrolling down) = look for points below (diff > 0)
      // direction < 0 (scrolling up) = look for points above (diff < 0)
      const isAhead = (direction > 0 && diff > 0) || (direction < 0 && diff < 0)

      if (!isAhead) continue

      const distance = Math.abs(diff)
      if (distance < minDistance) {
        minDistance = distance
        nearest = point
      }
    }

    return nearest
  }

  private findDirectionalSnapPoint(
    scroll: number,
    direction: number
  ): number | null {
    if (this.snapPoints.length === 0) return null

    let nearest: number | null = null
    let minDistance = Number.POSITIVE_INFINITY

    for (const point of this.snapPoints) {
      const diff = point - scroll

      // Only consider points in the direction we're scrolling (or very close)
      // direction > 0 means scrolling down, so look for points below
      // direction < 0 means scrolling up, so look for points above
      const isInDirection =
        direction === 0 ||
        (direction > 0 && diff >= -50) ||
        (direction < 0 && diff <= 50)

      if (!isInDirection) continue

      const distance = Math.abs(diff)
      if (distance < minDistance) {
        minDistance = distance
        nearest = point
      }
    }

    return nearest
  }

  /**
   * Call this when the instance is no longer needed to detach observers and
   * window listeners.
   */
  destroy() {
    if (this.destroyed) return

    this.destroyed = true
    this.attracting = false

    // Stop future observer notifications as early as possible.
    this.resizeObserver.disconnect()

    if (typeof window !== 'undefined') {
      if (this.recomputeRafId !== null) {
        if (typeof window.cancelAnimationFrame === 'function') {
          window.cancelAnimationFrame(this.recomputeRafId)
        }
        this.recomputeRafId = null
      }

      window.removeEventListener('resize', this.onWindowResize)
      window.removeEventListener('orientationchange', this.onWindowResize)
    }
    this.elements.clear()
    this.snapPoints = []
  }
}
