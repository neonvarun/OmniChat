import { mockPosts, mockComments, socialPlatforms } from '../data/mockData'
import { formatDate, formatNumber } from '../lib/utils'

export function Dashboard() {
  return (
    <div className="dashboard">
      {/* Hero Section with Post Creator */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Create & Manage
            <span className="gradient-text"> Social Content</span>
          </h1>
          <p className="hero-subtitle">
            Compose, schedule, and analyze your posts across all social media platforms in one place
          </p>
          
          {/* Central Post Creator */}
          <div className="post-creator-card">
            <div className="post-creator-header">
              <div className="creator-avatar">
                <div className="avatar-gradient">✨</div>
              </div>
              <div className="creator-info">
                <h3>What's on your mind?</h3>
                <p>Share with the world...</p>
              </div>
            </div>
            
            <textarea 
              className="post-input" 
              placeholder="Start typing your post here... 🚀"
              rows={3}
            />
            
            <div className="post-creator-actions">
              <div className="media-buttons">
                <button className="media-btn">📸 Photo</button>
                <button className="media-btn">🎥 Video</button>
                <button className="media-btn">📊 Poll</button>
                <button className="media-btn">📅 Schedule</button>
              </div>
              <div className="platform-selector">
                <span className="platform-label">Post to:</span>
                <div className="platform-badges">
                  <span className="platform-badge twitter">🐦 Twitter</span>
                  <span className="platform-badge instagram">📷 Instagram</span>
                  <span className="platform-badge linkedin">💼 LinkedIn</span>
                  <span className="platform-badge-add">+ Add</span>
                </div>
              </div>
              <button className="publish-btn">
                <span className="btn-text">Publish Now</span>
                <span className="btn-icon">🚀</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Posts</div>
          <div className="stat-value">124</div>
          <p className="stat-change positive">+12% from last month</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Engagement</div>
          <div className="stat-value">8.2K</div>
          <p className="stat-change positive">+24% from last month</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Connected Platforms</div>
          <div className="stat-value">
            {socialPlatforms.filter(p => p.connected).length}
          </div>
          <p className="stat-change neutral">
            {socialPlatforms.filter(p => !p.connected).length} more available
          </p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">This Week</div>
          <div className="stat-value">15</div>
          <p className="stat-change positive">+5 from last week</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Posts */}
        <div className="sidebar-card">
          <h3>Recent Posts</h3>
          <div className="activity-list">
            {mockPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="activity-item">
                <div className="activity-title">
                  {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                </div>
                <div className="activity-meta">
                  <span>{formatDate(post.createdAt)}</span>
                  <span>•</span>
                  <span>{post.status}</span>
                  <span>•</span>
                  <span>❤️ {formatNumber(post.likes)}</span>
                  <span>💬 {formatNumber(post.comments)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="sidebar-card">
          <h3>Recent Comments</h3>
          <div className="activity-list">
            {mockComments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="activity-item">
                <div className="comment-header">
                  <span className="comment-avatar">{comment.avatar}</span>
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-platform">
                    {socialPlatforms.find(p => p.id === comment.platform)?.name}
                  </span>
                </div>
                <div className="comment-content">
                  {comment.content.length > 80 ? comment.content.substring(0, 80) + '...' : comment.content}
                </div>
                <div className="activity-meta">
                  <span>{formatDate(comment.createdAt)}</span>
                  <span>•</span>
                  <span>❤️ {comment.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}