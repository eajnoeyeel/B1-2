import { useState } from 'react'
import { cn } from '@/lib/utils'
import { GENRES } from '@/lib/series'

function posterBackground(genre) {
  const hue = GENRES[genre]?.hue ?? 300
  return [
    `radial-gradient(120% 70% at 85% 0%, oklch(0.85 0.12 ${hue} / 0.45), transparent 60%)`,
    `linear-gradient(165deg, oklch(0.55 0.17 ${hue}) 0%, oklch(0.3 0.12 ${hue + 25}) 55%, oklch(0.15 0.05 ${hue + 45}) 100%)`,
  ].join(', ')
}

// 9:16 세로 포스터. 커버 이미지가 없거나 깨지면 장르 색 + 제목 타이포그래피로 그린다.
// 글자 크기는 포스터 너비(cqi) 기준이라 레일·그리드·상세 어디서든 같은 비율로 보인다.
export default function SeriesPoster({ series, className }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const showImage = Boolean(series.cover_url) && series.cover_url !== failedUrl

  return (
    <div
      className={cn('@container relative aspect-[9/16] overflow-hidden rounded-lg shadow-lg shadow-black/30', className)}
      style={{ background: posterBackground(series.genre) }}
    >
      {showImage ? (
        <img
          src={series.cover_url}
          alt={`${series.title} 포스터`}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
          onError={() => setFailedUrl(series.cover_url)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col p-[9cqi] text-white" aria-hidden="true">
          <span className="text-[7cqi] font-medium text-white/75">{GENRES[series.genre]?.label}</span>
          <p className="mt-auto font-display text-[15cqi] leading-[1.08] break-keep [text-wrap:balance] drop-shadow-sm">
            {series.title || '제목 없음'}
          </p>
          <span className="mt-[5cqi] truncate text-[6.5cqi] text-white/70">{series.creator || '크리에이터'}</span>
        </div>
      )}
    </div>
  )
}
