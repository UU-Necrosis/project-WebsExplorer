import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_VOTE_THRESHOLD, CLIENT_VOTE_THRESHOLD } from '../../context/ClientSubmit'
import { getSubmissionQueue, useClientSubmissions, type SubmissionRecord } from '../../context/ClientSubmissionStore'
import { nodesApi, type ApiNode } from '../../services/api'
import './css/AdminOverviewPage.css'

function getAdminVoteProgress(submissions: SubmissionRecord[]): number {
  if (!submissions.length) return 0
  const votes = submissions.reduce((total, submission) => total + Math.min(submission.adminVotes.length, ADMIN_VOTE_THRESHOLD), 0)
  return Math.round((votes / (submissions.length * ADMIN_VOTE_THRESHOLD)) * 100)
}

function getClientVoteProgress(submissions: SubmissionRecord[]): number {
  if (!submissions.length) return 0
  const votes = submissions.reduce((total, submission) => total + Math.min(submission.clientVotes.length, CLIENT_VOTE_THRESHOLD), 0)
  return Math.round((votes / (submissions.length * CLIENT_VOTE_THRESHOLD)) * 100)
}

export default function AdminOverviewPage() {
  const navigate = useNavigate()
  const { submissions, savedWebsites, isLoading, loadError } = useClientSubmissions()
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

  const queuedSubmissions = submissions.filter((submission) => {
    const queue = getSubmissionQueue(submission)
    return queue === 'pending' || queue === 'audit'
  })
  const pendingSubmissions = queuedSubmissions.filter((submission) => getSubmissionQueue(submission) === 'pending')
  const auditSubmissions = queuedSubmissions.filter((submission) => getSubmissionQueue(submission) === 'audit')
  const categories = new Set(savedWebsites.flatMap((submission) => submission.categories))
  const adminVoteProgress = getAdminVoteProgress(pendingSubmissions)
  const clientVoteProgress = getClientVoteProgress(auditSubmissions)
  const clientVotes = auditSubmissions.reduce((total, submission) => total + Math.min(submission.clientVotes.length, CLIENT_VOTE_THRESHOLD), 0)
  const dataStatus = loadError ? 'API unavailable' : isLoading ? 'Loading' : 'Connected'
  const displayValue = (value: number) => loadError ? 'N/A' : isLoading ? '...' : String(value)
  const kpiData = [
    { label: 'Directory Websites', value: displayValue(savedWebsites.length), unit: 'websites', meta: `${categories.size} categories`, status: dataStatus, pct: null, icon: 'language' },
    { label: 'Pending Review', value: displayValue(pendingSubmissions.length), unit: 'in queue', meta: `${adminVoteProgress}% of admin vote slots filled`, status: dataStatus, pct: adminVoteProgress, icon: 'inbox' },
    { label: 'Community Audit', value: displayValue(auditSubmissions.length), unit: 'submissions', meta: `${clientVoteProgress}% of client vote slots filled`, status: dataStatus, pct: clientVoteProgress, icon: 'groups' },
    { label: 'Client Votes', value: displayValue(clientVotes), unit: 'votes', meta: `Across ${auditSubmissions.length} audit websites`, status: dataStatus, pct: clientVoteProgress, icon: 'how_to_vote' },
  ]
  const prioritySubmissions = pendingSubmissions.slice(0, 5)
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
            Current submissions, saved websites, and registered cluster nodes.
          </p>
        </div>
        <div className="admin-overview__actions">
          <button className="admin-overview__btn admin-overview__btn--primary"
            onClick={() => navigate('/admin/submissions')}>
            <span className="material-symbols-outlined">inbox</span> Open Submissions
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="admin-overview__kpi-grid">
        {kpiData.map((k) => (
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
              {k.pct !== null && <div className="admin-overview__kpi-bar" style={{ marginTop: 8 }}>
                <div className="admin-overview__kpi-bar-fill" style={{ width: `${k.pct}%` }} />
              </div>}
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
                <div className="admin-overview__card-title">Cluster Traffic &amp; Ingestion Activity</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>Telemetry is not available from the API.</div>
              </div>
            </div>
            <div className="admin-overview__empty-state">
              <span className="material-symbols-outlined" aria-hidden="true">monitoring</span>
              <span>No telemetry data</span>
            </div>
          </div>

          {/* Priority submissions */}
          <div className="admin-overview__card">
            <div className="admin-overview__card-hd">
              <div className="admin-overview__card-title">
                Priority Submissions Requiring Attention
                <span className="admin-overview__badge--queued">{displayValue(pendingSubmissions.length)} PENDING</span>
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
                  {prioritySubmissions.map((s) => {
                    const voteCount = Math.min(s.adminVotes.length, ADMIN_VOTE_THRESHOLD)
                    const submittedAt = new Intl.DateTimeFormat('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC',
                    }).format(new Date(s.submittedAt))
                    return <tr key={s.id}>
                      <td>
                        <div className="admin-overview__site-name">{s.name}</div>
                        <div className="admin-overview__site-hash">auth-hash: {s.hash}</div>
                      </td>
                      <td>
                        <span className={`admin-overview__badge admin-overview__badge--${voteCount ? 'amber' : 'coral'}`}>
                          <span className="admin-overview__badge-dot" />
                          Admin votes ({voteCount}/{ADMIN_VOTE_THRESHOLD})
                        </span>
                      </td>
                      <td>{s.submittedBy}</td>
                      <td>{submittedAt} UTC</td>
                    </tr>
                  })}
                  {!isLoading && (loadError || prioritySubmissions.length === 0) && <tr>
                    <td colSpan={4}>
                      {loadError || 'No pending submissions.'}
                    </td>
                  </tr>}
                  {isLoading && <tr><td colSpan={4}>Loading submissions...</td></tr>}
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
