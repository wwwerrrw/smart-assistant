import { afterEach, describe, expect, it } from 'vitest'
import { answerQuestion, AssistantUnavailableError, getAssistantStatus } from './assistant.js'

const originalUrl = process.env.DIFY_API_URL
const originalKey = process.env.DIFY_API_KEY

afterEach(() => {
  if (originalUrl === undefined) delete process.env.DIFY_API_URL
  else process.env.DIFY_API_URL = originalUrl
  if (originalKey === undefined) delete process.env.DIFY_API_KEY
  else process.env.DIFY_API_KEY = originalKey
})

describe('Dify-only assistant boundary', () => {
  it('reports unconfigured without server credentials', async () => {
    delete process.env.DIFY_API_URL
    delete process.env.DIFY_API_KEY

    expect(getAssistantStatus()).toEqual({ configured: false, provider: 'unconfigured' })
    await expect(answerQuestion({ message: '糖尿病饮食需要注意什么？' })).rejects.toBeInstanceOf(AssistantUnavailableError)
  })

  it('rejects invalid requests before contacting a provider', async () => {
    await expect(answerQuestion({ message: '' })).rejects.toMatchObject({ name: 'ZodError' })
  })
})
