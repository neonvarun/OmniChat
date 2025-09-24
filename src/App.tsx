import { useState } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { PostComposer } from './pages/PostComposer'
import { CommentsView } from './pages/CommentsView'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'compose' | 'comments' | 'analytics' | 'settings'>('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'compose':
        return <PostComposer />
      case 'comments':
        return <CommentsView />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app-container">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-container">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
