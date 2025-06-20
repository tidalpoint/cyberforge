import { FormEvent, useEffect, useRef, useState } from 'react'
import { faker } from '@faker-js/faker'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateNewChat } from '@/mutations/useCreateNewChat'
import { useSendMessage } from '@/mutations/useSendMessage'
import { useGetMessages } from '@/queries/useGetMessages'

type ViewType = 'default' | 'chat' | 'history'

export const useChat = () => {
  const [currMessage, setCurrMessage] = useState('')
  const [isScrolledUp, setIsScrolledUp] = useState(false)
  const [view, setView] = useState<ViewType>('default')
  const [threadId, setThreadId] = useState('')

  const queryClient = useQueryClient()
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  const { data: messages, isPending: isFetchingMessages } = useGetMessages({ threadId })

  const { mutate: createNewChat, isPending: isCreatingNewChat } = useCreateNewChat({
    onMutate: ({ message }) => {
      queryClient.setQueryData(['thread', threadId], () => [
        {
          id: faker.string.uuid(),
          content: message,
          isUser: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      setView('chat')
    },
    onSuccess: (data) => {
      if (!data.thread_id) return

      setThreadId(data.thread_id)
    },
  })

  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage()

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()

    if (!currMessage) return

    view === 'default' ? createNewChat({ message: currMessage }) : sendMessage({ message: currMessage, threadId })

    setCurrMessage('')
  }

  useEffect(() => {
    handleScrollToBottom()
  }, [messages?.length])

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

  return {
    messages,
    currMessage,
    view,
    isScrolledUp,
    chatContainerRef,
    isCreatingNewChat,
    isSendingMessage,
    isFetchingMessages,
    threadId,
    setThreadId,
    setCurrMessage,
    setView,
    handleSendMessage,
    handleOnScroll,
    handleScrollToBottom,
    setIsScrolledUp,
  }
}
