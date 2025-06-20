import { QueryOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { ChatThreadType } from '@/types/ChatThread'

const fetchChatThreads = async () => {
  const response = await fetch(`${API_URL}/chats`)

  return response.json()
}

export const useGetChatThreads = (options?: Partial<UseQueryOptions<ChatThreadType[], Error>>) => {
  const query = useQuery<ChatThreadType[]>({
    queryKey: ['chats'],
    queryFn: fetchChatThreads,
    ...options,
  })

  return query
}
