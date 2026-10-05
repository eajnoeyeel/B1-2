import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

// { user, loading } — loading은 앱 시작 시 저장된 세션을 확인하는 동안 true
export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth는 <AuthProvider> 안에서만 사용할 수 있습니다.')
  return auth
}
