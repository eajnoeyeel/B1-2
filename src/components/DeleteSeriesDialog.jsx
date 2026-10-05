import { LoaderCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

// 삭제 확인 창. 삭제 중/실패 상태를 스스로 관리하고, 성공 후 이동은 onDelete를 넘긴 페이지가 정한다.
export default function DeleteSeriesDialog({ seriesTitle, onDelete }) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  async function handleConfirm(event) {
    event.preventDefault() // 요청이 끝날 때까지 창을 닫지 않는다
    setDeleting(true)
    setError(null)
    try {
      await onDelete()
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  function handleOpenChange(next) {
    if (deleting) return
    setOpen(next)
    if (!next) setError(null)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg">
          <Trash2 data-icon="inline-start" />
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>‘{seriesTitle}’ 작품을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>삭제한 작품은 되돌릴 수 없어요.</AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            삭제하지 못했어요. {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>취소</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={deleting}>
            {deleting && <LoaderCircle className="animate-spin" data-icon="inline-start" />}
            {deleting ? '삭제 중…' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
