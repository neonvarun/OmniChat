import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AlertTriangle, Check, Download, HardDrive, Shield, Upload, UserRound } from 'lucide-react'
import { PlatformMark } from '../components/platform/PlatformMark'
import { socialPlatforms, type WorkspaceData, type WorkspaceSettings } from '../data/mockData'
import { createWorkspaceBackup, parseWorkspaceBackup } from '../lib/workspaceStorage'

interface SettingsProps {
  settings: WorkspaceSettings
  workspace: WorkspaceData
  storageStatus: 'loading' | 'saving' | 'saved' | 'error'
  onSave: (settings: WorkspaceSettings) => void
  onReset: () => Promise<void>
  onImport: (workspace: WorkspaceData) => Promise<void>
  onNotice: (message: string) => void
}

export function Settings({ settings, workspace, storageStatus, onSave, onReset, onImport, onNotice }: SettingsProps) {
  const [draft, setDraft] = useState(settings)
  const [isDirty, setIsDirty] = useState(false)
  const [isWorking, setIsWorking] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setDraft(settings); setIsDirty(false) }, [settings])

  const updateField = (field: 'displayName' | 'website' | 'bio', value: string) => {
    setDraft(current => ({ ...current, [field]: value }))
    setIsDirty(true)
  }

  const updateNotification = (field: keyof WorkspaceSettings['notifications'], checked: boolean) => {
    setDraft(current => ({ ...current, notifications: { ...current.notifications, [field]: checked } }))
    setIsDirty(true)
  }

  const saveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(draft)
    setIsDirty(false)
  }

  const exportBackup = async () => {
    setIsWorking(true)
    try {
      const json = await createWorkspaceBackup(workspace)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `omnichat-backup-${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      URL.revokeObjectURL(url)
      onNotice('Workspace backup downloaded, including media attachments.')
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Could not create a workspace backup.')
    } finally { setIsWorking(false) }
  }

  const importBackup = async (file?: File) => {
    if (!file) return
    setIsWorking(true)
    try {
      const imported = await parseWorkspaceBackup(file)
      if (!window.confirm(`Replace this browser's local workspace with the backup from ${file.name}?`)) return
      await onImport(imported)
      setDraft(imported.settings)
      setIsDirty(false)
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Could not read that workspace backup.')
    } finally {
      setIsWorking(false)
      if (importRef.current) importRef.current.value = ''
    }
  }

  const clearWorkspace = async () => {
    if (!window.confirm('Clear posts, comments, contacts, preferences, and sample conversations in this browser? Download a backup first if you need to keep this data.')) return
    setIsWorking(true)
    try { await onReset() } catch (error) { onNotice(error instanceof Error ? error.message : 'Could not reset this workspace.') }
    finally { setIsWorking(false) }
  }

  return <div className="settings-page">
    <header className="page-heading"><div className="page-heading-copy"><p className="eyebrow">Workspace</p><h1>Settings</h1><p>Manage this browser's local data and see what each platform needs before connection.</p></div></header>

    <form className="settings-form" onSubmit={saveSettings}>
      <section className="panel settings-section" aria-labelledby="profile-settings-title"><div className="panel-header"><h2 id="profile-settings-title"><UserRound size={17} aria-hidden="true" />Workspace profile</h2></div><div className="panel-body profile-form-grid">
        <div className="profile-summary"><span className="profile-avatar" aria-hidden="true">{(draft.displayName || 'Y').slice(0, 1).toUpperCase()}</span><span><strong>{draft.displayName || 'Your Name'}</strong><small>Local display only</small></span></div>
        <div className="form-field"><label className="field-label" htmlFor="display-name">Display name</label><input className="field-control" id="display-name" value={draft.displayName} onChange={event => updateField('displayName', event.target.value)} /></div>
        <div className="form-field"><label className="field-label" htmlFor="profile-website">Website</label><input className="field-control" id="profile-website" type="url" placeholder="https://your-website.com" value={draft.website} onChange={event => updateField('website', event.target.value)} /></div>
        <div className="form-field profile-bio-field"><label className="field-label" htmlFor="profile-bio">Bio</label><textarea className="field-control settings-textarea" id="profile-bio" rows={3} value={draft.bio} onChange={event => updateField('bio', event.target.value)} /></div>
      </div></section>

      <section className="panel settings-section" aria-labelledby="platform-readiness-title"><div className="panel-header"><div><h2 id="platform-readiness-title">Platform readiness</h2><span className="panel-subtitle">No accounts are connected. API keys and OAuth setup can be added in a later phase.</span></div><span className="status-pill disconnected">0 connected</span></div><ul className="platform-requirements-list">
        {socialPlatforms.map(platform => <li key={platform.id}><PlatformMark platformId={platform.id} large /><div className="platform-requirement-copy"><strong>{platform.name}<span>{platform.purpose === 'messaging' ? 'Messaging' : 'Publishing'}</span></strong><small>{platform.accessNote}</small></div><span className="status-pill disconnected">API setup later</span></li>)}
      </ul><p className="api-security-note"><Shield size={16} aria-hidden="true" /><span>API secrets must be stored by a server-side integration. A static browser app and its IndexedDB are not a safe place for provider secrets.</span></p></section>

      <section className="panel settings-section" aria-labelledby="notification-settings-title"><div className="panel-header"><div><h2 id="notification-settings-title">Notification preferences</h2><span className="panel-subtitle">Saved locally; delivery needs an account or notification service later.</span></div></div><div className="settings-toggle-list">
        <PreferenceToggle title="Email Notifications" description="Preference for future account email alerts" checked={draft.notifications.email} onChange={checked => updateNotification('email', checked)} />
        <PreferenceToggle title="Push Notifications" description="Preference for future device notifications" checked={draft.notifications.push} onChange={checked => updateNotification('push', checked)} />
        <PreferenceToggle title="Comment Notifications" description="Preference for new comments after API setup" checked={draft.notifications.comments} onChange={checked => updateNotification('comments', checked)} />
        <PreferenceToggle title="Mentions & Tags" description="Preference for mentions after API setup" checked={draft.notifications.mentions} onChange={checked => updateNotification('mentions', checked)} />
      </div></section>

      <section className="panel local-data-panel" aria-labelledby="local-data-title"><div className="panel-header"><div><h2 id="local-data-title"><HardDrive size={17} aria-hidden="true" />Local data</h2><span className="panel-subtitle">Stored in this browser's IndexedDB on this device.</span></div><span className={`status-pill ${storageStatus === 'error' ? 'disconnected' : storageStatus === 'saving' ? 'pending' : 'connected'}`}>{storageStatus === 'error' ? 'Storage error' : storageStatus === 'saving' ? 'Saving' : 'Saved'}</span></div>
        <div className="local-data-stats"><span><strong>{workspace.posts.length}</strong> posts</span><span><strong>{workspace.comments.length}</strong> comments</span><span><strong>{workspace.conversations.length}</strong> WhatsApp contacts</span><span><strong>{workspace.posts.reduce((count, post) => count + post.attachments.length, 0)}</strong> media files</span></div>
        <p className="local-data-copy">Local data is not synced across devices. Export a backup before clearing browser data or moving to another device. Backups include attached media and consent fields.</p>
        <div className="local-data-actions"><button className="button button-secondary" type="button" disabled={isWorking} onClick={exportBackup}><Download size={15} aria-hidden="true" />Export backup</button><button className="button button-secondary" type="button" disabled={isWorking} onClick={() => importRef.current?.click()}><Upload size={15} aria-hidden="true" />Import backup</button><input ref={importRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Choose an OmniChat JSON backup" onChange={event => void importBackup(event.target.files?.[0])} /><button className="button button-danger" type="button" disabled={isWorking} onClick={() => void clearWorkspace()}><AlertTriangle size={15} aria-hidden="true" />Reset workspace</button></div>
      </section>

      <footer className="settings-save-bar"><span className={isDirty ? 'save-state is-unsaved' : 'save-state'}><Check size={15} aria-hidden="true" />{isDirty ? 'Unsaved preferences' : 'Preferences saved'}</span><button className="button button-primary" type="submit" disabled={!isDirty}>Save preferences</button></footer>
    </form>
  </div>
}

function PreferenceToggle({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  const id = `preference-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return <div className="preference-row"><label className="preference-copy" htmlFor={id}><strong>{title}</strong><span>{description}</span></label><label className="switch-control" htmlFor={id}><input id={id} type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} /><span className="switch-visual" aria-hidden="true" /></label></div>
}
