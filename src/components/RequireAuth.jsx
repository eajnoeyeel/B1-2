import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Loading from './Loading.jsx'

// 보호 라우트: 로그인하지 않았으면 /login으로 보내고, 로그인 후 돌아올 주소를 state로 넘긴다.
export default function RequireAuth() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loading variant="detail" />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
