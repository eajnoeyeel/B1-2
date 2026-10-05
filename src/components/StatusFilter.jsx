import { STATUS_LABELS } from '../lib/book.js'

const OPTIONS = [['all', '전체'], ...Object.entries(STATUS_LABELS)]

// counts: { all, reading, done, wish } — 탭마다 개수를 함께 보여준다.
export default function StatusFilter({ value, onChange, counts }) {
  return (
    <div className="filter" role="tablist" aria-label="읽기 상태 필터">
      {OPTIONS.map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={value === key}
          className={`filter-tab ${value === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
        >
          {label} <span className="filter-count">{counts[key] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}
