import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
        const value =
          props?.[key as keyof typeof props] ?? config.defaultVariants?.[key]
        if (value != null) {
          const cls = config.variants[key][value as string]
          if (cls) variantClasses.push(cls)
        }
      }
    }
    return cn(base, ...variantClasses)
  }
}

export type VariantProps<T extends (...args: any[]) => any> = T extends (
  props: infer P
) => any
  ? P
  : never
