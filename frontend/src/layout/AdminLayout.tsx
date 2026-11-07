import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminLayout.css'

const NAV_ITEMS = [
  { label: 'Overview',       path: '/admin/overview',     icon: 'grid_view' },
  { label: 'Submissions',    path: '/admin/submissions',  icon: 'inbox',           badge: 14 },
  { label: 'Directory',      path: '/admin/directory',    icon: 'verified' },
]

const INFRA_ITEMS = [
  { label: 'Audit Logs',     path: '/admin/audit-logs',   icon: 'history_toggle_off' },
  { label: 'Feedback & Requests', path: '/admin/community',   icon: 'groups' },
  { label: 'System Telemetry', path: '/admin/telemetry', icon: 'monitoring' },
  { label: 'Reports',         path: '/admin/reports',  icon: 'bar_chart' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-shell">

      {/* ── Top header ──────────────────────────────────── */}
      <header className="admin-header">
        <div className="admin-header__left">
          <button
            className="admin-header__menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            title="Toggle sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="admin-header__cluster">
            <span className="admin-header__cluster-dot" />
            <span>PRD-CLUSTER-01</span>
            <span style={{ color: '#94a3b8' }}>|</span>
            <span>12ms</span>
          </div>
        </div>

        <div className="admin-header__right">
          <div className="admin-header__role-badge">
            <span>ADMIN ROLE:</span>
            <strong>ROOT_OPERATOR</strong>
          </div>

          <button className="admin-header__icon-btn" title="Settings">
            <span className="material-symbols-outlined">tune</span>
          </button>

          <button className="admin-header__icon-btn" title="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="admin-header__notif-dot" />
          </button>

          <div
            className="admin-header__avatar"
            onClick={handleLogout}
            title="Sign out"
            style={{ cursor: 'pointer' }}
          >
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </header>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`admin-sidebar${sidebarOpen ? '' : ' admin-sidebar--hidden'}`}>
        <div>
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__brand-name">EnvAdmin</span>
            <span className="admin-sidebar__brand-version">Admin Operations v1.0</span>
          </div>

          <div className="admin-sidebar__sync">
            <div className="admin-sidebar__sync-left">
              <span className="admin-sidebar__sync-dot" />
              <span className="admin-sidebar__sync-label">Sync Gateway</span>
            </div>
            <span className="admin-sidebar__sync-value">99.98%</span>
          </div>

          <span className="admin-sidebar__section-label">Operational Registry</span>
          <nav className="admin-sidebar__nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `admin-sidebar__nav-link${isActive ? ' admin-sidebar__nav-link--active' : ''}`
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="admin-sidebar__nav-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <span className="admin-sidebar__section-label">Infrastructure & Security</span>
          <nav className="admin-sidebar__nav">
            {INFRA_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `admin-sidebar__nav-link${isActive ? ' admin-sidebar__nav-link--active' : ''}`
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar__bottom">
          <div className="admin-sidebar__security">
            <span className="material-symbols-outlined">shield</span>
            <div>
              <span className="admin-sidebar__security-title">Audited Enclave</span>
              <span className="admin-sidebar__security-sub">TLS 1.3 / Zero-Trust</span>
            </div>
          </div>
          <div className="admin-sidebar__node">
            <span className="admin-sidebar__node-label">NODE: us-east-core-09</span>
            <span className="material-symbols-outlined">cloud_done</span>
          </div>
        </div>
      </aside>

      {/* ── Page content ────────────────────────────────── */}
      <main className={`admin-content${sidebarOpen ? '' : ' admin-content--expanded'}`}>
        <Outlet />
      </main>
    </div>
  )
}
