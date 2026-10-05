import { ArrowLeft, Pencil } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DataState from '@/components/DataState.jsx'
import DeleteSeriesDialog from '@/components/DeleteSeriesDialog.jsx'
import SeriesPoster from '@/components/SeriesPoster.jsx'
import StatusBadge from '@/components/StatusBadge.jsx'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSeries } from '@/hooks/useSeries'
import { useToast } from '@/hooks/useToast'
import { DAY_LABELS, GENRES, ORIENTATIONS } from '@/lib/series'
import { deleteSeries } from '@/lib/seriesApi'

function formatDate(value) {
  return new Date(value).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function SeriesDetailPage() {
  const { id } = useParams()
  const { data: series, loading, error, reload } = useSeries(id)
  const navigate = useNavigate()
  const toast = useToast()

  async function handleDelete() {
    await deleteSeries(id)
    toast.show(`‘${series.title}’ 작품을 삭제했어요.`)
    navigate('/series')
  }

  return (
    <div className="space-y-6">
      <Link to="/series" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        작품 탐색
      </Link>

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
          <article className="grid gap-8 md:grid-cols-[18rem_1fr] md:gap-12">
            <SeriesPoster series={series} className="w-48 md:w-full" />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{GENRES[series.genre]?.label}</Badge>
                <StatusBadge status={series.status} />
              </div>
              <h1 className="mt-4 font-display text-4xl leading-tight break-keep md:text-5xl">{series.title}</h1>
              <p className="mt-2 text-muted-foreground">{series.creator}</p>

              <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-y py-5">
                <div>
                  <dt className="text-xs text-muted-foreground">공개 회차</dt>
                  <dd className="mt-1 text-lg font-semibold">{series.episode_count}화</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">연재</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {series.status === 'ongoing' && series.release_day ? `매주 ${DAY_LABELS[series.release_day]}요일` : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">화면</dt>
                  <dd className="mt-1 text-lg font-semibold">{ORIENTATIONS[series.orientation]}</dd>
                </div>
              </dl>

              <p className="mt-8 max-w-prose leading-relaxed break-words whitespace-pre-wrap">{series.description}</p>

              <p className="mt-8 text-xs text-muted-foreground">
                {formatDate(series.created_at)} 등록
                {series.updated_at !== series.created_at && `, ${formatDate(series.updated_at)} 수정`}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="lg">
                  <Link to={`/series/${id}/edit`}>
                    <Pencil data-icon="inline-start" />
                    수정
                  </Link>
                </Button>
                <DeleteSeriesDialog seriesTitle={series.title} onDelete={handleDelete} />
              </div>
            </div>
          </article>
        )}
      </DataState>
    </div>
  )
}
