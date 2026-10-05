import { Clapperboard } from 'lucide-react'

export default function EmptyState({ icon: Icon = Clapperboard, message = '표시할 작품이 없어요.', description, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center">
      <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
      <p className="font-semibold">{message}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}
