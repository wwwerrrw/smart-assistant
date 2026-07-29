import { CirclePower, Database, FileText, Search, ShieldCheck, Stethoscope, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { articles, doctors, planItems } from '../data/demo'
import { useAssistantStatus } from '../lib/assistant'

type AdminTab = 'users' | 'doctors' | 'articles' | 'plans'
interface AdminRow { id: string; primary: string; secondary: string; meta: string; enabled: boolean }

const initialRows: Record<AdminTab, AdminRow[]> = {
  users: [{ id: 'user-1', primary: '孙铭炜', secondary: '138****0000', meta: '普通用户', enabled: true }],
  doctors: doctors.map((doctor) => ({ id: doctor.id, primary: doctor.name, secondary: `${doctor.department} · ${doctor.title}`, meta: doctor.online ? '在线' : '离线', enabled: true })),
  articles: articles.map((article) => ({ id: article.id, primary: article.title, secondary: article.category, meta: `${article.views} 阅读`, enabled: true })),
  plans: planItems.map((item) => ({ id: item.id, primary: item.title, secondary: item.type === 'diet' ? '饮食方案' : '运动方案', meta: item.time, enabled: true })),
}

const tabs = [
  { id: 'users' as const, label: '用户', icon: UsersRound },
  { id: 'doctors' as const, label: '医生', icon: Stethoscope },
  { id: 'articles' as const, label: '资讯', icon: FileText },
  { id: 'plans' as const, label: '方案', icon: Database },
]

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('users')
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState(initialRows)
  const { sourceCounts } = useAssistantStatus()
  const visibleRows = useMemo(() => rows[tab].filter((row) => `${row.primary}${row.secondary}${row.meta}`.toLowerCase().includes(query.trim().toLowerCase())), [query, rows, tab])
  const toggleRow = (id: string) => setRows((current) => ({ ...current, [tab]: current[tab].map((row) => row.id === id ? { ...row, enabled: !row.enabled } : row) }))

  return (
    <div className="page-stack admin-page">
      <PageHeader title="基础管理台" />
      <section className="admin-summary"><div><ShieldCheck /><span><strong>系统概览</strong><small>本地课程项目管理视图</small></span></div><p><strong>{sourceCounts.knowledgeDocuments || 6}</strong> 份资料 · <strong>{sourceCounts.databaseTables || 9}</strong> 张表</p></section>
      <div className="admin-tabs" role="tablist">{tabs.map(({ id, label, icon: Icon }) => <button className={tab === id ? 'active' : ''} type="button" role="tab" onClick={() => { setTab(id); setQuery('') }} key={id}><Icon size={18} />{label}<span>{rows[id].length}</span></button>)}</div>
      <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`搜索${tabs.find((item) => item.id === tab)?.label}`} aria-label="搜索管理数据" /></label>
      <section className="admin-table" aria-label={`${tab}管理列表`}><div className="admin-table__head"><span>名称</span><span>分类/角色</span><span>状态</span><span>操作</span></div>{visibleRows.map((row) => <div className="admin-table__row" key={row.id}><span><strong>{row.primary}</strong><small>{row.secondary}</small></span><span>{row.meta}</span><span className={row.enabled ? 'table-status table-status--online' : 'table-status'}>{row.enabled ? '启用' : '停用'}</span><button className="icon-button" type="button" onClick={() => toggleRow(row.id)} aria-label={`${row.enabled ? '停用' : '启用'}${row.primary}`}><CirclePower size={18} /></button></div>)}{!visibleRows.length ? <div className="empty-state">没有匹配的数据。</div> : null}</section>
      <p className="admin-footnote">字段与模块依据资料分享中的 db.txt 数据模型建立。</p>
    </div>
  )
}
