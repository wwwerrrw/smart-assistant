import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, Check, Dumbbell, Salad, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { planItems, weeklyCompletion } from '../data/demo'

type PlanTab = 'diet' | 'exercise' | 'analysis'

export default function PlansPage() {
  const [tab, setTab] = useState<PlanTab>('diet')
  const { completedPlanIds, togglePlan } = useApp()
  const completion = Math.round((completedPlanIds.size / planItems.length) * 100)
  const visible = planItems.filter((item) => item.type === tab)

  return (
    <div className="page-stack plans-page">
      <PageHeader title="生活方案" />
      <div className="segmented-control" role="tablist" aria-label="方案视图">
        <button className={tab === 'diet' ? 'active' : ''} onClick={() => setTab('diet')} role="tab"><Salad size={18} />饮食</button>
        <button className={tab === 'exercise' ? 'active' : ''} onClick={() => setTab('exercise')} role="tab"><Dumbbell size={18} />运动</button>
        <button className={tab === 'analysis' ? 'active' : ''} onClick={() => setTab('analysis')} role="tab"><BarChart3 size={18} />趋势</button>
      </div>

      {tab !== 'analysis' ? (
        <>
          <section className={`plan-banner plan-banner--${tab}`}>
            <div>{tab === 'diet' ? <Salad size={27} /> : <Dumbbell size={27} />}<span><strong>{tab === 'diet' ? '饮食管理' : '运动管理'}</strong><small>{tab === 'diet' ? '定时定量，优先高纤维食物' : '循序渐进，运动前后关注身体感受'}</small></span></div>
            <strong>{visible.filter((item) => completedPlanIds.has(item.id)).length}/{visible.length}</strong>
          </section>
          <div className="plan-list">
            {visible.map((item) => {
              const done = completedPlanIds.has(item.id)
              return (
                <article className={`plan-row ${done ? 'plan-row--done' : ''}`} key={item.id}>
                  <time>{item.time}</time><div><strong>{item.title}</strong><p>{item.content}</p></div>
                  <button type="button" className="check-button" aria-label={`${item.title}${done ? '取消打卡' : '打卡'}`} onClick={() => togglePlan(item.id)}>{done ? <Check size={19} /> : null}</button>
                </article>
              )
            })}
          </div>
        </>
      ) : (
        <div className="analysis-layout">
          <section className="analysis-summary">
            <div className="completion-ring" style={{ '--progress': `${completion * 3.6}deg` } as React.CSSProperties}><span><strong>{completion}%</strong><small>今日完成</small></span></div>
            <div><h2>计划完成状态</h2><p>{completion >= 80 ? '今天的执行情况很好，继续保持稳定节奏。' : '还有计划尚未完成，选择一项力所能及的任务开始吧。'}</p></div>
          </section>
          <section className="trend-panel"><div className="panel-title"><div><h2>近 7 日打卡趋势</h2><p>饮食与运动计划完成率</p></div><Sparkles size={21} /></div><div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%"><AreaChart data={weeklyCompletion} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id="dietFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f7df6" stopOpacity={0.3} /><stop offset="100%" stopColor="#2f7df6" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5eaf1" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6c7788', fontSize: 12 }} /><YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#8993a3', fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="diet" name="饮食" stroke="#2f7df6" strokeWidth={3} fill="url(#dietFill)" isAnimationActive={false} /><Area type="monotone" dataKey="exercise" name="运动" stroke="#12b981" strokeWidth={3} fillOpacity={0} isAnimationActive={false} /></AreaChart></ResponsiveContainer>
          </div></section>
          <section className="analysis-advice"><h2>生活评价</h2><p>近一周饮食记录较稳定，运动完成率仍有提升空间。建议把运动安排在固定时段，降低临时中断的概率。</p><h2>改进建议</h2><p>继续保持清淡、均衡饮食。运动以能正常交流但略感气促的强度为宜，如出现明显不适请停止并咨询医生。</p></section>
        </div>
      )}
    </div>
  )
}
