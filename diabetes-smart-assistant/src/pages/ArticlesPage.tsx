import { ChevronRight, Eye, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { articles } from '../data/demo'

export function ArticlesPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const categories = ['全部', ...new Set(articles.map((article) => article.category))]
  const filtered = useMemo(() => articles.filter((article) => (category === '全部' || article.category === category) && `${article.title}${article.summary}`.includes(query.trim())), [category, query])

  return (
    <div className="page-stack">
      <PageHeader title="健康资讯" />
      <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索健康知识" aria-label="搜索健康资讯" /></label>
      <div className="filter-row" aria-label="资讯分类">{categories.map((item) => <button className={item === category ? 'active' : ''} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
      <div className="article-list">
        {filtered.map((article) => <Link className="article-row article-row--large" to={`/articles/${article.id}`} key={article.id}><img src={article.image} alt="" /><span><small className="article-category">{article.category}</small><strong>{article.title}</strong><p>{article.summary}</p><small><Eye size={14} /> {article.views} 阅读</small></span><ChevronRight size={20} /></Link>)}
        {!filtered.length ? <div className="empty-state">没有找到匹配的健康资讯。</div> : null}
      </div>
    </div>
  )
}
