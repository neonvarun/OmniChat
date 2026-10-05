import { useEffect, useState } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar, type PageId } from './components/layout/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { PostComposer } from './pages/PostComposer'
import { CommentsView } from './pages/CommentsView'
import { WhatsAppInbox } from './pages/WhatsAppInbox'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { createInitialWorkspace, type Post, type WhatsAppConversation, type WorkspaceData, type WorkspaceSettings } from './data/mockData'
import { loadWorkspace, resetWorkspace, saveWorkspace } from './lib/workspaceStorage'

const pageIds: PageId[] = ['dashboard', 'compose', 'comments', 'whatsapp', 'analytics', 'settings']

function readPageFromHash(): PageId {
  const page = window.location.hash.replace(/^#\/?/, '').split('?')[0] as PageId
  return pageIds.includes(page) ? page : 'dashboard'
}

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem('theme')
  return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function createId() { return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}` }

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(readPageFromHash)
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null)
  const [storageStatus, setStorageStatus] = useState<'loading' | 'saving' | 'saved' | 'error'>('loading')
  const [isDark, setIsDark] = useState(getInitialTheme)
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)

  useEffect(() => {
    const syncPage = () => setCurrentPage(readPageFromHash())
    if (!window.location.hash) window.history.replaceState(null, '', `${window.location.pathname}#dashboard`)
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  useEffect(() => {
    let active = true
    loadWorkspace().then(data => {
      if (!active) return
      setWorkspace(data)
      setStorageStatus('saved')
    }).catch(error => {
      if (!active) return
      console.error('OmniChat local storage could not be opened:', error)
      setWorkspace(createInitialWorkspace())
      setStorageStatus('error')
      setNotice('Browser storage is unavailable. Changes will stay only until this tab closes.')
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!workspace) return
    let active = true
    setStorageStatus('saving')
    saveWorkspace(workspace).then(() => {
      if (active) setStorageStatus('saved')
    }).catch(error => {
      console.error('OmniChat local workspace could not be saved:', error)
      if (active) {
        setStorageStatus('error')
        setNotice('Could not save to browser storage. Export a backup before closing this tab.')
      }
    })
    return () => { active = false }
  }, [workspace])

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    const updateOnline = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnline)
    window.addEventListener('offline', updateOnline)
    const captureInstall = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', captureInstall)
    return () => {
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOnline)
      window.removeEventListener('beforeinstallprompt', captureInstall)
    }
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 5200)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!isNavigationOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsNavigationOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isNavigationOpen])

  useEffect(() => {
    if (!workspace) return
    const promoteDuePosts = () => {
      const due = workspace.posts.filter(post => post.status === 'scheduled' && post.scheduledAt && post.scheduledAt.getTime() <= Date.now())
      if (!due.length) return
      const dueIds = new Set(due.map(post => post.id))
      setWorkspace({ ...workspace, posts: workspace.posts.map(post => dueIds.has(post.id) ? { ...post, status: 'queued' } : post) })
      setNotice(`${due.length} scheduled ${due.length === 1 ? 'post is' : 'posts are'} ready in the local outbox. Nothing was sent.`)
    }
    promoteDuePosts()
    const timer = window.setInterval(promoteDuePosts, 60_000)
    window.addEventListener('focus', promoteDuePosts)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', promoteDuePosts)
    }
  }, [workspace])

  const handleCreatePost = (input: { content: string; youtubeTitle?: string; platforms: Post['platforms']; status: Post['status']; scheduledAt?: Date; attachments: Post['attachments'] }) => {
    const newPost: Post = { id: createId(), ...input, createdAt: new Date() }
    setWorkspace(current => current ? { ...current, posts: [newPost, ...current.posts] } : current)
    setNotice(input.status === 'draft' ? 'Draft saved on this device.' : input.status === 'scheduled' ? 'Schedule saved locally. It will not publish while this app is closed.' : 'Added to the local outbox. No platform was contacted.')
  }

  const handleReplyDraft = (commentId: string, reply: string) => {
    setWorkspace(current => current ? { ...current, comments: current.comments.map(comment => comment.id === commentId ? { ...comment, status: 'replied', reply } : comment) } : current)
    setNotice('Reply draft saved locally. It was not sent.')
  }

  const handleAddContact = ({ name, phone, optedIn }: { name: string; phone: string; optedIn: boolean }) => {
    const contact: WhatsAppConversation = { id: createId(), name, phone, optedIn, optedOut: false, consentCapturedAt: optedIn ? new Date() : undefined, messages: [], sample: false }
    setWorkspace(current => current ? { ...current, conversations: [contact, ...current.conversations] } : current)
    setNotice(optedIn ? 'Contact and recorded opt-in saved locally.' : 'Contact saved locally without messaging consent.')
  }

  const handleSaveWhatsAppMessage = (conversationId: string, body: string, kind: 'freeform' | 'template') => {
    setWorkspace(current => current ? { ...current, conversations: current.conversations.map(conversation => conversation.id === conversationId ? { ...conversation, messages: [...conversation.messages, { id: createId(), direction: 'outbound', body, kind, sentAt: new Date() }] } : conversation) } : current)
    setNotice('WhatsApp message draft saved locally. No message was sent.')
  }

  const handleRecordOptIn = (conversationId: string) => {
    setWorkspace(current => current ? { ...current, conversations: current.conversations.map(conversation => conversation.id === conversationId ? { ...conversation, optedIn: true, optedOut: false, consentCapturedAt: new Date() } : conversation) } : current)
    setNotice('New opt-in recorded locally. Keep the underlying consent record for real use.')
  }

  const handleRecordOptOut = (conversationId: string) => {
    setWorkspace(current => current ? { ...current, conversations: current.conversations.map(conversation => conversation.id === conversationId ? { ...conversation, optedIn: false, optedOut: true, optedOutAt: new Date() } : conversation) } : current)
    setNotice('Opt-out recorded locally. This contact is blocked from messaging.')
  }

  const handleSaveSettings = (settings: WorkspaceSettings) => {
    setWorkspace(current => current ? { ...current, settings } : current)
    setNotice('Workspace preferences saved on this device.')
  }

  const handleResetWorkspace = async () => {
    const initial = await resetWorkspace()
    setWorkspace(initial)
    setStorageStatus('saved')
    setNotice('Local workspace cleared.')
  }

  const handleImportWorkspace = async (data: WorkspaceData) => {
    setWorkspace(data)
    setNotice('Backup loaded. Saving the restored workspace on this device.')
  }

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    setInstallPrompt(null)
    setNotice(choice.outcome === 'accepted' ? 'OmniChat was added to your device.' : 'Install can be started later from your browser menu.')
  }

  const toggleTheme = () => setIsDark(current => !current)

  if (!workspace) return <div className="app-loading" role="status"><span className="brand-mark">O</span><p>Opening your local workspace…</p></div>

  const displayName = workspace.settings.displayName

  return <div className="app-shell">
    <Header isDark={isDark} isNavigationOpen={isNavigationOpen} onToggleNavigation={() => setIsNavigationOpen(current => !current)} onToggleTheme={toggleTheme} isOnline={isOnline} canInstall={Boolean(installPrompt)} onInstall={handleInstall} />
    <div className="app-mode-banner"><span className="mode-banner-dot" /><span>Local workspace</span><span>·</span><span>{storageStatus === 'saving' ? 'Saving changes…' : storageStatus === 'error' ? 'Storage unavailable' : 'Saved in this browser'}</span><span className="mode-banner-spacer" /><span>Social API connections are not configured</span></div>
    <div className="app-layout">
      <Sidebar currentPage={currentPage} isOpen={isNavigationOpen} onNavigate={() => setIsNavigationOpen(false)} displayName={displayName} />
      <main className="main-content"><div className="page-container">
        {notice && <div className="notice" role="status" aria-live="polite"><p>{notice}</p><button className="icon-button notice-dismiss" type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button></div>}
        <div hidden={currentPage !== 'dashboard'}><Dashboard posts={workspace.posts} conversations={workspace.conversations} displayName={displayName} /></div>
        <div hidden={currentPage !== 'compose'}><PostComposer displayName={displayName} onCreatePost={handleCreatePost} /></div>
        <div hidden={currentPage !== 'comments'}><CommentsView comments={workspace.comments} onReply={handleReplyDraft} /></div>
        <div hidden={currentPage !== 'whatsapp'}><WhatsAppInbox conversations={workspace.conversations} onAddContact={handleAddContact} onSaveMessage={handleSaveWhatsAppMessage} onRecordOptIn={handleRecordOptIn} onRecordOptOut={handleRecordOptOut} /></div>
        <div hidden={currentPage !== 'analytics'}><Analytics posts={workspace.posts} conversations={workspace.conversations} /></div>
        <div hidden={currentPage !== 'settings'}><Settings settings={workspace.settings} workspace={workspace} storageStatus={storageStatus} onSave={handleSaveSettings} onReset={handleResetWorkspace} onImport={handleImportWorkspace} onNotice={setNotice} /></div>
      </div></main>
    </div>
  </div>
}

export default App
