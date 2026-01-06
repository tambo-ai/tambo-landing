export function scalingCalc(value: number) {
  if (value < 0) {
    return `calc(-1 * min(calc(((${value} * -100) / var(--device-width)) * var(--calc-factor, 1vw)), calc(((${value} * var(--max-width)) / var(--device-width)) * 1px)))`
  }
  return `min(calc(((${value} * 100) / var(--device-width)) * var(--calc-factor, 1vw)), calc(((${value} * var(--max-width)) / var(--device-width)) * 1px))`
}

/**
 * Format an object into a string of CSS variables
 * @param obj - The object to format
 * @param mapper - A function that maps the object's entries to a string
 * @param joiner - The string to join the mapped entries with
 * @returns A string of CSS variables
 */
export function formatObject<Obj extends Record<string, unknown>>(
  obj: Obj,
  mapper: (args: [key: keyof Obj, value: Obj[keyof Obj]]) => string,
  joiner = '\n\t'
) {
  return Object.entries(obj).map(mapper).join(joiner)
}
