import './css/UserProfileHomePage.css'

const savedSites = [
  { name: 'Linear', category: 'Productivity', rating: '4.9' },
  { name: 'Notion', category: 'Workspace', rating: '4.8' },
  { name: 'Figma', category: 'Design', rating: '4.8' },
]

const activityFeed = [
  'You saved 3 new sites this week',
  'Your submission “Flow Studio” is under review',
  '2 communities you follow published new recommendations',
]

export default function UserHomePage() {
  return (
    <div className="user-home" data-theme="client">
      <div className="user-home__shell">
        <header className="user-home__header">
          <div className="user-home__brand">
            <div className="user-home__brand-mark">W</div>
            <div>
            <span className="user-home__brand-name">Web<span>Explorer</span></span>
              <div className="user-home__brand-tag">Member dashboard</div>
            </div>
          </div>

          <nav className="user-home__nav">
            <a href="#discover">Discover</a>
            <a href="#saved">Saved</a>
            <a href="#submissions">My submissions</a>
            <a href="#submit" className="user-home__nav-primary">Submit website</a>
          </nav>
        </header>

        <main className="user-home__main">
          <section className="user-home__welcome">
            <div>
              <div className="user-home__mini-label">Welcome back</div>
              <h1>Hello, Alex.</h1>
              <p>
                Your personal feed is ready. Discover trending tools, revisit your saves, and keep submitting the best sites you find.
              </p>
            </div>

            <div className="user-home__score">
              <div className="user-home__mini-label">Member score</div>
              <div className="user-home__score-value">94</div>
              <div className="user-home__score-text">Trusted curator</div>
            </div>
          </section>

          <section className="user-home__content-grid">
            <div className="user-home__panel">
              <div className="user-home__panel-head">
                <h2>Recommended for you</h2>
                <a href="#discover">View all</a>
              </div>

              <div className="user-home__list">
                {savedSites.map((site) => (
                  <div key={site.name} className="user-home__list-item">
                    <div className="user-home__site-meta">
                      <div className="user-home__site-badge">{site.name.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <div className="user-home__site-name">{site.name}</div>
                        <div className="user-home__site-category">{site.category}</div>
                      </div>
                    </div>
                    <div className="user-home__star-chip">
                      <span className="material-symbols-outlined">star</span>
                      {site.rating}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="user-home__panel">
              <h2>Activity</h2>
              <div className="user-home__activity">
                {activityFeed.map((item) => (
                  <div key={item} className="user-home__activity-item">
                    <span className="user-home__activity-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="user-home__stats-grid" id="saved">
            <div className="user-home__stat-card">
              <div className="user-home__mini-label">Saved</div>
              <div className="user-home__stat-value">18</div>
              <div className="user-home__stat-caption">Curated websites</div>
            </div>
            <div className="user-home__stat-card">
              <div className="user-home__mini-label">Submissions</div>
              <div className="user-home__stat-value">6</div>
              <div className="user-home__stat-caption">Approved this month</div>
            </div>
            <div className="user-home__stat-card">
              <div className="user-home__mini-label">Communities</div>
              <div className="user-home__stat-value">12</div>
              <div className="user-home__stat-caption">Followed spaces</div>
            </div>
          </section>

          <section className="user-home__cta" id="submit">
            <div className="user-home__cta-panel">
              <div className="user-home__mini-label">Member tools</div>
              <h2>Submit something useful to the directory</h2>
              <p>
                Found a site worth sharing? Add it to the directory and help other members discover tools they actually need.
              </p>
              <button type="button" className="user-home__cta-button">New submission</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
