import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { ThreatType } from '@/types/Threat'

const fetchThreats = async () => {
  const response = await fetch(`${API_URL}/threats`)

  return response.json()
}

export const useGetThreats = () => {
  const query = useQuery<ThreatType[]>({
    queryKey: ['threats'],
    queryFn: fetchThreats,
  })

  return query
}
