import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PageHeader({ title, back = false, action }: { title: string; back?: boolean; action?: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <header className="page-header">
      <div className="page-header__side">
        {back ? (
          <button className="icon-button" type="button" aria-label="返回" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
        ) : null}
      </div>
      <h1>{title}</h1>
      <div className="page-header__side page-header__side--right">{action}</div>
    </header>
  )
}

