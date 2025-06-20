import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatHistory from '@/components/chat/ChatHistory'
import ChatInputContainer from '@/components/chat/ChatInputContainer'
import RisaLogo from '@/components/icons/RisaLogo'
import { useSendMessage } from '@/mutations/useSendMessage'
import { useGetMessages } from '@/queries/useGetMessages'

const ChatPage = () => {
  const [isScrolledUp, setIsScrolledUp] = useState(false)
  const { threadId } = useParams()

  const { data: messages } = useGetMessages({ threadId })
  const { mutate: sendMessage, isPending } = useSendMessage()

  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    handleScrollToBottom()
  }, [messages])

  const handleScrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior })
  }

  // Detect when user scrolls up
  const handleOnScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      setIsScrolledUp(scrollTop + clientHeight < scrollHeight - 40)
    }
  }

  return (
    <div className="h-dvh grid grid-cols-[256px_1fr]">
      <ChatHistory />

      <div className="grid grid-rows-[64px_1fr] relative">
        <ChatHeader />

        <div className="bg-gradient-to-b from-[#a182ff05] to-[#7fa7ff25] h-[calc(100dvh-64px)]">
          <div className="h-full w-full grid grid-rows-[1fr_auto]">
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

                {isPending && (
                  <div className="bg-primary flex items-center justify-center h-9 w-9 rounded-full p-2 animate-pulse">
                    <RisaLogo className="text-background" />
                  </div>
                )}
              </div>
            </div>

            <ChatInputContainer
              isScrolledUp={isScrolledUp}
              handleScrollToBottom={() => handleScrollToBottom('smooth')}
              handleOnSend={sendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
