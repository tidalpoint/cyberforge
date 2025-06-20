import { FC, useEffect } from 'react'
import { matchPath, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { HIDE_RISA_ROUTES } from '@/constants'
import { ROUTES } from '@/constants/routes'
import { useGetActiveFramework } from '@/queries/useGetActiveFramework'
import RisaFloating from './RisaFloating'

const AppLayout: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { data, isFetching } = useGetActiveFramework()

  // Redirect to onboarding if no active framework is selected
  useEffect(() => {
    if (!data || isFetching) return

    if (!data?.frameworkId) {
      navigate(ROUTES.onboarding)
    }
  }, [data, isFetching])

  if (!data?.frameworkId) {
    return null
  }

  return (
    <main className="h-dvh w-full">
      <Outlet />
      {!HIDE_RISA_ROUTES.some((route) => matchPath(route, location.pathname)) && <RisaFloating />}
    </main>
  )
}

export default AppLayout
