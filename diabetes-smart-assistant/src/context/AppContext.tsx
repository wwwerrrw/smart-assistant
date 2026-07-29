import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AssessmentResult, UserProfile } from '../types'
import { loadState, saveState } from '../lib/storage'

interface AppContextValue {
  user: UserProfile | null
  assessment: AssessmentResult | null
  completedPlanIds: Set<string>
  favoriteArticleIds: Set<string>
  login: (name: string, phone: string) => void
  logout: () => void
  setAssessment: (result: AssessmentResult) => void
  togglePlan: (id: string) => void
  toggleFavorite: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => loadState(), [])
  const [user, setUser] = useState<UserProfile | null>(initial.user)
  const [assessment, setAssessment] = useState<AssessmentResult | null>(
    initial.assessment as AssessmentResult | null,
  )
  const [completedPlanIds, setCompletedPlanIds] = useState(
    () => new Set(initial.completedPlanIds),
  )
  const [favoriteArticleIds, setFavoriteArticleIds] = useState(
    () => new Set(initial.favoriteArticleIds),
  )

  useEffect(() => {
    saveState({
      user,
      assessment,
      completedPlanIds: [...completedPlanIds],
      favoriteArticleIds: [...favoriteArticleIds],
    })
  }, [user, assessment, completedPlanIds, favoriteArticleIds])

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      assessment,
      completedPlanIds,
      favoriteArticleIds,
      login: (name, phone) =>
        setUser({ name: name.trim() || '体验用户', phone, avatar: name.trim().slice(0, 1) || '糖' }),
      logout: () => {
        setUser(null)
        setAssessment(null)
        setCompletedPlanIds(new Set())
        setFavoriteArticleIds(new Set())
      },
      setAssessment,
      togglePlan: (id) =>
        setCompletedPlanIds((current) => {
          const next = new Set(current)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        }),
      toggleFavorite: (id) =>
        setFavoriteArticleIds((current) => {
          const next = new Set(current)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        }),
    }),
    [assessment, completedPlanIds, favoriteArticleIds, user],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useApp must be used within AppProvider')
  return value
}
