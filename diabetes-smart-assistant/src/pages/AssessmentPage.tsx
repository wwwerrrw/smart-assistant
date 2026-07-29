import { AlertCircle, CheckCircle2, ClipboardCheck, RotateCcw } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { calculateRisk } from '../lib/risk'
import type { AssessmentInput } from '../types'

const initialInput: AssessmentInput = {
  age: 38,
  sex: 'male',
  height: 172,
  weight: 72,
  waist: 84,
  systolic: 126,
  fastingGlucose: 5.4,
  familyHistory: false,
  activityMinutes: 120,
  pregnancy: false,
}

const levelCopy = {
  low: { title: '较低风险', description: '当前已知风险因素较少，请继续保持规律生活并定期筛查。' },
  moderate: { title: '中等风险', description: '存在需要关注的风险因素，建议完善检查并持续记录。' },
  high: { title: '较高风险', description: '多项指标需要重视，建议尽快到正规医疗机构复查。' },
}

export function AssessmentPage() {
  const { assessment, setAssessment } = useApp()
  const [input, setInput] = useState(initialInput)
  const [showResult, setShowResult] = useState(Boolean(assessment))
  const result = assessment

  const updateNumber = (key: keyof AssessmentInput, value: string) => {
    setInput((current) => ({ ...current, [key]: Number(value) }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setAssessment(calculateRisk(input))
    setShowResult(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-stack assessment-page">
      <PageHeader title="健康风险评估" />
      {showResult && result ? (
        <section className="assessment-result" aria-live="polite">
          <div className={`risk-summary risk-summary--${result.level}`}>
            <span className="risk-score"><strong>{result.score}</strong><small>风险分</small></span>
            <div><p>评估结果</p><h2>{levelCopy[result.level].title}</h2><span>{levelCopy[result.level].description}</span></div>
          </div>
          <div className="result-grid">
            <section><h3><ClipboardCheck size={20} /> 指标摘要</h3><div className="bmi-row"><span>BMI</span><strong>{result.bmi}</strong><small>kg/m²</small></div>{result.factors.length ? <ul>{result.factors.map((factor) => <li key={factor}><AlertCircle size={16} />{factor}</li>)}</ul> : <p className="empty-copy">未识别到明显风险因素。</p>}</section>
            <section><h3><CheckCircle2 size={20} /> 健康建议</h3><ol>{result.suggestions.map((item) => <li key={item}>{item}</li>)}</ol></section>
          </div>
          <button className="secondary-button" type="button" onClick={() => setShowResult(false)}><RotateCcw size={18} /> 重新评估</button>
          <p className="medical-disclaimer">结果仅用于健康教育与风险提示，不能作为糖尿病诊断依据。</p>
        </section>
      ) : (
        <form className="assessment-form" onSubmit={submit}>
          <div className="form-intro"><h2>填写健康数据</h2><p>请按近期真实情况填写，评估会在当前浏览器中保存。</p></div>
          <fieldset><legend>基本信息</legend><div className="form-grid">
            <label>年龄<input type="number" min="18" max="100" value={input.age} onChange={(e) => updateNumber('age', e.target.value)} required /></label>
            <label>生理性别<select value={input.sex} onChange={(e) => setInput((v) => ({ ...v, sex: e.target.value as AssessmentInput['sex'], pregnancy: e.target.value === 'male' ? false : v.pregnancy }))}><option value="male">男</option><option value="female">女</option></select></label>
            <label>身高（cm）<input type="number" min="120" max="220" value={input.height} onChange={(e) => updateNumber('height', e.target.value)} required /></label>
            <label>体重（kg）<input type="number" min="30" max="200" step="0.1" value={input.weight} onChange={(e) => updateNumber('weight', e.target.value)} required /></label>
          </div></fieldset>
          <fieldset><legend>身体指标</legend><div className="form-grid">
            <label>腰围（cm）<input type="number" min="40" max="180" value={input.waist} onChange={(e) => updateNumber('waist', e.target.value)} required /></label>
            <label>收缩压（mmHg）<input type="number" min="70" max="240" value={input.systolic} onChange={(e) => updateNumber('systolic', e.target.value)} required /></label>
            <label>空腹血糖（mmol/L）<input type="number" min="2" max="30" step="0.1" value={input.fastingGlucose} onChange={(e) => updateNumber('fastingGlucose', e.target.value)} required /></label>
            <label>每周运动（分钟）<input type="number" min="0" max="1400" value={input.activityMinutes} onChange={(e) => updateNumber('activityMinutes', e.target.value)} required /></label>
          </div></fieldset>
          <fieldset><legend>风险因素</legend><div className="check-grid">
            <label className="check-control"><input type="checkbox" checked={input.familyHistory} onChange={(e) => setInput((v) => ({ ...v, familyHistory: e.target.checked }))} /><span>有糖尿病家族史</span></label>
            {input.sex === 'female' ? <label className="check-control"><input type="checkbox" checked={input.pregnancy} onChange={(e) => setInput((v) => ({ ...v, pregnancy: e.target.checked }))} /><span>当前处于孕期</span></label> : null}
          </div></fieldset>
          <button className="primary-button assessment-submit" type="submit">生成评估结果</button>
        </form>
      )}
    </div>
  )
}
