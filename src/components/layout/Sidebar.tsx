import { BarChart3, LayoutDashboard, MessageCircle, PenSquare, Settings, Smartphone } from 'lucide-react'

export type PageId = 'dashboard' | 'compose' | 'comments' | 'whatsapp' | 'analytics' | 'settings'

interface SidebarProps {
  currentPage: PageId
  isOpen: boolean
  onNavigate: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'compose', label: 'Compose', Icon: PenSquare },
  { id: 'comments', label: 'Comments', Icon: MessageCircle },
  { id: 'whatsapp', label: 'WhatsApp', Icon: Smartphone },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { id: 'settings', label: 'Settings', Icon: Settings },
] as const

export function Sidebar({ currentPage, isOpen, onNavigate, displayName }: SidebarProps & { displayName: string }) {
  return (
    <>
      <button
        className={`mobile-scrim ${isOpen ? 'is-open' : ''}`}
        type="button"
        aria-label="Close navigation"
        tabIndex={isOpen ? 0 : -1}
        onClick={onNavigate}
      />
      <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
        <nav className="sidebar-nav" id="primary-navigation" aria-label="Primary navigation">
          {navItems.map(({ id, label, Icon }) => (
            <a
              key={id}
              className="sidebar-link"
              href={`#${id}`}
              aria-current={currentPage === id ? 'page' : undefined}
              onClick={onNavigate}
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="demo-avatar" aria-hidden="true">{displayName.slice(0, 2).toUpperCase() || 'YN'}</span>
          <div className="sidebar-footer-copy">
            <strong>{displayName || 'Your Name'}</strong>
            <span>Local workspace</span>
          </div>
        </div>
      </aside>
    </>
  )
}
