import { FC } from 'react'
import { ControlType } from '@/types/Control'

type Props = {
  controls: ControlType[]
}

const SimpleControls: FC<Props> = ({ controls }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button className="btn btn-primary">Button 1</button>
        <button className="btn btn-secondary">Button 2</button>
      </div>
      <div className="flex gap-2">
        <input type="text" placeholder="Input 1" className="input input-bordered" />
        <input type="text" placeholder="Input 2" className="input input-bordered" />
      </div>
    </div>
  )
}

export default SimpleControls
