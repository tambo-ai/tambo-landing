import { Link } from '~/components/link'
import { siteConfig } from '~/libs/config'

export const SITE_BANNER_ID = 'site-banner'

// Sticky so it reserves its own height in the page flow; the fixed navigation
// is offset by the same `--banner-height` token so the two never overlap.
export function SiteBanner() {
  return (
    <aside
      id={SITE_BANNER_ID}
      aria-label="Announcement"
      className="sticky top-0 z-110 w-full h-banner-height shrink-0 bg-teal text-black border-b border-dark-teal"
    >
      <Link
        href={siteConfig.links.shutdownPost}
        className="group/banner flex size-full items-center justify-center px-safe text-center text-balance typo-label-m font-medium focus-visible:outline-black! -outline-offset-4"
      >
        <span>
          Tambo Cloud is shutting down on October 31, 2026.{' '}
          <span className="whitespace-nowrap underline underline-offset-2 decoration-1 dt:group-hover/banner:decoration-2">
            Read why <span aria-hidden="true">→</span>
          </span>
        </span>
      </Link>
    </aside>
  )
}
