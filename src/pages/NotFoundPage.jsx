import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <p className="font-display text-7xl text-primary">404</p>
      <h1 className="text-2xl font-bold">없는 페이지예요.</h1>
      <p className="text-muted-foreground">주소가 바뀌었거나 삭제된 작품일 수 있어요.</p>
      <Button asChild className="mt-2">
        <Link to="/">홈으로 가기</Link>
      </Button>
    </div>
  )
}
