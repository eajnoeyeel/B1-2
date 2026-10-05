import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// 제출 중이면 비활성화하고 스피너와 진행 문구를 보여주는 submit 버튼
export default function SubmitButton({ submitting, pendingLabel, className, children }) {
  return (
    <Button type="submit" size="lg" disabled={submitting} className={cn('min-w-28', className)}>
      {submitting && <LoaderCircle className="animate-spin" data-icon="inline-start" />}
      {submitting ? pendingLabel : children}
    </Button>
  )
}
