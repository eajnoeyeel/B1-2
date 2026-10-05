import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '@/components/AuthCard.jsx'
import FormField from '@/components/FormField.jsx'
import SubmitButton from '@/components/SubmitButton.jsx'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useFormState } from '@/hooks/useFormState'
import { useToast } from '@/hooks/useToast'
import { validateLogin } from '@/lib/auth'
import { signIn } from '@/lib/authApi'

export default function LoginPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  // 보호 라우트에서 튕겨 왔다면 로그인 후 그 주소로 돌려보낸다.
  const from = useLocation().state?.from ?? '/'
  const { errors, submitting, submitError, submit, fieldProps } = useFormState({ email: '', password: '' })

  function handleSubmit(event) {
    event.preventDefault()
    submit(validateLogin, async (values) => {
      await signIn(values)
      toast.show('로그인했어요.')
      navigate(from, { replace: true })
    })
  }

  // 이미 로그인한 상태로 /login에 들어오면 바로 돌려보낸다. (로그인 직후에는 위 navigate가 먼저 처리)
  if (user && !submitting) return <Navigate to={from} replace />

  return (
    <AuthCard
      title="로그인"
      description={from === '/' ? '작품을 등록하고 관리하려면 로그인해 주세요.' : '이 페이지는 로그인한 크리에이터만 쓸 수 있어요.'}
      error={submitError}
      footer={
        <>
          아직 계정이 없나요?{' '}
          <Link to="/signup" state={{ from }} className="font-medium text-primary underline-offset-4 hover:underline">
            회원가입
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <FormField label="이메일" htmlFor="email" error={errors.email}>
          <Input {...fieldProps('email')} type="email" autoComplete="email" className="h-10" />
        </FormField>
        <FormField label="비밀번호" htmlFor="password" error={errors.password}>
          <Input {...fieldProps('password')} type="password" autoComplete="current-password" className="h-10" />
        </FormField>
        <SubmitButton submitting={submitting} pendingLabel="로그인 중…" className="mt-2 w-full">
          로그인
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
