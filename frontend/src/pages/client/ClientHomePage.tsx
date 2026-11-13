import { useAuth } from '../../context/AuthContext'
import GuestLayout from '../../layout/GuestLayout'
import GuestHomePage from './guest-pages/GuestHomePage'
import UserHomePage from './user-pages/UserHomePage'

export default function ClientHomePage() {
  const { isUserLoggedIn } = useAuth()

  return isUserLoggedIn
    ? <UserHomePage />
    : <GuestLayout><GuestHomePage /></GuestLayout>
}
