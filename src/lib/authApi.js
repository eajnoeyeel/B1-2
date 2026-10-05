import { toAuthErrorMessage } from './auth.js'
import { supabase } from './supabase.js'

function auth() {
  if (!supabase) throw new Error('Supabase 환경변수가 설정되지 않았습니다.')
  return supabase.auth
}

function unwrap({ data, error }) {
  if (error) throw new Error(toAuthErrorMessage(error.message))
  return data
}

export async function signIn({ email, password }) {
  return unwrap(await auth().signInWithPassword({ email: email.trim(), password }))
}

// 이메일 인증을 켜 둔 프로젝트라면 session이 null로 온다 → 화면에서 "메일함 확인" 안내
export async function signUp({ displayName, email, password }) {
  return unwrap(
    await auth().signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: displayName.trim() },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    }),
  )
}

export async function signOut() {
  unwrap(await auth().signOut())
}
