import { generatePath, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ROUTES } from '@/constants/routes'
import { useGetChatThreads } from '@/queries/useGetChatThreads'
import { cn } from '@/utils/cn'
import { sortChatThreads } from '@/utils/sortChatThreads'
import { Button } from '../ui/button'

const ChatHistory = () => {
  const { threadId } = useParams()

  const { data: chatThreads } = useGetChatThreads()

  return (
    <div className="grid grid-rows-[64px_1fr] w-64 border-r bg-white">
      <div className="flex items-center gap-1.5 border-b px-2 font-bold">
        <Button asChild size="icon" variant="ghost" className="size-8">
          <Link to={ROUTES.home}>
            <ArrowLeftIcon className="h-4 stroke-[2.25]" />
          </Link>
        </Button>
        Chat History
      </div>

      <div className="px-2 py-4 overflow-y-auto h-[calc(100dvh-64px)]">
        {!!chatThreads?.length && (
          <div className="grid gap-8">
            {Object.entries(sortChatThreads(chatThreads)).map(
              ([section, items]) =>
                !!items.length && (
                  <div key={section} className="grid gap-0.5">
                    <h2 className="text-xs font-extrabold ml-2 uppercase text-gray-700">{section}</h2>

                    <ul className="grid gap-1">
                      {items.map(({ id, title }) => (
                        <li key={id}>
                          <div className="grid">
                            <Link
                              className={cn(
                                'w-full rounded-md px-2 py-2 font-semibold text-sm text-gray-800 truncate hover:bg-gray-50',
                                threadId === id && 'bg-gray-50',
                              )}
                              to={generatePath(ROUTES.chat, { threadId: id })}
                            >
                              {title}
                            </Link>
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
  )
}

export default ChatHistory
