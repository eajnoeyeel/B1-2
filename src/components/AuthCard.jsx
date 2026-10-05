import { CircleAlert } from 'lucide-react'

// 로그인/회원가입 화면의 공통 틀: 제목, 설명, 서버 에러, 폼, 하단 링크
export default function AuthCard({ title, description, error, footer, children }) {
  return (
    <div className="mx-auto w-full max-w-sm py-6 md:py-12">
      <h1 className="font-display text-3xl">{title}</h1>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      {error && (
        <div role="alert" className="mt-6 flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}
      <div className="mt-6">{children}</div>
      {footer && <p className="mt-6 text-sm text-muted-foreground">{footer}</p>}
    </div>
  )
}
