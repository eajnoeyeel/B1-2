import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import DataState from '../components/DataState.jsx'
import RatingStars from '../components/RatingStars.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useBook } from '../hooks/useBooks.js'
import { useToast } from '../hooks/useToast.js'
import { deleteBook } from '../lib/booksApi.js'

export default function BookDetailPage() {
  const { id } = useParams()
  const { data: book, loading, error, reload } = useBook(id)
  const navigate = useNavigate()
  const toast = useToast()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteBook(id)
      toast.show(`"${book.title}" 기록을 삭제했습니다.`)
      navigate('/books')
    } catch (err) {
      setDeleteError(err.message)
      setDeleting(false)
    }
  }

  return (
    <DataState
      loading={loading}
      error={error}
      onRetry={reload}
      isEmpty={!book}
      emptyMessage="해당 기록을 찾을 수 없습니다."
      emptyAction={<Button to="/books">목록으로</Button>}
    >
      {() => (
        <article className="detail">
          <div className="card-meta">
            <StatusBadge status={book.status} />
            <RatingStars value={book.rating} />
          </div>
          <h1>{book.title}</h1>
          <p className="detail-author">{book.author}</p>
          <p className="detail-review">{book.review}</p>
          <p className="detail-date">
            기록일 {new Date(book.created_at).toLocaleDateString('ko-KR')}
            {book.updated_at !== book.created_at &&
              ` · 수정일 ${new Date(book.updated_at).toLocaleDateString('ko-KR')}`}
          </p>

          {deleteError && (
            <p className="form-error" role="alert">
              삭제하지 못했습니다. {deleteError}
            </p>
          )}
          <div className="form-actions">
            {confirming ? (
              <>
                <span className="confirm-text">정말 삭제할까요?</span>
                <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? '삭제 중...' : '삭제 확인'}
                </Button>
                <Button variant="secondary" onClick={() => setConfirming(false)} disabled={deleting}>
                  취소
                </Button>
              </>
            ) : (
              <>
                <Button to={`/books/${id}/edit`}>수정</Button>
                <Button variant="danger" onClick={() => setConfirming(true)}>
                  삭제
                </Button>
                <Button to="/books" variant="secondary">
                  목록으로
                </Button>
              </>
            )}
          </div>
        </article>
      )}
    </DataState>
  )
}
