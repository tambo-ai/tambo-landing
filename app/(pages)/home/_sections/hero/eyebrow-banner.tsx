import { AnimatedGradientText } from '~/components/animated-gradient-text'
import { Link } from '~/components/link'

export function EyebrowBanner({
  href,
  children,
}: {
  href: string
  children: string
}) {
  return (
    <Link
      href={href}
      className="group/pill relative inline-flex items-center rounded-full dr-px-16 dr-py-8 shadow-[inset_0_-8px_10px_#80fcc21f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#80fcc23f]"
    >
      <span
        className="animate-gradient absolute inset-0 block size-full rounded-[inherit] bg-gradient-to-r from-[#80fcc2]/50 via-[#40a0ff]/50 to-[#80fcc2]/50 bg-[length:300%_100%] p-px"
        style={{
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'subtract',
          WebkitClipPath: 'padding-box',
        }}
      />
      🎉
      <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
      <AnimatedGradientText className="typo-p font-medium" colorFrom="#80fcc2" colorTo="#40a0ff">
        {children}
      </AnimatedGradientText>
    </Link>
  )
}
