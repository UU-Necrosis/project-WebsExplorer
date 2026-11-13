import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ClientSubmissionProvider } from './context/ClientSubmissionStore'

// Layout
import AdminLayout from './layout/AdminLayout'
import ClientLayout from './pages/client/ClientLayout'

// Admin pages
import AdminLoginPage     from './pages/admin/AdminLoginPage'
import AdminOverviewPage  from './pages/admin/AdminOverviewPage'
import AdminSubmissionsPage from './pages/admin/AdminSubmissionsPage'
import AdminDirectoryPage from './pages/admin/AdminDirectoryPage'
import AdminAuditLogsPage from './pages/admin/security/AdminAuditLogsPage'

// Client pages
import ClientAuthPage from './pages/client/ClientAuthPage'
import ClientHomePage from './pages/client/ClientHomePage'
import GuestHomePage from './pages/client/Guest pages/GuestHomePage'
import UserHomePage from './pages/client/User pages/UserHomePage'
import UserSubmitWeb from './pages/client/User pages/UserSubmitWeb'
import UserProfileHomePage from './pages/client/User pages/profile/UserProfileHomePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClientSubmissionProvider>
          <Routes>
          {/* ── Client pages ───────────────────────────── */}
          <Route element={<ClientLayout />}>
            <Route index element={<ClientHomePage />} />
            <Route path="home" element={<ClientHomePage />} />
            <Route path="discover" element={<GuestHomePage />} />
            <Route path="categories" element={<UserHomePage />} />
            <Route path="submit" element={<UserSubmitWeb />} />
            <Route path="profile" element={<UserProfileHomePage />} />
            <Route path="guest" element={<GuestHomePage />} />
            <Route path="user" element={<UserHomePage />} />
            <Route path="login" element={<ClientAuthPage />} />
            <Route path="signup" element={<ClientAuthPage />} />
          </Route>

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
        </ClientSubmissionProvider>
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
