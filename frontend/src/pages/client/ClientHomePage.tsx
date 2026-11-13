import { useAuth } from '../../context/AuthContext'
import GuestHomePage from './Guest pages/GuestHomePage'
import UserHomePage from './User pages/UserHomePage'

export default function ClientHomePage() {
  const { isLoggedIn } = useAuth()

  return isLoggedIn ? <UserHomePage /> : <GuestHomePage />
}
