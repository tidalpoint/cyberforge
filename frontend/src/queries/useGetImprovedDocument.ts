import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'

type Params = {
  fileName: string | undefined
}

const fetchImprovedDocument = async ({ fileName }: Params) => {
  const response = await fetch(`${API_URL}/improved_doc/${fileName}`)

  if (!response.ok) {
    throw new Error('Failed to fetch document')
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  return url
}

export const useGetImprovedDocument = ({ fileName }: Params) => {
  const query = useQuery<string>({
    queryKey: ['improved-document', fileName],
    queryFn: () => fetchImprovedDocument({ fileName }),
    enabled: !!fileName,
  })

  return query
}
