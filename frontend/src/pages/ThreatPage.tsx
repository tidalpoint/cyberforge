import { useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import Controls from '@/components/controls/Controls'
import { ROUTES } from '@/constants/routes'
import { useGetThreat } from '@/queries/useGetThreat'

const ThreatPage = () => {
  const { threatId } = useParams()
  const { data: threat } = useGetThreat({ threatId })

  if (!threat) {
    return null
  }

  return (
    <div>
      <PageHeader
        header={threat.name}
        subheader={threat.short_desc}
        breadcrumbs={[
          { href: ROUTES.home, text: 'Home' },
          { href: '', text: threat.name },
        ]}
      />

      <div className="border-b">
        <div className="max-w-page mx-auto grid gap-12 px-4 py-12">
          <div className="grid gap-1">
            <h2 className="text-lg font-bold text-gray-800">Overview</h2>
            <p className="font-medium text-gray-700">{threat.long_desc}</p>
          </div>

          <div className="grid gap-1">
            <h2 className="text-lg font-bold text-gray-800">Why you're at risk</h2>
            <p className="font-medium text-gray-700">{threat.reason}</p>
          </div>
        </div>
      </div>

      <div className="max-w-page mx-auto px-4 py-12">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Relevant Controls</h2>

        <Controls controls={threat.controls} />
      </div>
    </div>
  )
}

export default ThreatPage
