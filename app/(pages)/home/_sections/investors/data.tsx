import { Image } from '~/components/image'
import DropboxSVG from './icons/dropbox.svg'
import MicrosoftSVG from './icons/microsoft.svg'

export const investors = [
  {
    name: 'Eric Wittman',
    position: 'ceo at vsco',
    icon: (
      <div className="dr-size-56 z-1">
        <Image
          block
          src="/images/vsco.png"
          alt="Eric Wittman"
          className="min-w-full min-h-full"
        />
      </div>
    ),
  },
  {
    name: 'Daniel Lewis',
    position: 'cvp at microsoft ai',
    icon: <MicrosoftSVG className="dr-size-56 z-1" />,
  },
  {
    name: 'Drew Houston',
    position: 'ceo at Dropbox',
    icon: <DropboxSVG className="dr-size-56 z-1" />,
  },
]
