import { Link } from 'react-router-dom'
import DataState from '@/components/DataState.jsx'
import SeriesPoster from '@/components/SeriesPoster.jsx'
import SeriesRail from '@/components/SeriesRail.jsx'
import { Button } from '@/components/ui/button'
import { useSeriesList } from '@/hooks/useSeries'
import { DAY_LABELS, todayKey } from '@/lib/series'
import { cn } from '@/lib/utils'

const NEW_COUNT = 8

// 히어로 오른쪽에 겹쳐 세우는 최신 포스터 3장의 자리 (뒤 왼쪽, 뒤 오른쪽, 앞 가운데)
const STACK = [
  'left-0 top-10 -rotate-8 delay-150',
  'right-0 top-6 rotate-7 delay-300',
  'left-1/2 top-0 z-10 -translate-x-1/2',
]

export default function HomePage() {
  const { data: series, loading, error, reload } = useSeriesList()
  const today = todayKey()

  return (
    <div className="space-y-14">
      <section className="grid items-center gap-10 pt-4 md:grid-cols-[1fr_auto] md:pt-10">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl leading-[1.15] md:text-6xl">
            다음 화가
            <br />
            기다려지는 이야기
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">어떤 AI 도구로 만들었든, 숏드라마를 작품 단위로 연재하고 찾아보세요.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-5 text-base">
              <Link to="/series">작품 둘러보기</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-5 text-base">
              <Link to="/series/new">내 작품 등록하기</Link>
            </Button>
          </div>
        </div>
        {series?.length > 0 && (
          <div aria-hidden="true" className="relative mr-6 hidden h-[23rem] w-[20rem] md:block">
            {series.slice(0, 3).map((item, i) => (
              <SeriesPoster
                key={item.id}
                series={item}
                className={cn('absolute w-44 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both', STACK[i])}
              />
            ))}
          </div>
        )}
      </section>

      <DataState
        loading={loading}
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
          <div className="space-y-12">
            <SeriesRail
              title={`오늘(${DAY_LABELS[today]}) 새 회차`}
              series={series.filter((s) => s.status === 'ongoing' && s.release_day === today)}
              emptyMessage="오늘은 새 회차가 올라오는 작품이 없어요."
            />
            <SeriesRail
              title="새로 등록된 작품"
              series={series.slice(0, NEW_COUNT)}
              action={
                <Link to="/series" className="text-sm text-muted-foreground hover:text-foreground">
                  전체 보기
                </Link>
              }
            />
            <SeriesRail
              title="완결 작품 정주행"
              series={series.filter((s) => s.status === 'completed')}
              emptyMessage="아직 완결된 작품이 없어요."
            />
          </div>
        )}
      </DataState>
    </div>
  )
}
