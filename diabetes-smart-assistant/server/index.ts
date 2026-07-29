import express from 'express'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ZodError } from 'zod'
import { readFileSync } from 'node:fs'
import { answerQuestion, AssistantUnavailableError, getAssistantStatus } from './assistant.js'

const app = express()
const port = Number(process.env.PORT || 8787)
const currentDir = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(currentDir, '../dist')
const projectSources = JSON.parse(
  readFileSync(resolve(currentDir, 'project-sources.json'), 'utf8'),
) as { knowledge_sources: unknown[]; database_tables: unknown[] }

app.use(express.json({ limit: '64kb' }))

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    assistant: getAssistantStatus(),
    sources: {
      knowledgeDocuments: projectSources.knowledge_sources.length,
      databaseTables: projectSources.database_tables.length,
    },
  })
})

app.get('/api/project-sources', (_request, response) => {
  response.json(projectSources)
})

app.post('/api/assistant', async (request, response) => {
  try {
    response.json(await answerQuestion(request.body))
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: '请求内容不完整或超出长度限制。' })
      return
    }
    if (error instanceof AssistantUnavailableError) {
      response.status(503).json({ error: error.message })
      return
    }
    console.error(error)
    response.status(500).json({ error: '助手服务暂时不可用。' })
  }
})

if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.use((_request, response) => response.sendFile(resolve(distDir, 'index.html')))
}

app.listen(port, '127.0.0.1', () => {
  console.log(`Diabetes assistant API listening on http://127.0.0.1:${port}`)
})
