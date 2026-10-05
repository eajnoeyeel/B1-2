import { CircleAlert, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import { DAY_LABELS, EMPTY_SERIES, GENRES, LIMITS, ORIENTATIONS, STATUSES, toSeriesPayload, validateSeries } from '@/lib/series'
import FormField from './FormField.jsx'
import SegmentedControl from './SegmentedControl.jsx'
import SeriesPoster from './SeriesPoster.jsx'
import StatusBadge from './StatusBadge.jsx'

const STATUS_OPTIONS = Object.entries(STATUSES)
const ORIENTATION_OPTIONS = Object.entries(ORIENTATIONS)

// 에러가 있는 필드에 aria 속성을 붙여 스크린리더가 에러 문구를 함께 읽게 한다.
function errorProps(name, errors) {
  return errors[name] ? { 'aria-invalid': true, 'aria-describedby': `${name}-error` } : {}
}

// 등록/수정 공용 폼. 저장 후 이동은 onSubmit을 넘긴 페이지가 정한다.
// onSubmit이 throw하면 실패 메시지를 폼 상단에 보여주고 입력값은 그대로 둔다.
export default function SeriesForm({ initialValues = EMPTY_SERIES, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
    // 사용자가 고치기 시작하면 그 필드의 에러는 지운다.
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest)
  }

  function handleChange(event) {
    const { name, value } = event.target
    setField(name, name === 'episode_count' ? (value === '' ? '' : Number(value)) : value)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateSeries(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus()
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit(toSeriesPayload(values))
    } catch (error) {
      setSubmitError(error.message)
      setSubmitting(false)
    }
  }

  const field = (name) => ({ id: name, name, value: values[name], onChange: handleChange, ...errorProps(name, errors) })

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_17rem]">
      <form onSubmit={handleSubmit} noValidate className="grid max-w-2xl gap-6">
        {submitError && (
          <div role="alert" className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>저장하지 못했어요. {submitError}</p>
          </div>
        )}

        <FormField label="작품 제목" htmlFor="title" error={errors.title}>
          <Input {...field('title')} maxLength={LIMITS.title} placeholder="예: 마지막 마녀" className="h-10" />
        </FormField>

        <FormField label="크리에이터" htmlFor="creator" error={errors.creator}>
          <Input {...field('creator')} maxLength={LIMITS.creator} placeholder="예: lyra" className="h-10" />
        </FormField>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="장르" htmlFor="genre" error={errors.genre}>
            <NativeSelect {...field('genre')} className="w-full [&_select]:h-10">
              {Object.entries(GENRES).map(([key, { label }]) => (
                <NativeSelectOption key={key} value={key}>
                  {label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormField>
          <FormField label="화면 방향" htmlFor="orientation" error={errors.orientation}>
            <SegmentedControl
              id="orientation"
              label="화면 방향"
              value={values.orientation}
              onChange={(v) => setField('orientation', v)}
              options={ORIENTATION_OPTIONS}
              invalid={Boolean(errors.orientation)}
            />
          </FormField>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="연재 상태" htmlFor="status" error={errors.status}>
            <SegmentedControl
              id="status"
              label="연재 상태"
              value={values.status}
              onChange={(v) => setField('status', v)}
              options={STATUS_OPTIONS}
              invalid={Boolean(errors.status)}
            />
          </FormField>
          <FormField
            label="연재 요일"
            htmlFor="release_day"
            error={errors.release_day}
            hint={values.status === 'ongoing' ? '새 회차가 올라오는 요일이에요.' : '연재 중이 아니면 비워 둬도 돼요.'}
          >
            <NativeSelect {...field('release_day')} className="w-full [&_select]:h-10">
              <NativeSelectOption value="">정해지지 않음</NativeSelectOption>
              {Object.entries(DAY_LABELS).map(([key, label]) => (
                <NativeSelectOption key={key} value={key}>
                  매주 {label}요일
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormField>
        </div>

        <FormField label="공개된 회차 수" htmlFor="episode_count" error={errors.episode_count}>
          <Input {...field('episode_count')} type="number" inputMode="numeric" min={0} max={LIMITS.episodes} className="h-10 w-32" />
        </FormField>

        <FormField
          label="커버 이미지 주소 (선택)"
          htmlFor="cover_url"
          error={errors.cover_url}
          hint="비워 두면 장르 색과 제목으로 포스터를 만들어요."
        >
          <Input {...field('cover_url')} type="url" placeholder="https://" className="h-10" />
        </FormField>

        <FormField
          label="작품 소개"
          htmlFor="description"
          error={errors.description}
          hint={`${values.description.length} / ${LIMITS.description}자`}
        >
          <Textarea
            {...field('description')}
            rows={6}
            maxLength={LIMITS.description}
            placeholder="어떤 이야기인지 두세 문장으로 소개해 주세요."
          />
        </FormField>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" size="lg" disabled={submitting} className="min-w-28">
            {submitting && <LoaderCircle className="animate-spin" data-icon="inline-start" />}
            {submitting ? '저장 중…' : submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" size="lg" onClick={onCancel} disabled={submitting}>
              취소
            </Button>
          )}
        </div>
      </form>

      <aside aria-label="포스터 미리보기" className="order-first lg:order-none">
        <div className="space-y-3 lg:sticky lg:top-24">
          <p className="text-sm text-muted-foreground">미리보기</p>
          <SeriesPoster series={values} className="w-40 lg:w-full" />
          <div className="flex items-center gap-2 text-sm">
            <StatusBadge status={values.status} />
            <span className="text-muted-foreground">{values.episode_count || 0}화</span>
          </div>
        </div>
      </aside>
    </div>
  )
}
