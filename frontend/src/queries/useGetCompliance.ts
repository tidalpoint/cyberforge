import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { ComplianceType } from '@/types/Compliance'

const fetchCompliance = async () => {
  const response = await fetch(`${API_URL}/compliance`)

  const res = (await response.json()) as Record<number, number>

  return {
    major: res[0] + res[1] + res[2],
    minor: res[3],
    compliant: res[4] + res[5],
  }
}

export const useGetCompliance = () => {
  const query = useQuery<ComplianceType>({
    queryKey: ['compliance'],
    queryFn: fetchCompliance,
  })

  return query
}
