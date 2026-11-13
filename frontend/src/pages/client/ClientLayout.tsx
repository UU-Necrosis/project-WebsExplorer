import { Outlet } from 'react-router-dom'
import ClientFooter from './ClientFooter'

export default function ClientLayout() {
  return (
    <>
      <Outlet />
      <ClientFooter />
    </>
  )
}