import { useState } from 'react'
import { EMPTY_BOOK, LIMITS, STATUS_LABELS, toBookPayload, validateBook } from '../lib/book.js'
import BookCard from './BookCard.jsx'
import Button from './Button.jsx'
import TextField from './TextField.jsx'

// 등록/수정 공용 폼. 저장 후 이동은 onSubmit을 넘긴 페이지가 정한다.
// onSubmit이 throw하면 실패 메시지를 폼 상단에 보여준다.
export default function BookForm({ initialValues = EMPTY_BOOK, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }))
    // 사용자가 고치기 시작하면 그 필드의 에러는 지운다.
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateBook(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit(toBookPayload(values))
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-layout">
      <form className="form" onSubmit={handleSubmit} noValidate>
        {submitError && (
          <p className="form-error" role="alert">
            저장하지 못했습니다. {submitError}
          </p>
        )}
        <TextField label="제목" name="title" value={values.title} onChange={handleChange} error={errors.title} maxLength={LIMITS.title} />
        <TextField label="저자" name="author" value={values.author} onChange={handleChange} error={errors.author} maxLength={LIMITS.author} />
        <div className="field-row">
          <TextField as="select" label="읽기 상태" name="status" value={values.status} onChange={handleChange} error={errors.status}>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </TextField>
          <TextField as="select" label="별점" name="rating" value={values.rating} onChange={handleChange} error={errors.rating}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n)} ({n})
              </option>
            ))}
          </TextField>
        </div>
        <TextField
          as="textarea"
          label="감상"
          name="review"
          rows={6}
          value={values.review}
          onChange={handleChange}
          error={errors.review}
          hint={`${values.review.length} / ${LIMITS.review}자`}
          maxLength={LIMITS.review}
        />
        <div className="form-actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? '저장 중...' : submitLabel}
          </Button>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} disabled={submitting}>
              취소
            </Button>
          )}
        </div>
      </form>
      <aside className="preview" aria-label="미리보기">
        <p className="preview-label">미리보기</p>
        <BookCard book={values} />
      </aside>
    </div>
  )
}
