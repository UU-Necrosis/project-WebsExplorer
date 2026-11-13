import './css/UserHomePage.css'

const trendingTopics = ['Generative AI', 'Web Comics', 'Dev Tools', 'Design & UI', 'Media']

const categories = [
  { name: 'AI & Machine Learning', count: '4,820 websites', icon: 'neurology', tone: 'mint' },
  { name: 'Developer Tools', count: '5,340 websites', icon: 'terminal', tone: 'blue' },
  { name: 'Design & Creativity', count: '3,210 websites', icon: 'palette', tone: 'rose' },
  { name: 'SaaS & Productivity', count: '5,420 websites', icon: 'dashboard', tone: 'gold' },
]

const recommendedSites = [
  { name: 'Perplexity', category: 'AI research', rating: '4.9', description: 'Explore the web with cited answers and focused research.', badge: 'Trending' },
  { name: 'Linear', category: 'Project management', rating: '4.8', description: 'A fast, thoughtful workspace for planning and shipping software.', badge: 'Editor pick' },
  { name: 'Excalidraw', category: 'Visual collaboration', rating: '4.8', description: 'Turn rough ideas into diagrams with a hand-drawn feel.', badge: 'Community favorite' },
]

const newSites = [
  { name: 'Spline', category: '3D design', date: 'Added today' },
  { name: 'Read.cv', category: 'Professional community', date: 'Added today' },
  { name: 'OpenAlternative', category: 'Open-source software', date: 'Added yesterday' },
]

export default function UserHomePage() {
  return (
    <div className="user-home" data-theme="client">
      <div className="user-home__shell">
        <header className="user-home__header">
          <a className="user-home__brand" href="/" aria-label="WebExplorer home">
            <span className="user-home__brand-mark">W</span>
            <span className="user-home__brand-name">Web<span>Explorer</span></span>
          </a>

          <nav className="user-home__nav" aria-label="Main navigation">
            <a className="user-home__nav-active" href="discover">Discover</a>
            <a href="categories">Categories</a>
            <a href="new-sites">New websites</a>
          </nav>

          <div className="user-home__header-actions">
            <a className="user-home__saved-link" href="saved">
              <span className="material-symbols-outlined" aria-hidden="true">bookmark</span>
              Saved
            </a>
            <a className="user-home__submit-link" href="submit">
              <span className="material-symbols-outlined" aria-hidden="true">add</span>
              Submit a site
            </a>
            <button type="button" className="user-home__account" aria-label="Account menu">
              <span className="material-symbols-outlined" aria-hidden="true">person</span>
            </button>
          </div>
        </header>

        <main className="user-home__main" id="discover">
          <section className="user-home__hero">
            <div className="user-home__hero-copy">
              <span className="user-home__eyebrow"><span /> A better corner of the internet</span>
              <h1>Find your next<br /><span>favorite website.</span></h1>
              <p>Explore useful tools and unexpected finds, backed by people who actually use them.</p>
            </div>

            <form className="user-home__search" onSubmit={(event) => event.preventDefault()}>
              <label className="user-home__search-field">
                <span className="material-symbols-outlined" aria-hidden="true">search</span>
                <input type="search" placeholder="Search websites, categories, or tags" aria-label="Search websites, categories, or tags" />
                <kbd>/</kbd>
              </label>
              <button type="submit">Explore</button>
            </form>

            <div className="user-home__trending">
              <span>Trending</span>
              {trendingTopics.map((topic) => <a key={topic} href="#categories">{topic}</a>)}
            </div>
          </section>

          <section className="user-home__section" id="categories">
            <div className="user-home__section-heading">
              <div>
                <span className="user-home__section-kicker">Start somewhere</span>
                <h2>Explore categories</h2>
              </div>
              <a href="#categories" className="user-home__text-link">Browse all <span aria-hidden="true">→</span></a>
            </div>

            <div className="user-home__category-grid">
              {categories.map((category) => (
                <a href="#recommended" key={category.name} className={`user-home__category user-home__category--${category.tone}`}>
                  <span className="material-symbols-outlined" aria-hidden="true">{category.icon}</span>
                  <span className="user-home__category-copy">
                    <strong>{category.name}</strong>
                    <small>{category.count}</small>
                  </span>
                  <span className="material-symbols-outlined user-home__category-arrow" aria-hidden="true">arrow_outward</span>
                </a>
              ))}
            </div>
          </section>

          <section className="user-home__section" id="recommended">
            <div className="user-home__section-heading">
              <div>
                <span className="user-home__section-kicker">Picked by the community</span>
                <h2>Worth a closer look</h2>
              </div>
              <a href="#recommended" className="user-home__text-link">See top-rated sites <span aria-hidden="true">→</span></a>
            </div>

            <div className="user-home__site-grid">
              {recommendedSites.map((site, index) => (
                <article className="user-home__site-card" key={site.name}>
                  <div className={`user-home__site-art user-home__site-art--${index + 1}`}>
                    <span className="user-home__site-monogram">{site.name.slice(0, 1)}</span>
                    <span className="user-home__site-badge">{site.badge}</span>
                    <button className="user-home__bookmark" type="button" aria-label={`Save ${site.name}`}>
                      <span className="material-symbols-outlined" aria-hidden="true">bookmark</span>
                    </button>
                  </div>
                  <div className="user-home__site-body">
                    <div className="user-home__site-title-row">
                      <div>
                        <h3>{site.name}</h3>
                        <span>{site.category}</span>
                      </div>
                      <span className="user-home__rating"><span className="material-symbols-outlined" aria-hidden="true">star</span>{site.rating}</span>
                    </div>
                    <p>{site.description}</p>
                    <a href="#recommended" className="user-home__visit-link">View website <span aria-hidden="true">↗</span></a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="user-home__new-sites" id="new-sites">
            <div className="user-home__section-heading">
              <div>
                <span className="user-home__section-kicker">Freshly discovered</span>
                <h2>Recently added</h2>
              </div>
              <a href="#new-sites" className="user-home__text-link">See all new sites <span aria-hidden="true">→</span></a>
            </div>

            <div className="user-home__new-list">
              {newSites.map((site, index) => (
                <a href="#new-sites" className="user-home__new-item" key={site.name}>
                  <span className={`user-home__new-icon user-home__new-icon--${index + 1}`}>{site.name.slice(0, 1)}</span>
                  <span className="user-home__new-copy"><strong>{site.name}</strong><small>{site.category}</small></span>
                  <span className="user-home__new-date">{site.date}</span>
                  <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                </a>
              ))}
            </div>
          </section>

          <section className="user-home__submit" id="submit">
            <div>
              <span className="user-home__section-kicker">Found something good?</span>
              <h2>Put a great website on the map.</h2>
              <p>Share it with the community and help someone else find their next favorite.</p>
            </div>
            <a href="#submit" className="user-home__submit-button"><span className="material-symbols-outlined" aria-hidden="true">add</span> Submit a website</a>
          </section>
        </main>
      </div>
    </div>
  )
}
