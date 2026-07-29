import { Bot, BrainCircuit, Database, FileHeart, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { ChatPanel } from '../components/ChatPanel'
import { PageHeader } from '../components/PageHeader'
import { useAssistantStatus } from '../lib/assistant'

export function AssistantPage() {
  const [chatting, setChatting] = useState(false)
  const { status, sourceCounts } = useAssistantStatus()
  const configured = status?.configured === true

  return (
    <div className="assistant-page">
      <PageHeader title="AI 智能助手" />
      {!chatting ? <div className="assistant-intro">
        <section className="assistant-hero"><div className="assistant-orbit"><Bot size={48} /></div><h1>糖护智能助手</h1><p>由 Dify 工作流连接 DeepSeek，结合项目糖尿病知识资料提供健康教育问答。</p></section>
        <div className={`connection-banner ${configured ? 'connection-banner--online' : ''}`}><span className="status-dot" /><div><strong>{status === null ? '正在检查连接' : configured ? 'Dify 服务已连接' : 'Dify 服务未连接'}</strong><small>{configured ? '可以开始知识库问答' : '未配置密钥时不提供本地模拟回答'}</small></div></div>
        <section className="assistant-capabilities"><h2>核心能力</h2><div><span><BrainCircuit /><p><strong>知识问答</strong><small>通过 DeepSeek 理解健康问题</small></p></span><span><Database /><p><strong>资料检索</strong><small>{sourceCounts.knowledgeDocuments || 6} 份项目知识文档</small></p></span><span><FileHeart /><p><strong>风险教育</strong><small>解释常见风险与生活建议</small></p></span><span><ShieldCheck /><p><strong>安全边界</strong><small>不替代诊断、处方或急诊</small></p></span></div></section>
        <button className="primary-button assistant-start" type="button" onClick={() => setChatting(true)}>进入智能问答 <Sparkles size={18} /></button>
      </div> : <div className="assistant-chat"><div className={`connection-banner ${configured ? 'connection-banner--online' : ''}`}><span className="status-dot" /><div><strong>{configured ? 'Dify 服务已连接' : 'Dify 服务未连接'}</strong><small>{configured ? '回答将由项目工作流生成' : '请配置服务端环境变量后使用'}</small></div></div><ChatPanel enabled={configured} initialMessage="您好，我是糖护智能助手。您可以咨询糖尿病饮食、运动和生活管理知识。" suggested={['2 型糖尿病日常饮食需要注意什么？', '运动前后怎样预防低血糖？', '妊娠期血糖管理有哪些重点？']} /></div>}
    </div>
  )
}
