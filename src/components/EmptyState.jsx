export default function EmptyState({ message = '표시할 데이터가 없습니다.', children }) {
  return (
    <div className="state">
      <p className="state-title">{message}</p>
      {children}
    </div>
  )
}
