import { useNavigate } from 'react-router-dom'
import SeriesForm from '@/components/SeriesForm.jsx'
import { useToast } from '@/hooks/useToast'
import { createSeries } from '@/lib/seriesApi'

export default function SeriesNewPage() {
  const navigate = useNavigate()
  const toast = useToast()

  async function handleSubmit(payload) {
    const created = await createSeries(payload)
    toast.show(`‘${created.title}’ 작품을 등록했어요.`)
    navigate(`/series/${created.id}`)
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl md:text-4xl">작품 등록</h1>
      <SeriesForm submitLabel="작품 등록" onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
    </div>
  )
}
