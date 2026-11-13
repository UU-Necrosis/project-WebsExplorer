
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { ADMIN_VOTE_THRESHOLD, CLIENT_VOTE_THRESHOLD, type SubmissionQueue } from '../../context/ClientSubmit'
import { getSubmissionQueue, useClientSubmissions, type SubmissionRecord } from '../../context/ClientSubmissionStore'
import './css/AdminSubmissionsPage.css'

type Submission = SubmissionRecord & { queue: SubmissionQueue }

export default function AdminSubmissionsPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab]       = useState<'pending' | 'audit'>('pending')
  const { submissions: submissionRecords, isLoading, loadError, castVote } = useClientSubmissions()
  const submissions: Submission[] = submissionRecords.map((submission) => ({
    ...submission,
    queue: getSubmissionQueue(submission),
  }))
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [drawerView, setDrawerView] = useState<'inspect' | 'preview' | 'history'>('inspect')
  const [notice, setNotice] = useState('')
  const { accountId, demoAccounts } = useAuth()

  useEffect(() => {
    if (!selectedSubmission) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedSubmission(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedSubmission])

  const activeSubmissions = submissions.filter((s) => getSubmissionQueue(s) === tab)
  const filtered = activeSubmissions.filter((s) =>
    [s.name, s.url, s.hash, s.fullHash, s.submittedBy, ...s.tags]
      .some((value) => value?.toLowerCase().includes(search.trim().toLowerCase()) ?? false)
  )
  const pendingCount = submissions.filter((s) => getSubmissionQueue(s) === 'pending').length
  const auditCount = submissions.filter((s) => getSubmissionQueue(s) === 'audit').length
  const queuedSubmissions = submissions.filter((s) => {
    const queue = getSubmissionQueue(s)
    return queue === 'pending' || queue === 'audit'
  })
  const pendingAdminVotes = submissions
    .filter((submission) => getSubmissionQueue(submission) === 'pending')
    .reduce((total, submission) => total + Math.min(submission.adminVotes.length, ADMIN_VOTE_THRESHOLD), 0)
  const auditCommunityVotes = submissions
    .filter((submission) => getSubmissionQueue(submission) === 'audit')
    .reduce((total, submission) => total + Math.min(submission.clientVotes.length, CLIENT_VOTE_THRESHOLD), 0)
  const pendingAdminVoteProgress = pendingCount ? Math.round((pendingAdminVotes / (pendingCount * ADMIN_VOTE_THRESHOLD)) * 100) : 0
  const auditCommunityVoteProgress = auditCount ? Math.round((auditCommunityVotes / (auditCount * CLIENT_VOTE_THRESHOLD)) * 100) : 0
  const totalVotes = pendingAdminVotes + auditCommunityVotes
  const totalVoteSlots = pendingCount * ADMIN_VOTE_THRESHOLD + auditCount * CLIENT_VOTE_THRESHOLD
  const voteProgress = totalVoteSlots ? Math.round((totalVotes / totalVoteSlots) * 100) : 0
  const mockKpis = [
    { label: 'Pending Review', val: String(pendingCount), unit: 'websites', meta: 'Admin votes required for audit', status: 'Sample data', pct: pendingAdminVoteProgress, icon: 'inbox' },
    { label: 'Under Community Audit', val: String(auditCount), unit: 'websites', meta: 'Client votes required for review', status: 'Sample data', pct: auditCommunityVoteProgress, icon: 'groups' },
    { label: 'Queued Submissions', val: String(queuedSubmissions.length), unit: 'websites', meta: 'Pending plus community audit', status: 'Sample data', pct: 100, icon: 'list_alt' },
    { label: 'Stage Votes', val: String(totalVotes), unit: 'votes', meta: `Across ${queuedSubmissions.length} queued websites`, status: `${voteProgress}% quorum`, pct: voteProgress, icon: 'how_to_vote' },
  ]
  const selectedVoteIds = selectedSubmission
    ? selectedSubmission.queue === 'pending' ? selectedSubmission.adminVotes : selectedSubmission.clientVotes
    : []
  const selectedVoteLimit = selectedSubmission?.queue === 'pending' ? ADMIN_VOTE_THRESHOLD : CLIENT_VOTE_THRESHOLD
  const selectedVoteLabel = selectedSubmission?.queue === 'pending' ? 'Admin votes' : 'Client votes'
  const selectedVoteAccounts = selectedVoteIds.map((id) => ({
    id,
    account: demoAccounts.find((account) => account.id === String(id)),
  }))

  async function castCurrentVote(submission: Submission) {
    const voterId = Number(accountId)
    if (!Number.isInteger(voterId) || voterId < 1) {
      setNotice('Sign in with an account before voting.')
      return
    }

    const kind = submission.queue === 'pending' ? 'admin' : 'client'
    try {
      const updated = await castVote(submission.id, kind, voterId)
      setSelectedSubmission((current) => current?.id === updated.id ? { ...updated, queue: getSubmissionQueue(updated) } : current)
      setNotice(`${kind === 'admin' ? 'Admin' : 'Client'} vote recorded for ${submission.name}.`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Vote could not be recorded.')
    }
  }

  function openSubmission(submission: Submission, view: 'inspect' | 'history') {
    setSelectedSubmission(submission)
    setDrawerView(view)
  }

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

      {(loadError || notice) && <p className="admin-subs__subtitle" role="status">{notice || loadError}</p>}

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

      {/* Mock KPIs */}
      <div className="admin-subs__kpi-grid">
        {mockKpis.map((k) => (
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
      <p className="admin-subs__demo-note">Dashboard metrics and submission details are sample data for UI demonstration.</p>

      {notice && (
        <div className="admin-subs__notice" role="status">
          <span>{notice}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}>×</button>
        </div>
      )}

      {/* Table card */}
      <div className="admin-subs__table-card">
        <div className="admin-subs__table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div className="admin-subs__tabs">
              <button type="button" className={`admin-subs__tab${tab === 'pending' ? ' admin-subs__tab--active' : ''}`} aria-pressed={tab === 'pending'} onClick={() => setTab('pending')}>
                Pending Ingestion <span className="admin-subs__tab-badge">{pendingCount}</span>
              </button>
              <button type="button" className={`admin-subs__tab${tab === 'audit' ? ' admin-subs__tab--active' : ''}`} aria-pressed={tab === 'audit'} onClick={() => setTab('audit')}>
                Under Community Audit <span className="admin-subs__tab-badge admin-subs__tab-badge--muted">{auditCount}</span>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: '#64748b' }}>
              Showing <strong style={{ color: '#0f172a' }}>{filtered.length} of {activeSubmissions.length}</strong> {tab === 'pending' ? 'pending' : 'under audit'}
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
                aria-label="Filter submissions by name, URL, hash, username, or tag"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <table className="admin-subs__tbl">
          <colgroup>
            <col className="admin-subs__col-platform" />
            <col className="admin-subs__col-auth" />
            <col className="admin-subs__col-consensus" />
            <col className="admin-subs__col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>Platform &amp; URL</th>
              <th>Contributor Auth &amp; Hash</th>
              <th>Consensus Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const voteLimit = tab === 'pending' ? ADMIN_VOTE_THRESHOLD : CLIENT_VOTE_THRESHOLD
              const voteCount = Math.min(tab === 'pending' ? s.adminVotes.length : s.clientVotes.length, voteLimit)
              const voteEmpty = voteCount === 0
              const voteLabel = tab === 'pending' ? 'Admin votes' : voteEmpty ? 'Need votes' : 'Client votes'

              return (
              <tr key={s.id}>
                <td>
                  <div className="admin-subs__site-name">{s.name}</div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="admin-subs__site-url">
                    <span className="admin-subs__site-url-text">{s.url}</span>
                    <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span>
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
                    <span className={`admin-subs__badge admin-subs__badge--${voteEmpty ? 'coral' : 'amber'}`}>
                      <span className="admin-subs__badge-dot" />
                      {voteLabel} ({voteCount}/{voteLimit})
                    </span>
                    <div className="admin-subs__progress">
                      <div className={`admin-subs__progress-fill admin-subs__progress-fill--${voteEmpty ? 'coral' : 'amber'}`} style={{ width: `${(voteCount / voteLimit) * 100}%` }} />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="admin-subs__row-actions">
                    <button type="button" className="admin-subs__approve-btn" disabled={!accountId} onClick={() => void castCurrentVote(s)}>
                      {tab === 'pending' ? 'Admin vote' : 'Client vote'}
                    </button>
                    <button type="button" className="admin-subs__inspect-btn" onClick={() => openSubmission(s, 'inspect')}>Inspect</button>
                    <button type="button" className="admin-subs__log-btn" title="View audit history" aria-label={`View audit history for ${s.name}`} onClick={() => openSubmission(s, 'history')}>
                      <span className="material-symbols-outlined">history</span>
                    </button>
                  </div>
                </td>
              </tr>
              )
            })}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td className="admin-subs__empty" colSpan={4}>{loadError || 'No submissions match this filter.'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedSubmission && (
        <div className="admin-subs__drawer-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedSubmission(null)
        }}>
          <section className="admin-subs__drawer" role="dialog" aria-modal="true" aria-labelledby="admin-subs-drawer-title">
            <header className="admin-subs__drawer-head">
              <div>
                <p className="admin-subs__drawer-eyebrow">
                  {drawerView === 'history' ? 'Submission history' : drawerView === 'preview' ? 'Web preview' : 'Submission review'}
                </p>
                <h2 id="admin-subs-drawer-title">{selectedSubmission.name}</h2>
                <a href={selectedSubmission.url} target="_blank" rel="noopener noreferrer">{selectedSubmission.url}</a>
                {drawerView !== 'history' && (
                  <div className="admin-subs__drawer-switch-row" role="group" aria-label="Submission view">
                    <button
                      type="button"
                      className={`admin-subs__drawer-switch${drawerView === 'inspect' ? ' admin-subs__drawer-switch--active' : ''}`}
                      aria-pressed={drawerView === 'inspect'}
                      onClick={() => setDrawerView('inspect')}
                    >
                      Inspect core
                    </button>
                    <button
                      type="button"
                      className={`admin-subs__drawer-switch${drawerView === 'preview' ? ' admin-subs__drawer-switch--active' : ''}`}
                      aria-pressed={drawerView === 'preview'}
                      onClick={() => setDrawerView('preview')}
                    >
                      Web display
                    </button>
                  </div>
                )}
              </div>
              <button type="button" className="admin-subs__drawer-close" aria-label="Close details" autoFocus onClick={() => setSelectedSubmission(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            {drawerView === 'inspect' ? (
              <div className="admin-subs__drawer-body">
                <section className="admin-subs__detail-section">
                  <h3>Submission details</h3>
                  <dl className="admin-subs__detail-list">
                    <div><dt>Submitted by</dt><dd>{selectedSubmission.submittedBy}</dd></div>
                    <div><dt>Submitted at</dt><dd>{selectedSubmission.submittedAt}</dd></div>
                    <div><dt>{selectedVoteLabel}</dt><dd>{selectedVoteIds.length} of {selectedVoteLimit}</dd></div>
                    <div><dt>Full auth hash</dt><dd className="admin-subs__full-hash">{selectedSubmission.fullHash}</dd></div>
                  </dl>
                </section>
                <section className="admin-subs__detail-section">
                  <h3>{selectedVoteLabel} by account</h3>
                  <ul className="admin-subs__vote-list">
                    {selectedVoteAccounts.map(({ id, account }) => (
                      <li key={id}>
                        <span className="admin-subs__vote-dot" />
                        <span><strong>{account?.name ?? `Account ${id}`}</strong>{account ? ` · ${account.email}` : ''}</span>
                        <time>{account?.status ?? 'unknown'}</time>
                      </li>
                    ))}
                    {selectedVoteIds.length < selectedVoteLimit ? (
                      <li className="admin-subs__vote-pending">Waiting for {selectedVoteLimit - selectedVoteIds.length} more vote(s)</li>
                    ) : (
                      <li className="admin-subs__vote-pending">This stage has reached its vote limit.</li>
                    )}
                  </ul>
                </section>
                <section className="admin-subs__detail-section">
                  <h3>Raw platform data <span className="admin-subs__sample-label">sample</span></h3>
                  <pre className="admin-subs__payload">{JSON.stringify({ name: selectedSubmission.name, url: selectedSubmission.url, submittedBy: selectedSubmission.submittedBy, tags: selectedSubmission.tags }, null, 2)}</pre>
                </section>
                <section className="admin-subs__detail-section">
                  <h3>Security checks <span className="admin-subs__sample-label">sample</span></h3>
                  <ul className="admin-subs__scan-list">
                    <li><span className="material-symbols-outlined">check_circle</span> HTTPS endpoint reachable</li>
                    <li><span className="material-symbols-outlined">check_circle</span> Zero-PII ping confirmed</li>
                    <li><span className="material-symbols-outlined">check_circle</span> RFC verification passed</li>
                  </ul>
                </section>
              </div>
            ) : drawerView === 'history' ? (
              <div className="admin-subs__drawer-body">
                <p className="admin-subs__history-note">Vote IDs are mapped to demo account details. Vote timestamps are not included in the sample data.</p>
                <ol className="admin-subs__timeline">
                  <li><strong>Submission received</strong><span>{selectedSubmission.submittedBy} · {selectedSubmission.submittedAt}</span></li>
                  {selectedVoteAccounts.map(({ id, account }) => (
                    <li key={id}>
                      <strong>{selectedVoteLabel} recorded</strong>
                      <span>{account?.name ?? `Account ${id}`}{account ? ` · ${account.email}` : ''}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="admin-subs__drawer-body admin-subs__preview-body">
                <div className="admin-subs__preview-placeholder">
                  <span className="material-symbols-outlined" aria-hidden="true">language</span>
                  <h3>Web display coming soon</h3>
                  <p>A safe embedded preview of this website will be available here.</p>
                  <a href={selectedSubmission.url} target="_blank" rel="noopener noreferrer">
                    Open website in a new tab
                    <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span>
                  </a>
                </div>
              </div>
            )}
            <footer className="admin-subs__drawer-footer">
              <button type="button" className="admin-subs__inspect-btn" onClick={() => setSelectedSubmission(null)}>Close</button>
              {drawerView === 'inspect' && selectedSubmission.queue !== 'approved' && (
                <button type="button" className="admin-subs__approve-btn" disabled={!accountId} onClick={() => void castCurrentVote(selectedSubmission)}>
                  Record {selectedSubmission.queue === 'pending' ? 'admin' : 'client'} vote
                </button>
              )}
            </footer>
          </section>
        </div>
      )}
    </div>
  )
}
