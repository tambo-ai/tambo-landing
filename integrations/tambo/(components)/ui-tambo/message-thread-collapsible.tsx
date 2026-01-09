'use client'

import { XIcon } from 'lucide-react'
import { Collapsible } from 'radix-ui'
import * as React from 'react'
import type { messageVariants, VariantProps } from '@/components/tambo/message'
import {
  MessageInput,
  MessageInputError,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
  // MessageInputMcpConfigButton,
} from '@/components/tambo/message-input'
import { ScrollableMessageContainer } from '@/components/tambo/scrollable-message-container'
import {
  ThreadContent,
  ThreadContentMessages,
} from '@/components/tambo/thread-content'
import { cn } from '@/lib/utils'

/**
 * Props for the MessageThreadCollapsible component
 * @interface
 * @extends React.HTMLAttributes<HTMLDivElement>
 */
export interface MessageThreadCollapsibleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional context key for the thread */
  contextKey?: string
  /** Whether the collapsible should be open by default (default: false) */
  defaultOpen?: boolean
  /**
   * Controls the visual styling of messages in the thread.
   * Possible values include: "default", "compact", etc.
   * These values are defined in messageVariants from "@/components/tambo/message".
   * @example variant="compact"
   */
  variant?: VariantProps<typeof messageVariants>['variant']
}

/**
 * A collapsible chat thread component with keyboard shortcuts and thread management
 * @component
 * @example
 * ```tsx
 * <MessageThreadCollapsible
 *   contextKey="my-thread"
 *   defaultOpen={false}
 *   className="left-4" // Position on the left instead of right
 *   variant="default"
 * />
 * ```
 */

/**
 * Custom hook for managing collapsible state with keyboard shortcuts
 */
const useCollapsibleState = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const isMac =
    typeof navigator !== 'undefined' && navigator.platform.startsWith('Mac')
  const shortcutText = isMac ? '⌘K' : 'Ctrl+K'

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { isOpen, setIsOpen, shortcutText }
}

/**
 * Props for the CollapsibleContainer component
 */
interface CollapsibleContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

/**
 * Container component for the collapsible panel
 */
function CollapsibleContainer({
  className,
  isOpen,
  onOpenChange,
  children,
  ...props
}: CollapsibleContainerProps) {
  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={onOpenChange}
      //:TODO i've changed the width to 277 for dev, originally was 177
      className={cn(
        'flex flex-col dr-w-346 dr-rounded-12 shadow-lg bg-background border border-border',
        'transition-all duration-300 ease-in-out',
        className
      )}
      {...props}
    >
      {children}
    </Collapsible.Root>
  )
}

/**
 * Props for the CollapsibleTrigger component
 */
interface CollapsibleTriggerProps {
  isOpen: boolean
  shortcutText: string
  onClose: () => void
  contextKey?: string
  onThreadChange: () => void
  config: {
    labels: {
      openState: string
      closedState: string
    }
  }
}

/**
 * Trigger component for the collapsible panel
 */
function CollapsibleTrigger({
  isOpen,
  shortcutText,
  onClose,
  config,
}: CollapsibleTriggerProps) {
  return (
    <>
      {!isOpen && (
        <Collapsible.Trigger asChild className="typo-p-s uppercase">
          <button
            type="button"
            className={cn(
              'flex items-center justify-between w-full dr-p-8',
              'hover:bg-muted/50 transition-colors'
            )}
            aria-expanded={isOpen}
            aria-controls="message-thread-content"
          >
            <span>{config.labels.closedState}</span>
            <span
              className="typo-label-s uppercase text-muted-foreground"
              suppressHydrationWarning
            >
              {`(${shortcutText})`}
            </span>
          </button>
        </Collapsible.Trigger>
      )}
      {isOpen && (
        <button
          type="button"
          className="dr-mt-8 dr-ml-8 bg-dark-grey w-fit dr-p-2 dr-py-4 flex items-center justify-center rounded-full hover:bg-muted/70 transition-colors cursor-pointer hover:[&>svg]:rotate-180"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          aria-label="Close"
        >
          <XIcon className="dr-h-16 aspect-square transition-transform duration-200" />
        </button>
      )}
    </>
  )
}
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

const THREAD_CONFIG = {
  labels: {
    openState: 'Conversations',
    closedState: 'Ask tambo',
  },
}

export function MessageThreadCollapsible({
  className,
  contextKey,
  defaultOpen = false,
  variant,
  ...props
}: MessageThreadCollapsibleProps) {
  const { isOpen, setIsOpen, shortcutText } = useCollapsibleState(defaultOpen)

  const handleThreadChange = React.useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  return (
    <CollapsibleContainer
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className={className}
      {...props}
    >
      <CollapsibleTrigger
        isOpen={isOpen}
        shortcutText={shortcutText}
        onClose={() => setIsOpen(false)}
        contextKey={contextKey}
        onThreadChange={handleThreadChange}
        config={THREAD_CONFIG}
      />
      <Collapsible.Content>
        {/* Message thread content */}
        <div className="flex flex-col dr-h-550">
          <ScrollableMessageContainer className="dr-p-8">
            <ThreadContent variant={variant}>
              <ThreadContentMessages />
            </ThreadContent>
          </ScrollableMessageContainer>
          {/* Message input */}
          <div className="dr-p-8 justify-self-end">
            <MessageInput contextKey={contextKey}>
              <MessageInputTextarea />
              <MessageInputToolbar>
                <MessageInputSubmitButton />
              </MessageInputToolbar>
              <MessageInputError />
            </MessageInput>
          </div>
        </div>
      </Collapsible.Content>
    </CollapsibleContainer>
  )
}
