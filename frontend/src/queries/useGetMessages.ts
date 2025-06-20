import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { MessageType } from '@/types/Message'

type Params = {
  threadId?: string
}

const fetchMessages = async ({ threadId }: Params) => {
  const response = await fetch(`${API_URL}/chat/${threadId}`)

  return response.json()
}

export const useGetMessages = ({ threadId }: Params) => {
  const query = useQuery<MessageType[]>({
    queryKey: ['thread', threadId],
    queryFn: () => fetchMessages({ threadId }),
    enabled: !!threadId,
  })

  return query
}
