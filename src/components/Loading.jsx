import { Skeleton } from '@/components/ui/skeleton'

// 실제 화면과 같은 모양의 뼈대를 먼저 보여준다. variant: grid | detail
export default function Loading({ variant = 'grid', count = 5 }) {
  return (
    <div role="status" aria-label="불러오는 중">
      {variant === 'detail' ? (
        <div className="grid gap-8 md:grid-cols-[18rem_1fr]">
          <Skeleton className="aspect-[9/16] w-48 rounded-lg md:w-full" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="space-y-2.5">
              <Skeleton className="aspect-[9/16] rounded-lg" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}
      <span className="sr-only">불러오는 중…</span>
    </div>
  )
}
