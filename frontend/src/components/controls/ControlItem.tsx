import { FC, useState } from 'react'
import { generatePath, Link } from 'react-router-dom'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { ROUTES } from '@/constants/routes'
import { ControlType } from '@/types/Control'
import { cn } from '@/utils/cn'
import { getComplianceColor } from '@/utils/getComplianceColor'
import { getComplianceName } from '@/utils/getComplianceName'
import ControlsProgressDial from '../ControlsProgressDial'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'

type SubcategoryType = { name: string; score: number; controls: ControlType[] }

type Props = {
  name: string
  score: number
  controls: { type: 'controls'; data: ControlType[] } | { type: 'subcategories'; data: SubcategoryType[] }
  defaultOpen?: boolean
}

const ControlItem: FC<Props> = ({ name, score, controls, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        style={{ '--compliance': getComplianceColor(score) }}
        className={cn('rounded-lg p-[2px] bg-gradient-to-r from-compliance to-[#e1e1e1] shadow-sm')}
      >
        <div className="rounded-lg bg-compliance h-full w-full">
          <div className="rounded-md overflow-hidden bg-white/95 h-full w-full">
            <CollapsibleTrigger className="flex items-center justify-between px-4 w-full bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center gap-1.5">
                <ControlsProgressDial score={score} showLabel className="relative -ml-[7px]" />

                <div className="flex flex-col items-start">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-compliance font-medium">{getComplianceName(score)}</p>
                </div>
              </div>

              <ChevronUpIcon
                className={cn('h-5 text-gray-500 stroke-2 transition-transform duration-200', !open && 'rotate-180')}
              />
            </CollapsibleTrigger>

            <CollapsibleContent>
              {controls.type === 'controls' && (
                <div className="flex items-center gap-3 flex-wrap p-5 font-semibold border-t last:rounded-bl-xl last:rounded-br-xl bg-[#f9f9f9]">
                  {controls.data.map(({ id, score }) => (
                    <Link
                      key={id}
                      to={generatePath(ROUTES.control, { controlId: id })}
                      style={{ '--compliance': getComplianceColor(score) }}
                      className="flex items-center justify-center h-10 px-4 rounded-md bg-compliance/20 hover:bg-compliance/25"
                    >
                      {id}
                    </Link>
                  ))}
                </div>
              )}

              {controls.type === 'subcategories' &&
                controls.data.map(({ name, score, controls }) => (
                  <div
                    key={name}
                    className="grid gap-3 p-5 font-semibold border-t last:rounded-bl-xl last:rounded-br-xl bg-[#f9f9f9]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ '--compliance': getComplianceColor(score) }}
                        className="h-2.5 w-2.5 rounded-full bg-compliance"
                      />
                      <span className="text-gray-900">{name}</span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {controls.map(({ id, score }) => (
                        <Link
                          key={id}
                          to={generatePath(ROUTES.control, { controlId: id })}
                          style={{ '--compliance': getComplianceColor(score) }}
                          className="flex items-center justify-center h-10 px-4 rounded-md bg-compliance/20 hover:bg-compliance/25"
                        >
                          {id}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </CollapsibleContent>
          </div>
        </div>
      </div>
    </Collapsible>
  )
}

export default ControlItem
