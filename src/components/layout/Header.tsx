import { Download, Menu, Moon, Sun, Wifi, WifiOff } from 'lucide-react'

interface HeaderProps {
  isDark: boolean
  isNavigationOpen: boolean
  onToggleNavigation: () => void
  onToggleTheme: () => void
  isOnline: boolean
  canInstall: boolean
  onInstall: () => void
}

export function Header({ isDark, isNavigationOpen, onToggleNavigation, onToggleTheme, isOnline, canInstall, onInstall }: HeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button
          className="icon-button mobile-menu-button"
          type="button"
          aria-label={isNavigationOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isNavigationOpen}
          aria-controls="primary-navigation"
          onClick={onToggleNavigation}
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <a className="topbar-brand" href="#dashboard" aria-label="OmniChat dashboard">
          <span className="brand-mark" aria-hidden="true">O</span>
          <span>OmniChat</span>
        </a>

        <div className="topbar-actions">
          <span className={`connection-state ${isOnline ? '' : 'is-offline'}`} title={isOnline ? 'Changes save on this device' : 'Offline · changes save on this device'}>
            {isOnline ? <Wifi size={14} aria-hidden="true" /> : <WifiOff size={14} aria-hidden="true" />}
            <span>{isOnline ? 'Local mode' : 'Offline'}</span>
          </span>
          {canInstall && <button className="button button-secondary install-button" type="button" onClick={onInstall}><Download size={14} aria-hidden="true" />Install app</button>}
          <button
            className="icon-button"
            type="button"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={onToggleTheme}
          >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}
