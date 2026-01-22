import cn from 'clsx'
import { socials } from './data'
import s from './social.module.css'

export function SocialProof() {
  return (
    <section className="dt:dr-px-155 px-safe dt:dr-py-200 dr-py-120">
      <h2 className="dt:typo-h2 typo-h1 text-center dr-mb-56">
        Product engineers 💚 Tambo
      </h2>
      {/* Social Proof */}
      <div className="dt:grid dt:grid-cols-3 dt:dr-gap-24 flex flex-col dr-gap-16">
        {socials?.map((social, index) => (
          <div
            key={social?.author + index?.toString()}
            className={cn(
              s.social,
              'dt:dr-h-258 bg-white dr-rounded-20 border border-dark-grey dr-p-8 dr-pb-16'
            )}
          >
            <div
              className={cn(
                s.text,
                'dr-p-24 bg-off-white dr-rounded-12  dt:dr-h-162 dr-mb-16'
              )}
            >
              <p className="typo-p">{social?.text}</p>
            </div>
            <div className="flex items-center dr-gap-12 justify-between">
              <div className="flex flex-col">
                <span className="typo-p-bold dr-mb-6">{social?.author}</span>
                <span
                  className={cn(
                    s.position,
                    'typo-label-s dr-px-8 dr-py-4 dr-rounded-16 bg-off-white w-fit'
                  )}
                >
                  {social?.position}
                </span>
              </div>
              {social?.icon}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
