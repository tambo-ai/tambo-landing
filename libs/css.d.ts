// CSS module type declarations
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.svg' {
  import type * as React from 'react'

  const Component: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >
  export default Component
}

// Regular CSS imports
declare module '*.css'
declare module '*.scss'
declare module '*.sass'
