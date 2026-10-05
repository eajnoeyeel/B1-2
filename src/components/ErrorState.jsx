import Button from './Button.jsx'

export default function ErrorState({ message = '요청에 실패했습니다. 다시 시도하세요.', onRetry }) {
  return (
    <div className="state state-error" role="alert">
      <p className="state-title">요청에 실패했습니다. 다시 시도하세요.</p>
      <p className="state-detail">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}
