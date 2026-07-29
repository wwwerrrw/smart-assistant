import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { useApp } from './context/AppContext'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { AssessmentPage } from './pages/AssessmentPage'
import { ConsultationPage } from './pages/ConsultationPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { ArticlePage } from './pages/ArticlePage'
import { AssistantPage } from './pages/AssistantPage'
import { ProfilePage } from './pages/ProfilePage'

const ChatPage = lazy(() => import('./pages/ChatPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const PlansPage = lazy(() => import('./pages/PlansPage'))

function ProtectedApp() {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />

  return (
    <AppShell>
      <Suspense fallback={<div className="page-loading">正在载入...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/doctors" element={<ConsultationPage />} />
          <Route path="/doctors/:doctorId" element={<ChatPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:articleId" element={<ArticlePage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}

export default function App() {
  const { user } = useApp()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedApp />} />
    </Routes>
  )
}
