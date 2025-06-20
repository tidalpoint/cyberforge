import NavigationTabs from '@/components/NavigationTabs'
import StatCard from '@/components/StatCard'
import Controls from '@/components/controls/Controls'
import { useGetCompliance } from '@/queries/useGetCompliance'
import { useGetControls } from '@/queries/useGetControls'
import { getGreeting } from '@/utils/getGreeting'

const CompliancePage = () => {
  const { data: compliance } = useGetCompliance()
  const { data: controls } = useGetControls()

  return (
    <div className="max-w-page mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">{getGreeting()}</h1>
      <h2 className="md:text-lg font-medium text-gray-700">Here's an overview of your security posture</h2>

      <NavigationTabs />

      {compliance && (
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard title="Major Deficiency" count={compliance.major} type="Major" />
          <StatCard title="Minor Deficiency" count={compliance.minor} type="Minor" />
          <StatCard title="Compliant" count={compliance.compliant} type="Compliant" />
        </div>
      )}

      {controls && <Controls controls={controls} />}
    </div>
  )
}

export default CompliancePage
