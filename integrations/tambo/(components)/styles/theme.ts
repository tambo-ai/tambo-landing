// Tambo integration theme colors (for Tailwind @theme)
export const tamboColors = {
  // Base semantic colors
  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.14 0 285)',
  card: 'oklch(1 0 0)',
  'card-foreground': 'oklch(0.14 0 285)',
  popover: 'oklch(1 0 0)',
  'popover-foreground': 'oklch(0.14 0 285)',
  // Brand (prefixed to avoid conflict with existing primary/secondary)
  'tambo-primary': 'oklch(0.31 0.02 281)',
  'tambo-primary-foreground': 'oklch(0.98 0 0)',
  'tambo-secondary': 'oklch(0.54 0.027 261)',
  'tambo-secondary-foreground': 'oklch(1 0 0)',
  // UI colors
  muted: 'oklch(0.92 0 260)',
  'muted-foreground': 'oklch(0.73 0.022 260)',
  accent: 'oklch(0.97 0 286)',
  'accent-foreground': 'oklch(0.21 0 286)',
  destructive: 'oklch(0.64 0.2 25)',
  // Form/border
  border: 'oklch(0.93 0 242)',
  input: 'oklch(0.92 0 286)',
  ring: 'oklch(0.14 0 285)',
  // Charts
  'chart-1': 'oklch(0.72 0.15 60)',
  'chart-2': 'oklch(0.62 0.2 6)',
  'chart-3': 'oklch(0.53 0.2 262)',
  'chart-4': 'oklch(0.7 0.13 165)',
  'chart-5': 'oklch(0.62 0.2 313)',
  // Tambo specific
  container: 'oklch(0.98 0 247)',
  backdrop: 'oklch(0.25 0.07 252 / 0.25)',
  'muted-backdrop': 'oklch(0.25 0.07 252 / 0.1)',
} as const

// Non-color variables (layout)
export const tamboLayout = {
  radius: '0.5rem',
  'panel-left-width': '500px',
  'panel-right-width': '500px',
  'sidebar-width': '3rem',
} as const
