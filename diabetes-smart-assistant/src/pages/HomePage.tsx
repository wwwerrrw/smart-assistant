import { Activity, ArrowRight, Bot, CalendarCheck, ChevronRight, HeartPulse, MessageCircleMore } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { articles, doctors, planItems } from '../data/demo'

const levelText = { low: '较低风险', moderate: '中等风险', high: '较高风险' }

export function HomePage() {
  const { user, assessment, completedPlanIds } = useApp()
  const progress = Math.round((completedPlanIds.size / planItems.length) * 100)

  return (
    <div className="page-stack home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <span>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</span>
          <h1>{user?.name}，今天也要照顾好自己</h1>
          <p>记录身体指标，按计划完成饮食与运动任务，让健康变化清晰可见。</p>
          <Link className="primary-button" to="/assessment">开始健康评估 <ArrowRight size={18} /></Link>
        </div>
        <img src="/images/hero-doctor.jpg" alt="糖尿病健康管理咨询场景" />
      </section>

      <section className="metric-strip" aria-label="健康概览">
        <div><span className="metric-icon metric-icon--blue"><HeartPulse size={20} /></span><p>风险状态<strong>{assessment ? levelText[assessment.level] : '待评估'}</strong></p></div>
        <div><span className="metric-icon metric-icon--green"><CalendarCheck size={20} /></span><p>今日计划<strong>{completedPlanIds.size}/{planItems.length} 项</strong></p></div>
        <div><span className="metric-icon metric-icon--amber"><Activity size={20} /></span><p>完成进度<strong>{progress}%</strong></p></div>
      </section>

      <section className="quick-actions" aria-label="常用服务">
        <Link to="/assessment"><HeartPulse /><span><strong>健康评估</strong><small>了解风险水平</small></span><ChevronRight /></Link>
        <Link to="/plans"><CalendarCheck /><span><strong>生活方案</strong><small>完成今日打卡</small></span><ChevronRight /></Link>
        <Link to="/doctors"><MessageCircleMore /><span><strong>医生咨询</strong><small>获取专业支持</small></span><ChevronRight /></Link>
        <Link to="/assistant"><Bot /><span><strong>AI 助手</strong><small>Dify 知识问答</small></span><ChevronRight /></Link>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><h2>专业医生团队</h2><p>按专长选择咨询医生</p></div><Link to="/doctors">查看全部 <ChevronRight size={17} /></Link></div>
        <div className="doctor-rail">
          {doctors.map((doctor) => (
            <article className="doctor-card" key={doctor.id}>
              <div className="doctor-photo"><img src={doctor.image} alt={`${doctor.name}${doctor.title}`} />{doctor.online ? <span /> : null}</div>
              <strong>{doctor.name}</strong><small>{doctor.title}</small><p>{doctor.department}</p>
              <Link to={`/doctors/${doctor.id}`}>立即咨询</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><h2>健康科普</h2><p>来自项目知识资料的日常建议</p></div><Link to="/articles">更多 <ChevronRight size={17} /></Link></div>
        <div className="article-list article-list--home">
          {articles.slice(0, 3).map((article) => (
            <Link className="article-row" to={`/articles/${article.id}`} key={article.id}>
              <img src={article.image} alt="" />
              <span><strong>{article.title}</strong><p>{article.summary}</p><small>{article.category} · {article.views} 阅读</small></span>
              <ChevronRight size={19} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
