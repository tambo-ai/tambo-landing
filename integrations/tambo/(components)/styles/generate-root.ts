import { formatObject } from '~/styles/scripts/utils'
import { tamboColors, tamboLayout } from './theme'

export function generateTambo() {
  const theme = `
/** Tambo Integration Theme **/
@theme {
  ${formatObject(tamboColors, ([key, value]) => `--color-${key}: ${value};`)}
}

:root {
  ${formatObject(tamboLayout, ([key, value]) => `--${key}: ${value};`)}
}`

  return theme
}
