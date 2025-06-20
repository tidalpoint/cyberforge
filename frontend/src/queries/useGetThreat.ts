import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { ThreatType } from '@/types/Threat'

type Params = {
  threatId?: string
}

const fetchThreat = async ({ threatId }: Params) => {
  const response = await fetch(`${API_URL}/threat/${threatId}`)

  return response.json()
}

export const useGetThreat = ({ threatId }: Params) => {
  const query = useQuery<ThreatType>({
    queryKey: ['threat', threatId],
    queryFn: () => fetchThreat({ threatId }),
    enabled: !!threatId,
  })

  return query
}
