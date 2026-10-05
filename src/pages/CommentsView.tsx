import { useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import { PlatformMark } from '../components/platform/PlatformMark'
import { type Comment } from '../data/mockData'
import { formatDate } from '../lib/utils'

interface CommentsViewProps {
  comments: Comment[]
  onReply: (commentId: string, reply: string) => void
}

export function CommentsView({ comments, onReply }: CommentsViewProps) {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState('')
  const [replyText, setReplyText] = useState('')
  const pending = comments.filter(comment => comment.status === 'pending').length
  const drafted = comments.filter(comment => comment.status === 'replied').length
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return comments.filter(comment => !normalized || `${comment.author} ${comment.content}`.toLowerCase().includes(normalized))
  }, [comments, query])
  const selected = filtered.find(comment => comment.id === activeId) ?? filtered[0]

  const saveReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected || !replyText.trim()) return
    onReply(selected.id, replyText.trim())
    setReplyText('')
  }

  return (
    <div className="comments-page">
      <header className="page-heading">
        <div className="page-heading-copy"><p className="eyebrow">Community</p><h1>Comment inbox</h1><p>Comments will appear here after platform APIs are configured. Replies saved here remain drafts in this browser.</p></div>
        <span className="status-pill disconnected">API setup later</span>
      </header>

      <section className="metric-grid comment-metrics" aria-label="Local comment overview">
        <Metric label="Comments available" value={comments.length} />
        <Metric label="Need a reply" value={pending} />
        <Metric label="Local reply drafts" value={drafted} />
      </section>

      <section className="panel inbox-panel" aria-label="Comment inbox">
        <div className="inbox-toolbar">
          <label className="search-field"><Search size={17} aria-hidden="true" /><span className="sr-only">Search comments</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search comments or authors..." /></label>
        </div>
        {filtered.length === 0 ? (
          <div className="comments-offline-empty"><span className="empty-icon"><MessageCircle size={22} aria-hidden="true" /></span><h2>{comments.length ? 'No comments match your search' : 'Comment sync is waiting for API access'}</h2><p>{comments.length ? 'Try a different name or phrase.' : 'The inbox is ready. Add platform credentials later to sync real comments. This app does not invent engagement or pretend a reply was sent.'}</p><a href="#settings" className="button button-secondary button-small">See platform requirements</a></div>
        ) : (
          <div className="comments-workspace">
            <div className="comments-list" aria-label="Available comments">
              {filtered.map(comment => <button className={`comments-list-item ${selected?.id === comment.id ? 'is-active' : ''}`} key={comment.id} type="button" onClick={() => { setActiveId(comment.id); setReplyText('') }}>
                <span className="comment-initial">{comment.author.slice(0, 1)}</span><span><strong>{comment.author}</strong><small>{comment.content}</small><span className="comment-local-meta"><PlatformMark platformId={comment.platform} />{formatDate(comment.createdAt)} · {comment.status === 'replied' ? 'Local draft saved' : 'Needs reply'}</span></span>
              </button>)}
            </div>
            {selected && <article className="comment-local-detail"><div className="panel-header"><div><h2>{selected.author}</h2><span className="panel-subtitle"><PlatformMark platformId={selected.platform} /> · {formatDate(selected.createdAt)}</span></div></div><blockquote>{selected.content}</blockquote>{selected.reply && <div className="saved-reply"><strong>Saved locally · not sent</strong><p>{selected.reply}</p></div>}<form className="reply-form" onSubmit={saveReply}><label className="field-label" htmlFor="reply-draft">Save a reply draft</label><textarea id="reply-draft" className="field-control reply-textarea" value={replyText} onChange={event => setReplyText(event.target.value)} placeholder="Write a reply to keep with this comment..." /><div className="reply-form-footer"><span>Sending requires an approved platform connection.</span><button type="submit" className="button button-primary" disabled={!replyText.trim()}>Save draft</button></div></form></article>}
          </div>
        )}
      </section>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="metric-card"><div className="metric-card-copy"><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong></div><span className="metric-icon"><MessageCircle size={18} aria-hidden="true" /></span></div>
}
