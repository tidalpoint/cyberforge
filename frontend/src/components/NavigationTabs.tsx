import { useLocation } from 'react-router-dom'
import HomeIcon from '@/components/icons/HomeIcon'
import ReportIcon from '@/components/icons/ReportIcon'
import ShieldIcon from '@/components/icons/ShieldIcon'
import { ROUTES } from '@/constants/routes'
import RocketIcon from './icons/RocketIcon'
import { Tabs, TabsLinkTrigger, TabsList } from './ui/tabs'

const TABS = {
  overview: { value: 'overview', label: 'Overview', href: ROUTES.home, icon: HomeIcon },
  compliance: { value: 'compliance', label: 'Compliance', href: ROUTES.compliance, icon: ShieldIcon },
  documents: { value: 'improve', label: 'Policy Improver', href: ROUTES.documents, icon: RocketIcon },
  improve: { value: 'pipeda', label: 'PIPEDA Results', href: ROUTES.pipeda, icon: ReportIcon },
}

const NavigationTabs = () => {
  const { pathname } = useLocation()

  return (
    <Tabs defaultValue={pathname} className="overflow-x-auto">
      <TabsList className="h-full mt-5 mb-7 border rounded-xl p-1.5 w-full">
        {Object.values(TABS).map(({ value, label, href, icon: Icon }) => (
          <TabsLinkTrigger key={value} href={href}>
            <Icon className="h-6 shrink-0" />
            {label}
          </TabsLinkTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export default NavigationTabs
