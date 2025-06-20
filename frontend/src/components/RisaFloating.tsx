import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { generatePath, useNavigate } from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize'
import { ArrowDownIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline'
import { ArrowsPointingOutIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { AGENT_NAME } from '@/constants'
import { ROUTES } from '@/constants/routes'
import { useChat } from '@/hooks/useChat'
import { useGetChatThreads } from '@/queries/useGetChatThreads'
import { cn } from '@/utils/cn'
import { sortChatThreads } from '@/utils/sortChatThreads'
import RisaLogo from './icons/RisaLogo'
import { Button } from './ui/button'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'

const SUGGESTIONS = [
  'How can I improve my compliance scores?',
  'What is PIPEDA and how does it affect my business?',
  'What are the latest cybersecurity threats?',
]

const PLACEHOLDER_TEXT = [
  'Help me improve my compliance',
  'Send this to Dave',
  'Show me my top threats',
  'Can you summarize this for a board meeting?',
  'How can I improve my compliance score?',
  'What does this compliance score mean?',
  'What is the most impactful action I can take?',
  'Can you provide additional insights about this page?',
  'Give me a breakdown of the latest cybersecurity news',
]

const RisaFloating = () => {
  const [isPulsing, setIsPulsing] = useState(true)
  const [placeholderTextState, setPlaceholderTextState] = useState([0, 0, 0])

  const {
    messages,
    currMessage,
    view,
    isCreatingNewChat,
    isSendingMessage,
    isScrolledUp,
    chatContainerRef,
    threadId,
    setThreadId,
    setCurrMessage,
    setView,
    handleSendMessage,
    handleOnScroll,
    handleScrollToBottom,
    setIsScrolledUp,
  } = useChat()

  const navigate = useNavigate()

  const { data: chatThreads } = useGetChatThreads({ enabled: view === 'history' })

  const resetChatState = () => {
    setView('default')
    setThreadId('')
    setIsScrolledUp(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderTextState((prev) => {
        if (prev[1] >= PLACEHOLDER_TEXT[prev[0]].length) {
          if ((prev[2] || 0) >= 30) {
            return [(prev[0] + 1) % PLACEHOLDER_TEXT.length, 0, 0]
          }

          return [prev[0], prev[1], (prev[2] || 0) + 1]
        }

        return [prev[0], prev[1] + 1, 0]
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) return

        setTimeout(() => handleScrollToBottom('instant'), 1)
        resetChatState()
      }}
    >
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center justify-center fixed right-6 bottom-6 bg-primary size-14 rounded-full shadow-xl z-50',
            isPulsing && 'transform transition-transform animate-grow-shrink',
          )}
          onClick={() => {
            setIsPulsing(false)
          }}
        >
          <div
            className={cn(
              'absolute bg-primary size-10 rounded-full shadow-lg z-[-10]',
              isPulsing && 'transform transition-transform animate-ping-primary',
            )}
          />

          <div
            className={cn(
              'absolute bg-primary size-10 rounded-full shadow-lg z-[-10]',
              isPulsing && 'transform transition-transform animate-ping-secondary',
            )}
          />

          <RisaLogo className="size-7 stroke-2 text-white" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="p-0 rounded-xl border text-card-foreground shadow-xl w-[450px] animate-fade-in bg-gradient-to-t from-[#7fa7ff25] to-gray-50"
      >
        {view === 'default' && (
          <div className="grid grid-rows-[50px_1fr] w-full">
            <div className="flex items-center justify-end gap-1 px-3">
              <Button variant="ghost" onClick={() => setView('history')} className="size-8 hover:bg-gray-200">
                <ClockIcon className="size-4 text-gray-700 stroke-2" />
              </Button>
              <Button variant="ghost" onClick={() => navigate(ROUTES.newChat)} className="size-8 hover:bg-gray-200">
                <ArrowsPointingOutIcon className="size-4 text-gray-700 stroke-2" />
              </Button>
            </div>

            <div className="w-full p-6 pt-0">
              <div className="mb-6">
                <div className="flex items-center justify-center h-11 w-11 rounded-full border border-gray-300 bg-white shadow-sm">
                  <RisaLogo className="size-7 stroke-2 text-gray-900" />
                </div>

                <h2 className="mt-2 font-bold text-gray-800">Hello! How can I help you today?</h2>
              </div>

              <form onSubmit={(e) => handleSendMessage(e)}>
                <TextareaAutosize
                  maxRows={2}
                  className="mb-6 p-4 bg-background border rounded-lg h-16 shadow-sm text-gray-700 font-medium w-full outline-none resize-none text-sm"
                  placeholder={PLACEHOLDER_TEXT[placeholderTextState[0]].slice(0, placeholderTextState[1])}
                  value={currMessage}
                  onChange={(e) => setCurrMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />

                <h3 className="text-sm font-bold pb-1 pt-4 border-t border-gray-300/50">Suggested</h3>

                <div className="grid space-y-1">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <Button
                      key={suggestion}
                      variant="ghost"
                      onClick={() => setCurrMessage(suggestion)}
                      className="p-1 text-[13px] justify-start opacity-0 animate-fade-in h-9 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                      style={{
                        animationDelay: `${index * 75 + 150}ms`,
                        animationFillMode: 'forwards',
                      }}
                    >
                      <SparklesIcon className="size-4 stroke-2" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </form>
            </div>
          </div>
        )}

        {view === 'chat' && (
          <div className="grid grid-rows-[50px_1fr] h-full w-full">
            <div className="flex items-center justify-between gap-2 px-3 border-b">
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" onClick={() => resetChatState()} className="size-8 hover:bg-gray-200">
                  <ArrowLeftIcon className="size-4 stroke-2" />
                </Button>

                {chatThreads?.find((thread) => thread.id === threadId)?.title && (
                  <div className="grid">
                    <h2 className="text-sm font-bold text-gray-800 truncate">
                      {chatThreads.find((thread) => thread.id === threadId)?.title}
                    </h2>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  navigate(generatePath(ROUTES.chat, { threadId }))
                }}
                className="size-8 hover:bg-gray-200"
              >
                <ArrowsPointingOutIcon className="size-4 stroke-2" />
              </Button>
            </div>

            <div className="h-full">
              <div ref={chatContainerRef} className="h-[50vh] overflow-y-auto pb-6" onScroll={handleOnScroll}>
                <div className="flex flex-col gap-8 p-6 pb-0">
                  {messages?.map((message) => {
                    if (message.isUser) {
                      return (
                        <div
                          key={message.id}
                          className="bg-primary/5 rounded-lg px-4 py-[10px] font-semibold self-end border border-[rgba(0,0,0,0.05)] shadow-sm text-sm max-w-[90%]"
                        >
                          {message.content}
                        </div>
                      )
                    }

                    return (
                      <div
                        key={message.id}
                        className="bg-background border rounded-lg px-4 py-[10px] font-semibold relative space-y-3 shadow-sm text-sm"
                      >
                        <Markdown>{message.content}</Markdown>
                      </div>
                    )
                  })}

                  {(isCreatingNewChat || isSendingMessage) && (
                    <div className="bg-primary flex items-center justify-center h-9 w-9 rounded-full p-2 animate-pulse">
                      <RisaLogo className="text-background" />
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center justify-center w-full">
                  <TextareaAutosize
                    maxRows={2}
                    className="mb-6 mx-6 p-4 bg-background border rounded-lg h-16 shadow-sm text-gray-700 font-medium w-full outline-none resize-none text-sm"
                    placeholder={`Message ${AGENT_NAME}`}
                    value={currMessage}
                    onChange={(e) => setCurrMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                </form>

                {/* {isScrolledUp && (
                  <button
                    onClick={() => handleScrollToBottom()}
                    className={cn(
                      'flex items-center justify-center size-8 rounded-full bg-background border absolute -top-12 left-1/2 -translate-x-1/2 z-10 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300',
                    )}
                  >
                    <ArrowDownIcon className="h-4 stroke-[2.75] text-gray-700" />
                  </button>
                )} */}

                <button
                  onClick={() => handleScrollToBottom()}
                  className={cn(
                    'flex items-center justify-center size-8 rounded-full bg-background border absolute -top-12 left-1/2 -translate-x-1/2 z-10 shadow-md opacity-0 pointer-events-none invisible transition-opacity duration-300',
                    isScrolledUp && 'opacity-100 pointer-events-auto visible',
                  )}
                >
                  <ArrowDownIcon className="h-4 stroke-[2.75] text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="grid grid-rows-[50px_1fr] h-full w-full">
            <div className={cn('flex items-center justify-between px-3 border-b')}>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" onClick={() => resetChatState()} className="size-8 hover:bg-gray-200">
                  <ArrowLeftIcon className="size-4 stroke-2" />
                </Button>

                <h2 className="text-sm font-bold text-gray-800 truncate">Chat History</h2>
              </div>
            </div>

            <div className="h-[50vh] overflow-y-auto">
              {!!chatThreads?.length && (
                <div className="grid gap-8 p-4">
                  {Object.entries(sortChatThreads(chatThreads)).map(
                    ([section, items]) =>
                      !!items.length && (
                        <div key={section} className="grid gap-0.5">
                          <h2 className="text-xs font-extrabold ml-2 uppercase text-gray-700">{section}</h2>

                          <ul className="grid gap-1">
                            {items.map(({ id, title }) => (
                              <li key={id}>
                                <div className="grid">
                                  <div
                                    onClick={() => {
                                      setThreadId(id)
                                      setView('chat')
                                    }}
                                    className={cn(
                                      'w-full rounded-md px-2 py-2 font-semibold text-sm text-gray-800 truncate hover:bg-primary/5 cursor-pointer transition-all duration-200',
                                    )}
                                  >
                                    {title}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default RisaFloating
