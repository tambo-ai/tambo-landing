---
title: "Magnetic Scroll Snapping with Lenis"
category: "integration-issues"
tags:
  - lenis
  - smooth-scroll
  - scroll-snapping
  - velocity-physics
  - react
severity: "medium"
component: "Lenis smooth scroll integration"
date_solved: "2026-02-06"
---

# Magnetic Scroll Snapping with Lenis

## Problem

The built-in Lenis snap (`lenis/snap`) felt jarring—scroll would overshoot, stop, then jump back to snap points. CSS scroll-snap doesn't work with Lenis because Lenis intercepts native scroll.

## Solution

Custom `MagneticScroll` class that applies physics-based attraction during deceleration, not after.

### Core Algorithm

1. **Resistance**: When approaching snap points at high velocity, apply drag to slow down
2. **Attraction**: When velocity drops, pull toward nearest snap point with exponential falloff
3. **Directional**: Only snap to points in scroll direction (prevents pull-back)

### Key Files

- `app/(pages)/_components/lenis/magnetic-scroll.ts` - Core implementation
- `app/(pages)/_components/lenis/index.tsx` - Lenis integration
- `app/(pages)/_components/lenis/snap.tsx` - `useLenisSnap` hook
- `libs/store.ts` - Zustand store for global instance

### Configuration

```typescript
const magnetic = new MagneticScroll(lenis, {
  velocityThreshold: 4,    // Below this, attraction kicks in
  distanceThreshold: 800,  // Max attraction range (px)
  pullStrength: 0.25,      // Strength of pull (0-1)
})
```

### Usage

```tsx
const setSnapRef = useLenisSnap('center')
return <section ref={isDesktop ? setSnapRef : undefined}>Content</section>
```

## Why This Works

- **Predict & adjust during deceleration**, not after scroll stops
- **Exponential falloff**: `Math.exp(-distance / threshold)` creates natural attraction
- **Direction tracking**: Remembers scroll direction to prevent backward snaps
- **Resistance phase**: Slows momentum before passing snap points

## Parameter Tuning

| Parameter | Low | Current | High | Effect |
|-----------|-----|---------|------|--------|
| velocityThreshold | 2 | 4 | 6 | Lower = more aggressive |
| distanceThreshold | 300 | 800 | 1200 | Higher = longer reach |
| pullStrength | 0.1 | 0.25 | 0.4 | Higher = snappier |

## Gotchas

1. **Pull-back effect**: Use directional snapping with ±50px buffer
2. **Mobile**: Disable snapping on mobile (`isDesktop ? setSnapRef : undefined`)
3. **Cleanup**: Always call `destroy()` when unmounting

## Related

- Lenis doesn't support CSS scroll-snap (documented limitation)
- Built-in `lenis/snap` uses debounce which creates two-phase feel
