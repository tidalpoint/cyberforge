import { FC } from 'react'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { Card } from '@/components/ui/card'
import { FRAMEWORKS } from '@/constants/frameworks'

type Props = {
  frameworkId: string
}

const SelectedFrameworkCard: FC<Props> = ({ frameworkId }) => {
  const framework = FRAMEWORKS.find((framework) => framework.id === frameworkId)

  if (!framework) {
    return null
  }

  return (
    <Card className="flex items-center justify-between flex-col md:flex-row gap-12 my-8 p-5 bg-[#E6F0FF] border-2 border-blue-200">
      <div className="grid gap-4">
        <div className="flex items-center gap-3 text-[#2663EB]">
          <SparklesIcon className="size-6" />
          <h1 className="font-bold select-none">Selected Framework</h1>
        </div>

        <h1 className="text-lg text-gray-900 font-semibold">{framework.name}</h1>

        <p className="text-gray-700 font-medium line-clamp-4">{framework.description}</p>
      </div>

      <img src={framework.image} alt="Framework Logo" className="size-32 shrink-0" />
    </Card>
  )
}

export default SelectedFrameworkCard
