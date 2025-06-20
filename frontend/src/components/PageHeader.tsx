import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'
import { Button } from './ui/button'

type Props = {
  header: string
  subheader?: string
  className?: string
  maxWidth?: string
  breadcrumbs?: { href: string; text: string }[]
  children?: ReactNode
}

const PageHeader: FC<Props> = ({ header, subheader, className, maxWidth, breadcrumbs, children }) => {
  return (
    <div
      className={cn(
        'bg-gray-100 border-b w-full flex items-center justify-center py-10 min-h-[170px] relative',
        breadcrumbs && 'pt-3 pb-12',
        className,
      )}
    >
      <div className="grid max-w-page w-full mx-auto px-4" style={{ maxWidth }}>
        {breadcrumbs && (
          <div className="flex items-center gap-1.5 mb-5">
            {breadcrumbs.map(({ href, text }, idx) => {
              const isLast = idx === breadcrumbs.length - 1

              return (
                <div key={href} className="flex items-center gap-1.5">
                  {isLast ? (
                    <span className="text-gray-800 font-bold text-[13px]">{text}</span>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="link"
                        className="flex items-center gap-2 text-gray-700 font-bold text-[13px]"
                      >
                        <Link to={href}>{text}</Link>
                      </Button>
                      <ChevronRightIcon className="h-2.5 stroke-[3] text-gray-700" />
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <h1 className="font-bold text-2xl">{header}</h1>
        {subheader && <p className="font-semibold text-gray-800 mt-2">{subheader}</p>}

        {children}
      </div>
    </div>
  )
}

export default PageHeader
