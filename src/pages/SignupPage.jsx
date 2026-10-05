import { MailCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '@/components/AuthCard.jsx'
import EmptyState from '@/components/EmptyState.jsx'
import FormField from '@/components/FormField.jsx'
import SubmitButton from '@/components/SubmitButton.jsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useFormState } from '@/hooks/useFormState'
import { useToast } from '@/hooks/useToast'
import { NAME_MAX, PASSWORD_MIN, validateSignup } from '@/lib/auth'
import { signUp } from '@/lib/authApi'

const EMPTY = { displayName: '', email: '', password: '', passwordConfirm: '' }

export default function SignupPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const from = useLocation().state?.from ?? '/'
  const [pendingEmail, setPendingEmail] = useState(null) // 이메일 인증이 필요한 경우 안내할 주소
  const { values, errors, submitting, submitError, submit, fieldProps } = useFormState(EMPTY)

  function handleSubmit(event) {
    event.preventDefault()
    submit(validateSignup, async (formValues) => {
      const { session } = await signUp(formValues)
      if (!session) {
        setPendingEmail(formValues.email.trim())
        return
      }
      toast.show(`${formValues.displayName.trim()}님, 환영해요.`)
      navigate(from, { replace: true })
    })
  }

  if (pendingEmail) {
    return (
      <div className="mx-auto max-w-md py-12">
        <EmptyState icon={MailCheck} message="메일함을 확인해 주세요." description={`${pendingEmail}로 보낸 인증 링크를 누르면 가입이 끝나요.`}>
          <Button asChild variant="outline">
            <Link to="/login">로그인 화면으로</Link>
          </Button>
        </EmptyState>
      </div>
    )
  }

  if (user && !submitting) return <Navigate to={from} replace />

  return (
    <AuthCard
      title="회원가입"
      description="가입하면 내 작품을 등록하고 수정할 수 있어요."
      error={submitError}
      footer={
        <>
          이미 계정이 있나요?{' '}
          <Link to="/login" state={{ from }} className="font-medium text-primary underline-offset-4 hover:underline">
            로그인
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <FormField label="크리에이터 이름" htmlFor="displayName" error={errors.displayName} hint="작품 등록 때 크리에이터 칸에 미리 채워져요.">
          <Input {...fieldProps('displayName')} maxLength={NAME_MAX} autoComplete="nickname" placeholder="예: lyra" className="h-10" />
        </FormField>
        <FormField label="이메일" htmlFor="email" error={errors.email}>
          <Input {...fieldProps('email')} type="email" autoComplete="email" className="h-10" />
        </FormField>
        <FormField label="비밀번호" htmlFor="password" error={errors.password} hint={`${PASSWORD_MIN}자 이상`}>
          <Input {...fieldProps('password')} type="password" autoComplete="new-password" className="h-10" />
        </FormField>
        <FormField
          label="비밀번호 확인"
          htmlFor="passwordConfirm"
          error={errors.passwordConfirm}
          hint={values.passwordConfirm && values.password === values.passwordConfirm ? '비밀번호가 일치해요.' : undefined}
        >
          <Input {...fieldProps('passwordConfirm')} type="password" autoComplete="new-password" className="h-10" />
        </FormField>
        <SubmitButton submitting={submitting} pendingLabel="가입하는 중…" className="mt-2 w-full">
          가입하기
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
