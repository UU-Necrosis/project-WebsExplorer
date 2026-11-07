import { useState } from 'react'
import './css/AdminSubmissionsPage.css'

const SUBMISSIONS = [
  { id: '1', name: 'Latent Space Engine', url: 'https://latent-space.dev', hash: '0x8a92...fc10', consensus: 3, total: 5, pct: 60, color: 'amber' },
  { id: '2', name: 'V0 Dev Platform',     url: 'https://v0.dev',           hash: '0x4f12...7e99', consensus: 5, total: 5, pct: 100, color: 'green' },
  { id: '3', name: 'MangaDex Open Reader',url: 'https://mangadex.org',     hash: '0x9c31...2b88', consensus: 4, total: 5, pct: 80, color: 'green' },
  { id: '4', name: 'Kagi Search',         url: 'https://kagi.com',         hash: '0x77e1...912a', consensus: 2, total: 5, pct: 40, color: 'amber' },
  { id: '5', name: 'Perplexity AI',       url: 'https://perplexity.ai',    hash: '0xab33...de12', consensus: 1, total: 5, pct: 20, color: 'amber' },
]

export default function AdminSubmissionsPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab]       = useState<'pending' | 'audit'>('pending')

  const filtered = SUBMISSIONS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.url.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-subs">

      {/* Header */}
      <div className="admin-subs__head">
        <div>
          <div className="admin-subs__breadcrumb">
            <span>admin</span><span>/</span>
            <span className="admin-subs__breadcrumb-active">submissions-queue</span>
          </div>
          <h1 className="admin-subs__title">Admin Submission Queue</h1>
          <p className="admin-subs__subtitle">
            Review incoming community submissions, verify credentials, and manage consensus audit queues.
          </p>
        </div>
        <div className="admin-subs__actions">
          <button className="admin-subs__btn"><span className="material-symbols-outlined">sync</span> Sync Ledger</button>
          <button className="admin-subs__btn"><span className="material-symbols-outlined">checklist</span> Batch Review</button>
          <button className="admin-subs__btn admin-subs__btn--primary">
            <span className="material-symbols-outlined">add</span> Manual Add
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="admin-subs__banner">
        <div className="admin-subs__banner-left">
          <div className="admin-subs__banner-icon">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
          <div>
            <div className="admin-subs__banner-tag">ADMIN PROTOCOL · RFC-7519 · ZERO USER TELEMETRY</div>
            <div className="admin-subs__banner-desc">
              Only verified email and salted hash credentials are retained. No tracking cookies, no IP logging.
            </div>
          </div>
        </div>
        <div className="admin-subs__banner-hash">
          <span>AUDIT HASH:</span><code>0x9f4a...88e1</code>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#059669' }}>lock</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="admin-subs__kpi-grid">
        {[
          { label: 'Pending Review',          val: '18', unit: 'websites', meta: 'Avg review time: 14 mins', status: '', pct: 72, icon: 'inbox' },
          { label: 'Under Community Check',   val: '7',  unit: 'items',    meta: 'Waiting for community votes', status: 'In Progress', pct: 38, icon: 'groups' },
          { label: 'Verified Submissions',    val: '100%',unit: 'safe',    meta: 'Zero personal data collected', status: 'Protected', pct: 100, icon: 'verified_user' },
          { label: 'Approval Rate',           val: '99.8%',unit: 'approved', meta: 'Community accuracy rating', status: 'High', pct: 99.8, icon: 'check_circle' },
        ].map((k) => (
          <div key={k.label} className="admin-subs__kpi">
            <div className="admin-subs__kpi-top">
              <span className="admin-subs__kpi-label">{k.label}</span>
              <span className="material-symbols-outlined admin-subs__kpi-icon">{k.icon}</span>
            </div>
            <div>
              <div className="admin-subs__kpi-val">{k.val} <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 400 }}>{k.unit}</span></div>
              <div className="admin-subs__kpi-meta"><span>{k.meta}</span>{k.status && <strong>{k.status}</strong>}</div>
              <div className="admin-subs__kpi-bar"><div className="admin-subs__kpi-bar-fill" style={{ width: `${k.pct}%` }} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="admin-subs__table-card">
        <div className="admin-subs__table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div className="admin-subs__tabs">
              <button className={`admin-subs__tab${tab === 'pending' ? ' admin-subs__tab--active' : ''}`} onClick={() => setTab('pending')}>
                Pending Ingestion <span className="admin-subs__tab-badge">18</span>
              </button>
              <button className={`admin-subs__tab${tab === 'audit' ? ' admin-subs__tab--active' : ''}`} onClick={() => setTab('audit')}>
                Under Community Audit <span className="admin-subs__tab-badge" style={{ background: '#e2e8f0', color: '#64748b' }}>7</span>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: '#64748b' }}>
              Showing <strong style={{ color: '#0f172a' }}>{filtered.length} of 18</strong> pending
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9999, padding: '2px 10px', color: '#059669', fontSize: 11, fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: 9999, background: '#059669', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                Live Ingest Feed
              </span>
            </div>
          </div>
          <div className="admin-subs__search-row">
            <div className="admin-subs__search-wrap">
              <span className="material-symbols-outlined admin-subs__search-icon">search</span>
              <input
                className="admin-subs__search"
                placeholder="Filter submissions, hash IDs, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <table className="admin-subs__tbl">
          <thead>
            <tr>
              <th>Platform &amp; URL</th>
              <th>Contributor Auth &amp; Hash</th>
              <th>Consensus Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="admin-subs__site-name">{s.name}</div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="admin-subs__site-url">
                    {s.url}<span className="material-symbols-outlined">open_in_new</span>
                  </a>
                </td>
                <td>
                  <div className="admin-subs__hash-verified">
                    <span className="admin-subs__hash-verified-dot" />RFC VERIFIED
                  </div>
                  <div className="admin-subs__hash-val">auth-hash: {s.hash}</div>
                  <div className="admin-subs__hash-sub">Zero-PII Ping Confirmed</div>
                </td>
                <td>
                  <div className="admin-subs__consensus-wrap">
                    <span className={`admin-subs__badge admin-subs__badge--${s.color}`}>
                      <span className="admin-subs__badge-dot" />
                      {s.color === 'green' ? 'Ready' : 'In Consensus'} ({s.consensus}/{s.total})
                    </span>
                    <div className="admin-subs__progress">
                      <div className={`admin-subs__progress-fill admin-subs__progress-fill--${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="admin-subs__row-actions">
                    <button className="admin-subs__approve-btn">Quick Approve</button>
                    <button className="admin-subs__inspect-btn">Inspect</button>
                    <button className="admin-subs__log-btn" title="Audit Log">
                      <span className="material-symbols-outlined">history</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
