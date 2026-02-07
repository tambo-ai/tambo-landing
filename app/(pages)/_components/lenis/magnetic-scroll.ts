import type Lenis from 'lenis'

type Align = 'start' | 'end' | 'center'

type SnapElement = {
  element: HTMLElement
  align: Align[]
  unobserve: () => void
}

type MagneticScrollOptions = {
  velocityThreshold?: number
  distanceThreshold?: number
  pullStrength?: number
}

export class MagneticScroll {
  private lenis: Lenis
  private elements: Map<HTMLElement, SnapElement> = new Map()
  private snapPoints: number[] = []
  private velocityThreshold: number
  private distanceThreshold: number
  private pullStrength: number
  private resizeObserver: ResizeObserver
  private lastDirection = 0

  constructor(lenis: Lenis, options: MagneticScrollOptions = {}) {
    this.lenis = lenis
    this.velocityThreshold = options.velocityThreshold ?? 4
    this.distanceThreshold = options.distanceThreshold ?? 1000
    this.pullStrength = options.pullStrength ?? 0.06

    this.resizeObserver = new ResizeObserver(() => {
      this.computeSnapPoints()
    })
  }

  addElement(
    element: HTMLElement,
    options: { align?: Align | Align[] } = {}
  ): () => void {
    const align = Array.isArray(options.align)
      ? options.align
      : [options.align ?? 'start']

    const unobserve = () => this.resizeObserver.unobserve(element)

    this.elements.set(element, { element, align, unobserve })
    this.resizeObserver.observe(element)
    this.computeSnapPoints()

    return () => {
      unobserve()
      this.elements.delete(element)
      this.computeSnapPoints()
    }
  }

  private computeSnapPoints() {
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
        this.lenis.scrollTo(currentScroll + slowdown, {
          immediate: true,
        })
        return
      }
    }

    // Only apply attraction when velocity is low (decelerating)
    if (absVelocity > this.velocityThreshold) return

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

  destroy() {
    this.resizeObserver.disconnect()
    this.elements.clear()
    this.snapPoints = []
  }
}
