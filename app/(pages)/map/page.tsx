'use client'

import { Wrapper } from '../_components/wrapper'
import { AreaSelectMap } from './(components)/map'

export default function Page() {
  return (
    <Wrapper
      theme="light"
      lenis={{}}
      className="mx-auto bg-primary flex items-center justify-center"
      style={{
        maxWidth: `calc(var(--max-width) * 1px)`,
        overflow: 'hidden',
      }}
    >
      <div className="dt:dr-w-682 dt:dr-h-356 dr-p-14  overflow-hidden dr-rounded-28  bg-white flex items-center justify-center">
        <div className="w-full h-full border-dashed border-dark-grey dr-border-1 dr-rounded-20 overflow-hidden">
          <AreaSelectMap
            height={356}
            onBBoxSelected={(bbox) => console.log('bbox:', bbox)}
            onResult={(data) => console.log('result:', data)}
          />
        </div>
      </div>
    </Wrapper>
  )
}
