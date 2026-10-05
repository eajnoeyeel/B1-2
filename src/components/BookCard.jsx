import { memo } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from './RatingStars.jsx'
import StatusBadge from './StatusBadge.jsx'

// to가 없으면 링크 없는 카드(등록 폼의 미리보기)로 쓰인다.
function BookCard({ book, to }) {
  const body = (
    <>
      <div className="card-meta">
        <StatusBadge status={book.status} />
        <RatingStars value={book.rating} />
      </div>
      <h3 className="card-title">{book.title || '제목 없음'}</h3>
      <p className="card-author">{book.author || '저자 미상'}</p>
      <p className="card-review">{book.review || '감상을 입력하면 여기에 미리 보입니다.'}</p>
    </>
  )
  return to ? (
    <Link to={to} className="card card-link">
      {body}
    </Link>
  ) : (
    <article className="card">{body}</article>
  )
}

// 필터/검색으로 목록이 다시 렌더링될 때, props가 그대로인 카드는 다시 그리지 않는다.
export default memo(BookCard)
