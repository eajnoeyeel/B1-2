import { Badge } from '@/components/ui/badge'
import { STATUSES } from '@/lib/series'

const VARIANT = { ongoing: 'default', completed: 'secondary', hiatus: 'outline' }

export default function StatusBadge({ status }) {
  return <Badge variant={VARIANT[status] ?? 'outline'}>{STATUSES[status] ?? status}</Badge>
}
