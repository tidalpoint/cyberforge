import { FC } from 'react'
import { formatNestedControls } from '@/utils/formatControls'
import ControlItem from './ControlItem'
import { NestedControlType } from './Controls'

type Props = {
  controls: NestedControlType[]
}

const NestedCategorizedControls: FC<Props> = ({ controls }) => {
  return (
    <div className="grid gap-4 pt-8">
      {Object.entries(formatNestedControls(controls)).map(([category, { score, subcategories }]) => (
        <ControlItem
          key={category}
          name={category}
          score={score}
          controls={{ type: 'subcategories', data: subcategories }}
        />
      ))}
    </div>
  )
}

export default NestedCategorizedControls
