import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, MessageCircle, PenSquare, Send, Users } from 'lucide-react'
import { PlatformMark } from '../components/platform/PlatformMark'
import { socialPlatforms, type Post, type WhatsAppConversation } from '../data/mockData'
import { formatDate } from '../lib/utils'

interface DashboardProps {
  posts: Post[]
  conversations: WhatsAppConversation[]
  displayName: string
}

export function Dashboard({ posts, conversations, displayName }: DashboardProps) {
  const drafts = posts.filter(post => post.status === 'draft').length
  const scheduled = posts.filter(post => post.status === 'scheduled').length
  const queued = posts.filter(post => post.status === 'queued').length
  const openConversations = conversations.filter(conversation => isWindowOpen(conversation.lastInboundAt) && conversation.optedIn && !conversation.optedOut).length
  const recentPosts = [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)
  const now = Date.now()
  const thisWeek = posts.filter(post => now - post.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000).length

  return (
    <div className="dashboard-page">
      <header className="page-heading">
        <div className="page-heading-copy">
          <p className="eyebrow">Your local workspace</p>
          <h1>Welcome back, {displayName || 'creator'}</h1>
          <p>Plan content and manage your local outbox. Social accounts are ready to connect when API access is available.</p>
        </div>
        <div className="page-heading-actions">
          <a className="button button-primary" href="#compose"><PenSquare size={16} aria-hidden="true" />Create Post</a>
        </div>
      </header>

      <section className="metric-grid" aria-label="Workspace overview">
        <MetricCard label="Local posts" value={posts.length} detail={`${drafts} ${plural(drafts, 'draft')} · ${queued} ready in outbox`} Icon={PenSquare} />
        <MetricCard label="Scheduled locally" value={scheduled} detail="Will move to the outbox when due" Icon={CalendarDays} />
        <MetricCard label="WhatsApp replies" value={openConversations} detail="Sample or local contacts inside 24 hours" Icon={MessageCircle} />
        <MetricCard label="Created this week" value={thisWeek} detail="Based on this browser's saved data" Icon={CheckCircle2} />
      </section>

      <section className="local-mode-card" aria-label="Local mode status">
        <div className="local-mode-icon"><Send size={18} aria-hidden="true" /></div>
        <div>
          <strong>Local mode is ready</strong>
          <p>Drafts, schedules, media, replies, and sample WhatsApp conversations stay in this browser. Nothing is sent to a social network.</p>
        </div>
        <a className="text-link" href="#settings">Platform setup <ArrowUpRight size={14} aria-hidden="true" /></a>
      </section>

      <div className="dashboard-columns">
        <section className="panel">
          <div className="panel-header">
            <div><h2>Content workspace</h2><span className="panel-subtitle">Your drafts and local publishing queue</span></div>
            <a className="text-link" href="#compose">Compose <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
          {recentPosts.length === 0 ? (
            <div className="empty-state"><PenSquare size={22} aria-hidden="true" /><h3>Your workspace is clear</h3><p>Create a draft, schedule it, or add a post to your local outbox.</p><a className="button button-primary button-small" href="#compose">Create Post</a></div>
          ) : (
            <ul className="activity-list post-list">
              {recentPosts.map(post => (
                <li className="post-row" key={post.id}>
                  <div className="post-row-main">
                    <p className="post-row-copy">{post.content || 'Media post'}</p>
                    <div className="post-row-meta">
                      <span className={`status-pill ${post.status}`}>{statusLabel(post.status)}</span>
                      <span>{post.status === 'scheduled' && post.scheduledAt ? `Due ${formatDate(post.scheduledAt)}` : `Saved ${formatDate(post.createdAt)}`}</span>
                      <span className="platform-stack" aria-label="Selected platforms">{post.platforms.map(platformId => <PlatformMark key={platformId} platformId={platformId} />)}</span>
                      {post.attachments.length > 0 && <span>{post.attachments.length} {plural(post.attachments.length, 'attachment')}</span>}
                    </div>
                  </div>
                  <span className="outbox-state">{post.status === 'queued' ? 'Waiting for API setup' : post.status === 'scheduled' ? 'Local schedule' : 'Draft'}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel platform-readiness-panel">
          <div className="panel-header"><div><h2>Priority platforms</h2><span className="panel-subtitle">Four publishing channels · one messaging channel</span></div><Users size={17} aria-hidden="true" /></div>
          <ul className="platform-readiness-list">
            {socialPlatforms.map(platform => (
              <li key={platform.id}>
                <PlatformMark platformId={platform.id} large />
                <span><strong>{platform.name}</strong><small>{platform.purpose === 'messaging' ? 'Messaging inbox' : 'Post planning'}</small></span>
                <span className="status-pill disconnected">API setup later</span>
              </li>
            ))}
          </ul>
          <a className="panel-footer-link" href="#settings">Review API requirements <ArrowUpRight size={14} aria-hidden="true" /></a>
        </section>
      </div>

      <section className="panel dashboard-whatsapp-summary">
        <div className="panel-header"><div><h2>WhatsApp inbox</h2><span className="panel-subtitle">Consent and reply-window examples are local sample data</span></div><a className="text-link" href="#whatsapp">Open inbox <ArrowUpRight size={14} aria-hidden="true" /></a></div>
        <div className="whatsapp-summary-grid">
          {conversations.slice(0, 3).map(conversation => {
            const allowed = conversation.optedIn && !conversation.optedOut
            const open = allowed && isWindowOpen(conversation.lastInboundAt)
            return <div className="whatsapp-summary-row" key={conversation.id}>
              <span className="contact-avatar">{conversation.name.slice(0, 1)}</span>
              <span className="summary-contact-copy"><strong>{conversation.name}</strong><small>{conversation.phone}</small></span>
              <span className={`status-pill ${open ? 'connected' : allowed ? 'pending' : 'disconnected'}`}>{open ? '24-hour window open' : allowed ? 'Template required' : 'Opted out'}</span>
            </div>
          })}
          {conversations.length === 0 && <div className="empty-state"><MessageCircle size={20} aria-hidden="true" /><p>No local conversations yet. Add one in the WhatsApp inbox.</p></div>}
        </div>
      </section>

      {scheduled > 0 && <p className="schedule-limitation"><Clock3 size={15} aria-hidden="true" /> This browser cannot publish scheduled content while closed. Due items move into your outbox when you open the app.</p>}
    </div>
  )
}

function isWindowOpen(lastInboundAt?: Date) {
  return Boolean(lastInboundAt && Date.now() - lastInboundAt.getTime() < 24 * 60 * 60 * 1000)
}

function plural(count: number, word: string) { return `${word}${count === 1 ? '' : 's'}` }

function statusLabel(status: Post['status']) {
  return status === 'queued' ? 'In local outbox' : status === 'scheduled' ? 'Scheduled locally' : 'Draft'
}

function MetricCard({ label, value, detail, Icon }: { label: string; value: number; detail: string; Icon: typeof PenSquare }) {
  return <div className="metric-card"><div className="metric-card-copy"><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><span className="metric-detail">{detail}</span></div><span className="metric-icon"><Icon size={18} aria-hidden="true" /></span></div>
}
