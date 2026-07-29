import {
  Activity,
  Bot,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Home,
  LogOut,
  Menu,
  MessageCircleMore,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAssistantStatus } from '../lib/assistant'

const mainLinks = [
  { to: '/', label: '首页', icon: Home },
  { to: '/plans', label: '方案定制', icon: ClipboardCheck },
  { to: '/assessment', label: '健康评估', icon: HeartPulse },
  { to: '/assistant', label: 'AI 助手', icon: Bot },
  { to: '/profile', label: '个人中心', icon: UserRound },
]

const secondaryLinks = [
  { to: '/doctors', label: '医生咨询', icon: MessageCircleMore },
  { to: '/articles', label: '健康资讯', icon: FileText },
  { to: '/admin', label: '管理台', icon: ShieldCheck },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileMenu, setMobileMenu] = useState(false)
  const { user, logout } = useApp()
  const location = useLocation()
  const { status } = useAssistantStatus()

  const renderLink = ({ to, label, icon: Icon }: (typeof mainLinks)[number]) => (
    <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileMenu(false)}>
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  )

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar--open' : ''}`}>
        <div className="brand">
          <span className="brand__mark"><Activity size={24} /></span>
          <div><strong>糖护</strong><small>预治智能助手</small></div>
          <button className="sidebar-close" type="button" aria-label="关闭菜单" onClick={() => setMobileMenu(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="主导航">
          <span className="nav-label">健康管理</span>
          {mainLinks.map(renderLink)}
          <span className="nav-label">服务与内容</span>
          {secondaryLinks.map(renderLink)}
        </nav>
        <div className="sidebar-profile">
          <span className="avatar avatar--text">{user?.avatar}</span>
          <div><strong>{user?.name}</strong><small>健康档案已同步</small></div>
          <button className="icon-button" type="button" aria-label="退出登录" onClick={logout}><LogOut size={18} /></button>
        </div>
      </aside>
      {mobileMenu ? <button className="sidebar-scrim" aria-label="关闭菜单" onClick={() => setMobileMenu(false)} /> : null}
      <div className="app-main">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" type="button" aria-label="打开菜单" onClick={() => setMobileMenu(true)}>
            <Menu size={21} />
          </button>
          <div className="topbar__context">
            <strong>{location.pathname === '/' ? '今日健康概览' : '糖护健康管理'}</strong>
            <span className={status?.configured ? 'provider-state provider-state--online' : 'provider-state'}>
              <span className="status-dot" />
              {status === null ? '正在检查 Dify' : status.configured ? 'Dify 已连接' : 'Dify 未连接'}
            </span>
          </div>
          <NavLink className="topbar-profile" to="/profile" aria-label="个人中心">
            <span>{user?.name}</span><span className="avatar avatar--text">{user?.avatar}</span>
          </NavLink>
        </header>
        <main className="content">{children}</main>
        <nav className="bottom-nav" aria-label="移动端主导航">
          {mainLinks.map(renderLink)}
        </nav>
      </div>
    </div>
  )
}
