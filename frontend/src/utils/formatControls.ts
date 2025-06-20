import { CategorizedControlType, NestedControlType } from '@/components/controls/Controls'
import { ControlType } from '@/types/Control'

export const formatNestedControls = (controls: NestedControlType[]) => {
  return controls.reduce(
    (acc, control) => {
      if (!acc[control.category]) {
        acc[control.category] = { subcategories: [], score: 0 }
      }

      // Find if the subcategory already exists
      let subcategory = acc[control.category].subcategories.find((sub) => sub.name === control.subcategory)

      if (!subcategory) {
        // Create a new subcategory if it doesn't exist
        subcategory = { name: control.subcategory, controls: [], score: 0 }
        acc[control.category].subcategories.push(subcategory)
      }

      // Add the control to the subcategory
      subcategory.controls.push(control)

      // Recalculate subcategory average
      subcategory.score = subcategory.controls.reduce((sum, ctrl) => sum + ctrl.score, 0) / subcategory.controls.length

      // Recalculate category average
      const allControls = acc[control.category].subcategories.flatMap((sub) => sub.controls)
      acc[control.category].score = allControls.reduce((sum, ctrl) => sum + ctrl.score, 0) / allControls.length

      return acc
    },
    {} as Record<string, { subcategories: { name: string; controls: ControlType[]; score: number }[]; score: number }>,
  )
}

export const formatCategorizedControls = (controls: CategorizedControlType[]) => {
  return controls.reduce(
    (acc, control) => {
      if (!acc[control.category]) {
        acc[control.category] = { controls: [], score: 0 }
      }

      // Add the control to the category
      acc[control.category].controls.push(control)

      // Recalculate category average score
      acc[control.category].score =
        acc[control.category].controls.reduce((sum, ctrl) => sum + ctrl.score, 0) /
        acc[control.category].controls.length

      return acc
    },
    {} as Record<string, { controls: ControlType[]; score: number }>,
  )
}
