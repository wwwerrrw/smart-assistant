import { Bookmark, Eye } from 'lucide-react'
import { Navigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { articles } from '../data/demo'

export function ArticlePage() {
  const { articleId } = useParams()
  const article = articles.find((item) => item.id === articleId)
  const { favoriteArticleIds, toggleFavorite } = useApp()
  if (!article) return <Navigate to="/articles" replace />
  const favorite = favoriteArticleIds.has(article.id)

  return (
    <article className="article-page">
      <PageHeader title="健康科普" back action={<button className={`icon-button ${favorite ? 'active' : ''}`} type="button" onClick={() => toggleFavorite(article.id)} aria-label={favorite ? '取消收藏' : '收藏文章'}><Bookmark size={19} fill={favorite ? 'currentColor' : 'none'} /></button>} />
      <img className="article-cover" src={article.image} alt="" />
      <div className="article-body"><span className="article-category">{article.category}</span><h1>{article.title}</h1><div className="article-meta"><span>{article.author}</span><span><Eye size={14} />{article.views} 阅读</span></div>{article.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="medical-disclaimer">本文用于健康教育，具体诊疗方案请咨询专业医生。</div></div>
    </article>
  )
}
