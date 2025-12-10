'use client'

import { TamboProvider, useTamboThread } from '@tambo-ai/react'
import { CTA } from '~/components/button'
import { SeatSelector, SeatSelectorSchema } from './(components)/seat-selector'

export function TamboIntegration() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={[component]}
    >
      <TamboResponse />
      <TamboInput />
    </TamboProvider>
  )
}

const component = {
  name: 'seat-selector',
  description: 'A seat selector component',
  component: SeatSelector,
  propsSchema: SeatSelectorSchema,
}

function TamboInput() {
  const { sendThreadMessage } = useTamboThread()

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await sendThreadMessage(e.currentTarget.message.value, {
      streamResponse: true,
    })
  }

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-col gap-[12px] w-full"
    >
      <textarea
        id="message"
        name="message"
        defaultValue="Need to pick my airplane seat"
        className="border border-gray p-2 rounded-md typo-label-m"
      />
      <CTA type="submit">Send Message</CTA>
    </form>
  )
}

function TamboResponse() {
  const { thread } = useTamboThread()

  return (
    <div className=" w-full dr-h-400 overflow-y-auto">
      <div data-lenis-prevent className="flex flex-col gap-[24px]">
        {thread.messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-2 ">
            <p className="typo-label-m">{message.role}</p>
            <p className="typo-p-l">{message.content[0]?.text}</p>
            {message.renderedComponent}
          </div>
        ))}
      </div>
    </div>
  )
}
