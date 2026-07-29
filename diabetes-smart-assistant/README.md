# 糖护 - 糖尿病预治智能助手

课程项目“DeepSeek+Dify 智能体开发——糖尿病预治智能助手开发实践”的移动优先 Web 应用，项目开发者为孙铭炜。

应用包含登录、健康概览、风险评估、饮食/运动方案与打卡趋势、医生咨询、健康资讯、Dify 智能助手、个人中心和基础管理台。健康评估等确定性功能在本地运行；AI 问答只通过 Dify 工作流调用 DeepSeek，不提供无密钥本地回答。

## 资料使用

- `资料分享/知识库` 中 6 份 DOCX 全部由 `scripts/extract_knowledge.py` 抽取为 `server/knowledge.json`，作为 Dify 知识库导入资料。
- `资料分享/知识库/db.txt` 解析为 9 张表的数据模型，用于管理台模块、数据字段和项目数据字典。
- `server/project-sources.json` 记录全部 7 份资料的 SHA-256、知识片段数和数据库表清单，可用于交付核验。

重新生成资料清单：

```powershell
& 'C:\Users\LENOVO\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' .\scripts\extract_knowledge.py
```

## 本地运行

```powershell
npm install
npm run dev
```

前端地址：`http://127.0.0.1:5173`

API 地址：`http://127.0.0.1:8787`

登录页已预填课程演示账号，数据只保存在当前浏览器。

## Dify 接入

复制 `.env.example` 为 `.env`，配置服务端变量：

```dotenv
DIFY_API_URL=https://your-dify-host.example/v1
DIFY_API_KEY=your-server-side-key
PORT=8787
```

密钥仅由 Node 服务读取，不会打包到浏览器。未配置或调用失败时，`POST /api/assistant` 返回 `503`，页面明确显示“Dify 服务未连接”，不会回退到本地模拟回答。

在 Dify 中创建聊天应用，选择 DeepSeek 模型，将上述 6 份 DOCX 导入知识库并在工作流中连接知识检索节点；服务地址应指向 Dify 的 `/v1` API 根路径。

## 验证

```powershell
npm run check
npm run build
npm run test:e2e
```

Playwright 同时覆盖 `1440x1000` 桌面视图和 Pixel 7 手机视图，证据截图输出到 `artifacts/screenshots`。

风险评估、资讯和问答内容只用于课程演示和健康教育，不能替代医生诊断、处方或急诊建议。
