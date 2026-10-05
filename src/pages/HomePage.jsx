import Button from '../components/Button.jsx'
import DataState from '../components/DataState.jsx'
import BookList from '../components/BookList.jsx'
import { useBooks } from '../hooks/useBooks.js'
import { STATUS_LABELS } from '../lib/book.js'

const RECENT_COUNT = 3

export default function HomePage() {
  const { data: books, loading, error, reload } = useBooks()

  return (
    <>
      <section className="hero">
        <h1>읽은 책, 읽는 책, 읽고 싶은 책</h1>
        <p>짧은 감상과 별점으로 나만의 독서 기록을 남겨 보세요.</p>
        <div className="hero-actions">
          <Button to="/books/new">새 기록 쓰기</Button>
          <Button to="/books" variant="secondary">
            전체 목록 보기
          </Button>
        </div>
      </section>

      <section>
        <h2>최근 기록</h2>
        <DataState
          loading={loading}
          error={error}
          onRetry={reload}
          isEmpty={books?.length === 0}
          emptyMessage="아직 기록한 책이 없습니다."
          emptyAction={<Button to="/books/new">첫 기록 쓰기</Button>}
        >
          {() => (
            <>
              <ul className="stats">
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <li key={key}>
                    <strong>{books.filter((b) => b.status === key).length}</strong>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <BookList books={books.slice(0, RECENT_COUNT)} />
            </>
          )}
        </DataState>
      </section>
    </>
  )
}
