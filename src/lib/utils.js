import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn/ui 공용 헬퍼: 조건부 클래스 + 충돌하는 Tailwind 클래스 정리
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
