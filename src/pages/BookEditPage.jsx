import { useNavigate, useParams } from 'react-router-dom'
import BookForm from '../components/BookForm.jsx'
import Button from '../components/Button.jsx'
import DataState from '../components/DataState.jsx'
import { useBook } from '../hooks/useBooks.js'
import { useToast } from '../hooks/useToast.js'
import { toBookPayload } from '../lib/book.js'
import { updateBook } from '../lib/booksApi.js'

export default function BookEditPage() {
  const { id } = useParams()
  const { data: book, loading, error, reload } = useBook(id)
  const navigate = useNavigate()
  const toast = useToast()

  async function handleSubmit(payload) {
    const updated = await updateBook(id, payload)
    toast.show(`"${updated.title}" 기록을 수정했습니다.`)
    navigate(`/books/${id}`)
  }

  return (
    <>
      <h1>기록 수정</h1>
      <DataState
        loading={loading}
        error={error}
        onRetry={reload}
        isEmpty={!book}
        emptyMessage="해당 기록을 찾을 수 없습니다."
        emptyAction={<Button to="/books">목록으로</Button>}
      >
        {() => (
          <BookForm
            initialValues={toBookPayload(book)}
            submitLabel="수정 저장"
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/books/${id}`)}
          />
        )}
      </DataState>
    </>
  )
}
