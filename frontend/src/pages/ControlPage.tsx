import { useParams } from 'react-router-dom'
import { CheckIcon } from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'
import ControlsProgressDial from '@/components/ControlsProgressDial'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { useGetControl } from '@/queries/useGetControl'
import { getCompliance } from '@/utils/getCompliance'
import { getComplianceColor } from '@/utils/getComplianceColor'

const ControlPage = () => {
  const { controlId } = useParams()

  const { data: control } = useGetControl({ controlId })

  if (!control) {
    return null
  }

  return (
    <div>
      <PageHeader
        header={control.name}
        subheader={control.description}
        breadcrumbs={[
          { href: ROUTES.compliance, text: 'Compliance' },
          { href: '', text: control.name },
        ]}
      />

      <div
        style={{ '--compliance': getComplianceColor(control.score) }}
        className="grid gap-12 max-w-page mx-auto px-4 py-12"
      >
        <Card className="bg-compliance/15 px-5 py-6 relative border-none">
          <ControlsProgressDial score={control.score} className="absolute top-3 right-3" showLabel />

          <div className="flex items-center gap-3 text-compliance">
            <SparklesIcon className="h-6 w-6" />
            <span className="font-bold text-lg">RiskAssist's Assessment</span>
          </div>

          <p className="text-gray-900 font-semibold text-lg mt-6 mb-2">
            {getCompliance(control.score) === 'COMPLIANT' && 'This control is Compliant'}
            {getCompliance(control.score) === 'MINOR' && 'This control has a Minor Deficiency'}
            {getCompliance(control.score) === 'MAJOR' && 'This control has a Major Deficiency'}
          </p>

          <p className="text-gray-800 font-medium">{control.reason}</p>
        </Card>

        {control.actions && (
          <div className="grid gap-2">
            <h2 className="text-lg font-bold">How To Improve</h2>

            <Card>
              {control.actions.map((action) => (
                <div className="flex items-center gap-4 border-b last:border-none p-4">
                  <div className="h-8 w-8 bg-primary/15 rounded-full flex items-center justify-center border border-[rgba(0,0,0,0.05)] shrink-0">
                    <CheckIcon className="h-4 w-4 stroke-[2.5] text-primary" />
                  </div>
                  <span className="text-gray-700 font-semibold">{action}</span>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ControlPage
