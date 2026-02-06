'use client'

import hljs from 'highlight.js'
import { Check, Copy, ExternalLink } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import 'highlight.js/styles/github.css'
import DOMPurify from 'dompurify'
import { Link } from '~/components/link'

type MarkdownComponentProps = {
  children?: React.ReactNode
  className?: string
  href?: string
  [key: string]: unknown
}

/**
 * Markdown Components for Streamdown
 *
 * This module provides customized components for rendering markdown content with syntax highlighting.
 * It uses highlight.js for code syntax highlighting and supports streaming content updates.
 *
 * @example
 * ```tsx
 * import { createMarkdownComponents } from './markdown-components';
 * import { Streamdown } from 'streamdown';
 *
 * const MarkdownRenderer = ({ content }) => {
 *   const components = createMarkdownComponents();
 *   return <Streamdown components={components}>{content}</Streamdown>;
 * };
 * ```
 */

/**
 * Determines if a text block looks like code based on common code patterns
 * @param text - The text to analyze
 * @returns boolean indicating if the text appears to be code
 */
const looksLikeCode = (text: string): boolean => {
  const codeIndicators = [
    /^import\s+/m,
    /^function\s+/m,
    /^class\s+/m,
    /^const\s+/m,
    /^let\s+/m,
    /^var\s+/m,
    /[{}[\]();]/,
    /^\s*\/\//m,
    /^\s*\/\*/m,
    /=>/,
    /^export\s+/m,
  ]
  return codeIndicators.some((pattern) => pattern.test(text))
}

/**
 * Header component for code blocks with language display and copy functionality
 */
const CodeHeader = ({
  language,
  code,
}: {
  language?: string
  code?: string
}) => {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = () => {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between dr-gap-4 dr-rounded-t-6 bg-container dr-px-4 dr-py-2 dr-text-14 font-semibold text-foreground">
      <span className="lowercase text-muted-foreground">{language}</span>
      <button
        type="button"
        onClick={copyToClipboard}
        className="dr-p-1 dr-rounded-6 hover:bg-backdrop transition-colors cursor-pointer"
        title="Copy code"
      >
        {!copied ? (
          <Copy className="dr-h-4 dr-w-4" />
        ) : (
          <Check className="dr-h-4 dr-w-4 text-green-500" />
        )}
      </button>
    </div>
  )
}

/**
 * Creates a set of components for use with streamdown
 * @returns Components object for streamdown
 */
export const createMarkdownComponents = (): Record<
  string,
  React.ComponentType<MarkdownComponentProps>
> => ({
  code: function Code({
    className,
    children,
    ...props
  }: MarkdownComponentProps) {
    const match = /language-(\w+)/.exec(className ?? '')
    const content = String(children).replace(/\n$/, '')
    const deferredContent = React.useDeferredValue(content)

    const highlighted = React.useMemo(() => {
      if (!(match && looksLikeCode(deferredContent))) return null
      try {
        return hljs.highlight(deferredContent, { language: match[1] }).value
      } catch {
        return deferredContent
      }
    }, [deferredContent, match])

    if (match && looksLikeCode(content)) {
      return (
        <div className="relative border border-border dr-rounded-6 bg-muted max-w-[80ch] dr-text-14 dr-my-4">
          <CodeHeader language={match[1]} code={content} />
          <div
            className={cn(
              'overflow-x-auto dr-rounded-b-6 bg-background',
              '[&::-webkit-scrollbar]:w-[6px]',
              '[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-md',
              '[&::-webkit-scrollbar:horizontal]:h-[4px]'
            )}
          >
            <pre className="dr-p-4 whitespace-pre">
              <code
                className={className}
                // biome-ignore lint/security/noDangerouslySetInnerHtml: highlighted HTML is sanitized via DOMPurify before injection
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(highlighted ?? content),
                }}
              />
            </pre>
          </div>
        </div>
      )
    }

    return (
      <code
        className={cn(
          'bg-muted dr-px-1 dr-py-0 dr-rounded-4 dr-text-14',
          className
        )}
        {...(props as React.ComponentProps<'code'>)}
      >
        {children}
      </code>
    )
  },

  /**
   * Paragraph component with minimal vertical margin
   */
  p: ({ children }) => <p className="not-last:dr-pb-8">{children}</p>,

  /**
   * Heading 1 component with large text and proper spacing
   * Used for main section headers
   */
  h1: ({ children }) => (
    <h1 className="dr-text-24 font-bold dr-mb-4 dr-mt-6">{children}</h1>
  ),

  /**
   * Heading 2 component for subsection headers
   * Slightly smaller than h1 with adjusted spacing
   */
  h2: ({ children }) => (
    <h2 className="dr-text-20 font-bold dr-mb-3 dr-mt-5">{children}</h2>
  ),

  /**
   * Heading 3 component for minor sections
   * Used for smaller subdivisions within h2 sections
   */
  h3: ({ children }) => (
    <h3 className="dr-text-18 font-bold dr-mb-2 dr-mt-4">{children}</h3>
  ),

  /**
   * Heading 4 component for the smallest section divisions
   * Maintains consistent text size with adjusted spacing
   */
  h4: ({ children }) => (
    <h4 className="dr-text-16 font-bold dr-mb-2 dr-mt-3">{children}</h4>
  ),

  /**
   * Unordered list component with disc-style bullets
   * Indented from the left margin
   */
  ul: ({ children }) => (
    <ul className="list-disc flex flex-col dr-gap-8 dr-pl-16">{children}</ul>
  ),

  /**
   * Ordered list component with decimal numbering
   * Indented from the left margin
   */
  ol: ({ children }) => (
    <ol className="list-decimal flex flex-col dr-gap-24 dr-pl-16">
      {children}
    </ol>
  ),

  /**
   * List item component with normal line height
   * Used within both ordered and unordered lists
   */
  li: ({ children }) => (
    <li className="leading-normal list-disc last:dr-mb-24">{children}</li>
  ),

  /**
   * Blockquote component for quoted content
   * Features a left border and italic text with proper spacing
   */
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-muted dr-pl-4 italic dr-my-4">
      {children}
    </blockquote>
  ),

  /**
   * Anchor component for links
   * Opens links in new tab with security attributes
   * Includes hover underline effect
   */
  a: ({ href, children }) => (
    <Link
      href={href}
      className="inline-flex items-center dr-gap-1 text-foreground underline underline-offset-4 decoration-muted-foreground hover:text-foreground hover:decoration-foreground transition-colors"
    >
      <span>{children}</span>
      <ExternalLink className="dr-w-3 dr-h-3" />
    </Link>
  ),

  /**
   * Horizontal rule component
   * Creates a visual divider with proper spacing
   */
  hr: () => <hr className="dr-my-4 border-muted" />,

  /**
   * Table container component
   * Handles overflow for wide tables with proper spacing
   */
  table: ({ children }) => (
    <div className="overflow-x-auto dr-my-4">
      <table className="min-w-full border border-border">{children}</table>
    </div>
  ),

  /**
   * Table header cell component
   * Features bold text and distinct background
   */
  th: ({ children }) => (
    <th className="border border-border dr-px-4 dr-py-2 bg-muted font-semibold">
      {children}
    </th>
  ),

  /**
   * Table data cell component
   * Consistent styling with header cells
   */
  td: ({ children }) => (
    <td className="border border-border dr-px-4 dr-py-2">{children}</td>
  ),
})

/**
 * Pre-created markdown components instance for use across the application.
 */
export const markdownComponents = createMarkdownComponents()
