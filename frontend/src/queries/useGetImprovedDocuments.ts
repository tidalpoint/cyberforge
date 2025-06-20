import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { ControlType } from '@/types/Control'

type ImprovedDocumentsResponse = {
  id: string
  name: string
  original_content: string
  improved_content: string
  controls_improved: string[]
}

const fetchImprovedDocuments = async () => {
  const response = await fetch(`${API_URL}/improved_documents`)

  return response.json()
}

export const useGetImprovedDocuments = () => {
  const query = useQuery<ImprovedDocumentsResponse[]>({
    queryKey: ['improved-documents'],
    queryFn: () => fetchImprovedDocuments(),
  })

  return query
}
