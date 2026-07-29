const STORAGE_KEY = 'tanghu-app-state-v1'

export interface PersistedState {
  user: { name: string; phone: string; avatar: string } | null
  assessment: unknown
  completedPlanIds: string[]
  favoriteArticleIds: string[]
}

const emptyState: PersistedState = {
  user: null,
  assessment: null,
  completedPlanIds: [],
  favoriteArticleIds: [],
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...emptyState, ...JSON.parse(raw) } : emptyState
  } catch {
    return emptyState
  }
}

export function saveState(state: PersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
