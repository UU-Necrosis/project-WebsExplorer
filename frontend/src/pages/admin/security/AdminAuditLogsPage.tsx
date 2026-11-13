import { useEffect, useState } from 'react'
import { adminAuditApi, type AdminAuditLog } from '../../../context/AdminDemoData'
import './css/AdminAuditLogsPage.css'

function typeBadge(type: string) {
  const map: Record<string, { cls: string; label: string }> = {
    approve:  { cls: 'green', label: 'Approved'  },
    add:      { cls: 'green', label: 'Added'      },
    quorum:   { cls: 'blue',  label: 'Quorum'     },
    auth:     { cls: 'blue',  label: 'Auth'       },
    reject:   { cls: 'amber', label: 'Rejected'   },
    remove:   { cls: 'amber', label: 'Removed'    },
    security: { cls: 'red',   label: 'Security'   },
  }
  return map[type] ?? { cls: 'blue', label: type }
}

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState('')
  const [logs, setLogs] = useState<AdminAuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true

    adminAuditApi.list()
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

    return () => { active = false }
  }, [])

  const filtered = logs.filter((l) =>
    l.event.toLowerCase().includes(search.toLowerCase()) ||
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.hash.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-audit">
      <div>
        <div className="admin-audit__breadcrumb">
          <span>admin</span><span>/</span>
          <span className="admin-audit__breadcrumb-active">audit-logs</span>
        </div>
        <h1 className="admin-audit__title">Admin Audit Logs</h1>
        <p className="admin-audit__subtitle">Immutable cryptographic record of every admin action.</p>
      </div>

      <div className="admin-audit__card">
        <div className="admin-audit__toolbar">
          <div className="admin-audit__search-wrap">
            <span className="material-symbols-outlined admin-audit__search-icon">search</span>
            <input
              className="admin-audit__search"
              placeholder="Search events, actors, hash IDs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="admin-audit__select">
            <option>All Event Types</option>
            <option>Approvals</option>
            <option>Auth</option>
            <option>Security</option>
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
                    <div className="admin-audit__event-hash">{l.hash}</div>
                  </td>
                  <td><span className="admin-audit__actor">{l.actor}</span></td>
                  <td>
                    <span className={`admin-audit__badge admin-audit__badge--${badge.cls}`}>
                      <span className="admin-audit__badge-dot" />{badge.label}
                    </span>
                  </td>
                  <td><span className="admin-audit__timestamp">{l.time}</span></td>
                  <td>
                    <button className="admin-audit__inspect-btn">Inspect</button>
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
    </div>
  )
}
