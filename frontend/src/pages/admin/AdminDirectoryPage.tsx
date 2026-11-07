import { useEffect, useRef, useState } from 'react'
import './css/AdminDirectoryPage.css'

const ENTRIES = [
  { id: '1', name: 'Latent Space Engine', url: 'https://latent-space.dev', hash: '0x8a92...fc10', cats: ['AI & ML', 'Research'], tags: ['AI', 'ML', 'Research'], description: 'AI research and community resources', username: 'latentspace', role: 'Owner' },
  { id: '2', name: 'V0 Dev Platform', url: 'https://v0.dev', hash: '0x4f12...7e99', cats: ['UI Design', 'Dev Tools'], tags: ['UI', 'Development'], description: 'AI-powered interface design platform', username: 'v0team', role: 'Admin' },
  { id: '3', name: 'MangaDex', url: 'https://mangadex.org', hash: '0x9c31...2b88', cats: ['Comics', 'Community'], tags: ['Comics', 'Community', 'asdasddasdadasxczgs', 'asjdiajisdjmkzcxzc', 'asdasddasdadasxczgs', 'asjdiajisdjmkzcxzc'], description: 'Community-driven manga reading siteasdasdasddddddddddddddddssaaaaaaaaaaaaaaaaaa', username: 'mangadex', role: 'Moderator' },
  { id: '4', name: 'Kagi Search', url: 'https://kagi.com', hash: '0x77e1...912a', cats: ['Search', 'Privacy'], tags: ['Search', 'Privacy'], description: 'Private search engine', username: 'kagisearch', role: 'Owner' },
  { id: '5', name: 'Perplexity AI', url: 'https://perplexity.ai', hash: '0xab33...de12', cats: ['AI & ML', 'Search'], tags: ['AI', 'Search'], description: 'AI-powered answer and search engine', username: 'perplexity', role: 'Admin' },
  { id: '6', name: 'Excalidraw', url: 'https://excalidraw.com', hash: '0xcd55...1122', cats: ['Productivity', 'Design'], tags: ['Productivity', 'Design'], description: 'Collaborative virtual whiteboard', username: 'excalidraw', role: 'Owner' },
  { id: '7', name: 'Notion', url: 'https://notion.so', hash: '0x8a92...fc10', cats: ['AI & ML', 'Research'], tags: ['AI', 'ML', 'Research'], description: 'Workspace for notes and collaboration', username: 'notion', role: 'Admin' },
  { id: '8', name: 'Youtube', url: 'https://youtube.com', hash: '0x4f12...7e99', cats: ['UI Design', 'Dev Tools'], tags: ['UI', 'Development'], description: 'Video sharing and streaming platform', username: 'youtube', role: 'Owner' },
  { id: '9', name: 'Comix', url: 'https://comix.com', hash: '0x9c31...2b88', cats: ['Comics', 'Community'], tags: ['Comics', 'Community'], description: 'Online comics community', username: 'comix', role: 'Moderator' },
  { id: '10', name: 'Claude', url: 'https://claude.ai', hash: '0x77e1...912a', cats: ['Search', 'Privacy'], tags: ['Search', 'Privacy'], description: 'AI assistant for writing and analysis', username: 'claude', role: 'Admin' },
  { id: '11', name: 'Anthropic', url: 'https://anthropic.com', hash: '0xab33...de12', cats: ['AI & ML', 'Search'], tags: ['AI', 'Search'], description: 'AI safety and research company', username: 'anthropic', role: 'Owner' },
  { id: '12', name: 'Excalidraw', url: 'https://excalidraw.com', hash: '0xcd55...1122', cats: ['Productivity', 'Design'], tags: ['Productivity', 'Design'], description: 'Collaborative virtual whiteboard', username: 'excalidraw', role: 'Owner' },
]

export default function AdminDirectoryPage() {
  const [search, setSearch] = useState('')
  const [expandedTagEntries, setExpandedTagEntries] = useState<Set<string>>(() => new Set())
  const [showBackToTop, setShowBackToTop] = useState(false)
  const searchToolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const searchToolbar = searchToolbarRef.current
    if (!searchToolbar) return

    const observer = new IntersectionObserver(([entry]) => {
      setShowBackToTop(!entry.isIntersecting)
    })
    observer.observe(searchToolbar)

    return () => observer.disconnect()
  }, [])

  const filtered = ENTRIES.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.url.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-dir">
      <div>
        <div className="admin-dir__breadcrumb">
          <span>admin</span><span>/</span>
          <span className="admin-dir__breadcrumb-active">directory</span>
        </div>
        <h1 className="admin-dir__title">Admin Directory</h1>
        <p className="admin-dir__subtitle">Verified websites in the public directory index.</p>
      </div>

      <div className="admin-dir__toolbar" ref={searchToolbarRef}>
        <div className="admin-dir__search-wrap">
          <span className="material-symbols-outlined admin-dir__search-icon">search</span>
          <input
            className="admin-dir__search"
            placeholder="Search directory categories/tags/entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-dir__grid">
        {filtered.map((e) => (
          <div key={e.id} className="admin-dir__entry">
            <div className="admin-dir__entry-top">
              <div>
                <div className="admin-dir__entry-name">{e.name}</div>
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="admin-dir__entry-url">
                  {e.url}<span className="material-symbols-outlined">open_in_new</span>
                </a>
              </div>
              <span className="admin-dir__entry-badge admin-dir__entry-badge--verified">
                ✓ VERIFIED
              </span>
            </div>
            <div className="admin-dir__entry-classification">
              <div className="admin-dir__entry-hash">hash: {e.hash}</div>
              <div className="admin-dir__entry-cats">
                {e.cats.map((c) => <span key={c} className="admin-dir__cat">{c}</span>)}
              </div>
              <div className="admin-dir__entry-tags">
                {(expandedTagEntries.has(e.id) ? e.tags : e.tags.slice(0, 2)).map((t, index) => (
                  <span key={`${t}-${index}`} className="admin-dir__tag">{t}</span>
                ))}
                {e.tags.length > 2 && (
                  <button
                    type="button"
                    className="admin-dir__tags-toggle"
                    aria-expanded={expandedTagEntries.has(e.id)}
                    onClick={() => setExpandedTagEntries((current) => {
                      const next = new Set(current)
                      if (next.has(e.id)) next.delete(e.id)
                      else next.add(e.id)
                      return next
                    })}
                  >
                    {expandedTagEntries.has(e.id) ? 'Collapse' : `Expand (${e.tags.length - 2})`}
                  </button>
                )}
              </div>
            </div>
            <div className="admin-dir__entry-meta">
              <div className="admin-dir__meta-row">
                <span className="admin-dir__meta-label">Description</span>
                <span className="admin-dir__meta-value">{e.description}</span>
              </div>
              <div className="admin-dir__meta-row">
                <span className="admin-dir__meta-label">Username</span>
                <span className="admin-dir__meta-value">{e.username}</span>
              </div>
              <div className="admin-dir__meta-row">
                <span className="admin-dir__meta-label">User role</span>
                <span className="admin-dir__meta-value">{e.role}</span>
              </div>
            </div>
            <div className="admin-dir__entry-actions">
              <button className="admin-dir__view-btn">View Details</button>
              <button className="admin-dir__remove-btn">Remove</button>
            </div>
          </div>
        ))}
      </div>
      {showBackToTop && (
        <button
          type="button"
          className="admin-dir__back-to-top"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="material-symbols-outlined" aria-hidden="true">arrow_upward</span>
        </button>
      )}
    </div>
  )
}
