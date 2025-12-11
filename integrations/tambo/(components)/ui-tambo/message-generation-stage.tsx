'use client'

import { type GenerationStage, useTambo } from '@tambo-ai/react'
import { Loader2Icon } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Represents the generation stage of a message
 * @property {string} className - Optional className for custom styling
 * @property {boolean} showLabel - Whether to show the label
 */

export interface GenerationStageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  showLabel?: boolean
}

export function MessageGenerationStage({
  className,
  showLabel = true,
  ...props
}: GenerationStageProps) {
  const { thread, isIdle } = useTambo()
  const stage = thread?.generationStage

  // Only render if we have a generation stage
  if (!stage) {
    return null
  }

  // Map stage names to more user-friendly labels
  const stageLabels: Record<GenerationStage, string> = {
    IDLE: 'Idle',
    CHOOSING_COMPONENT: 'Choosing component',
    FETCHING_CONTEXT: 'Fetching context',
    HYDRATING_COMPONENT: 'Preparing component',
    STREAMING_RESPONSE: 'Generating response',
    COMPLETE: 'Complete',
    ERROR: 'Error',
    CANCELLED: 'Cancelled',
  }

  const label =
    stageLabels[stage] || `${stage.charAt(0).toUpperCase() + stage.slice(1)}`

  if (isIdle) {
    return null
  }

  return (
    <div
      className={cn('inline-flex items-center dr-gap-2 dr-px-2 dr-py-1 dr-text-12 dr-rounded-6 bg-transparent text-muted-foreground',
        className
      )}
      {...props}
    >
      <Loader2Icon className="dr-h-3 dr-w-3 animate-spin" />
      {showLabel && <span>{label}</span>}
    </div>
  )
}
