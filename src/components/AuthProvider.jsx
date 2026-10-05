import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

// 로그인 상태를 전역으로 관리한다. undefined = 아직 확인 중, null = 로그아웃.
// supabase-js가 세션을 localStorage에 저장하므로 새로고침해도 로그인이 유지된다.
export default function AuthProvider({ children }) {
  const [session, setSession] = useState(supabase ? undefined : null)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    // 로그인/로그아웃/토큰 갱신 때마다 호출된다 (다른 탭에서 로그아웃한 경우 포함)
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  const value = useMemo(() => ({ user: session?.user ?? null, loading: session === undefined }), [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
