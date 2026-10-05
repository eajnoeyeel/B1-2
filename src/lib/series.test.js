import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY_SERIES, todayKey, toFormValues, toSeriesPayload, validateSeries } from './series.js'

const valid = {
  ...EMPTY_SERIES,
  title: '마지막 마녀',
  creator: 'lyra',
  genre: 'fantasy',
  release_day: 'fri',
  episode_count: 13,
  description: '멸망한 왕국의 마지막 마녀가 10년 전으로 돌아온다.',
}

test('정상 입력은 에러가 없다', () => {
  assert.deepEqual(validateSeries(valid), {})
})

test('빈 폼은 필수값 에러를 낸다', () => {
  assert.deepEqual(Object.keys(validateSeries(EMPTY_SERIES)).sort(), ['creator', 'description', 'release_day', 'title'])
})

test('연재 중이 아니면 요일이 없어도 된다', () => {
  assert.deepEqual(validateSeries({ ...valid, status: 'completed', release_day: '' }), {})
})

test('범위와 형식을 검사한다', () => {
  assert.ok(validateSeries({ ...valid, title: '   ' }).title)
  assert.ok(validateSeries({ ...valid, title: 'a'.repeat(41) }).title)
  assert.ok(validateSeries({ ...valid, episode_count: -1 }).episode_count)
  assert.ok(validateSeries({ ...valid, episode_count: 1.5 }).episode_count)
  assert.ok(validateSeries({ ...valid, genre: 'opera' }).genre)
  assert.ok(validateSeries({ ...valid, cover_url: 'javascript:alert(1)' }).cover_url)
  assert.deepEqual(validateSeries({ ...valid, cover_url: 'https://example.com/a.jpg' }), {})
})

test('payload는 공백을 정리하고 빈 선택값을 null로 바꾸며 원본을 바꾸지 않는다', () => {
  const input = { ...valid, title: '  마지막 마녀 ', status: 'completed', release_day: '', id: 3 }
  const payload = toSeriesPayload(input)
  assert.equal(payload.title, '마지막 마녀')
  assert.equal(payload.release_day, null)
  assert.equal(payload.cover_url, null)
  assert.equal('id' in payload, false)
  assert.equal(input.title, '  마지막 마녀 ')
})

test('DB 행을 폼 값으로 되돌린다', () => {
  const row = { ...toSeriesPayload(valid), id: 1, created_at: 'x', release_day: null, cover_url: null }
  const form = toFormValues(row)
  assert.equal(form.release_day, '')
  assert.equal(form.cover_url, '')
  assert.equal('id' in form, false)
})

test('todayKey는 요일 키를 돌려준다', () => {
  assert.equal(todayKey(new Date(2026, 9, 5)), 'mon')
})
