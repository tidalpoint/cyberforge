import { FC } from 'react'
import { ControlType } from '@/types/Control'
import CategorizedControls from './CategorizedControls'
import NestedCategorizedControls from './NestedCategorizedControls'
import SimpleControls from './SimpleControls'

export type NestedControlType = ControlType & { category: string; subcategory: string }
export type CategorizedControlType = ControlType & { category: string }

type Props = {
  controls: ControlType[]
}

const Controls: FC<Props> = ({ controls }) => {
  if (controls[0].category && controls[0].subcategory) {
    return <NestedCategorizedControls controls={controls as NestedControlType[]} />
  }

  if (controls[0].category) {
    return <CategorizedControls controls={controls as CategorizedControlType[]} />
  }

  return <SimpleControls controls={controls} />
}

export default Controls
