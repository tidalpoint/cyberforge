import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ROUTES } from '@/constants/routes'
import { ChatPage, HomePage, OnboardingPage, ThreatPage } from '@/pages'
import AppLayout from './components/AppLayout'
import { ScrollToTop } from './components/ScrollToTop'
import './globals.css'
import CompliancePage from './pages/CompliancePage'
import ControlPage from './pages/ControlPage'
import DocumentsPage from './pages/DocumentsPage'
import ImprovePage from './pages/ImprovePage'
import NewChatPage from './pages/NewChatPage'
import QuestionnairePage from './pages/QuestionnairePage'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <Toaster />

        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.compliance} element={<CompliancePage />} />
            <Route path={ROUTES.documents} element={<DocumentsPage />} />
            <Route path={ROUTES.improve} element={<ImprovePage />} />
            <Route path={ROUTES.pipeda} element={<QuestionnairePage />} />
            <Route path={ROUTES.threat} element={<ThreatPage />} />
            <Route path={ROUTES.control} element={<ControlPage />} />
            <Route path={ROUTES.newChat} element={<NewChatPage />} />
            <Route path={ROUTES.chat} element={<ChatPage />} />
          </Route>

          <Route path={ROUTES.onboarding} element={<OnboardingPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
