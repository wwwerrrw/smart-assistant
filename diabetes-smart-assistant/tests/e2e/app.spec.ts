import { expect, test, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

async function login(page: Page) {
  await page.goto('/login')
  await expect(page).toHaveTitle('糖护 - 糖尿病预治智能助手')
  await page.getByRole('button', { name: '进入健康中心' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: /孙铭炜，今天也要照顾好自己/ })).toBeVisible()
}

async function capture(page: Page, projectName: string, name: string) {
  const screenshotDir = resolve(process.cwd(), 'artifacts', 'screenshots')
  await mkdir(screenshotDir, { recursive: true })
  await page.screenshot({ path: resolve(screenshotDir, `${projectName}-${name}.png`), fullPage: false })
}

function trackBrowserErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

test('core health workflow and evidence screenshot', async ({ page }, testInfo) => {
  const browserErrors = trackBrowserErrors(page)
  await login(page)
  await expect(page.getByRole('link', { name: /健康评估/ }).first()).toBeVisible()
  await expect(page.getByText('专业医生团队')).toBeVisible()
  await expect(page.locator('img')).toHaveCount(7)
  expect(await page.locator('img').evaluateAll((images) => images.every((image) => (image as HTMLImageElement).naturalWidth > 0))).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  if (testInfo.project.name.startsWith('mobile')) {
    await expect(page.getByRole('navigation', { name: '移动端主导航' })).toBeVisible()
  }

  await capture(page, testInfo.project.name, 'home')

  await page.goto('/assessment')
  await page.getByRole('button', { name: '生成评估结果' }).click()
  await expect(page.getByText('评估结果')).toBeVisible()
  await expect(page.getByText('较低风险')).toBeVisible()
  await capture(page, testInfo.project.name, 'assessment-result')

  await page.goto('/plans')
  await page.getByRole('button', { name: '均衡早餐打卡' }).click()
  await expect(page.getByRole('button', { name: '均衡早餐取消打卡' })).toBeVisible()
  await page.getByRole('tab', { name: '趋势' }).click()
  await expect(page.getByText('近 7 日打卡趋势')).toBeVisible()
  await capture(page, testInfo.project.name, 'plan-trend')
  expect(browserErrors).toEqual([])
})

test('Dify stays visibly unavailable without credentials and API returns 503', async ({ page, request }, testInfo) => {
  const browserErrors = trackBrowserErrors(page)
  await login(page)
  await page.goto('/assistant')
  await expect(page.getByText('Dify 服务未连接')).toBeVisible()
  await page.getByRole('button', { name: /进入智能问答/ }).click()
  await expect(page.getByRole('textbox', { name: '输入问题' })).toBeDisabled()
  await expect(page.getByText('Dify 服务未连接，配置完成后即可开始问答。')).toBeVisible()

  const response = await request.post('/api/assistant', { data: { message: '测试问题', userId: 'e2e-user' } })
  expect(response.status()).toBe(503)
  expect(await response.json()).toMatchObject({ error: /Dify 服务尚未配置/ })

  const sources = await request.get('/api/project-sources')
  expect(sources.status()).toBe(200)
  expect(await sources.json()).toMatchObject({ knowledge_sources: { length: 6 }, database_tables: { length: 9 } })

  await capture(page, testInfo.project.name, 'assistant-unconfigured')
  expect(browserErrors).toEqual([])
})

test('health article favorite is reflected in the profile', async ({ page }) => {
  const browserErrors = trackBrowserErrors(page)
  await login(page)
  await page.goto('/articles')
  await page.getByLabel('搜索健康资讯').fill('饮食')
  await page.getByRole('link', { name: /糖尿病患者的日常饮食指南/ }).click()
  await page.getByRole('button', { name: '收藏文章' }).click()
  await expect(page.getByRole('button', { name: '取消收藏' })).toBeVisible()
  await page.goto('/profile')
  await expect(page.getByText('内容收藏').locator('..').getByText('1')).toBeVisible()
  await expect(page.getByText('项目开发：孙铭炜')).toBeVisible()
  expect(browserErrors).toEqual([])
})

test('management search and doctor consultation submission work', async ({ page }, testInfo) => {
  const browserErrors = trackBrowserErrors(page)
  await login(page)
  await page.goto('/admin')
  await page.getByLabel('搜索管理数据').fill('孙铭炜')
  await expect(page.getByText('138****0000')).toBeVisible()
  await page.getByRole('button', { name: '停用孙铭炜' }).click()
  await expect(page.getByText('停用')).toBeVisible()
  await capture(page, testInfo.project.name, 'admin')

  await page.goto('/doctors/zhao')
  await page.getByLabel('咨询内容').fill('想了解日常饮食记录的方法')
  await page.getByRole('button', { name: '发送咨询' }).click()
  await expect(page.getByText('留言已提交，等待医生通过真实问诊服务回复。')).toBeVisible()
  await capture(page, testInfo.project.name, 'consultation')
  expect(browserErrors).toEqual([])
})
