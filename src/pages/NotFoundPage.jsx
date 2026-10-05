import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function NotFoundPage() {
  return (
    <>
      <h1>404</h1>
      <EmptyState message="요청한 페이지를 찾을 수 없습니다.">
        <Button to="/">홈으로</Button>
      </EmptyState>
    </>
  )
}
