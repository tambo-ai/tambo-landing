import { useTamboThread } from '@tambo-ai/react'
import { useRef, useState } from 'react'
import ArrowDownSVG from '~/assets/svgs/arrow-down.svg'

const options = [
  { label: 'Get started', value: 'What can you help me with?' },
  { label: 'Learn more', value: 'Tell me about your capabilities.' },
  { label: 'Examples', value: 'Show me some example queries I can try.' },
]

export function ChatInput() {
  const { sendThreadMessage } = useTamboThread()
  const formRef = useRef<HTMLFormElement>(null)
  const [inputValue, setInputValue] = useState(
    'Can you help me pick my airplane seat?'
  )
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await sendThreadMessage(e.currentTarget.message.value, {
      streamResponse: true,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <div className="flex flex-col dr-gap-12">
      <form
        ref={formRef}
        onSubmit={handleSendMessage}
        className="flex flex-col gap-[12px] w-full relative"
      >
        <textarea
          id="message"
          name="message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray dr-h-120 dr-p-16 dr-rounded-12 typo-label-m focus:outline-none"
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="absolute dr-bottom-16 dr-right-16 dr-rounded-4 border dr-p-4 bg-black text-white"
        >
          <ArrowDownSVG className="dr-size-20 rotate-180" />
        </button>
      </form>
      <ul className="flex dr-gap-16">
        {options.map(({ label, value }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setInputValue(value)}
              className="dr-rounded-8 border dr-p-8 typo-label-s"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
