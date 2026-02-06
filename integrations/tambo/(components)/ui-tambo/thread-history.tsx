'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  type TamboThread,
  useTamboThread,
  useTamboThreadList,
} from '@tambo-ai/react'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  MoreHorizontal,
  Pencil,
  PlusIcon,
  SearchIcon,
  Sparkles,
} from 'lucide-react'
import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'

/**
 * Context for sharing thread history state and functions
 */
interface ThreadHistoryContextValue {
  threads: { items?: TamboThread[] } | null | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<unknown>
  currentThread: TamboThread
  switchCurrentThread: (threadId: string) => void
  startNewThread: () => void
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  onThreadChange?: () => void
  position?: 'left' | 'right'
  updateThreadName: (newName: string, threadId?: string) => Promise<void>
  generateThreadName: (threadId: string) => Promise<TamboThread>
}

const ThreadHistoryContext =
  React.createContext<ThreadHistoryContextValue | null>(null)

const useThreadHistoryContext = () => {
  const context = React.useContext(ThreadHistoryContext)
  if (!context) {
    throw new Error(
      'ThreadHistory components must be used within ThreadHistory'
    )
  }
  return context
}

/**
 * Root component that provides context for thread history
 */
interface ThreadHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  onThreadChange?: () => void
  children?: React.ReactNode
  defaultCollapsed?: boolean
  position?: 'left' | 'right'
}

const ThreadHistory = React.forwardRef<HTMLDivElement, ThreadHistoryProps>(
  (
    {
      className,
      onThreadChange,
      defaultCollapsed = true,
      position = 'left',
      children,
      ...props
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
    const [shouldFocusSearch, setShouldFocusSearch] = React.useState(false)

    const {
      data: threads,
      isLoading,
      error,
      refetch,
    } = useTamboThreadList()

    const {
      switchCurrentThread,
      startNewThread,
      thread: currentThread,
      updateThreadName,
      generateThreadName,
    } = useTamboThread()

    // Update CSS variable when sidebar collapses/expands
    React.useEffect(() => {
      const sidebarWidth = isCollapsed ? '3rem' : '16rem'
      document.documentElement.style.setProperty(
        '--sidebar-width',
        sidebarWidth
      )
    }, [isCollapsed])

    // Focus search input when expanded from collapsed state
    React.useEffect(() => {
      if (!isCollapsed && shouldFocusSearch) {
        setShouldFocusSearch(false)
      }
    }, [isCollapsed, shouldFocusSearch])

    const contextValue = React.useMemo(
      () => ({
        threads,
        isLoading,
        error,
        refetch,
        currentThread,
        switchCurrentThread,
        startNewThread,
        searchQuery,
        setSearchQuery,
        isCollapsed,
        setIsCollapsed,
        onThreadChange,
        position,
        updateThreadName,
        generateThreadName,
      }),
      [
        threads,
        isLoading,
        error,
        refetch,
        currentThread,
        switchCurrentThread,
        startNewThread,
        searchQuery,
        isCollapsed,
        onThreadChange,
        position,
        updateThreadName,
        generateThreadName,
      ]
    )

    return (
      <ThreadHistoryContext.Provider
        value={contextValue as ThreadHistoryContextValue}
      >
        <div
          ref={ref}
          className={cn('border-flat bg-container h-full transition-all duration-300 flex-none',
            position === 'left' ? 'border-r' : 'border-l',
            isCollapsed ? 'dr-w-12' : 'dr-w-64',
            className
          )}
          {...props}
        >
          <div
            className={cn('flex flex-col h-full',
              isCollapsed ? 'py-4 px-2' : 'dr-p-4'
            )} // py-4 px-2 is for better alignment when isCollapsed
          >
            {children}
          </div>
        </div>
      </ThreadHistoryContext.Provider>
    )
  }
)
ThreadHistory.displayName = 'ThreadHistory'

/**
 * Header component with title and collapse toggle
 */
const ThreadHistoryHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    isCollapsed,
    setIsCollapsed,
    position = 'left',
  } = useThreadHistoryContext()

  return (
    <div
      ref={ref}
      className={cn('flex items-center dr-mb-4 relative',
        isCollapsed ? 'dr-p-1' : 'dr-p-1',
        className
      )}
      {...props}
    >
      <h2
        className={cn('dr-text-14 text-muted-foreground whitespace-nowrap ',
          isCollapsed
            ? 'opacity-0 dr-max-w-0 overflow-hidden '
            : 'opacity-100 max-w-none transition-all duration-300 delay-75'
        )}
      >
        Tambo Conversations
      </h2>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(`bg-container dr-p-1 hover:bg-backdrop transition-colors dr-rounded-6 cursor-pointer absolute flex items-center justify-center`,
          position === 'left' ? 'right-1' : 'left-0'
        )}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ArrowRightToLine
            className={cn('dr-h-4 dr-w-4', position === 'right' && 'rotate-180')}
          />
        ) : (
          <ArrowLeftToLine
            className={cn('dr-h-4 dr-w-4', position === 'right' && 'rotate-180')}
          />
        )}
      </button>
    </div>
  )
})
ThreadHistoryHeader.displayName = 'ThreadHistory.Header'

