export function Analytics() {
  const analyticsData = {
    overview: {
      totalReach: '2.4M',
      engagement: '12.5%',
      followers: '+2,847',
      posts: '124'
    },
    platforms: [
      { name: 'Twitter', reach: '1.2M', engagement: '15.2%', growth: '+12%' },
      { name: 'Instagram', reach: '800K', engagement: '8.7%', growth: '+8%' },
      { name: 'LinkedIn', reach: '300K', engagement: '18.5%', growth: '+15%' },
      { name: 'Facebook', reach: '100K', engagement: '5.2%', growth: '+3%' }
    ]
  }

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        {/* Header */}
        <div className="analytics-header">
          <h1 className="analytics-title">
            <span className="title-icon">📊</span>
            Analytics Dashboard
          </h1>
          <p className="analytics-subtitle">
            Advanced analytics and insights for your social media performance
          </p>
        </div>

        {/* Overview Cards */}
        <div className="analytics-overview">
          <div className="analytics-card glass">
            <div className="metric-icon">🌍</div>
            <div className="metric-content">
              <h3>Total Reach</h3>
              <div className="metric-value">{analyticsData.overview.totalReach}</div>
              <div className="metric-change positive">+18% this month</div>
            </div>
          </div>

          <div className="analytics-card glass">
            <div className="metric-icon">💖</div>
            <div className="metric-content">
              <h3>Engagement Rate</h3>
              <div className="metric-value">{analyticsData.overview.engagement}</div>
              <div className="metric-change positive">+2.3% this month</div>
            </div>
          </div>

          <div className="analytics-card glass">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>New Followers</h3>
              <div className="metric-value">{analyticsData.overview.followers}</div>
              <div className="metric-change positive">+24% this month</div>
            </div>
          </div>

          <div className="analytics-card glass">
            <div className="metric-icon">📝</div>
            <div className="metric-content">
              <h3>Total Posts</h3>
              <div className="metric-value">{analyticsData.overview.posts}</div>
              <div className="metric-change neutral">This month</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="analytics-charts">
          <div className="chart-card glass">
            <h3>Engagement Over Time</h3>
            <div className="chart-placeholder">
              <div className="chart-lines">
                <div className="chart-line chart-60"></div>
                <div className="chart-line chart-80"></div>
                <div className="chart-line chart-45"></div>
                <div className="chart-line chart-90"></div>
                <div className="chart-line chart-70"></div>
                <div className="chart-line chart-85"></div>
                <div className="chart-line chart-75"></div>
              </div>
              <p className="chart-label">Interactive charts coming soon! 📈</p>
            </div>
          </div>

          <div className="chart-card glass">
            <h3>Platform Performance</h3>
            <div className="platform-metrics">
              {analyticsData.platforms.map((platform) => (
                <div key={platform.name} className="platform-metric">
                  <div className="platform-name">{platform.name}</div>
                  <div className="platform-stats">
                    <div className="stat">
                      <span className="stat-label">Reach:</span>
                      <span className="stat-value">{platform.reach}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Engagement:</span>
                      <span className="stat-value">{platform.engagement}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Growth:</span>
                      <span className="stat-value growth-positive">{platform.growth}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="insights-section">
          <div className="insights-card glass">
            <h3>🎯 Key Insights</h3>
            <div className="insights-list">
              <div className="insight-item">
                <div className="insight-icon">🚀</div>
                <div className="insight-content">
                  <h4>Peak Engagement</h4>
                  <p>Your posts perform best on Tuesdays at 3 PM</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">💡</div>
                <div className="insight-content">
                  <h4>Content Type</h4>
                  <p>Video posts get 3x more engagement than images</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">📱</div>
                <div className="insight-content">
                  <h4>Platform Growth</h4>
                  <p>LinkedIn shows the highest engagement rate at 18.5%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="recommendations-card glass">
            <h3>💎 Recommendations</h3>
            <div className="recommendations-list">
              <div className="recommendation-item">
                <div className="recommendation-priority high">High</div>
                <div className="recommendation-content">
                  <h4>Increase Video Content</h4>
                  <p>Create more video posts to boost engagement by up to 40%</p>
                </div>
              </div>
              <div className="recommendation-item">
                <div className="recommendation-priority medium">Medium</div>
                <div className="recommendation-content">
                  <h4>Optimize Posting Times</h4>
                  <p>Schedule more posts during peak hours (2-4 PM)</p>
                </div>
              </div>
              <div className="recommendation-item">
                <div className="recommendation-priority low">Low</div>
                <div className="recommendation-content">
                  <h4>Hashtag Strategy</h4>
                  <p>Use 5-7 hashtags per post for optimal reach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}