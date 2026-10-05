import { useCallback, useEffect, useMemo, useState } from 'react'
import { ToastContext } from '../hooks/useToast.js'

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

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
      </div>
    </ToastContext.Provider>
  )
}
