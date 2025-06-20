import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL } from '@/constants'

type Params = {
  frameworkId: string
}

const saveFramework = async ({ frameworkId }: Params) => {
  const response = await fetch(`${API_URL}/select_framework`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ frameworkId }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

export const useSelectFramework = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: Params) => saveFramework(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-framework'] })
    },
  })
}
