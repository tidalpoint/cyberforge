import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { generatePath, useNavigate } from 'react-router-dom'
import { faker } from '@faker-js/faker'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatHistory from '@/components/chat/ChatHistory'
import ChatInputContainer from '@/components/chat/ChatInputContainer'
import RisaLogo from '@/components/icons/RisaLogo'
import { AGENT_NAME } from '@/constants'
import { ROUTES } from '@/constants/routes'
import { useChat } from '@/hooks/useChat'
import { useCreateNewChat } from '@/mutations/useCreateNewChat'
import { MessageType } from '@/types/Message'

const NewChatPage = () => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const { isScrolledUp, handleScrollToBottom, handleOnScroll } = useChat()
  const navigate = useNavigate()

  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  const { mutate: createNewChat, isPending } = useCreateNewChat({
    onMutate: ({ message }) => {
      setMessages((prev) => [
        ...prev,
        { id: faker.string.uuid(), content: message, isUser: true, createdAt: new Date(), updatedAt: new Date() },
      ])
    },
    onSuccess: (data) => {
      if (!data.thread_id) return

      navigate(generatePath(ROUTES.chat, { threadId: data.thread_id }))
    },
  })

  return (
    <div className="h-dvh grid grid-cols-[256px_1fr]">
      <ChatHistory />

      <div className="grid grid-rows-[64px_1fr] relative">
        <ChatHeader />

        <div className="bg-gradient-to-b from-[#a182ff05] to-[#7fa7ff25] h-[calc(100dvh-64px)]">
          <div className="h-full w-full grid grid-rows-[1fr_auto]">
            {isPending ? (
              <div ref={chatContainerRef} className="overflow-y-auto" onScroll={handleOnScroll}>
                <div className="flex flex-col gap-8 max-w-[900px] mx-auto px-10 py-8">
                  {messages?.map((message) => {
                    if (message.isUser) {
                      return (
                        <div
                          key={message.id}
                          className="bg-primary/5 text-[#182a75] rounded-2xl p-4 font-semibold self-end border border-[rgba(0,0,0,0.05)]"
                        >
                          {message.content}
                        </div>
                      )
                    }

                    return (
                      <div
                        key={message.id}
                        className="bg-background text-foreground shadow-md border rounded-2xl p-4 font-semibold relative w-full space-y-3"
                      >
                        <ReactMarkdown children={message.content.replace('/\n/gi', '\n &nbsp;')} />
                      </div>
                    )
                  })}

                  <div className="bg-primary flex items-center justify-center h-9 w-9 rounded-full p-2 animate-pulse">
                    <RisaLogo className="text-background" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col gap-3 h-full">
                <p className="text-4xl text-primary font-bold">Chat with {AGENT_NAME}</p>
                <p className="text-xl text-[#5f6fab] font-semibold">Your virtual CyberForge employee</p>
              </div>
            )}

            <ChatInputContainer
              isScrolledUp={isScrolledUp}
              handleScrollToBottom={handleScrollToBottom}
              handleOnSend={createNewChat}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewChatPage
