import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { API_URL } from '@/constants'

type Params = {
  message: string
}

type NewChatResponse = {
  reply: string
  thread_id: string
}

const createNewChat = async ({ message }: Params) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

export const useCreateNewChat = (options?: UseMutationOptions<NewChatResponse, Error, Params>) => {
  const queryClient = useQueryClient()

  return useMutation<NewChatResponse, Error, Params>({
    mutationFn: (params: Params) => createNewChat(params),

    // Refetch chat history
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
    ...options,
  })
}
