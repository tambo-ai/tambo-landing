export default function Head() {
  return (
    <>
      {/* Preload hero placeholder images for instant above-the-fold render */}
      <link
        rel="preload"
        href="/assets/rives/HeroThumbnail.png"
        as="image"
        media="(min-width: 800px)"
      />
      <link
        rel="preload"
        href="/assets/rives/HeroThumbnail_Mobile.png"
        as="image"
        media="(max-width: 799px)"
      />
    </>
  )
}
