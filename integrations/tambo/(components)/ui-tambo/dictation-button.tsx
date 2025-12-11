import { useTamboThreadInput, useTamboVoice } from '@tambo-ai/react'
import { Loader2Icon, Mic, Square } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Tooltip } from '@/components/tambo/suggestions-tooltip'

/**
 * Button for dictating speech into the message input.
 */
export default function DictationButton() {
  const {
    startRecording,
    stopRecording,
    isRecording,
    isTranscribing,
    transcript,
    transcriptionError,
  } = useTamboVoice()
  const { value, setValue } = useTamboThreadInput()
  const [lastProcessedTranscript, setLastProcessedTranscript] =
    useState<string>('')

  const handleStartRecording = () => {
    setLastProcessedTranscript('')
    startRecording()
  }

  const handleStopRecording = () => {
    stopRecording()
  }

  useEffect(() => {
    if (transcript && transcript !== lastProcessedTranscript) {
      setLastProcessedTranscript(transcript)
      setValue(value + ' ' + transcript)
    }
  }, [transcript, lastProcessedTranscript, value, setValue])

  if (isTranscribing) {
    return (
      <div className="dr-p-2 dr-rounded-6">
        <Loader2Icon className="dr-h-5 dr-w-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-row items-center dr-gap-2">
      <span className="dr-text-14 text-red-500">{transcriptionError}</span>
      {isRecording ? (
        <Tooltip content="Stop">
          <button
            type="button"
            onClick={handleStopRecording}
            className="dr-w-32 aspect-square dr-p-4 dr-rounded-6 cursor-pointer hover:bg-gray-100"
          >
            <Square className="h-full w-full text-red-500 fill-current animate-pulse" />
          </button>
        </Tooltip>
      ) : (
        <Tooltip content="Dictate">
          <button
            type="button"
            onClick={handleStartRecording}
            className="dr-w-32 aspect-square dr-p-4 dr-rounded-6 cursor-pointer hover:bg-gray-100"
          >
            <Mic className="h-full w-full" />
          </button>
        </Tooltip>
      )}
    </div>
  )
}
