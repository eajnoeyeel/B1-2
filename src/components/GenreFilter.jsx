import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { GENRES } from '@/lib/series'

const OPTIONS = [['all', '전체'], ...Object.entries(GENRES).map(([key, { label }]) => [key, label])]

// counts: { all, romance, ... } — 칩마다 해당 장르 작품 수를 함께 보여준다.
export default function GenreFilter({ value, onChange, counts }) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      // 이미 선택된 칩을 다시 누르면 Radix가 ''를 넘기므로 무시한다(항상 하나는 선택).
      onValueChange={(next) => next && onChange(next)}
      aria-label="장르"
      className="rail -mx-4 w-[calc(100%+2rem)] justify-start gap-2 overflow-x-auto px-4"
      spacing={2}
    >
      {OPTIONS.map(([key, label]) => (
        <ToggleGroupItem
          key={key}
          value={key}
          className="h-9 shrink-0 rounded-full border px-4 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {label}
          <span className="text-xs opacity-60">{counts[key] ?? 0}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