/**
 * Button to create a new thread
 */
const ThreadHistoryNewButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ ...props }, ref) => {
  const { isCollapsed, startNewThread, refetch, onThreadChange } =
    useThreadHistoryContext()

  const handleNewThread = React.useCallback(
    async (e?: React.MouseEvent) => {
      if (e) e.stopPropagation()

      try {
        await startNewThread()
        await refetch()
        onThreadChange?.()
      } catch (error) {
        console.error('Failed to create new thread:', error)
      }
    },
    [startNewThread, refetch, onThreadChange]
  )

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.key === 'n') {
        event.preventDefault()
        handleNewThread()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleNewThread])

  return (
    <button
      ref={ref}
      onClick={handleNewThread}
      className={cn('flex items-center dr-rounded-6 dr-mb-4 hover:bg-backdrop transition-colors cursor-pointer relative',
        isCollapsed ? 'dr-p-1 justify-center' : 'dr-p-2 dr-gap-2'
      )}
      title="New thread"
      {...props}
    >
      <PlusIcon className="dr-h-4 dr-w-4 bg-green-600 rounded-full text-white" />
      <span
        className={cn('dr-text-14 font-medium whitespace-nowrap absolute dr-left-8 pb-[2px] ',
          isCollapsed
            ? 'opacity-0 dr-max-w-0 overflow-hidden pointer-events-none'
            : 'opacity-100 transition-all duration-300 delay-100'
        )}
      >
        New thread
      </span>
    </button>
  )
})
ThreadHistoryNewButton.displayName = 'ThreadHistory.NewButton'

/**
 * Search input for filtering threads
 */
const ThreadHistorySearch = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, setIsCollapsed, searchQuery, setSearchQuery } =
    useThreadHistoryContext()
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const expandOnSearch = () => {
    if (isCollapsed) {
      setIsCollapsed(false)
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300) // Wait for animation
    }
  }

  return (
    <div ref={ref} className={cn('dr-mb-4 relative', className)} {...props}>
      {/*visible when collapsed */}
      <button
        onClick={expandOnSearch}
        className={cn('dr-p-1 hover:bg-backdrop dr-rounded-6 cursor-pointer absolute left-1/2 -translate-x-1/2',
          isCollapsed
            ? 'opacity-100 pointer-events-auto transition-all duration-300'
            : 'opacity-0 pointer-events-none'
        )}
        title="Search threads"
      >
        <SearchIcon className="dr-h-4 dr-w-4 text-gray-400" />
      </button>

      {/*visible when expanded with delay */}

      <div
        className={cn(
          //using this as wrapper
          isCollapsed
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100 delay-100 transition-all duration-500'
        )}
      >
        <div className="absolute dr-inset-y-0 dr-left-0 dr-pl-3 flex items-center pointer-events-none">
          <SearchIcon className="dr-h-4 dr-w-4 text-gray-400" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          className="dr-pl-10 dr-pr-4 dr-py-2 w-full dr-text-14 dr-rounded-6 bg-container focus:outline-none"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  )
})
ThreadHistorySearch.displayName = 'ThreadHistory.Search'

/**
 * List of thread items
 */
