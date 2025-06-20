import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { API_URL } from '@/constants'

const fetchComplianceProgress = async () => {
  const response = await fetch(`${API_URL}/compliance_progress`)

  return response.json()
}

export const useGetComplianceProgress = (options?: Partial<UseQueryOptions<number, Error>>) => {
  const query = useQuery<number>({
    queryKey: ['compliance_progress'],
    queryFn: fetchComplianceProgress,
    refetchInterval: 2000,
    ...options,
  })

  return query
}
