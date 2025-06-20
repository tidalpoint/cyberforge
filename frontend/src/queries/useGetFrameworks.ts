import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { FrameworkType } from '@/types/Framework'

const fetchFrameworks = async () => {
  const response = await fetch(`${API_URL}/csf_recommendation`)

  return response.json()
}

export const useGetFrameworks = () => {
  const query = useQuery<FrameworkType[]>({
    queryKey: ['frameworks'],
    queryFn: fetchFrameworks,
  })

  return query
}