const ThreadHistoryList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    threads,
    isLoading,
    error,
    isCollapsed,
    searchQuery,
    currentThread,
    switchCurrentThread,
    onThreadChange,
    updateThreadName,
    generateThreadName,
    refetch,
  } = useThreadHistoryContext()

  const [editingThread, setEditingThread] = React.useState<TamboThread | null>(
    null
  )
  const [newName, setNewName] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Handle click outside name editing input
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingThread &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setEditingThread(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editingThread])

  // Focus input when entering edit mode
  React.useEffect(() => {
    if (editingThread) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }

    return undefined
  }, [editingThread])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingThread(null)
    }
  }

  // Filter threads based on search query
  const filteredThreads = useMemo(() => {
    // While collapsed we do not need the list, avoid extra work.
    if (isCollapsed) return []

    if (!threads?.items) return []

    const query = searchQuery.toLowerCase()
    return threads.items.filter((thread: TamboThread) => {
      const nameMatches = thread.name?.toLowerCase().includes(query) ?? false
      const idMatches = thread.id.toLowerCase().includes(query)

      return idMatches ? true : nameMatches
    })
  }, [isCollapsed, threads, searchQuery])

  const handleSwitchThread = async (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    try {
      switchCurrentThread(threadId)
      onThreadChange?.()
    } catch (error) {
      console.error('Failed to switch thread:', error)
    }
  }

  const handleRename = (thread: TamboThread) => {
    setEditingThread(thread)
    setNewName(thread.name ?? '')
  }

  const handleGenerateName = async (thread: TamboThread) => {
    try {
      await generateThreadName(thread.id)
      await refetch()
    } catch (error) {
      console.error('Failed to generate name:', error)
    }
  }

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingThread) return

    try {
      await updateThreadName(newName, editingThread.id)
      await refetch()
      setEditingThread(null)
    } catch (error) {
      console.error('Failed to rename thread:', error)
    }
  }

  // Content to show
  let content: React.ReactNode
  if (isLoading) {
    content = (
      <div
        ref={ref}
        className={cn('dr-text-14 text-muted-foreground dr-p-2', className)}
        {...props}
      >
        Loading threads...
      </div>
    )
  } else if (error) {
    content = (
      <div
        ref={ref}
        className={cn(
          'text-sm text-destructive p-2 whitespace-nowrap',
          isCollapsed ? 'opacity-0 dr-max-w-0 overflow-hidden' : 'opacity-100',
          className
        )}
        {...props}
      >
        Error loading threads
      </div>
    )
  } else if (filteredThreads.length === 0) {
    content = (
      <div
        ref={ref}
        className={cn(
          'text-sm text-muted-foreground dr-p-2 whitespace-nowrap',
          isCollapsed ? 'opacity-0 dr-max-w-0 overflow-hidden' : 'opacity-100',
          className
        )}
        {...props}
      >
        {searchQuery ? 'No matching threads' : 'No previous threads'}
      </div>
    )
  } else {
    content = (
      <div className="space-y-1">
        {filteredThreads.map((thread: TamboThread) => (
          <div
            key={thread.id}
            role="button"
            tabIndex={0}
            onClick={() => void handleSwitchThread(thread.id)}
            onKeyDown={(e) => {
              if (editingThread?.id === thread.id) return
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                void handleSwitchThread(thread.id)
              }
            }}
            className={cn('dr-p-2 dr-rounded-6 hover:bg-backdrop cursor-pointer group flex items-center justify-between',
              currentThread?.id === thread.id ? 'bg-muted' : '',
              editingThread?.id === thread.id ? 'bg-muted' : ''
            )}
          >
            <div className="dr-text-14 flex-1">
              {editingThread?.id === thread.id ? (
                <form
                  onSubmit={handleNameSubmit}
                  className="flex flex-col dr-gap-1"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-background dr-px-1 dr-text-14 font-medium focus:outline-none dr-rounded-2"
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Thread name..."
                  />
                  <p className="dr-text-12 text-muted-foreground truncate">
                    {new Date(thread.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </form>
              ) : (
                <>
                  <span className="font-medium line-clamp-1">
                    {thread.name ?? `Thread ${thread.id.substring(0, 8)}`}
                  </span>
                  <p className="dr-text-12 text-muted-foreground truncate dr-mt-1">
                    {new Date(thread.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </>
              )}
            </div>
            <ThreadOptionsDropdown
              thread={thread}
              onRename={handleRename}
              onGenerateName={handleGenerateName}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn('overflow-y-auto flex-1 transition-all duration-300 ease-in-out',
        isCollapsed
          ? 'opacity-0 dr-max-h-0 overflow-hidden pointer-events-none'
          : 'opacity-100 max-h-full pointer-events-auto',
        className
      )}
      {...props}
    >
      {content}
    </div>
  )
})
ThreadHistoryList.displayName = 'ThreadHistory.List'

/**
 * Dropdown menu component for thread actions
 */
const ThreadOptionsDropdown = ({
  thread,
  onRename,
  onGenerateName,
}: {
  thread: TamboThread
  onRename: (thread: TamboThread) => void
  onGenerateName: (thread: TamboThread) => void
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="dr-p-1 hover:bg-backdrop dr-rounded-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="dr-h-4 dr-w-4 text-muted-foreground" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] dr-text-12 bg-popover dr-rounded-6 dr-p-1 shadow-md border border-border"
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item
            className="flex items-center dr-gap-2 dr-px-2 dr-py-1 text-foreground hover:bg-backdrop dr-rounded-2 cursor-pointer outline-none transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onRename(thread)
            }}
          >
            <Pencil className="dr-h-3 dr-w-3" />
            Rename
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center dr-gap-2 dr-px-2 dr-py-1 text-foreground hover:bg-backdrop dr-rounded-2 cursor-pointer outline-none transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onGenerateName(thread)
            }}
          >
            <Sparkles className="dr-h-3 dr-w-3" />
            Generate Name
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export {
  ThreadHistory,
  ThreadHistoryHeader,
  ThreadHistoryList,
  ThreadHistoryNewButton,
  ThreadHistorySearch,
  ThreadOptionsDropdown,
}
