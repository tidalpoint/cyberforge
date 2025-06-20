import { FC } from 'react'
import { ControlType } from '@/types/Control'
import { formatCategorizedControls, formatNestedControls } from '@/utils/formatControls'
import ControlItem from './ControlItem'
import { CategorizedControlType } from './Controls'

type Props = {
  controls: CategorizedControlType[]
}

const CategorizedControls: FC<Props> = ({ controls }) => {
  return (
    <div className="grid gap-4 pt-8">
      {Object.entries(formatCategorizedControls(controls)).map(([category, { score, controls }]) => (
        <ControlItem key={category} name={category} score={score} controls={{ type: 'controls', data: controls }} />
      ))}
    </div>
  )
}

export default CategorizedControls
