import { memo } from 'react'
import { Link } from 'react-router-dom'
import { DAY_LABELS } from '@/lib/series'
import SeriesPoster from './SeriesPoster.jsx'
import StatusBadge from './StatusBadge.jsx'

function SeriesCard({ series }) {
  return (
    <Link
      to={`/series/${series.id}`}
      className="group block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
    >
      <SeriesPoster series={series} className="transition duration-200 group-hover:brightness-110" />
      <div className="mt-2.5 space-y-1">
        <p className="truncate font-semibold leading-snug">{series.title}</p>
        <p className="truncate text-sm text-muted-foreground">{series.creator}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <StatusBadge status={series.status} />
          <span>{series.episode_count}화</span>
          {series.status === 'ongoing' && series.release_day && <span>매주 {DAY_LABELS[series.release_day]}</span>}
        </div>
      </div>
    </Link>
  )
}

// 필터·검색으로 목록이 다시 렌더링될 때, props가 그대로인 카드는 다시 그리지 않는다.
export default memo(SeriesCard)
