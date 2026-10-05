export default function Loading({ message = '불러오는 중...' }) {
  return (
    <div className="state" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}
