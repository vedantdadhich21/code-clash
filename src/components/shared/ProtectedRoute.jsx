import { Outlet ,Navigate} from 'react-router-dom'
import { NotLogIn } from '@/pages/NotLogIn'
import useAuthStore from '@/store/useAuthStore'
import Auth from '@/pages/Auth'
const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)

  if(isLoading){
    return null;
  }
  if (!user) {
    return <>
    <Auth/>
    </>
  }
  return (
    <>
    <Outlet/>
    </>
  )
}

export default ProtectedRoute


