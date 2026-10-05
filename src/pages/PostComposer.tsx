import { useEffect, useState } from 'react'
import { CalendarDays, Check, ImagePlus, Info, Send, Video } from 'lucide-react'
import { PlatformMark } from '../components/platform/PlatformMark'
import { socialPlatforms, type PlatformId, type Post } from '../data/mockData'

interface PostComposerProps {
  displayName: string
  onCreatePost: (post: { content: string; youtubeTitle?: string; platforms: PlatformId[]; status: Post['status']; scheduledAt?: Date; attachments: Post['attachments'] }) => void
}

const publishingPlatforms = socialPlatforms.filter(platform => platform.purpose === 'publishing')
const characterLimits: Record<PlatformId, number> = { linkedin: 3000, youtube: 5000, instagram: 2200, facebook: 63206, whatsapp: 0 }

export function PostComposer({ displayName, onCreatePost }: PostComposerProps) {
  const [postContent, setPostContent] = useState('')
  const [youtubeTitle, setYoutubeTitle] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(['linkedin', 'facebook'])
  const [scheduleDate, setScheduleDate] = useState('')
  const [activePreview, setActivePreview] = useState<PlatformId>('linkedin')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selectedPlatforms.includes(activePreview)) setActivePreview(selectedPlatforms[0] ?? 'linkedin')
  }, [selectedPlatforms, activePreview])

  const togglePlatform = (platformId: PlatformId) => {
    setSelectedPlatforms(current => current.includes(platformId) ? current.filter(id => id !== platformId) : [...current, platformId])
  }

  const characterLimit = selectedPlatforms.length ? Math.min(...selectedPlatforms.map(id => characterLimits[id])) : 63206
  const remainingChars = characterLimit - postContent.length
  const hasImage = selectedFiles.some(file => file.type.startsWith('image/'))
  const hasVideo = selectedFiles.some(file => file.type.startsWith('video/'))

  const saveWithStatus = (status: Post['status']) => {
    setError('')
    if (!postContent.trim() && selectedFiles.length === 0) return setError('Add post text or an attachment before saving.')
    if (status !== 'draft' && selectedPlatforms.length === 0) return setError('Select at least one publishing platform for the local outbox.')
    if (remainingChars < 0) return setError(`This text exceeds the ${characterLimit.toLocaleString()} character limit for a selected platform.`)
    if (selectedPlatforms.includes('instagram') && !hasImage && !hasVideo) return setError('Instagram publishing needs an image or video. Add media or remove Instagram from this post.')
    if (selectedPlatforms.includes('youtube')) {
      if (!youtubeTitle.trim()) return setError('Add a YouTube video title before queuing this post.')
      if (!hasVideo) return setError('YouTube video uploads need a video file. Add one or remove YouTube from this post.')
    }
    if (status === 'scheduled') {
      const timestamp = new Date(scheduleDate).getTime()
      if (!scheduleDate || timestamp <= Date.now()) return setError('Choose a future date and time to schedule this post.')
    }
    onCreatePost({
      content: postContent.trim(),
      youtubeTitle: selectedPlatforms.includes('youtube') ? youtubeTitle.trim() : undefined,
      platforms: selectedPlatforms,
      status,
      scheduledAt: status === 'scheduled' ? new Date(scheduleDate) : undefined,
      attachments: selectedFiles.map(file => ({ id: createId(), name: file.name, type: file.type, size: file.size, blob: file })),
    })
    if (status !== 'draft') {
      setPostContent('')
      setYoutubeTitle('')
      setSelectedFiles([])
      setScheduleDate('')
    }
  }

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    const incoming = [...files]
    const invalid = incoming.find(file => file.size > 10 * 1024 * 1024)
    if (invalid) return setError(`${invalid.name} is over the 10MB local attachment limit.`)
    setError('')
    setSelectedFiles(current => [...current, ...incoming].slice(0, 4))
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const previewPlatform = publishingPlatforms.find(platform => platform.id === activePreview)
  const minScheduleDate = new Date(Date.now() + 60_000)
  minScheduleDate.setMinutes(minScheduleDate.getMinutes() - minScheduleDate.getTimezoneOffset())

  return <div className="composer-page">
    <header className="page-heading"><div className="page-heading-copy"><p className="eyebrow">Local publishing</p><h1>Create post</h1><p>Prepare platform-specific content, save drafts, and build a local outbox for API setup later.</p></div><span className="status-pill disconnected">Nothing is sent</span></header>

    <form className="composer-layout" onSubmit={event => { event.preventDefault(); saveWithStatus(scheduleDate ? 'scheduled' : 'queued') }}>
      <div className="composer-main-column">
        <section className="panel composer-editor">
          <div className="panel-header"><h2>Post content</h2><span className={`character-count ${remainingChars < 0 ? 'is-over' : ''}`}>{remainingChars.toLocaleString()} characters remaining</span></div>
          <div className="composer-editor-body">
            <label className="sr-only" htmlFor="post-content">Post content or description</label>
            <textarea id="post-content" className="field-control composer-textarea" placeholder="Write your post or video description..." value={postContent} onChange={event => setPostContent(event.target.value)} />
            <p className="field-helper"><span>Text limit follows the shortest selected channel.</span><span>{characterLimit.toLocaleString()} max</span></p>
            {selectedPlatforms.includes('youtube') && <div className="form-field youtube-title-field"><label className="field-label" htmlFor="youtube-title">YouTube video title</label><input id="youtube-title" className="field-control" maxLength={100} value={youtubeTitle} onChange={event => setYoutubeTitle(event.target.value)} placeholder="Add a title for the video" /><span className="field-helper">{youtubeTitle.length}/100 · YouTube selection also requires a video file.</span></div>}

            <div className="media-toolbar" aria-label="Add media">
              <label className="icon-button media-picker" title="Add images"><ImagePlus size={18} aria-hidden="true" /><span className="sr-only">Add images</span><input type="file" accept="image/png,image/jpeg,image/gif,image/webp" multiple onChange={event => addFiles(event.target.files)} /></label>
              <label className="icon-button media-picker" title="Add a video"><Video size={18} aria-hidden="true" /><span className="sr-only">Add a video</span><input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={event => addFiles(event.target.files)} /></label>
              <span className="media-limit">Images and video · 10MB each · up to 4 files</span>
            </div>
            {selectedFiles.length > 0 && <ul className="selected-file-list">{selectedFiles.map((file, index) => <li className="selected-file" key={`${file.name}-${index}`}><span><Check size={15} aria-hidden="true" />{file.name} <small>{(file.size / 1024 / 1024).toFixed(1)}MB</small></span><button className="icon-button" type="button" aria-label={`Remove ${file.name}`} onClick={() => setSelectedFiles(current => current.filter((_, fileIndex) => fileIndex !== index))}>×</button></li>)}</ul>}
          </div>
        </section>

        <section className="panel schedule-panel"><div className="panel-header"><div><h2>Schedule locally</h2><span className="panel-subtitle">Optional · {timezone}</span></div><CalendarDays size={17} aria-hidden="true" /></div><div className="panel-body schedule-fields"><div className="form-field"><label className="field-label" htmlFor="schedule-input">Date and time</label><input id="schedule-input" type="datetime-local" className="field-control" value={scheduleDate} onChange={event => setScheduleDate(event.target.value)} min={minScheduleDate.toISOString().slice(0, 16)} /></div><div className="schedule-hint"><Info size={15} aria-hidden="true" /><span>Due items move into the local outbox the next time this app is open. This static app cannot publish in the background.</span></div></div></section>

        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="composer-actions"><button className="button button-secondary" type="button" onClick={() => saveWithStatus('draft')}>Save draft</button><button className="button button-primary" type="submit"><Send size={15} aria-hidden="true" />{scheduleDate ? 'Save schedule' : 'Add to outbox'}</button></div>
        <p className="demo-note">Adding to the outbox saves a local record only. Account authorization and delivery are not configured.</p>
      </div>

      <div className="composer-side-column">
        <section className="panel channel-panel"><div className="panel-header"><div><h2>Publishing channels</h2><span className="panel-subtitle">{selectedPlatforms.length} selected · local mode</span></div><a className="text-link" href="#settings">API setup</a></div><div className="channel-list">
          {publishingPlatforms.map(platform => {
            const selected = selectedPlatforms.includes(platform.id)
            return <button className={`channel-option ${selected ? 'is-selected' : ''}`} key={platform.id} type="button" aria-pressed={selected} onClick={() => togglePlatform(platform.id)}><PlatformMark platformId={platform.id} large /><span className="channel-option-copy"><strong>{platform.name}</strong><span>{platform.id === 'instagram' ? 'Professional account + media required' : platform.id === 'youtube' ? 'Video upload + OAuth required' : 'API connection required'}</span></span><span className={`channel-check ${selected ? 'is-checked' : ''}`} aria-hidden="true">{selected && <Check size={13} />}</span></button>
          })}
        </div><p className="channel-whatsapp-note"><PlatformMark platformId="whatsapp" /> WhatsApp is a messaging inbox, not a public post channel. <a href="#whatsapp">Open inbox</a></p></section>

        <section className="panel preview-panel"><div className="panel-header"><h2>Preview</h2></div>{selectedPlatforms.length === 0 ? <div className="empty-state compact-empty"><p>Select a platform to preview post copy.</p></div> : <div className="panel-body"><div className="preview-tabs" role="tablist" aria-label="Platform preview">{selectedPlatforms.map(platformId => <button className={`preview-tab ${activePreview === platformId ? 'is-active' : ''}`} key={platformId} type="button" role="tab" aria-selected={activePreview === platformId} onClick={() => setActivePreview(platformId)}><PlatformMark platformId={platformId} />{socialPlatforms.find(item => item.id === platformId)?.name}</button>)}</div><div className="social-preview" role="tabpanel"><div className="social-preview-head"><span className="demo-avatar" aria-hidden="true">{(displayName || 'Y').slice(0, 1).toUpperCase()}</span><span><strong>{displayName || 'Your Name'}</strong><small>Local preview · not connected</small></span>{previewPlatform && <PlatformMark platformId={previewPlatform.id} />}</div><p className="social-preview-copy">{postContent || 'Your post copy will appear here.'}</p>{selectedFiles.map(file => <div className="preview-attachment" key={`${file.name}-preview`}>{file.type.startsWith('video/') ? <Video size={16} aria-hidden="true" /> : <ImagePlus size={16} aria-hidden="true" />}{file.name}</div>)}</div></div>}</section>
      </div>
    </form>
  </div>
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
