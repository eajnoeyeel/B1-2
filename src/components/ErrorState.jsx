import { CircleAlert, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
      <CircleAlert className="size-8 text-destructive" aria-hidden="true" />
      <p className="font-semibold">요청에 실패했어요. 다시 시도해 주세요.</p>
      {message && <p className="max-w-md text-sm break-words text-muted-foreground">{message}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          <RotateCw data-icon="inline-start" />
          다시 시도
        </Button>
      )}
    </div>
  )
}
