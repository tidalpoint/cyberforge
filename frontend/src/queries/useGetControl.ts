import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { ControlType } from '@/types/Control'

type Params = {
  controlId?: string
}

const fetchControl = async ({ controlId }: Params) => {
  const response = await fetch(`${API_URL}/control/${controlId}`)

  return response.json()
}

export const useGetControl = ({ controlId }: Params) => {
  const query = useQuery<ControlType>({
    queryKey: ['control', controlId],
    queryFn: () => fetchControl({ controlId }),
    enabled: !!controlId,
  })

  return query
}
