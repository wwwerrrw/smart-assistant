import { useEffect, useState } from 'react'
import type { AssistantStatus } from '../types'

interface HealthPayload {
  assistant?: AssistantStatus
  sources?: { knowledgeDocuments: number; databaseTables: number }
}

const disconnected: AssistantStatus = { configured: false, provider: 'unconfigured' }

export function useAssistantStatus() {
  const [status, setStatus] = useState<AssistantStatus | null>(null)
  const [sourceCounts, setSourceCounts] = useState({ knowledgeDocuments: 0, databaseTables: 0 })

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/health', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('health unavailable')
        return response.json() as Promise<HealthPayload>
      })
      .then((payload) => {
        setStatus(payload.assistant ?? disconnected)
        if (payload.sources) setSourceCounts(payload.sources)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus(disconnected)
      })
    return () => controller.abort()
  }, [])

  return { status, sourceCounts }
}
