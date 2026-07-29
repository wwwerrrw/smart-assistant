import { Bookmark, ChevronRight, ClipboardCheck, Database, FileText, LogOut, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { useAssistantStatus } from '../lib/assistant'

export function ProfilePage() {
  const { user, assessment, completedPlanIds, favoriteArticleIds, logout } = useApp()
  const { sourceCounts } = useAssistantStatus()
  return (
    <div className="page-stack profile-page">
      <PageHeader title="个人中心" />
      <section className="profile-identity"><span className="avatar avatar--large">{user?.avatar}</span><div><h1>{user?.name}</h1><p>{user?.phone}</p></div><UserRound size={24} /></section>
      <section className="profile-stats"><div><strong>{assessment ? assessment.score : '--'}</strong><span>风险分</span></div><div><strong>{completedPlanIds.size}</strong><span>今日打卡</span></div><div><strong>{favoriteArticleIds.size}</strong><span>内容收藏</span></div></section>
      <section className="settings-list"><Link to="/assessment"><span><ClipboardCheck />健康档案</span><ChevronRight /></Link><Link to="/articles"><span><Bookmark />我的收藏</span><ChevronRight /></Link><Link to="/admin"><span><Database />基础管理台</span><ChevronRight /></Link></section>
      <section className="project-info"><h2>项目资料</h2><div><FileText /><span><strong>{sourceCounts.knowledgeDocuments || 6} 份知识文档</strong><small>已整理为 Dify 知识库导入资料</small></span></div><div><Database /><span><strong>{sourceCounts.databaseTables || 9} 张数据表</strong><small>来自课程提供的 db.txt 数据模型</small></span></div><div><ShieldCheck /><span><strong>项目开发：孙铭炜</strong><small>课程实训项目</small></span></div></section>
      <button className="logout-button" type="button" onClick={logout}><LogOut size={18} />退出登录</button>
    </div>
  )
}
