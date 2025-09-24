import { useState, useEffect } from 'react'

interface HeaderProps {
  currentPage: string
  onPageChange: (page: 'dashboard' | 'compose' | 'comments' | 'analytics' | 'settings') => void
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      setIsDark(false)
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'compose' as const, label: 'Compose' },
    { id: 'comments' as const, label: 'Comments' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'settings' as const, label: 'Settings' },
  ]

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <div className="header-logo">
            O
          </div>
          <h1 className="header-title">
            OmniChat
          </h1>
        </div>
        
        <nav className="header-nav">
          <div className="nav-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`nav-button ${currentPage === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="header-actions">
            <button
              onClick={toggleTheme}
              className="theme-button"
            >
              {isDark ? '🌞' : '🌙'}
            </button>
            <button className="upgrade-button">
              Upgrade Pro
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}