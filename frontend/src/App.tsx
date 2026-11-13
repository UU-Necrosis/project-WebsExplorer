import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Layout
import AdminLayout from './layout/AdminLayout'
import GuestLayout from './layout/GuestLayout'
import UserLayout from './layout/UserLayout'

// Admin pages
import AdminLoginPage     from './pages/admin/AdminLoginPage'
import AdminOverviewPage  from './pages/admin/AdminOverviewPage'
import AdminSubmissionsPage from './pages/admin/AdminSubmissionsPage'
import AdminDirectoryPage from './pages/admin/AdminDirectoryPage'
import AdminAuditLogsPage from './pages/admin/security/AdminAuditLogsPage'

// Client pages
import ClientHomePage from './pages/client/ClientHomePage'
import GuestHomePage from './pages/client/guest-pages/GuestHomePage'
import GuestLoginPage from './pages/client/guest-pages/GuestLoginPage'
import GuestSignupPage from './pages/client/guest-pages/GuestSignupPage'
import UserHomePage from './pages/client/user-pages/UserHomePage'
import NewWebsitesPage from './pages/client/user-pages/NewWebsitesPage'
import UserSubmitWeb from './pages/client/user-pages/UserSubmitWeb'
import UserProfileHomePage from './pages/client/user-pages/profile/UserProfileHomePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* The root page chooses its home view from the current auth state. */}
          <Route path="/" element={<ClientHomePage />} />

          {/* ── Guest pages ───────────────────────────── */}
          <Route element={<GuestLayout />}>
            <Route path="discover" element={<GuestHomePage />} />
            <Route path="guest" element={<GuestHomePage />} />
            <Route path="guest-login" element={<GuestLoginPage />} />
            <Route path="guest-signup" element={<GuestSignupPage />} />
            <Route path="login" element={<GuestLoginPage />} />
            <Route path="signup" element={<GuestSignupPage />} />
          </Route>

          {/* ── User pages ────────────────────────────── */}
          <Route element={<UserLayout />}>
            <Route path="home" element={<UserHomePage />} />
            <Route path="categories" element={<UserHomePage />} />
            <Route path="new-websites" element={<NewWebsitesPage />} />
            <Route path="submit" element={<UserSubmitWeb />} />
            <Route path="profile" element={<UserProfileHomePage />} />
            <Route path="user" element={<UserHomePage />} />
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

          {/* Unknown public routes return to the guest landing page. */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
