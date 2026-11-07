import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Layout
import AdminLayout from './layout/AdminLayout'

// Admin pages
import AdminLoginPage     from './pages/admin/AdminLoginPage'
import AdminOverviewPage  from './pages/admin/AdminOverviewPage'
import AdminSubmissionsPage from './pages/admin/AdminSubmissionsPage'
import AdminDirectoryPage from './pages/admin/AdminDirectoryPage'
import AdminAuditLogsPage from './pages/admin/security/AdminAuditLogsPage'

// Client pages
import ClientHomePage from './pages/client/ClientHomePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Client pages ───────────────────────────── */}
          <Route path="/" element={<ClientHomePage />} />

          {/* ── Admin login (no sidebar) ───────────────── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ── Admin pages (inside sidebar layout) ──────── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview"    element={<AdminOverviewPage />} />
            <Route path="submissions" element={<AdminSubmissionsPage />} />
            <Route path="directory"   element={<AdminDirectoryPage />} />
            <Route path="audit-logs"  element={<AdminAuditLogsPage />} />
            {/* Placeholder routes — add pages later */}
            <Route path="community" element={<ComingSoon title="Admin Feedback & Requests" />} />
            <Route path="telemetry" element={<ComingSoon title="Admin System Telemetry" />} />
            <Route path="reports"  element={<ComingSoon title="Admin Reports" />} />
          </Route>

          {/* ── Catch-all ──────────────────────────────── */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

// Temporary placeholder for pages not built yet
function ComingSoon({ title }: { title: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: '1rem',
      fontFamily: 'Space Grotesk, sans-serif', color: '#0f172a',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#94a3b8' }}>
        construction
      </span>
      <p style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>{title}</p>
      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Coming soon</p>
    </div>
  )
}
