import Dropbox from '~/assets/svgs/investors/dropbox.svg'
import MicrosoftAi from '~/assets/svgs/investors/microsoft-ai.svg'
import Vsco from '~/assets/svgs/investors/vsco.svg'
import { Image } from '~/components/image'

export const investors = [
  {
    name: 'Eric Wittman',
    position: 'ceo at',
    companyIcon: <Vsco className="dr-w-39 dr-h-18" />,
    image: (
      <div className="dr-size-81 z-1">
        <Image
          block
          src="/images/investors/eric-w.png"
          alt="Eric Wittman"
          className="min-w-full min-h-full"
        />
      </div>
    ),
  },
  {
    name: 'Daniel Lewis',
    position: 'cvp at',
    companyIcon: <MicrosoftAi className="dr-w-66 dr-h-12" />,
    image: (
      <div className="dr-size-81 z-1">
        <Image
          block
          src="/images/investors/daniel-l.png"
          alt="Daniel Lewis"
          className="min-w-full min-h-full"
        />
      </div>
    ),
  },
  {
    name: 'Drew Houston',
    position: 'ceo at',
    companyIcon: <Dropbox className="dr-w-60 dr-h-12" />,
    image: (
      <div className="dr-size-81 z-1">
        <Image
          block
          src="/images/investors/drew-h.png"
          alt="Drew Houston"
          className="min-w-full min-h-full"
        />
      </div>
    ),
  },
]
