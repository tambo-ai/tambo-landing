export default function Head() {
  return (
    <>
      {/* Preload hero Rive animation for faster above-the-fold render */}
      <link
        rel="preload"
        href="/assets/rives/hero_loop_1.riv"
        as="fetch"
        media="(min-width: 800px)"
      />
      <link
        rel="preload"
        href="/assets/rives/Mobile_hero_loop_1.riv"
        as="fetch"
        media="(max-width: 799px)"
      />
    </>
  )
}
