import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_VOTE_THRESHOLD, CLIENT_VOTE_THRESHOLD, DEMO_SUBMISSIONS, getSubmissionQueue } from '../../context/ClientSubmit'
import { nodesApi, type ApiNode } from '../../services/api'
import './css/AdminOverviewPage.css'

const QUEUED_SUBMISSIONS = DEMO_SUBMISSIONS.filter((submission) => {
  const queue = getSubmissionQueue(submission)
  return queue === 'pending' || queue === 'audit'
})
const PENDING_SUBMISSIONS = QUEUED_SUBMISSIONS.filter((submission) => getSubmissionQueue(submission) === 'pending')
const AUDIT_SUBMISSIONS = QUEUED_SUBMISSIONS.filter((submission) => getSubmissionQueue(submission) === 'audit')
const categories = new Set(DEMO_SUBMISSIONS.flatMap((submission) => submission.categories))

function getAdminVoteProgress(submissions: typeof PENDING_SUBMISSIONS): number {
  if (!submissions.length) return 0
  const votes = submissions.reduce((total, submission) => total + Math.min(submission.adminVotes.length, ADMIN_VOTE_THRESHOLD), 0)
  return Math.round((votes / (submissions.length * ADMIN_VOTE_THRESHOLD)) * 100)
}

function getClientVoteProgress(submissions: typeof AUDIT_SUBMISSIONS): number {
  if (!submissions.length) return 0
  const votes = submissions.reduce((total, submission) => total + Math.min(submission.clientVotes.length, CLIENT_VOTE_THRESHOLD), 0)
  return Math.round((votes / (submissions.length * CLIENT_VOTE_THRESHOLD)) * 100)
}

const KPI_DATA = [
  { label: 'Directory Websites', value: String(DEMO_SUBMISSIONS.length), unit: 'websites', meta: `${categories.size} categories`, status: 'Sample data', pct: 100, icon: 'language' },
  { label: 'Pending Review', value: String(PENDING_SUBMISSIONS.length), unit: 'in queue', meta: `${getAdminVoteProgress(PENDING_SUBMISSIONS)}% of admin vote slots filled`, status: 'Sample data', pct: getAdminVoteProgress(PENDING_SUBMISSIONS), icon: 'inbox' },
  { label: 'Community Audit', value: String(AUDIT_SUBMISSIONS.length), unit: 'submissions', meta: `${getClientVoteProgress(AUDIT_SUBMISSIONS)}% of client vote slots filled`, status: 'Sample data', pct: getClientVoteProgress(AUDIT_SUBMISSIONS), icon: 'groups' },
  { label: 'Client Votes', value: String(AUDIT_SUBMISSIONS.reduce((total, submission) => total + Math.min(submission.clientVotes.length, CLIENT_VOTE_THRESHOLD), 0)), unit: 'votes', meta: `Across ${AUDIT_SUBMISSIONS.length} audit websites`, status: `${getClientVoteProgress(AUDIT_SUBMISSIONS)}% quorum`, pct: getClientVoteProgress(AUDIT_SUBMISSIONS), icon: 'how_to_vote' },
]

const SUBMISSIONS = PENDING_SUBMISSIONS.slice(0, 5).map((submission) => {
  const voteCount = Math.min(submission.adminVotes.length, ADMIN_VOTE_THRESHOLD)
  const submittedAt = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC',
  }).format(new Date(submission.submittedAt))

  return {
    ...submission,
    status: voteCount === 0 ? 'crimson' : 'coral',
    statusLabel: `Admin votes (${voteCount}/${ADMIN_VOTE_THRESHOLD})`,
    submittedAt: `${submittedAt} UTC`,
  }
})

export default function AdminOverviewPage() {
  const navigate = useNavigate()
  const [nodes, setNodes] = useState<ApiNode[]>([])
  const [nodesError, setNodesError] = useState('')

  useEffect(() => {
    let active = true
    nodesApi.list()
      .then((items) => {
        if (active) setNodes(items)
      })
      .catch((error: unknown) => {
        if (active) setNodesError(error instanceof Error ? error.message : 'Unable to load cluster nodes.')
      })
    return () => { active = false }
  }, [])

  const onlineNodeCount = nodes.filter((node) => node.status === 'online').length

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

        {/* Traffic chart */}
        <div className="admin-overview__primary">

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
                <span className="admin-overview__badge--queued">{PENDING_SUBMISSIONS.length} PENDING</span>
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

        {/* Cluster quorum */}
        <div className="admin-overview__quorum">
          <div className="admin-overview__card">
            <div className="admin-overview__quorum-hd">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: '#059669', fontSize: 20 }}>hub</span>
                <span className="admin-overview__card-title">Cluster Quorum</span>
              </div>
              <span className="admin-overview__quorum-badge">
                {nodes.length ? `${onlineNodeCount}/${nodes.length} NODES ONLINE` : 'NO NODES REGISTERED'}
              </span>
            </div>
            <div className="admin-overview__nodes-list" tabIndex={0} aria-label="Cluster quorum nodes">
              {nodes.map((node) => (
                <div key={node.id} className="admin-overview__node-row">
                  <div className="admin-overview__node-left">
                    <span className="admin-overview__node-dot" style={{ background: node.status === 'online' ? '#10b981' : node.status === 'maintenance' ? '#f59e0b' : '#ef4444' }} />
                    <span className="admin-overview__node-name">{node.name}</span>
                    <span className="admin-overview__node-region">({node.region})</span>
                  </div>
                  <span className="admin-overview__node-ms">{node.latencyMs === null ? node.status : `${node.latencyMs}ms`}</span>
                </div>
              ))}
              {!nodes.length && <span className="admin-overview__node-name">{nodesError || 'Add registered nodes to the cluster_nodes table.'}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
