import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'

type Params = {
  fileName: string | undefined
}

const fetchInputDocument = async ({ fileName }: Params) => {
  const response = await fetch(`${API_URL}/input_doc/${fileName}`)

  if (!response.ok) {
    throw new Error('Failed to fetch document')
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  return url
}

export const useGetInputDocument = ({ fileName }: Params) => {
  const query = useQuery<string>({
    queryKey: ['input-document', fileName],
    queryFn: () => fetchInputDocument({ fileName }),
    enabled: !!fileName,
  })

  return query
}
