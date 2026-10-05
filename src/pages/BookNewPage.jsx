import { useNavigate } from 'react-router-dom'
import BookForm from '../components/BookForm.jsx'
import { useToast } from '../hooks/useToast.js'
import { createBook } from '../lib/booksApi.js'

export default function BookNewPage() {
  const navigate = useNavigate()
  const toast = useToast()

  async function handleSubmit(payload) {
    const created = await createBook(payload)
    toast.show(`"${created.title}" 기록을 저장했습니다.`)
    navigate(`/books/${created.id}`)
  }

  return (
    <>
      <h1>새 기록</h1>
      <BookForm submitLabel="저장" onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
    </>
  )
}
