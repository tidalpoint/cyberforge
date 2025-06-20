import { FC, ReactNode } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

type Props = {
  type: 'yes' | 'no'
  isSelected: boolean
  children: ReactNode
}

const BooleanOption: FC<Props> = ({ type, isSelected, children }) => {
  return (
    <button
      className={cn(
        'flex items-center gap-2 p-2.5 bg-primary/5 max-w-[180px] w-full border-primary/15 border rounded-lg font-semibold',
        isSelected && 'border-primary',
      )}
    >
      <div className="flex items-center justify-center size-7 rounded-md border bg-background text-primary">
        {type === 'yes' && <CheckIcon className="h-4 stroke-2" />}
        {type === 'no' && <XMarkIcon className="h-4 stroke-2" />}
      </div>

      {children}
    </button>
  )
}

export default BooleanOption
