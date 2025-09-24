import { useState } from 'react'
import { socialPlatforms } from '../data/mockData'

export function PostComposer() {
  const [postContent, setPostContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'instagram'])
  const [scheduleDate, setScheduleDate] = useState('')

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const characterLimit = 280
  const remainingChars = characterLimit - postContent.length

  return (
    <div className="composer-page">
      <div className="composer-container">
        {/* Header */}
        <div className="composer-header">
          <h1 className="composer-title">
            <span className="title-icon">✨</span>
            Create Post
          </h1>
          <p className="composer-subtitle">
            Compose and schedule posts across multiple social media platforms
          </p>
        </div>

        {/* Main Composer */}
        <div className="composer-main">
          <div className="composer-card glass">
            <div className="composer-card-header">
              <h3>Compose Your Post</h3>
              <div className="char-counter">
                <span className={remainingChars < 0 ? 'over-limit' : 'under-limit'}>
                  {remainingChars} characters remaining
                </span>
              </div>
            </div>
            
            <textarea
              className="composer-textarea"
              placeholder="What's on your mind? Share it with the world..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={6}
            />

            <div className="media-upload-area">
              <div className="upload-zone">
                <div className="upload-icon">📎</div>
                <p>Click to upload or drag and drop</p>
                <span>PNG, JPG, GIF up to 10MB</span>
              </div>
            </div>

            <div className="schedule-section">
              <label htmlFor="schedule-input" className="schedule-label">Schedule Post (Optional)</label>
              <input
                id="schedule-input"
                type="datetime-local"
                className="schedule-input"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                title="Schedule your post for later"
              />
              <button className="schedule-btn">📅 Schedule</button>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="platform-selection-card glass">
            <h3>Select Platforms</h3>
            <div className="platform-grid">
              {socialPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`platform-option ${
                    selectedPlatforms.includes(platform.id) ? 'selected' : ''
                  } ${platform.connected ? 'connected' : 'disconnected'}`}
                  onClick={() => platform.connected && togglePlatform(platform.id)}
                >
                  <div className="platform-icon">{platform.icon}</div>
                  <div className="platform-info">
                    <h4>{platform.name}</h4>
                    <p>{platform.connected ? `${(platform.followers || 0).toLocaleString()} followers` : 'Not connected'}</p>
                  </div>
                  {platform.connected && (
                    <div className="platform-checkbox">
                      {selectedPlatforms.includes(platform.id) ? '✅' : '⭕'}
                    </div>
                  )}
                  {!platform.connected && (
                    <button className="connect-platform-btn">Connect</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="composer-actions">
            <button className="action-btn secondary">Save Draft</button>
            <button className="action-btn primary">
              <span>Post Now</span>
              <span>🚀</span>
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <div className="preview-card glass">
            <h3>Preview</h3>
            <div className="preview-content">
              {selectedPlatforms.map((platformId) => {
                const platform = socialPlatforms.find(p => p.id === platformId)
                return platform ? (
                  <div key={platformId} className="platform-preview">
                    <div className="preview-header">
                      <span className="platform-badge">{platform.icon} {platform.name}</span>
                    </div>
                    <div className="preview-post">
                      <div className="post-avatar">👤</div>
                      <div className="post-content">
                        <div className="post-author">Your Account</div>
                        <div className="post-text">
                          {postContent || "Your post content will appear here..."}
                        </div>
                        <div className="post-actions">
                          <span>❤️ Like</span>
                          <span>💬 Comment</span>
                          <span>🔄 Share</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}