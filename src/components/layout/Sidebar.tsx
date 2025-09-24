import { socialPlatforms } from '../../data/mockData'
import { formatNumber } from '../../lib/utils'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* Connected Platforms */}
        <div className="sidebar-card">
          <h3>Connected Platforms</h3>
          <div className="platform-list">
            {socialPlatforms.map((platform) => (
              <div key={platform.id} className="platform-item">
                <div className="platform-info">
                  <span className="platform-icon">{platform.icon}</span>
                  <div className="platform-details">
                    <p>{platform.name}</p>
                    <p className="platform-followers">
                      {formatNumber(platform.followers || 0)} followers
                    </p>
                  </div>
                </div>
                <div className={`status-badge ${platform.connected ? 'connected' : 'disconnected'}`}>
                  {platform.connected ? "✓" : "○"}
                </div>
              </div>
            ))}
          </div>
          <button className="connect-button">
            + Connect Platform
          </button>
        </div>

        {/* Quick Stats */}
        <div className="sidebar-card">
          <h3>Quick Stats</h3>
          <div className="stats-list">
            <div className="stat-row">
              <span>Total Posts</span>
              <span>124</span>
            </div>
            <div className="stat-row">
              <span>Total Engagement</span>
              <span>8.2K</span>
            </div>
            <div className="stat-row">
              <span>This Month</span>
              <span>+24%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="sidebar-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              📝 New post published to 3 platforms
            </div>
            <div className="activity-item">
              💬 5 new comments received
            </div>
            <div className="activity-item">
              📈 Engagement up 15% today
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}