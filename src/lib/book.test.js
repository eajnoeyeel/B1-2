import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateBook, toBookPayload, EMPTY_BOOK } from './book.js'

const valid = { title: '데미안', author: '헤르만 헤세', status: 'done', rating: 5, review: '새는 알을 깨고 나온다.' }

test('정상 입력은 에러가 없다', () => {
  assert.deepEqual(validateBook(valid), {})
})

test('빈 폼은 제목/저자/감상 에러를 낸다', () => {
  assert.deepEqual(Object.keys(validateBook(EMPTY_BOOK)).sort(), ['author', 'review', 'title'])
})

test('공백만 있는 값은 비어 있는 것으로 본다', () => {
  assert.ok(validateBook({ ...valid, title: '   ' }).title)
})

test('길이 제한과 별점/상태 범위를 검사한다', () => {
  assert.ok(validateBook({ ...valid, title: 'a'.repeat(101) }).title)
  assert.ok(validateBook({ ...valid, rating: 0 }).rating)
  assert.ok(validateBook({ ...valid, rating: 6 }).rating)
  assert.ok(validateBook({ ...valid, status: 'lost' }).status)
})

test('payload는 공백을 정리하고 원본을 바꾸지 않는다', () => {
  const input = { ...valid, title: '  데미안  ', id: 1 }
  assert.deepEqual(toBookPayload(input), { ...valid })
  assert.equal(input.title, '  데미안  ')
})
