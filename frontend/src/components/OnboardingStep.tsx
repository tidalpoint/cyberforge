import { FC, ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Props = {
  children: ReactNode
  className?: string
}

const OnboardingStep: FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center flex-col gap-3 h-full px-6 py-12 max-w-[550px] w-full animate-in',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default OnboardingStep
