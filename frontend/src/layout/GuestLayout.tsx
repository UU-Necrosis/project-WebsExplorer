import { Navigate, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import './css/GuestLayout.css'

export default function GuestLayout({ children }: { children?: ReactNode }) {
  const { isUserLoggedIn } = useAuth()

  if (isUserLoggedIn) return <Navigate to="/home" replace />

  return (
    <div className="guest-layout" data-theme="client">
      {children ?? <Outlet />}
    </div>
  )
}
