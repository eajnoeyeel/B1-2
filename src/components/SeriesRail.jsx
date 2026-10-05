import SeriesCard from './SeriesCard.jsx'

// 가로로 스크롤되는 작품 줄. 비어 있으면 emptyMessage를 한 줄로 보여준다.
export default function SeriesRail({ title, series, emptyMessage, action }) {
  return (
    <section className="space-y-4" aria-label={title}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-lg font-bold">{title}</h2>
        {action}
      </div>
      {series.length === 0 ? (
        <p className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="rail -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
          {series.map((item) => (
            <li key={item.id} className="w-36 shrink-0 snap-start sm:w-44">
              <SeriesCard series={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
