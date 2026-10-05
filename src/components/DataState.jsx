import EmptyState from './EmptyState.jsx'
import ErrorState from './ErrorState.jsx'
import Loading from './Loading.jsx'

// 모든 데이터 화면이 같은 순서(로딩 → 에러 → 빈 → 성공)로 상태를 보여주도록 하는 공통 틀.
// children은 함수로 받는다: 성공 상태일 때만 호출되므로 data가 null인 채로 렌더링될 일이 없다.
export default function DataState({ loading, error, isEmpty, loadingVariant, emptyMessage, emptyAction, onRetry, children }) {
  if (loading) return <Loading variant={loadingVariant} />
  if (error) return <ErrorState message={error.message} onRetry={onRetry} />
  if (isEmpty) return <EmptyState message={emptyMessage}>{emptyAction}</EmptyState>
  return children()
}
