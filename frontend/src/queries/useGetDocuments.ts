import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { DocumentType } from '@/types/Document'

const fetchDocuments = async () => {
  const response = await fetch(`${API_URL}/documents`)

  return response.json()
}

export const useGetDocuments = () => {
  const query = useQuery<DocumentType[]>({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  })

  return query
}
