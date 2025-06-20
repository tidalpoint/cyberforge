import { ControlType } from './Control'

export type ThreatType = {
  id: string
  name: string
  short_desc: string
  long_desc: string
  reason: string
  score: number
  controls: ControlType[]
}
