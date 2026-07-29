# 阶段 1 交接说明

项目开发：孙铭炜

## 本阶段完成

- 完成 React 19 + Vite + TypeScript 移动优先应用。
- 完成登录、首页健康概览、健康风险评估、饮食/运动方案与打卡趋势、医生咨询、健康资讯与收藏、AI 助手、个人中心和基础管理台。
- 本地状态通过 `localStorage` 持久化登录、评估结果、打卡和收藏。
- AI 问答只允许调用 Dify 聊天 API；未配置或服务异常时返回 `503`，没有本地回答兜底。
- 6 份 DOCX 已抽取为 37 个知识片段，供 Dify 知识库导入。
- `db.txt` 已解析为 9 张表的数据模型，用于管理台模块和数据字段；全部资料 SHA-256 写入 `server/project-sources.json`。
- 完成 4 个单元测试与 8 个桌面/手机端端到端测试。

## 验证结果

| 命令 | 结果 |
| --- | --- |
| `npm run check` | 通过，2 个测试文件、4 个测试 |
| `npm run build` | 通过，无大包警告；趋势页已按需加载 |
| `npm run test:e2e` | 通过，桌面 Edge + Pixel 7，共 8 个测试 |

端到端覆盖：登录、首页图片加载、无横向溢出、风险评估、计划打卡、趋势图、Dify 未连接态、API 503、资料清单 6/9、资讯收藏、个人中心同步、管理台搜索与启停、医生留言，以及浏览器控制台/页面异常为零。

应用内浏览器技能在本阶段任务中缺少所需的浏览器连接工具，无法建立会话；因此按任务授权使用项目 Playwright + 本机 Edge 完成等价的页面、交互、控制台和截图验证。

## 运行地址

- 开发前端：`http://127.0.0.1:5173`
- 开发 API：`http://127.0.0.1:8787`
- 生产构建由 API 托管时：`http://127.0.0.1:8787`

## Dify 行为

配置 `DIFY_API_URL` 和 `DIFY_API_KEY` 后，`POST /api/assistant` 调用 `${DIFY_API_URL}/chat-messages`。未配置时：

- `GET /api/health` 返回 `assistant.provider = "unconfigured"`。
- `POST /api/assistant` 返回 HTTP 503。
- 前端显示“Dify 服务未连接”，问答输入框不可用。
- 健康评估、打卡、资讯、咨询留言和管理台仍可正常使用。

## 截图清单

目录：`artifacts/screenshots`

- `desktop-edge-home.png`
- `desktop-edge-assessment-result.png`
- `desktop-edge-plan-trend.png`
- `desktop-edge-assistant-unconfigured.png`
- `desktop-edge-admin.png`
- `desktop-edge-consultation.png`
- `mobile-edge-home.png`
- `mobile-edge-assessment-result.png`
- `mobile-edge-plan-trend.png`
- `mobile-edge-assistant-unconfigured.png`
- `mobile-edge-admin.png`
- `mobile-edge-consultation.png`

这些截图来自真实 Playwright 页面运行，可直接供后续 Word、PPT 和测试报告阶段引用。

## 后续文档可引用的技术事实

- 前端：React 19、React Router、TypeScript、Vite、Lucide、Recharts。
- 服务端：Node.js、Express 5、Zod、Dify HTTP API。
- AI：Dify 工作流编排，DeepSeek 模型，6 份糖尿病知识文档。
- 数据模型：`db.txt` 中 9 张 SQLite 表，覆盖用户、医生、资讯、糖尿病类型、收藏、风险、生活方案、建议和打卡。
- 测试：Vitest + Playwright；桌面视口 `1440x1000`，移动设备 Pixel 7。
- 安全边界：密钥仅在服务端环境变量中读取；AI 未连接不降级为本地模拟回答；所有健康内容均注明不替代诊断。
