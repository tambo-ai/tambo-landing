import { Moment1 } from '../moment-1'
import { Moment2 } from '../moment-2'
import { Moment3 } from '../moment-3'

export function Moments() {
  return (
    <div>
      <div className="hidden dt:block absolute inset-0 z-20 pointer-events-none">
        <div className="sticky top-0 h-screen dr-w-480">
          <div
            id="moments-top-gradient"
            className="absolute top-0 w-full dr-h-140 opacity-0"
            style={{
              background:
                'linear-gradient(to bottom, var(--color-light-gray) 0%, transparent 97%)',
            }}
          />
          <div
            id="moments-bottom-gradient"
            className="absolute bottom-0 w-full dr-h-140 opacity-0"
            style={{
              background:
                'linear-gradient(to top, var(--color-light-gray) 0%, transparent 97%)',
            }}
          />
        </div>
      </div>
      <Moment1 />
      <Moment2 />
      <Moment3 />
    </div>
  )
}
