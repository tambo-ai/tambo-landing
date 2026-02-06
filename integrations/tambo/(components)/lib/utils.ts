import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Lightweight cva (class-variance-authority) using cn
type VariantConfig = Record<string, Record<string, string>>

export function cva<V extends VariantConfig>(
  base: string,
  config?: { variants?: V; defaultVariants?: { [K in keyof V]?: keyof V[K] } }
) {
  return (props?: { [K in keyof V]?: keyof V[K] }) => {
    const variantClasses: string[] = []
    if (config?.variants) {
      for (const key in config.variants) {
        const variantKey = key as keyof V
        const value = props?.[variantKey] ?? config.defaultVariants?.[variantKey]
        if (value != null) {
          const cls = config.variants[variantKey][String(value)]
          if (cls) variantClasses.push(cls)
        }
      }
    }
    return cn(base, ...variantClasses)
  }
}

export type VariantProps<T> = T extends (props: infer P) => unknown
  ? NonNullable<P>
  : never
