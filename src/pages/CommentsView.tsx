import { useState } from 'react'
import { mockComments, socialPlatforms } from '../data/mockData'
import { formatDate } from '../lib/utils'

export function CommentsView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  
  const filteredComments = mockComments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || comment.platform === selectedPlatform
    return matchesSearch && matchesPlatform
  })

  const getPlatformStats = () => {
    const stats = mockComments.reduce((acc, comment) => {
      acc[comment.platform] = (acc[comment.platform] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return stats
  }

  const platformStats = getPlatformStats()

  return (
    <div className="comments-page">
      <div className="comments-container">
        {/* Header */}
        <div className="comments-header">
          <div>
            <h1 className="comments-title">
              <span className="title-icon">💬</span>
              Comments & Mentions
            </h1>
            <p className="comments-subtitle">
              Monitor and respond to comments across all your social platforms
            </p>
          </div>
          <button className="analytics-btn">
            📊 Analytics
          </button>
        </div>

        {/* Search and Filters */}
        <div className="comments-filters">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search comments or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="platform-filters">
            <button
              className={`filter-btn ${selectedPlatform === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedPlatform('all')}
            >
              All Platforms ({mockComments.length})
            </button>
            {socialPlatforms
              .filter(platform => platformStats[platform.id])
              .map((platform) => (
                <button
                  key={platform.id}
                  className={`filter-btn ${selectedPlatform === platform.id ? 'active' : ''}`}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  {platform.icon} {platform.name} ({platformStats[platform.id] || 0})
                </button>
              ))}
          </div>
        </div>

        {/* Comment Stats */}
        <div className="stats-grid">
          <div className="stat-card glass">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Comments</h3>
              <div className="stat-value">{mockComments.length}</div>
              <div className="stat-change positive">+8 today</div>
            </div>
          </div>
          
          <div className="stat-card glass">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Replies</h3>
              <div className="stat-value">3</div>
              <div className="stat-change warning">Needs attention</div>
            </div>
          </div>
          
          <div className="stat-card glass">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Response Rate</h3>
              <div className="stat-value">94%</div>
              <div className="stat-change positive">Above average</div>
            </div>
          </div>
          
          <div className="stat-card glass">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>Avg Response Time</h3>
              <div className="stat-value">2.4h</div>
              <div className="stat-change positive">Excellent</div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="comments-list-card glass">
          <h3>Recent Comments</h3>
          <div className="comments-list">
            {filteredComments.length === 0 ? (
              <div className="no-comments">
                <div className="no-comments-icon">🔍</div>
                <p>No comments found matching your filters.</p>
                <span>Try adjusting your search terms or platform filters</span>
              </div>
            ) : (
              filteredComments.map((comment) => {
                const platform = socialPlatforms.find(p => p.id === comment.platform)
                return (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      {comment.avatar}
                    </div>
                    
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        {platform && (
                          <span className={`platform-badge ${comment.platform}`}>
                            {platform.icon} {platform.name}
                          </span>
                        )}
                        <span className="comment-time">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      
                      <p className="comment-text">{comment.content}</p>
                      
                      <div className="comment-actions">
                        <div className="comment-stats">
                          <span className="like-count">❤️ {comment.likes}</span>
                        </div>
                        <div className="action-buttons">
                          <button className="action-btn">💬 Reply</button>
                          <button className="action-btn">❤️ Like</button>
                          <button className="action-btn">🔄 Share</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          {filteredComments.length > 0 && (
            <div className="load-more-section">
              <button className="load-more-btn">
                Load More Comments
              </button>
            </div>
          )}
        </div>

        {/* Quick Reply Templates */}
        <div className="templates-card glass">
          <h3>Quick Reply Templates</h3>
          <div className="templates-grid">
            <div className="template-item">
              <h4>Thank You</h4>
              <p>"Thank you for your feedback! We really appreciate it. 🙏"</p>
            </div>
            <div className="template-item">
              <h4>More Info</h4>
              <p>"We'd love to help! Please send us a DM with more details."</p>
            </div>
            <div className="template-item">
              <h4>Follow Up</h4>
              <p>"Thanks for reaching out! We'll get back to you soon. 📧"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}