import { useMemo } from 'react'
import NavigationTabs from '@/components/NavigationTabs'
import SelectedFrameworkCard from '@/components/SelectedFrameworkCard'
import ThreatCard from '@/components/ThreatCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetActiveFramework } from '@/queries/useGetActiveFramework'
import { useGetThreats } from '@/queries/useGetThreats'
import { getGreeting } from '@/utils/getGreeting'

const HomePage = () => {
  const { data: threats } = useGetThreats()
  const { data: activeFramework } = useGetActiveFramework()

  const sortedThreats = useMemo(() => {
    return threats ? [...threats].sort((a, b) => a.score - b.score) : []
  }, [threats])

  return (
    <div className="max-w-page mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">{getGreeting()}</h1>
      <h2 className="md:text-lg font-medium text-gray-700">Here's an overview of your security posture</h2>

      <NavigationTabs />

      <h3 className="text-lg text-gray-900 font-semibold mb-2">Your Top Threats</h3>

      {!!sortedThreats.length ? (
        <div className="grid gap-2">
          {sortedThreats.map((threat, idx) => (
            <ThreatCard key={threat.id} threat={threat} rank={idx + 1} />
          ))}
        </div>
      ) : (
        <div className="grid gap-2">
          <Skeleton className="h-[148px] rounded-lg" />

          {Array.from({ length: 4 }).map(() => (
            <Skeleton className="h-[60px] rounded-lg" />
          ))}
        </div>
      )}

      {activeFramework?.frameworkId && <SelectedFrameworkCard frameworkId={activeFramework.frameworkId} />}
    </div>
  )
}

export default HomePage
