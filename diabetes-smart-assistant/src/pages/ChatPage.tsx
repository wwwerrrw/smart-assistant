import { Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { doctors } from '../data/demo'

interface ConsultationMessage { id: string; role: 'doctor' | 'user' | 'system'; content: string; time: string }

export default function ChatPage() {
  const { doctorId } = useParams()
  const doctor = doctors.find((item) => item.id === doctorId) ?? doctors[0]
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ConsultationMessage[]>([
    { id: 'welcome', role: 'doctor', content: '您好，请描述您想咨询的健康问题，并尽量补充近期血糖、饮食或运动情况。', time: '现在' },
  ])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const content = input.trim()
    if (!content) return
    const id = Date.now().toString()
    setMessages((current) => [...current, { id, role: 'user', content, time: '刚刚' }, { id: `${id}-queued`, role: 'system', content: '留言已提交，等待医生通过真实问诊服务回复。', time: '已送达' }])
    setInput('')
  }

  return (
    <div className="consultation-chat-page">
      <PageHeader title={doctor.name} back />
      <section className="chat-doctor-summary"><div className="doctor-photo"><img src={doctor.image} alt="" />{doctor.online ? <span /> : null}</div><div><strong>{doctor.name} <small>{doctor.title}</small></strong><p>{doctor.department} · {doctor.online ? '可接收留言' : '离线'}</p></div></section>
      <div className="consultation-stream" aria-live="polite">
        {messages.map((message) => <div className={`consultation-message consultation-message--${message.role}`} key={message.id}>{message.role === 'doctor' ? <img src={doctor.image} alt="" /> : null}<div><p>{message.content}</p><small>{message.time}</small></div></div>)}
      </div>
      <form className="consultation-composer" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="描述您的问题" aria-label="咨询内容" maxLength={500} /><button type="submit" disabled={!input.trim()} aria-label="发送咨询"><Send size={19} /></button></form>
    </div>
  )
}
