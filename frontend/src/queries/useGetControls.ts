import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { ControlType } from '@/types/Control'

const fetchControls = async () => {
  const response = await fetch(`${API_URL}/controls`)

  return response.json()
}

export const useGetControls = () => {
  const query = useQuery<ControlType[]>({
    queryKey: ['controls'],
    queryFn: fetchControls,
  })

  return query
}
