/**
 * Tailwind to dr-* prefix migration script
 *
 * Converts standard Tailwind sizing/spacing classes to dr-* prefixed equivalents
 * for responsive viewport-based scaling.
 *
 * Usage: bun run integrations/tambo/scripts/migrate-tailwind-to-dr.ts
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const TARGET_DIR = 'integrations/tambo/(components)/ui-tambo'

// Semantic border-radius mappings (Tailwind default → pixel value)
const ROUNDED_MAP: Record<string, string> = {
  sm: '2',
  '': '4', // bare "rounded"
  md: '6',
  lg: '8',
  xl: '12',
  '2xl': '16',
  '3xl': '24',
}

// Semantic text-size mappings (Tailwind size → pixel value)
const TEXT_SIZE_MAP: Record<string, string> = {
  xs: '12',
  sm: '14',
  base: '16',
  lg: '18',
  xl: '20',
  '2xl': '24',
  '3xl': '30',
  '4xl': '36',
}

// Patterns for numeric spacing/sizing classes that get dr- prefix
// These keep their numeric value as-is
const NUMERIC_PATTERNS = [
  // Padding
  /\b(p|px|py|pt|pr|pb|pl)-(\d+(?:\.\d+)?)\b/g,
  // Margin
  /\b(m|mx|my|mt|mr|mb|ml)-(\d+(?:\.\d+)?)\b/g,
  // Gap
  /\b(gap|gap-x|gap-y)-(\d+(?:\.\d+)?)\b/g,
  // Width/Height/Size
  /\b(w|h|size)-(\d+(?:\.\d+)?)\b/g,
  // Min/Max width/height
  /\b(min-w|max-w|min-h|max-h)-(\d+(?:\.\d+)?)\b/g,
  // Positioning
  /\b(top|right|bottom|left|inset|inset-x|inset-y)-(\d+(?:\.\d+)?)\b/g,
]

/**
 * Convert a single Tailwind class to dr-* prefixed version if applicable
 */
function convertClass(className: string): string {
  // Skip classes that shouldn't be converted
  if (
    className.includes('[') || // arbitrary values
    className.includes('full') || // w-full, h-full, etc.
    className.includes('auto') || // w-auto, etc.
    className.includes('screen') || // w-screen, etc.
    (className.includes('min') && !className.match(/^(min-w|min-h)-\d/)) || // min-content, etc.
    (className.includes('max') && !className.match(/^(max-w|max-h)-\d/)) || // max-content, etc.
    className.includes('fit') // w-fit, etc.
  ) {
    return className
  }

  // Handle variant prefixes (hover:, focus:, sm:, dt:, etc.)
  const variantMatch = className.match(/^((?:[a-z]+:)+)(.+)$/)
  const variant = variantMatch ? variantMatch[1] : ''
  const baseClass = variantMatch ? variantMatch[2] : className

  let converted = baseClass

  // 1. Check numeric patterns (padding, margin, gap, sizing, positioning)
  for (const pattern of NUMERIC_PATTERNS) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0
    const match = pattern.exec(baseClass)
    if (match && match[0] === baseClass) {
      const utility = match[1]
      const numValue = match[2]
      // Truncate decimal values (e.g., 2.5 → 2)
      const intValue = Math.floor(Number.parseFloat(numValue)).toString()
      converted = `dr-${utility}-${intValue}`
      return variant + converted
    }
  }

  // 2. Check semantic border-radius (rounded-lg, rounded-t-xl, etc.)
  // Match: rounded, rounded-{size}, rounded-{side}-{size}, rounded-{corner}-{size}
  const roundedMatch = baseClass.match(
    /^rounded(?:-(t|r|b|l|tl|tr|br|bl))?(?:-(sm|md|lg|xl|2xl|3xl))?$/
  )
  if (roundedMatch) {
    const side = roundedMatch[1] || ''
    const size = roundedMatch[2] || ''

    // Skip rounded-full (not matched by regex anyway since it has 'full')
    const pixelValue = ROUNDED_MAP[size]
    if (pixelValue !== undefined) {
      if (side) {
        converted = `dr-rounded-${side}-${pixelValue}`
      } else {
        converted = `dr-rounded-${pixelValue}`
      }
      return variant + converted
    }
  }

  // 3. Check semantic text-size (text-xs, text-sm, text-base, etc.)
  // Skip color classes like text-foreground, text-white, etc.
  const textSizeMatch = baseClass.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl)$/)
  if (textSizeMatch) {
    const size = textSizeMatch[1]
    const pixelValue = TEXT_SIZE_MAP[size]
    if (pixelValue) {
      converted = `dr-text-${pixelValue}`
      return variant + converted
    }
  }

  // No conversion needed
  return className
}

