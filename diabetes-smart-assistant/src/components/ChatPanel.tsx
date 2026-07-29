import { useRef, useState, type FormEvent } from 'react'
import { LoaderCircle, Send, Sparkles } from 'lucide-react'
import type { ChatMessage } from '../types'

interface ChatPanelProps {
  initialMessage: string
  title?: string
  avatar?: string
  suggested?: string[]
  enabled?: boolean
  unavailableMessage?: string
}

export function ChatPanel({
  initialMessage,
  title = '糖护助手',
  avatar,
  suggested = [],
  enabled = true,
  unavailableMessage = 'Dify 服务未连接，配置完成后即可开始问答。',
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: initialMessage },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const requestId = useRef(0)

  const send = async (content: string) => {
    const message = content.trim()
    if (!message || loading || !enabled) return
    const currentRequest = ++requestId.current
    setMessages((current) => [
      ...current,
      { id: `user-${currentRequest}`, role: 'user', content: message },
    ])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userId: 'demo-user' }),
      })
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || '助手服务暂时不可用。')
      }
      const data = (await response.json()) as { answer: string; sources?: string[] }
      setMessages((current) => [
        ...current,
        { id: `assistant-${currentRequest}`, role: 'assistant', content: data.answer, sources: data.sources },
      ])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `error-${currentRequest}`,
          role: 'assistant',
          content: error instanceof Error ? error.message : '助手服务暂时不可用。',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    void send(input)
  }

  return (
    <section className="chat-panel" aria-label={`${title}对话`}>
      <div className="chat-stream" aria-live="polite">
        {messages.map((message) => (
          <div className={`chat-message chat-message--${message.role}`} key={message.id}>
            {message.role === 'assistant' ? (
              avatar ? <img src={avatar} alt="" /> : <span className="chat-avatar"><Sparkles size={17} /></span>
            ) : null}
            <div className="chat-bubble">
              <p>{message.content}</p>
              {message.sources?.length ? (
                <small>参考：{message.sources.join('、')}</small>
              ) : null}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="chat-message chat-message--assistant">
            <span className="chat-avatar"><Sparkles size={17} /></span>
            <div className="chat-bubble chat-bubble--loading"><LoaderCircle className="spin" size={18} /> 正在检索知识库</div>
          </div>
        ) : null}
      </div>
      {!enabled ? <div className="chat-unavailable" role="status">{unavailableMessage}</div> : null}
      {enabled && messages.length === 1 && suggested.length ? (
        <div className="suggestion-row">
          {suggested.map((item) => (
            <button type="button" key={item} onClick={() => void send(item)}>{item}</button>
          ))}
        </div>
      ) : null}
      <form className="chat-composer" onSubmit={submit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="请输入你的问题"
          aria-label="输入问题"
          maxLength={1200}
          disabled={!enabled}
        />
        <button className="send-button" type="submit" disabled={!enabled || !input.trim() || loading} aria-label="发送">
          <Send size={19} />
        </button>
      </form>
    </section>
  )
}
