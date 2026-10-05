import { Link, useNavigate, useParams } from 'react-router-dom'
import DataState from '@/components/DataState.jsx'
import SeriesForm from '@/components/SeriesForm.jsx'
import { Button } from '@/components/ui/button'
import { useSeries } from '@/hooks/useSeries'
import { useToast } from '@/hooks/useToast'
import { toFormValues } from '@/lib/series'
import { updateSeries } from '@/lib/seriesApi'

export default function SeriesEditPage() {
  const { id } = useParams()
  const { data: series, loading, error, reload } = useSeries(id)
  const navigate = useNavigate()
  const toast = useToast()

  async function handleSubmit(payload) {
    const updated = await updateSeries(id, payload)
    toast.show(`‘${updated.title}’ 작품의 변경 사항을 저장했어요.`)
    navigate(`/series/${id}`)
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl md:text-4xl">작품 정보 수정</h1>
      <DataState
        loading={loading}
        loadingVariant="detail"
        error={error}
        onRetry={reload}
        isEmpty={!series}
        emptyMessage="작품을 찾을 수 없어요."
        emptyAction={
          <Button asChild variant="outline">
            <Link to="/series">작품 탐색으로</Link>
          </Button>
        }
      >
        {() => (
          <SeriesForm
            initialValues={toFormValues(series)}
            submitLabel="변경 사항 저장"
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/series/${id}`)}
          />
        )}
      </DataState>
    </div>
  )
}
