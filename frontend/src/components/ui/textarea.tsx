import * as React from 'react'
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'
import { cn } from '@/utils/cn'

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(({ className, ...props }, ref) => {
  return (
    <TextareaAutosize
      className={cn(
        'flex min-h-20 w-full rounded-lg border bg-background p-3 text-base text-gray-800 font-medium shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_#689fff26] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
