import { BarChart3, CalendarDays, FileText, HardDrive, MessageCircle } from 'lucide-react'
import { socialPlatforms, type Post, type WhatsAppConversation } from '../data/mockData'
import { PlatformMark } from '../components/platform/PlatformMark'

export function Analytics({ posts, conversations }: { posts: Post[]; conversations: WhatsAppConversation[] }) {
  const drafts = posts.filter(post => post.status === 'draft').length
  const scheduled = posts.filter(post => post.status === 'scheduled').length
  const ready = posts.filter(post => post.status === 'queued').length
  const mediaCount = posts.reduce((count, post) => count + post.attachments.length, 0)
  const eligible = conversations.filter(conversation => conversation.optedIn && !conversation.optedOut).length

  return <div className="analytics-page">
    <header className="page-heading"><div className="page-heading-copy"><p className="eyebrow">Workspace activity</p><h1>Analytics</h1><p>This view reports only data saved in this browser. Reach, impressions, followers, and engagement require platform APIs.</p></div><span className="status-pill disconnected">Live metrics need API access</span></header>

    <section className="metric-grid analytics-overview" aria-label="Local activity overview">
      <LocalMetric label="Total local posts" value={posts.length} Icon={FileText} />
      <LocalMetric label="Drafts" value={drafts} Icon={BarChart3} />
      <LocalMetric label="Scheduled locally" value={scheduled} Icon={CalendarDays} />
      <LocalMetric label="Media files" value={mediaCount} Icon={HardDrive} />
    </section>

    <div className="analytics-local-grid">
      <section className="panel analytics-local-panel"><div className="panel-header"><div><h2>Publishing workflow</h2><span className="panel-subtitle">Counts from your saved local posts</span></div><BarChart3 size={17} aria-hidden="true" /></div>
        <div className="workflow-bars">
          <WorkflowRow label="Drafts" value={drafts} total={posts.length} tone="neutral" />
          <WorkflowRow label="Scheduled" value={scheduled} total={posts.length} tone="brand" />
          <WorkflowRow label="Ready in outbox" value={ready} total={posts.length} tone="warning" />
        </div>
        <p className="analytics-note">Outbox items are not published. They remain ready until a platform integration is configured and the user authorizes delivery.</p>
      </section>

      <section className="panel analytics-local-panel"><div className="panel-header"><div><h2>Channel readiness</h2><span className="panel-subtitle">No account access configured</span></div></div>
        <ul className="channel-readiness-analytics">{socialPlatforms.map(platform => <li key={platform.id}><PlatformMark platformId={platform.id} /><span>{platform.name}</span><small>{platform.purpose === 'messaging' ? `${eligible} consented local contact${eligible === 1 ? '' : 's'}` : 'Not connected'}</small></li>)}</ul>
      </section>
    </div>

    <section className="analytics-honesty-card"><span><MessageCircle size={18} aria-hidden="true" /></span><div><strong>No invented performance figures</strong><p>Once official APIs are connected, this page can show only metrics each platform actually exposes and for which the account has permission. Local workflow counts are available now.</p></div></section>
  </div>
}

function LocalMetric({ label, value, Icon }: { label: string; value: number; Icon: typeof FileText }) {
  return <div className="metric-card"><div className="metric-card-copy"><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><span className="metric-detail">Local records only</span></div><span className="metric-icon"><Icon size={18} aria-hidden="true" /></span></div>
}

function WorkflowRow({ label, value, total, tone }: { label: string; value: number; total: number; tone: 'neutral' | 'brand' | 'warning' }) {
  const percent = total ? Math.round(value / total * 100) : 0
  return <div className="workflow-row"><div><span>{label}</span><strong>{value}</strong></div><div className="workflow-track" aria-label={`${label}: ${value} of ${total}`}><span className={`workflow-fill ${tone}`} style={{ width: `${percent}%` }} /></div></div>
}
