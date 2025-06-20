export type QuestionnaireType = {
  id: string
  name: string
  description: string
  questions: QuestionType[]
}

export type QuestionType = {
  id: string
  question: string
  answer: string
  agentAnswer: string
  sources: string[]
  answerer: 'user' | 'agent'
}
