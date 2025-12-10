'use client'

import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Marquee } from '~/components/marquee'
import { buttons, persons } from './data'

export function Section3() {
  return (
    <section className="dt:dr-pt-156 dt:dr-pb-204">
      <Marquee repeat={2} speed={0.3} className="dt:dr-mb-56">
        <div className="flex dr-gap-x-24 dr-mr-24">
          {persons.map((person) => (
            <div
              key={person?.name}
              className="dt:dr-w-322 dt:dr-h-126 dt:dr-p-16 dt:dr-rounded-20 border border-dark-grey flex dr-gap-x-16 bg-white"
            >
              <div className="dt:dr-w-40 dt:dr-h-40 dt:dr-rounded-full relative">
                <Image src={person?.image} alt={person?.name} fill />
              </div>
              <div>
                <div className="flex items-center dr-gap-x-4 w-full dr-mb-8">
                  <p className="typo-p">{person?.name ?? ''}</p>
                  <p className="typo-label-m text-black/50">
                    {person?.account ?? ''}
                  </p>
                </div>
                <div className="dt:dr-max-w-234 whitespace-normal">
                  <p className="typo-p-s ">
                    {(person?.tweet ?? '').split(' ').map((word, index) => (
                      <span
                        key={`${index}-${person?.name}`}
                        className={word.startsWith('@') ? 'text-[#1D9BF0]' : ''}
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Marquee>
      <div className="dr-gap-x-16 flex items-center justify-center w-full">
        {buttons.map((button) => (
          <CTA
            key={button.text}
            icon={button?.icon as 'github' | 'discord'}
            href={button?.href}
          >
            {button.text}
          </CTA>
        ))}
      </div>
    </section>
  )
}
