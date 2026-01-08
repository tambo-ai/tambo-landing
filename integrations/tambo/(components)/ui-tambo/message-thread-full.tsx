'use client'

import type { Suggestion } from '@tambo-ai/react'
import type * as React from 'react'
import type { messageVariants } from '@/components/tambo/message'
import {
  MessageInput,
  MessageInputError,
  MessageInputFileButton,
  MessageInputMcpPromptButton,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from '@/components/tambo/message-input'
import {
  MessageSuggestions,
  MessageSuggestionsList,
  MessageSuggestionsStatus,
} from '@/components/tambo/message-suggestions'
import { ScrollableMessageContainer } from '@/components/tambo/scrollable-message-container'
import {
  ThreadContainer,
  useThreadContainerContext,
} from '@/components/tambo/thread-container'
import {
  ThreadContent,
  ThreadContentMessages,
} from '@/components/tambo/thread-content'
import {
  ThreadHistory,
  ThreadHistoryHeader,
  ThreadHistoryList,
  ThreadHistoryNewButton,
  ThreadHistorySearch,
} from '@/components/tambo/thread-history'
import { useMergeRefs } from '@/lib/thread-hooks'

/**
 * Props for the MessageThreadFull component
 */
export interface MessageThreadFullProps
  extends React.HTMLAttributes<HTMLDivElement> {
  contextKey?: string
  // TODO: fix this
  variant?: VariantProps<typeof messageVariants>['variant']
  showHistory?: boolean
  showFileInput?: boolean
  ref?: React.RefObject<HTMLDivElement>
}

function ThreadHistorySidebar({
  contextKey,
  historyPosition,
}: {
  contextKey: string | undefined
  historyPosition: 'left' | 'right'
}) {
  return (
    <ThreadHistory contextKey={contextKey} position={historyPosition}>
      <ThreadHistoryHeader />
      <ThreadHistoryNewButton />
      <ThreadHistorySearch />
      <ThreadHistoryList />
    </ThreadHistory>
  )
}

const defaultSuggestions: Suggestion[] = [
  {
    id: 'suggestion-1',
    title: 'Get started',
    detailedSuggestion: 'What can you help me with?',
    messageId: 'welcome-query',
  },
  {
    id: 'suggestion-2',
    title: 'Learn more',
    detailedSuggestion: 'Tell me about your capabilities.',
    messageId: 'capabilities-query',
  },
  {
    id: 'suggestion-3',
    title: 'Examples',
    detailedSuggestion: 'Show me some example queries I can try.',
    messageId: 'examples-query',
  },
]

/**
 * A full-screen chat thread component with message history, input, and suggestions
 */
export function MessageThreadFull({
  className,
  contextKey,
  variant,
  showHistory = false,
  showFileInput = false,
  ref,
  ...props
}: MessageThreadFullProps) {
  const { containerRef, historyPosition } = useThreadContainerContext()
  const mergedRef = useMergeRefs<HTMLDivElement | null>(ref, containerRef)

  return (
    <div className="flex h-full w-full">
      {/* Thread History Sidebar - rendered first if history is on the left */}
      {showHistory && historyPosition === 'left' && (
        <ThreadHistorySidebar
          contextKey={contextKey}
          historyPosition={historyPosition}
        />
      )}

      <ThreadContainer
        ref={mergedRef}
        disableSidebarSpacing
        className={className}
        {...props}
      >
        <ScrollableMessageContainer className="dr-p-4">
          <ThreadContent variant={variant}>
            <ThreadContentMessages className="[&>div>div>div]:max-w-[70%]" />
          </ThreadContent>
        </ScrollableMessageContainer>

        {/* Message suggestions status */}
        <MessageSuggestions>
          <MessageSuggestionsStatus />
        </MessageSuggestions>

        {/* Message input */}
        <div className="dr-px-8 dr-mb-8">
          <MessageInput contextKey={contextKey}>
            <MessageInputTextarea
              placeholder="Lets pick your plane seat..."
              className="typo-p"
            />
            <MessageInputToolbar>
              {showFileInput && <MessageInputFileButton />}
              <MessageInputMcpPromptButton />
              {/* Uncomment this to enable client-side MCP config modal button */}
              {/* <MessageInputMcpConfigButton /> */}
              <MessageInputSubmitButton />
            </MessageInputToolbar>
            <MessageInputError />
          </MessageInput>
        </div>

        {/* Message suggestions */}
        <MessageSuggestions initialSuggestions={defaultSuggestions}>
          <MessageSuggestionsList />
        </MessageSuggestions>
      </ThreadContainer>

      {/* Thread History Sidebar - rendered last if history is on the right */}
      {showHistory && historyPosition === 'right' && (
        <ThreadHistorySidebar
          contextKey={contextKey}
          historyPosition={historyPosition}
        />
      )}
    </div>
  )
}
