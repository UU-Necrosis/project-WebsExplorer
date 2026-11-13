import './css/GuestHomePage.css'

const trendingTopics = ['Generative AI', 'Web Comics', 'Dev Tools', 'LLM Frameworks', 'Media & Streaming']

const reviewCards = [
  { initials: 'EK', name: 'Elena K', site: 'Cursor IDE', quote: 'Zero friction code generation while building web apps.', rating: 3, time: '2m ago' },
  { initials: 'MR', name: 'Marcus Reed', site: 'Midjourney', quote: 'v6.1 prompt adherence is incredible for creative design workflows.', rating: 5, time: '7m ago' },
  { initials: 'SL', name: 'Sarah Lin', site: 'Webtoon', quote: 'Smooth reader UI with seamless vertical scrolling and daily updates.', rating: 4, time: '11m ago' },
]

const categoryCards = [
  { title: 'AI & ML', metric: '4,820 websites' },
  { title: 'Web Comics', metric: '2,150 websites' },
  { title: 'Dev Tools', metric: '5,340 websites' },
  { title: 'Design & UI', metric: '3,210 websites' },
  { title: 'SaaS & Cloud', metric: '5,420 websites' },
  { title: 'Media & Streaming', metric: '3,120 websites' },
]

const featuredSites = [
  { name: 'Wikipedia', category: 'Knowledge base', score: '4.9' },
  { name: 'GitHub', category: 'Developer platform', score: '4.9' },
  { name: 'OpenAI', category: 'AI tools', score: '4.8' },
  { name: 'Reddit', category: 'Community', score: '4.7' },
  { name: 'YouTube', category: 'Video', score: '4.8' },
  { name: 'Stack Overflow', category: 'Developer help', score: '4.7' },
]

export default function GuestHomePage() {
  return (
    <div className="guest-home" data-theme="client">
      <div className="guest-home__bg" />

      <header className="guest-home__header">
        <div className="guest-home__brand">
          <div className="guest-home__brand-mark">W</div>
          <div>
            <div className="guest-home__brand-name">Web<span>Explorer</span></div>
            <div className="guest-home__brand-tag">Crowdsourced</div>
          </div>
        </div>

        <nav className="guest-home__nav" aria-label="Main navigation">
          <a href="#explore">Explore Niches</a>
          <a href="#featured">Most Rated</a>
          <a href="#recent">Recently Added</a>
          <a href="#submit">Submit</a>
        </nav>

        <div className="guest-home__actions">
          <a href="/admin/login" className="guest-home__ghost-button">Login</a>
        </div>
      </header>

      <main className="guest-home__main">
        <section className="guest-home__hero">
          <div className="guest-home__eyebrow">
            <span className="guest-home__eyebrow-dot" />
            Curated web discovery &amp; users provide
          </div>

          <h1>
            Find websites you <span>truly need.</span>
          </h1>

          <p>
            Discover curated tools, verified ratings, and top community reviews across the web.
          </p>

            <div className="guest-home__search-input guest-home__search-box">
              <span className="material-symbols-outlined" aria-hidden="true">search</span>
              <input type="text" placeholder="Describe website, tool category, or use case..." aria-label="Search website" />
              <button type="button">Search</button>
            </div>

          <div className="guest-home__tags">
            <span>Trending:</span>
            {trendingTopics.map((topic) => (
              <button key={topic} type="button">{topic}</button>
            ))}
          </div>
        </section>

        <section className="guest-home__metrics">
          <div className="guest-home__rating">
            <div className="guest-home__stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="material-symbols-outlined" aria-hidden="true">star</span>
              ))}
            </div>
            <div className="guest-home__rating-text">
              <strong>4.8 / 5.0</strong>
              <span>Excellent</span>
            </div>
          </div>

          <div className="guest-home__stats">
            <div>
              <small>Verified reviews</small>
              <strong>240M+</strong>
            </div>
            <div>
              <small>Fraud detection</small>
              <strong>99.8%</strong>
            </div>
            <div>
              <small>Websites indexed</small>
              <strong>1M+</strong>
            </div>
          </div>

          <a href="#submit" className="guest-home__review-link">
            Write a review
            <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </a>
        </section>

        <section className="guest-home__feed" id="recent">
          <div className="guest-home__section-head">
            <div className="guest-home__feed-heading">
              <h2>What people are saying</h2>
              <p>Real-time reviews and ratings from verified users across the web.</p>
            </div>
            <span className="guest-home__section-meta">Latency 42ms</span>
          </div>

          <div className="guest-home__feed-grid">
            {reviewCards.map((card) => (
              <article key={card.site} className="guest-home__feed-card">
                <div className="guest-home__feed-header">
                  <div className="guest-home__feed-user">
                    <div className="guest-home__feed-avatar">{card.initials}</div>
                    <div>
                      <strong>{card.name}</strong>
                      <small> reviewed {card.site}</small>
                    </div>
                  </div>
                  <span className="guest-home__verified">Verified</span>
                </div>
                <div className="guest-home__feed-stars" role="img" aria-label={`${card.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={`material-symbols-outlined ${index < card.rating ? 'guest-home__feed-star--filled' : ''}`}
                      aria-hidden="true"
                    >
                      {index < card.rating ? 'star' : 'star_outline'}
                    </span>
                  ))}
                  <span>{card.time}</span>
                </div>
                <p>{card.quote}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="guest-home__categories" id="explore">
          <div className="guest-home__section-head">
            <div>
              <div className="guest-home__section-kicker">Index navigation</div>
              <h2>Explore by category &amp; niche</h2>
            </div>
            <button type="button" className="guest-home__view-all">View all</button>
          </div>

          <div className="guest-home__category-grid">
            {categoryCards.map((category) => (
              <article key={category.title} className="guest-home__category-card">
                <div className="guest-home__category-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">category</span>
                </div>
                <h3>{category.title}</h3>
                <span>{category.metric}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="guest-home__featured" id="featured">
          <div className="guest-home__section-head">
            <div>
              <div className="guest-home__section-kicker">Most rated</div>
              <h2>High-signal picks</h2>
            </div>
          </div>

          <div className="guest-home__featured-grid">
            {featuredSites.map((site) => (
              <article key={site.name} className="guest-home__featured-card">
                <div className="guest-home__featured-top">
                  <div className="guest-home__featured-badge">{site.name.slice(0, 2).toUpperCase()}</div>
                  <span className="guest-home__featured-score">{site.score}★</span>
                </div>
                <h3>{site.name}</h3>
                <small>{site.category}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="guest-home__cta" id="submit">
          <div className="guest-home__cta-panel">
            <div className="guest-home__section-kicker">Submit a website</div>
            <h2>Share the next useful web app with the community</h2>
            <p>
              Found a hidden gem, a niche tool, or a product that deserves more attention? Submit it and help others discover what works.
            </p>
            <div className="guest-home__cta-actions">
              <a href="/admin/login" className="guest-home__primary-button">Login to submit</a>
              <button type="button" className="guest-home__secondary-button">Learn how it works</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
