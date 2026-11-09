import { useEffect, useRef, useState } from 'react'
import { DEMO_SUBMISSIONS } from '../../context/WebsList'
import './css/AdminDirectoryPage.css'

const ENTRIES = DEMO_SUBMISSIONS

function formatTag(tag: string): string {
  const maxLength = 41
  const startLength = 21
  const separator = '... '
  const endLength = maxLength - startLength - separator.length

  if (tag.length <= maxLength) return tag
  return `${tag.slice(0, startLength).trimEnd()}${separator}${tag.slice(-endLength).trimStart()}`
}

function formatCategory(category: string): string {
  const maxLength = 44
  const startLength = 28
  const endLength = maxLength - startLength - 3

  if (category.length <= maxLength) return category
  return `${category.slice(0, startLength)}...${category.slice(-endLength)}`
}

export default function AdminDirectoryPage() {
  const [search, setSearch] = useState('')
  const [expandedTagEntries, setExpandedTagEntries] = useState<Set<string>>(() => new Set())
  const [verifiedEntries, setVerifiedEntries] = useState<Set<string>>(() => new Set(ENTRIES.map((entry) => entry.id)))
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
            <div className="admin-dir__entry-primary">
              <div className="admin-dir__entry-top">
                <div>
                  <div className="admin-dir__entry-name">{e.name}</div>
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-dir__entry-url"
                    title={e.url}
                    data-full-url={e.url}
                  >
                    <span className="admin-dir__entry-url-text">{e.url}</span>
                    <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span>
                  </a>
                </div>
                <button
                  type="button"
                  className={`admin-dir__entry-badge ${verifiedEntries.has(e.id) ? 'admin-dir__entry-badge--verified' : 'admin-dir__entry-badge--hidden'}`}
                  aria-pressed={verifiedEntries.has(e.id)}
                  aria-label={`${verifiedEntries.has(e.id) ? 'Hide' : 'Visible'} ${e.name}`}
                  onClick={() => setVerifiedEntries((current) => {
                    const next = new Set(current)
                    if (next.has(e.id)) next.delete(e.id)
                    else next.add(e.id)
                    return next
                  })}
                >
                  {verifiedEntries.has(e.id) ? '✓ VISIBLE' : 'HIDDEN'}
                </button>
              </div>
              <div className="admin-dir__entry-actions">
                <button className="admin-dir__view-btn">View Details</button>
                <button className="admin-dir__remove-btn">Remove</button>
              </div>
            </div>
            <div className="admin-dir__entry-classification">
              <div className="admin-dir__entry-hash">hash: {e.hash}</div>
              <div className="admin-dir__entry-cats">
                {e.categories.map((c) => <span key={c} className="admin-dir__cat" title={c}>{formatCategory(c)}</span>)}
              </div>
              <div className="admin-dir__entry-tags">
                {(expandedTagEntries.has(e.id) ? e.tags : e.tags.slice(0, 2)).map((t, index) => (
                  <span key={`${t}-${index}`} className="admin-dir__tag" title={t}>{formatTag(t)}</span>
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
                <span className="admin-dir__meta-label">Username</span>
                <span className="admin-dir__meta-value">{e.username}</span>
              </div>
              <div className="admin-dir__meta-row">
                <span className="admin-dir__meta-label">User role</span>
                <span className="admin-dir__meta-value">{e.role}</span>
              </div>
              <div className="admin-dir__meta-row">
                <span className="admin-dir__meta-label">Appearance</span>
                <span className="admin-dir__meta-value">{e.appearance}</span>
              </div>
              <div className="admin-dir__meta-row">
                <span className="admin-dir__meta-label">Description</span>
                <span className="admin-dir__meta-value admin-dir__meta-value--description">{e.description}</span>
              </div>
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
