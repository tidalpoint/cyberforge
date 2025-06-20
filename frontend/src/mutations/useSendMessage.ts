import { faker } from '@faker-js/faker'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { MessageType } from '@/types/Message'

type Params = {
  threadId?: string
  message: string
}

const sendMessage = async ({ threadId, message }: Params) => {
  const response = await fetch(`${API_URL}/chat/${threadId}`, {
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

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: Params) => sendMessage(params),

    // Optimistic update
    onMutate: async ({ threadId, message }) => {
      if (!threadId) return

      await queryClient.cancelQueries({ queryKey: ['thread', threadId] })

      const previousMessages = queryClient.getQueryData<MessageType[]>(['thread', threadId])

      const optimisticMessage: MessageType = {
        id: faker.string.uuid(),
        content: message,
        isUser: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      queryClient.setQueryData<MessageType[]>(['thread', threadId], (old) =>
        old ? [...old, optimisticMessage] : [optimisticMessage],
      )

      return { previousMessages }
    },

    // On error, rollback to previous state
    onError: (_err, { threadId }, context) => {
      if (threadId && context?.previousMessages) {
        queryClient.setQueryData(['thread', threadId], context.previousMessages)
      }
    },

    // Always refetch for consistency
    onSettled: (_data, _error, { threadId }) => {
      if (threadId) {
        queryClient.invalidateQueries({ queryKey: ['thread', threadId] })
      }
    },
  })
}
