import { Activity, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function LoginPage() {
  const [name, setName] = useState('孙铭炜')
  const [phone, setPhone] = useState('13800000000')
  const { login } = useApp()
  const navigate = useNavigate()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    login(name, phone)
    navigate('/')
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="糖尿病健康管理场景">
        <img src="/images/hero-doctor.jpg" alt="医生为患者提供健康管理建议" />
        <div className="login-visual__copy">
          <span className="brand__mark"><Activity size={27} /></span>
          <h1>糖护</h1>
          <p>让每一次记录，都成为更稳妥的健康选择。</p>
        </div>
      </section>
      <section className="login-form-wrap">
        <form className="login-form" onSubmit={submit}>
          <div className="login-brand"><Activity size={25} /><span>糖护健康管理</span></div>
          <div>
            <h2>欢迎回来</h2>
            <p>登录后查看风险评估、生活方案和每日打卡。</p>
          </div>
          <label>
            姓名
            <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={20} />
          </label>
          <label>
            手机号
            <input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" pattern="[0-9]{11}" required />
          </label>
          <button className="primary-button login-submit" type="submit">
            进入健康中心 <ArrowRight size={19} />
          </button>
          <div className="login-trust"><ShieldCheck size={17} /> 健康信息仅保存在当前浏览器</div>
          <p className="medical-note"><CheckCircle2 size={15} /> 本项目内容用于健康教育，不替代医生诊断。</p>
        </form>
      </section>
    </main>
  )
}