/**
 * Process all classes in a className string or cn() call
 */
function processClassString(classString: string): string {
  // Split by whitespace, convert each class, rejoin
  return classString
    .split(/\s+/)
    .map((cls) => convertClass(cls))
    .join(' ')
}

/**
 * Remove decimal values from dr-* classes (e.g., dr-px-2.5 → dr-px-2)
 */
function removeDecimalsFromDrClasses(content: string): string {
  // Match dr-{utility}-{number with decimal} and convert to integer
  return content.replace(
    /\bdr-([a-z-]+)-(\d+)\.\d+\b/g,
    (match: string, utility: string, intPart: string) => {
      void match
      return `dr-${utility}-${intPart}`
    }
  )
}

/**
 * Process file content and convert Tailwind classes
 */
function processFileContent(content: string): string {
  let result = content

  // First, remove decimals from existing dr-* classes
  result = removeDecimalsFromDrClasses(result)

  // Match className="..." and className='...'
  result = result.replace(
    /className=["']([^"']+)["']/g,
    (match, classes: string) => {
      const converted = processClassString(classes)
      const quote = match.includes('"') ? '"' : "'"
      return `className=${quote}${converted}${quote}`
    }
  )

  // Match className={`...`} (template literals - just the static parts)
  result = result.replace(
    /className=\{`([^`]+)`\}/g,
    (match, classes: string) => {
      void match
      // Only process the static text parts, preserve ${} expressions
      const converted = classes.replace(/([^${}]+)/g, (staticPart: string) =>
        processClassString(staticPart)
      )
      return `className={\`${converted}\`}`
    }
  )

  // Match cn(...) and cva(...) calls - process string arguments
  result = result.replace(
    /\b(cn|cva)\(\s*(['"`])([^'"`]+)\2/g,
    (match, fn: string, quote: string, classes: string) => {
      void match
      const converted = processClassString(classes)
      return `${fn}(${quote}${converted}${quote}`
    }
  )

  // Match string arguments inside cn() arrays and objects
  result = result.replace(
    /(['"])([^'"]*(?:p-|m-|gap-|w-|h-|rounded|text-(?:xs|sm|base|lg|xl))[^'"]*)\1/g,
    (match, quote: string, classes: string) => {
      // Only convert if it looks like Tailwind classes (has spaces or is a single class)
      if (classes.includes(' ') || /^[a-z]+-/.test(classes)) {
        const converted = processClassString(classes)
        return `${quote}${converted}${quote}`
      }
      return match
    }
  )

  return result
}

/**
 * Get all TSX files in the target directory
 */
async function getTsxFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await getTsxFiles(fullPath)))
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Main function
 */
async function main() {
  console.log(`\n🔄 Migrating Tailwind classes to dr-* prefix...\n`)
  console.log(`📂 Target directory: ${TARGET_DIR}\n`)

  const files = await getTsxFiles(TARGET_DIR)
  let modifiedCount = 0

  for (const file of files) {
    const content = await readFile(file, 'utf-8')
    const converted = processFileContent(content)

    if (content !== converted) {
      await writeFile(file, converted, 'utf-8')
      console.log(`✅ Modified: ${file}`)
      modifiedCount++
    }
  }

  console.log(`\n✨ Done! Modified ${modifiedCount} file(s).\n`)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
