import NavigationTabs from '@/components/NavigationTabs'
import QuestionItem from '@/components/QuestionItem'
import { Card } from '@/components/ui/card'
import { useGetQuestionnaire } from '@/queries/useGetQuestionnaire'
import { getGreeting } from '@/utils/getGreeting'

export const NOT_ANSWERED_STRING = 'No relevant information found'

const QuestionnairePage = () => {
  const { data: pipeda, isLoading } = useGetQuestionnaire()

  const getPassingQuestionPercentage = () => {
    if (!pipeda?.questions.length) return 0

    const numCorrect = pipeda.questions.filter((question) => question.answer !== NOT_ANSWERED_STRING).length
    return ((numCorrect / pipeda.questions.length) * 100).toFixed(1)
  }

  return (
    <div className="max-w-page mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">{getGreeting()}</h1>
      <h2 className="md:text-lg font-medium text-gray-700">Here's an overview of your security posture</h2>

      <NavigationTabs />

      {!!pipeda && (
        <div className="grid gap-5">
          <div className="flex items-center justify-between gap-4 p-4 bg-blue-100 text-primary font-bold rounded-lg">
            <h2>PIPEDA Results</h2>
            <span>Score: {getPassingQuestionPercentage()}%</span>
          </div>

          <div className="grid gap-8">
            {pipeda.questions.map((question, idx) => (
              <QuestionItem key={question.id} question={question} order={idx + 1} />
            ))}
          </div>
        </div>
      )}

      {!pipeda && !isLoading && (
        <Card className="flex items-center justify-center flex-col gap-4 h-[300px] border-dashed bg-white select-none">
          <img src="/search.png" className="h-24" />
          <div className="grid gap-0.5 text-center">
            <p className="text-gray-700 text-lg font-semibold">Results Not Ready Yet</p>
            <p className="text-gray-500 text-sm font-semibold">Try again in a minute</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default QuestionnairePage
