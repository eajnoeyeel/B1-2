import { LogIn, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { displayNameOf } from '@/lib/auth'
import { signOut } from '@/lib/authApi'

// 헤더 오른쪽: 로그인 상태에 따라 "로그인" 또는 "이름 + 로그아웃"
export default function AuthMenu() {
  const { user, loading } = useAuth()
  const toast = useToast()

  async function handleSignOut() {
    try {
      await signOut()
      toast.show('로그아웃했어요.')
    } catch (error) {
      toast.show(error.message, 'error')
    }
  }

  if (loading) return null
  if (!user) {
    return (
      <Button asChild variant="outline">
        <Link to="/login">
          <LogIn data-icon="inline-start" />
          로그인
        </Link>
      </Button>
    )
  }
  return (
    <div className="flex items-center gap-1">
      <span className="max-w-32 truncate text-sm text-muted-foreground">{displayNameOf(user)}</span>
      <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="로그아웃" title="로그아웃">
        <LogOut />
      </Button>
    </div>
  )
}
