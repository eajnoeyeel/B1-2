export const STATUS_LABELS = {
  reading: '읽는 중',
  done: '완독',
  wish: '읽고 싶음',
}

export const EMPTY_BOOK = { title: '', author: '', status: 'reading', rating: 3, review: '' }

export const LIMITS = { title: 100, author: 50, review: 2000 }

// 폼 값 → { 필드명: 에러 메시지 }. 빈 객체면 통과.
export function validateBook(values) {
  const errors = {}
  const title = values.title.trim()
  const author = values.author.trim()
  const review = values.review.trim()

  if (!title) errors.title = '제목을 입력하세요.'
  else if (title.length > LIMITS.title) errors.title = `제목은 ${LIMITS.title}자 이하로 입력하세요.`

  if (!author) errors.author = '저자를 입력하세요.'
  else if (author.length > LIMITS.author) errors.author = `저자는 ${LIMITS.author}자 이하로 입력하세요.`

  if (!(values.status in STATUS_LABELS)) errors.status = '읽기 상태를 선택하세요.'

  if (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5) {
    errors.rating = '별점은 1~5 사이로 선택하세요.'
  }

  if (!review) errors.review = '감상을 입력하세요.'
  else if (review.length > LIMITS.review) errors.review = `감상은 ${LIMITS.review}자 이하로 입력하세요.`

  return errors
}

// DB에 보낼 값만 골라 공백을 정리한 새 객체를 만든다.
export function toBookPayload(values) {
  return {
    title: values.title.trim(),
    author: values.author.trim(),
    status: values.status,
    rating: values.rating,
    review: values.review.trim(),
  }
}
