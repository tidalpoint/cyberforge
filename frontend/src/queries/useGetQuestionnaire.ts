import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/constants'
import { QuestionnaireType } from '@/types/Questionnaire'

const fetchQuestionnaire = async () => {
  const response = await fetch(`${API_URL}/pipeda`)

  return response.json()
}

export const useGetQuestionnaire = () => {
  const query = useQuery<QuestionnaireType>({
    queryKey: ['pipeda'],
    queryFn: () => fetchQuestionnaire(),
  })

  return query
}
