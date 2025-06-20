import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL } from '@/constants'

type Params = {
  formData: FormData
  useSample?: boolean
  firstTime?: boolean
}

const uploadFiles = async ({ formData, useSample, firstTime }: Params) => {
  const response = await fetch(`${API_URL}/upload_docs?useSample=${useSample}&firstTime=${firstTime}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

export const useUploadFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: Params) => uploadFiles(params),

    // Refetch documents
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}
