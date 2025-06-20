import { FC } from 'react'
import { cn } from '@/utils/cn'
import { Card } from './ui/card'

type Props = {
  title: string
  count: number
  type: 'Major' | 'Minor' | 'Compliant'
  className?: string
}

const StatCard: FC<Props> = ({ title, count, type, className }) => {
  return (
    <div
      className={cn(
        'rounded-lg p-[2px] bg-gradient-to-r from-major to-[#e1e1e1] shadow-sm',
        type === 'Minor' && 'from-minor',
        type === 'Compliant' && 'from-compliant',
        className,
      )}
    >
      <div className="rounded-lg h-full w-full">
        <div className="grid gap-4 p-4 rounded-md bg-white h-full w-full">
          <span
            className={cn(
              'font-extrabold uppercase tracking-wider text-sm text-red-900',
              type === 'Minor' && 'text-amber-900',
              type === 'Compliant' && 'text-green-900',
            )}
          >
            {title}
          </span>

          <div className="flex items-end justify-between">
            <span
              className={cn(
                'font-semibold text-3xl text-red-800',
                type === 'Minor' && 'text-amber-900',
                type === 'Compliant' && 'text-green-900',
              )}
            >
              {count}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
