import { useNavigate } from 'react-router-dom'
import { DEMO_SUBMISSIONS } from '../../context/WebsList'
import { KPI_DATA, NODES } from '../../context/AdminDemoData'
import './css/AdminOverviewPage.css'


const SUBMISSIONS = DEMO_SUBMISSIONS.filter((submission) => submission.queue).slice(0, 5).map((submission) => {
  const voteCount = new Set((submission.voters ?? []).map((vote) => vote.id)).size
  const submittedAt = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC',
  }).format(new Date(submission.submittedAt))

  return {
    ...submission,
    status: voteCount === 0 ? 'crimson' : voteCount >= 4 ? 'amber' : 'coral',
    statusLabel: `In Consensus (${voteCount}/5)`,
    submittedAt: `${submittedAt} UTC`,
  }
})

export default function AdminOverviewPage() {
  const navigate = useNavigate()

  return (
    <div className="admin-overview">

      {/* Page heading + actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="admin-overview__head">
          <div className="admin-overview__breadcrumb">
            <span>cluster-us-east-1</span><span>/</span>
            <span>prod</span><span>/</span>
            <span className="admin-overview__breadcrumb-active">admin-overview</span>
          </div>
          <h1 className="admin-overview__title">Admin Operations Overview</h1>
          <p className="admin-overview__subtitle">
            Holistic summary of submissions, audit events, directory index, and node consensus.
          </p>
        </div>
        <div className="admin-overview__actions">
          <button className="admin-overview__btn">
            <span className="material-symbols-outlined">sync</span> Sync All Nodes
          </button>
          <button className="admin-overview__btn">
            <span className="material-symbols-outlined">description</span> Generate Report
          </button>
          <button className="admin-overview__btn admin-overview__btn--primary"
            onClick={() => navigate('/admin/submissions')}>
            <span className="material-symbols-outlined">add</span> Quick Ingest
          </button>
        </div>
      </div>

      {/* Protocol banner */}
      <div className="admin-overview__banner">
        <div className="admin-overview__banner-left">
          <div className="admin-overview__banner-icon">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
          <div>
            <div className="admin-overview__banner-tag">
              ADMIN PROTOCOL · RFC-7519 &amp; ZERO-PII ARCHITECTURE
            </div>
            <div className="admin-overview__banner-desc">
              All ingested platform domains are cryptographically hashed and validated across isolated enclaves with zero user tracking telemetry.
            </div>
          </div>
        </div>
        <div className="admin-overview__banner-hash">
          <span>LEDGER HASH:</span>
          <code>0x7f4a...92b1</code>
          <span className="material-symbols-outlined" title="SGX Enclave Sealed">lock</span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="admin-overview__kpi-grid">
        {KPI_DATA.map((k) => (
          <div key={k.label} className="admin-overview__kpi">
            <div className="admin-overview__kpi-top">
              <span className="admin-overview__kpi-label">{k.label}</span>
              <span className="material-symbols-outlined admin-overview__kpi-icon">{k.icon}</span>
            </div>
            <div>
              <div className="admin-overview__kpi-value">
                {k.value} {k.unit && <span>{k.unit}</span>}
              </div>
              <div className="admin-overview__kpi-meta">
                <span>{k.meta}</span>
                <span className="admin-overview__kpi-status">{k.status}</span>
              </div>
              <div className="admin-overview__kpi-bar" style={{ marginTop: 8 }}>
                <div className="admin-overview__kpi-bar-fill" style={{ width: `${k.pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div className="admin-overview__cols">

        {/* Left — submissions table + chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Chart card */}
          <div className="admin-overview__card">
            <div className="admin-overview__card-hd">
              <div>
                <div className="admin-overview__card-title">Cluster Traffic & Ingestion Activity</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>Real-time async hash verification across nodes</div>
              </div>
            </div>
            <div className="admin-overview__chart">
              <div className="admin-overview__chart-stats">
                <div>
                  <span className="admin-overview__chart-stat-label">Throughput</span>
                  <span className="admin-overview__chart-stat-val">1.48k <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>chk/s</span></span>
                </div>
                <div>
                  <span className="admin-overview__chart-stat-label">Live Inquiries</span>
                  <span className="admin-overview__chart-stat-val">240.8M</span>
                </div>
                <div>
                  <span className="admin-overview__chart-stat-label">Scrub Efficiency</span>
                  <span className="admin-overview__chart-stat-val" style={{ color: '#059669' }}>99.94%</span>
                </div>
              </div>
              {/* SVG sparkline */}
              <svg width="100%" height="72" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="ov-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,55 Q50,40 100,45 T200,25 T300,35 T400,15 T500,22 L500,72 L0,72 Z" fill="url(#ov-grad)" />
                <path d="M0,55 Q50,40 100,45 T200,25 T300,35 T400,15 T500,22" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="400" cy="15" r="4" fill="#059669" />
                <circle cx="400" cy="15" r="7" fill="#a7f3d0" opacity="0.6" />
              </svg>
              <div className="admin-overview__chart-axis">
                <span>00:00 UTC</span><span>06:00</span><span>12:00</span><span>18:00 (Peak)</span><span>Now</span>
              </div>
            </div>
          </div>

          {/* Priority submissions */}
          <div className="admin-overview__card">
            <div className="admin-overview__card-hd">
              <div className="admin-overview__card-title">
                Priority Submissions Requiring Attention
                <span className="admin-overview__badge--queued">4 QUEUED</span>
              </div>
              <button className="admin-overview__card-link" onClick={() => navigate('/admin/submissions')}>
                Open Queue <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="admin-overview__submission-list" tabIndex={0} aria-label="Priority submissions">
              <table className="admin-overview__table">
                <thead>
                  <tr>
                    <th scope="col">Platform</th>
                    <th scope="col">Status</th>
                    <th scope="col">Submitted by</th>
                    <th scope="col">Submitted at</th>
                  </tr>
                </thead>
                <tbody>
                  {SUBMISSIONS.map((s) => (
                    <tr key={s.name}>
                      <td>
                        <div className="admin-overview__site-name">{s.name}</div>
                        <div className="admin-overview__site-hash">auth-hash: {s.hash}</div>
                      </td>
                      <td>
                        <span className={`admin-overview__badge admin-overview__badge--${s.status}`}>
                          <span className="admin-overview__badge-dot" />
                          {s.statusLabel}
                        </span>
                      </td>
                      <td>{s.submittedBy}</td>
                      <td>{s.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right — cluster quorum */}
        <div>
          <div className="admin-overview__card">
            <div className="admin-overview__quorum-hd">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: '#059669', fontSize: 20 }}>hub</span>
                <span className="admin-overview__card-title">Cluster Quorum</span>
              </div>
              <span className="admin-overview__quorum-badge">5/5 SGX ONLINE</span>
            </div>
            {NODES.map((n) => (
              <div key={n.name} className="admin-overview__node-row">
                <div className="admin-overview__node-left">
                  <span className="admin-overview__node-dot" />
                  <span className="admin-overview__node-name">{n.name}</span>
                  <span className="admin-overview__node-region">({n.region})</span>
                </div>
                <span className="admin-overview__node-ms">{n.ms}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
