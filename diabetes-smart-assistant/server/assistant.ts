import { z } from 'zod'

const requestSchema = z.object({
  message: z.string().trim().min(1).max(1200),
  userId: z.string().trim().min(1).max(120).default('demo-user'),
})

export class AssistantUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AssistantUnavailableError'
  }
}

export function getAssistantStatus() {
  const baseUrl = process.env.DIFY_API_URL?.trim().replace(/\/$/, '')
  const apiKey = process.env.DIFY_API_KEY?.trim()
  return {
    configured: Boolean(baseUrl && apiKey),
    provider: baseUrl && apiKey ? ('dify' as const) : ('unconfigured' as const),
  }
}

async function difyAnswer(message: string, userId: string) {
  const baseUrl = process.env.DIFY_API_URL?.trim().replace(/\/$/, '')
  const apiKey = process.env.DIFY_API_KEY?.trim()
  if (!baseUrl || !apiKey) {
    throw new AssistantUnavailableError('Dify 服务尚未配置，请先设置服务端环境变量。')
  }

  let response: Response
  try {
    response = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        user: userId,
      }),
      signal: AbortSignal.timeout(30_000),
    })
  } catch {
    throw new AssistantUnavailableError('无法连接 Dify 服务，请检查地址、网络和工作流状态。')
  }

  if (!response.ok) {
    throw new AssistantUnavailableError(`Dify 服务请求失败（HTTP ${response.status}）。`)
  }

  const data = (await response.json()) as { answer?: string; metadata?: { retriever_resources?: Array<{ document_name?: string }> } }
  const sources = data.metadata?.retriever_resources
    ?.map((item) => item.document_name)
    .filter((item): item is string => Boolean(item)) ?? []

  return {
    answer: data.answer?.trim() || 'Dify 未返回有效内容。',
    sources: [...new Set(sources)],
    provider: 'dify' as const,
  }
}

export async function answerQuestion(payload: unknown) {
  const { message, userId } = requestSchema.parse(payload)
  return difyAnswer(message, userId)
}
