import { Search } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DataState from '@/components/DataState.jsx'
import EmptyState from '@/components/EmptyState.jsx'
import GenreFilter from '@/components/GenreFilter.jsx'
import SegmentedControl from '@/components/SegmentedControl.jsx'
import SeriesGrid from '@/components/SeriesGrid.jsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useSeriesList } from '@/hooks/useSeries'
import { STATUSES } from '@/lib/series'

const STATUS_OPTIONS = [['all', '전체'], ...Object.entries(STATUSES)]

const SORTS = {
  new: { label: '최근 등록순', compare: (a, b) => b.id - a.id },
  episodes: { label: '회차 많은 순', compare: (a, b) => b.episode_count - a.episode_count },
  title: { label: '제목순', compare: (a, b) => a.title.localeCompare(b.title, 'ko') },
}

export default function ExplorePage() {
  const { data: series, loading, error, reload } = useSeriesList()

  // 필터 상태를 URL 쿼리에 둔다: 상세에서 뒤로 가도 필터가 유지되고, 링크로 공유할 수 있다.
  const [params, setParams] = useSearchParams()
  const genre = params.get('genre') ?? 'all'
  const status = params.get('status') ?? 'all'
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'new'
  const query = params.get('q') ?? ''

  function setParam(key, value, fallback) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === fallback) next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  const genreCounts = useMemo(() => {
    const counts = { all: series?.length ?? 0 }
    for (const item of series ?? []) counts[item.genre] = (counts[item.genre] ?? 0) + 1
    return counts
  }, [series])

  // 원본(series)은 그대로 두고, 필터/검색/정렬 결과만 새 배열로 계산한다.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (series ?? [])
      .filter(
        (item) =>
          (genre === 'all' || item.genre === genre) &&
          (status === 'all' || item.status === status) &&
          (!q || item.title.toLowerCase().includes(q) || item.creator.toLowerCase().includes(q)),
      )
      .toSorted(SORTS[sort].compare)
  }, [series, genre, status, query, sort])

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl md:text-4xl">작품 탐색</h1>

      <DataState
        loading={loading}
        loadingVariant="grid"
        error={error}
        onRetry={reload}
        isEmpty={series?.length === 0}
        emptyMessage="아직 등록된 작품이 없어요."
        emptyAction={
          <Button asChild>
            <Link to="/series/new">첫 작품 등록하기</Link>
          </Button>
        }
      >
        {() => (
          <>
            <div className="space-y-4">
              <GenreFilter value={genre} onChange={(v) => setParam('genre', v, 'all')} counts={genreCounts} />
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <SegmentedControl
                  label="연재 상태"
                  value={status}
                  onChange={(v) => setParam('status', v, 'all')}
                  options={STATUS_OPTIONS}
                  className="md:w-auto"
                />
                <div className="relative md:ml-auto md:w-64">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    type="search"
                    aria-label="제목 또는 크리에이터 검색"
                    placeholder="제목 또는 크리에이터"
                    value={query}
                    onChange={(e) => setParam('q', e.target.value, '')}
                    className="h-9 pl-9"
                  />
                </div>
                <NativeSelect aria-label="정렬" value={sort} onChange={(e) => setParam('sort', e.target.value, 'new')} className="[&_select]:h-9">
                  {Object.entries(SORTS).map(([key, { label }]) => (
                    <NativeSelectOption key={key} value={key}>
                      {label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            </div>

            <p className="text-sm text-muted-foreground" aria-live="polite">
              작품 {visible.length}개
            </p>

            {visible.length > 0 ? (
              <SeriesGrid series={visible} />
            ) : (
              <EmptyState message="조건에 맞는 작품이 없어요." description="다른 장르나 검색어로 찾아보세요.">
                <Button variant="outline" onClick={() => setParams({}, { replace: true })}>
                  필터 초기화
                </Button>
              </EmptyState>
            )}
          </>
        )}
      </DataState>
    </div>
  )
}
