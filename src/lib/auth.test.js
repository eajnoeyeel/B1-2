import { test } from 'node:test'
import assert from 'node:assert/strict'
import { displayNameOf, toAuthErrorMessage, validateLogin, validateSignup } from './auth.js'

const signup = { displayName: 'lyra', email: 'lyra@example.com', password: 'secret1', passwordConfirm: 'secret1' }

test('로그인 검증: 빈 값과 이메일 형식', () => {
  assert.deepEqual(Object.keys(validateLogin({ email: '', password: '' })).sort(), ['email', 'password'])
  assert.ok(validateLogin({ email: 'no-at-sign', password: 'x' }).email)
  assert.deepEqual(validateLogin({ email: 'a@b.co', password: 'x' }), {})
})

test('회원가입 검증: 이름, 비밀번호 길이, 확인 일치', () => {
  assert.deepEqual(validateSignup(signup), {})
  assert.ok(validateSignup({ ...signup, displayName: '  ' }).displayName)
  assert.ok(validateSignup({ ...signup, password: '123', passwordConfirm: '123' }).password)
  assert.ok(validateSignup({ ...signup, passwordConfirm: 'other' }).passwordConfirm)
})

test('Supabase 에러를 한국어로 바꾸고, 모르는 에러는 그대로 둔다', () => {
  assert.equal(toAuthErrorMessage('Invalid login credentials'), '이메일 또는 비밀번호가 맞지 않아요.')
  assert.match(toAuthErrorMessage('User already registered'), /이미 가입된/)
  assert.equal(toAuthErrorMessage('Something else'), 'Something else')
})

test('표시 이름은 메타데이터 → 이메일 앞부분 순서로 고른다', () => {
  assert.equal(displayNameOf({ email: 'a@b.co', user_metadata: { display_name: '라이라' } }), '라이라')
  assert.equal(displayNameOf({ email: 'lyra@b.co', user_metadata: {} }), 'lyra')
  assert.equal(displayNameOf(null), '')
})
