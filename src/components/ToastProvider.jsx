import { CircleCheck, CircleAlert } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ToastContext } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

const DURATION_MS = 3000

// 저장/삭제 결과 알림을 전역 상태로 관리한다. 페이지가 바뀌어도(등록 → 상세 이동) 알림이 유지된다.
export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), DURATION_MS)
    return () => clearTimeout(timer)
  }, [toast])

  const show = useCallback((message, type = 'success') => setToast({ message, type }), [])
  const value = useMemo(() => ({ show }), [show])
  const Icon = toast?.type === 'error' ? CircleAlert : CircleCheck

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-8">
        {toast && (
          <div
            className={cn(
              'flex items-center gap-2 rounded-full border bg-popover px-5 py-3 text-sm shadow-2xl shadow-black/40 animate-in fade-in slide-in-from-bottom-2',
              toast.type === 'error' && 'border-destructive/40',
            )}
          >
            <Icon className={cn('size-4', toast.type === 'error' ? 'text-destructive' : 'text-primary')} aria-hidden="true" />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
