import { useEffect, useState } from 'react'
import { auditApi, type AdminAuditLog, type AuditChainVerification } from '../../../services/api'
import './css/AdminAuditLogsPage.css'

function typeBadge(type: string) {
  const map: Record<string, { cls: string; label: string }> = {
    approve:  { cls: 'green', label: 'Approved'  },
    add:      { cls: 'green', label: 'Added'      },
    quorum:   { cls: 'blue',  label: 'Quorum'     },
    auth:     { cls: 'blue',  label: 'Auth'       },
    vote:     { cls: 'blue',  label: 'Vote'       },
    reject:   { cls: 'amber', label: 'Rejected'   },
    remove:   { cls: 'amber', label: 'Removed'    },
    security: { cls: 'red',   label: 'Security'   },
  }
  return map[type] ?? { cls: 'blue', label: type }
}

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [logs, setLogs] = useState<AdminAuditLog[]>([])
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null)
  const [verification, setVerification] = useState<AuditChainVerification | null>(null)
  const [verificationError, setVerificationError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true

    auditApi.list()
      .then((items) => {
        if (active) {
          setLogs(items)
          setLoadError('')
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load audit logs.')
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    auditApi.verify()
      .then((result) => {
        if (active) setVerification(result)
      })
      .catch((error: unknown) => {
        if (active) setVerificationError(error instanceof Error ? error.message : 'Unable to verify audit integrity.')
      })

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!selectedLog) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedLog(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedLog])

  const filtered = logs.filter((l) =>
    (typeFilter === 'all' || l.type === typeFilter)
    && [l.event, l.actor, l.actorRole, l.target ?? '', l.hash, l.id]
      .some((value) => value.toLowerCase().includes(search.trim().toLowerCase()))
  )

  return (
    <div className="admin-audit">
      <div>
        <div className="admin-audit__breadcrumb">
          <span>admin</span><span>/</span>
          <span className="admin-audit__breadcrumb-active">audit-logs</span>
        </div>
        <h1 className="admin-audit__title">Admin Audit Logs</h1>
        <p className="admin-audit__subtitle">Hash-chained record of authentication and submission review actions.</p>
      </div>

      <div className="admin-audit__card">
        <div className="admin-audit__toolbar">
          <div className={`admin-audit__integrity${verification?.valid ? ' admin-audit__integrity--valid' : verification ? ' admin-audit__integrity--invalid' : ''}`} role="status">
            <span className="admin-audit__badge-dot" />
            {verification
              ? verification.valid
                ? `Chain verified · ${verification.checked} records`
                : `Integrity check failed · record ${verification.firstInvalidId}`
              : verificationError || 'Verifying chain…'}
          </div>
          <div className="admin-audit__search-wrap">
            <span className="material-symbols-outlined admin-audit__search-icon">search</span>
            <input
              className="admin-audit__search"
              placeholder="Search events, actors, hash IDs..."
              aria-label="Search audit events"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-audit__select"
            aria-label="Filter by audit event type"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="all">All Event Types</option>
            <option value="approve">Approvals</option>
            <option value="add">Submissions</option>
            <option value="vote">Votes</option>
            <option value="auth">Authentication</option>
            <option value="security">Security</option>
          </select>
        </div>

        <table className="admin-audit__tbl">
          <thead>
            <tr>
              <th>Event</th>
              <th>Actor</th>
              <th>Type</th>
              <th>Timestamp (UTC)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5}>Loading audit logs...</td>
              </tr>
            )}
            {!isLoading && loadError && (
              <tr>
                <td colSpan={5}>{loadError}</td>
              </tr>
            )}
            {!isLoading && !loadError && filtered.map((l) => {
              const badge = typeBadge(l.type)
              return (
                <tr key={l.id}>
                  <td>
                    <div className="admin-audit__event-name">{l.event}</div>
                    <div className="admin-audit__event-hash" title={l.hash}>{l.hash.slice(0, 12)}…{l.hash.slice(-8)}</div>
                  </td>
                  <td>
                    <span className="admin-audit__actor">{l.actor}</span>
                    <div className="admin-audit__event-hash">{l.actorRole}</div>
                  </td>
                  <td>
                    <span className={`admin-audit__badge admin-audit__badge--${badge.cls}`}>
                      <span className="admin-audit__badge-dot" />{badge.label}
                    </span>
                  </td>
                  <td><span className="admin-audit__timestamp">{new Date(l.time).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC</span></td>
                  <td>
                    <button type="button" className="admin-audit__inspect-btn" onClick={() => setSelectedLog(l)}>Inspect</button>
                  </td>
                </tr>
              )
            })}
            {!isLoading && !loadError && filtered.length === 0 && (
              <tr>
                <td colSpan={5}>No audit logs match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedLog && (
        <div className="admin-audit__backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedLog(null)
        }}>
          <section className="admin-audit__drawer" role="dialog" aria-modal="true" aria-labelledby="admin-audit-drawer-title">
            <header className="admin-audit__drawer-header">
              <div>
                <p className="admin-audit__subtitle">Audit record #{selectedLog.id}</p>
                <h2 id="admin-audit-drawer-title">{selectedLog.event}</h2>
              </div>
              <button type="button" className="admin-audit__inspect-btn" onClick={() => setSelectedLog(null)}>Close</button>
            </header>
            <dl className="admin-audit__details">
              <div><dt>Actor</dt><dd>{selectedLog.actor} ({selectedLog.actorRole})</dd></div>
              <div><dt>Target</dt><dd>{selectedLog.target ?? '—'}</dd></div>
              <div><dt>Recorded at (UTC)</dt><dd>{selectedLog.time}</dd></div>
              <div><dt>Record hash</dt><dd>{selectedLog.hash}</dd></div>
              <div><dt>Previous hash</dt><dd>{selectedLog.previousHash}</dd></div>
            </dl>
            <h3 className="admin-audit__details-title">Event details</h3>
            <pre className="admin-audit__json">{JSON.stringify(selectedLog.details, null, 2)}</pre>
          </section>
        </div>
      )}
    </div>
  )
}
