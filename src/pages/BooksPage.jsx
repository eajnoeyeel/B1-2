import { useMemo, useState } from 'react'
import BookList from '../components/BookList.jsx'
import Button from '../components/Button.jsx'
import DataState from '../components/DataState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import StatusFilter from '../components/StatusFilter.jsx'
import TextField from '../components/TextField.jsx'
import { useBooks } from '../hooks/useBooks.js'

export default function BooksPage() {
  const { data: books, loading, error, reload } = useBooks()
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')

  // 원본(books)은 그대로 두고, 필터/검색 결과만 새 배열로 계산한다.
  const counts = useMemo(() => {
    const result = { all: books?.length ?? 0 }
    for (const book of books ?? []) result[book.status] = (result[book.status] ?? 0) + 1
    return result
  }, [books])

  const visibleBooks = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (books ?? []).filter(
      (book) =>
        (status === 'all' || book.status === status) &&
        (!q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)),
    )
  }, [books, status, query])

  return (
    <>
      <div className="page-head">
        <h1>책 목록</h1>
        <Button to="/books/new">새 기록</Button>
      </div>
      <DataState
        loading={loading}
        error={error}
        onRetry={reload}
        isEmpty={books?.length === 0}
        emptyAction={<Button to="/books/new">첫 기록 쓰기</Button>}
      >
        {() => (
          <>
            <div className="toolbar">
              <StatusFilter value={status} onChange={setStatus} counts={counts} />
              <TextField
                label="검색"
                name="search"
                type="search"
                placeholder="제목 또는 저자"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {visibleBooks.length > 0 ? (
              <BookList books={visibleBooks} />
            ) : (
              <EmptyState message="조건에 맞는 책이 없습니다." />
            )}
          </>
        )}
      </DataState>
    </>
  )
}
