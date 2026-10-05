import { Label } from '@/components/ui/label'

// 라벨 + 입력 컨트롤 + 에러/도움말을 묶는 틀. 에러가 있으면 도움말 대신 에러를 보여준다.
export default function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
