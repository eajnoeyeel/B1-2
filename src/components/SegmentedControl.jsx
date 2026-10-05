import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

// options: [[value, label], ...]. 항상 하나가 선택된 단일 선택 버튼 묶음.
export default function SegmentedControl({ id, value, onChange, options, label, invalid, className }) {
  return (
    <ToggleGroup
      id={id}
      type="single"
      value={value}
      onValueChange={(next) => next && onChange(next)}
      aria-label={label}
      aria-invalid={invalid || undefined}
      variant="outline"
      spacing={0}
      className={cn('w-full', className)}
    >
      {options.map(([key, text]) => (
        <ToggleGroupItem
          key={key}
          value={key}
          className="h-9 flex-1 data-[state=on]:bg-accent data-[state=on]:text-foreground data-[state=on]:font-semibold"
        >
          {text}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
