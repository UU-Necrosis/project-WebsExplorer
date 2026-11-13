import { Navigate, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { ClientSubmissionProvider } from '../context/ClientSubmissionStore'
import './css/UserLayout.css'

export default function UserLayout({ children }: { children?: ReactNode }) {
  const { isUserLoggedIn } = useAuth()

  if (!isUserLoggedIn) return <Navigate to="/guest-login" replace />

  return (
    <ClientSubmissionProvider>
      <div className="user-layout" data-theme="client">
        {children ?? <Outlet />}
      </div>
    </ClientSubmissionProvider>
  )
}
