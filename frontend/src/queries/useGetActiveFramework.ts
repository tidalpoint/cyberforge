import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { FrameworkType } from '@/types/Framework'

type ActiveFrameworkResponse = {
  frameworkId: string
}

const fetchActiveFramework = async () => {
  const response = await fetch(`${API_URL}/framework`)

  return response.json()
}

export const useGetActiveFramework = () => {
  const query = useQuery<ActiveFrameworkResponse>({
    queryKey: ['active-framework'],
    queryFn: fetchActiveFramework,
  })

  return query
}
