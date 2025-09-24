import { useState } from 'react'

export function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    comments: true,
    mentions: true
  })
  
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showFollowers: true,
    analyticsPublic: false
  })

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <h1 className="settings-title">
            <span className="title-icon">⚙️</span>
            Settings
          </h1>
          <p className="settings-subtitle">
            Manage your account preferences and platform settings
          </p>
        </div>

        <div className="settings-content">
          {/* Profile Settings */}
          <div className="settings-section glass">
            <h2>👤 Profile Settings</h2>
            <div className="settings-group">
              <div className="profile-preview">
                <div className="profile-avatar">
                  <div className="avatar-placeholder">👤</div>
                  <button className="avatar-edit">📷</button>
                </div>
                <div className="profile-info">
                  <h3>Your Name</h3>
                  <p>@yourusername</p>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  className="form-input"
                  placeholder="Enter your display name"
                  defaultValue="Your Name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  className="form-textarea"
                  placeholder="Tell people about yourself..."
                  rows={3}
                  defaultValue="Social media enthusiast 🚀 | Content creator | Digital marketer"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="url"
                  className="form-input"
                  placeholder="https://your-website.com"
                />
              </div>
            </div>
          </div>

          {/* Connected Platforms */}
          <div className="settings-section glass">
            <h2>🔗 Connected Platforms</h2>
            <div className="platforms-list">
              <div className="platform-item connected">
                <div className="platform-info">
                  <span className="platform-icon">🐦</span>
                  <div>
                    <h4>Twitter</h4>
                    <p>@yourusername • 15.2K followers</p>
                  </div>
                </div>
                <div className="platform-actions">
                  <button className="btn-secondary">Settings</button>
                  <button className="btn-danger">Disconnect</button>
                </div>
              </div>
              
              <div className="platform-item connected">
                <div className="platform-info">
                  <span className="platform-icon">📷</span>
                  <div>
                    <h4>Instagram</h4>
                    <p>@yourusername • 8.5K followers</p>
                  </div>
                </div>
                <div className="platform-actions">
                  <button className="btn-secondary">Settings</button>
                  <button className="btn-danger">Disconnect</button>
                </div>
              </div>
              
              <div className="platform-item">
                <div className="platform-info">
                  <span className="platform-icon">🎵</span>
                  <div>
                    <h4>TikTok</h4>
                    <p>Not connected</p>
                  </div>
                </div>
                <div className="platform-actions">
                  <button className="btn-primary">Connect</button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-section glass">
            <h2>🔔 Notifications</h2>
            <div className="settings-group">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Email Notifications</h4>
                  <p>Receive updates via email</p>
                </div>
                <label className="toggle-switch" htmlFor="email-notifications">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                    aria-label="Enable email notifications"
                    title="Toggle email notifications on/off"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Push Notifications</h4>
                  <p>Get instant alerts on your device</p>
                </div>
                <label className="toggle-switch" htmlFor="push-notifications">
                  <input
                    id="push-notifications"
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                    aria-label="Enable push notifications"
                    title="Toggle push notifications on/off"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Comment Notifications</h4>
                  <p>Alert when someone comments on your posts</p>
                </div>
                <label className="toggle-switch" htmlFor="comment-notifications">
                  <input
                    id="comment-notifications"
                    type="checkbox"
                    checked={notifications.comments}
                    onChange={(e) => setNotifications(prev => ({ ...prev, comments: e.target.checked }))}
                    aria-label="Enable comment notifications"
                    title="Toggle comment notifications on/off"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Mentions & Tags</h4>
                  <p>Notify when you're mentioned or tagged</p>
                </div>
                <label className="toggle-switch" htmlFor="mentions-notifications">
                  <input
                    id="mentions-notifications"
                    type="checkbox"
                    checked={notifications.mentions}
                    onChange={(e) => setNotifications(prev => ({ ...prev, mentions: e.target.checked }))}
                    aria-label="Enable mentions and tags notifications"
                    title="Toggle mentions and tags notifications on/off"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="settings-section glass">
            <h2>🔒 Privacy & Security</h2>
            <div className="settings-group">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Public Profile</h4>
                  <p>Make your profile visible to everyone</p>
                </div>
                <label className="toggle-switch" htmlFor="public-profile">
                  <input
                    id="public-profile"
                    type="checkbox"
                    checked={privacy.profilePublic}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, profilePublic: e.target.checked }))}
                    aria-label="Make profile public"
                    title="Toggle public profile visibility"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Show Follower Count</h4>
                  <p>Display your follower numbers publicly</p>
                </div>
                <label className="toggle-switch" htmlFor="show-followers">
                  <input
                    id="show-followers"
                    type="checkbox"
                    checked={privacy.showFollowers}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, showFollowers: e.target.checked }))}
                    aria-label="Show follower count publicly"
                    title="Toggle public follower count display"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Public Analytics</h4>
                  <p>Allow others to see your post analytics</p>
                </div>
                <label className="toggle-switch" htmlFor="public-analytics">
                  <input
                    id="public-analytics"
                    type="checkbox"
                    checked={privacy.analyticsPublic}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, analyticsPublic: e.target.checked }))}
                    aria-label="Make analytics public"
                    title="Toggle public analytics visibility"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="settings-section danger-zone glass">
            <h2>⚠️ Danger Zone</h2>
            <div className="settings-group">
              <div className="danger-item">
                <div className="danger-info">
                  <h4>Export Data</h4>
                  <p>Download all your data including posts, comments, and analytics</p>
                </div>
                <button className="btn-secondary">Export Data</button>
              </div>
              
              <div className="danger-item">
                <div className="danger-info">
                  <h4>Deactivate Account</h4>
                  <p>Temporarily disable your account and all connected platforms</p>
                </div>
                <button className="btn-warning">Deactivate</button>
              </div>
              
              <div className="danger-item">
                <div className="danger-info">
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account and all associated data</p>
                </div>
                <button className="btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-footer">
          <button className="save-settings-btn">
            <span>💾 Save All Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}