export const PASSWORD_MIN = 6
export const NAME_MAX = 30

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = '이메일을 입력해 주세요.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = '이메일 형식이 맞지 않아요.'
  if (!password) errors.password = '비밀번호를 입력해 주세요.'
  return errors
}

export function validateSignup({ displayName, email, password, passwordConfirm }) {
  const errors = validateLogin({ email, password })
  const name = displayName.trim()
  if (!name) errors.displayName = '크리에이터 이름을 입력해 주세요.'
  else if (name.length > NAME_MAX) errors.displayName = `${NAME_MAX}자 이하로 입력해 주세요.`
  if (password && password.length < PASSWORD_MIN) errors.password = `비밀번호는 ${PASSWORD_MIN}자 이상이어야 해요.`
  if (password !== passwordConfirm) errors.passwordConfirm = '비밀번호가 서로 달라요.'
  return errors
}

// Supabase Auth 영어 에러 → 사용자에게 보여줄 문장
const AUTH_MESSAGES = [
  [/invalid login credentials/i, '이메일 또는 비밀번호가 맞지 않아요.'],
  [/already registered|already exists/i, '이미 가입된 이메일이에요. 로그인해 주세요.'],
  [/email not confirmed/i, '이메일 인증이 아직 끝나지 않았어요. 메일함을 확인해 주세요.'],
  [/rate limit/i, '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.'],
  [/password should be/i, `비밀번호는 ${PASSWORD_MIN}자 이상이어야 해요.`],
]

export function toAuthErrorMessage(message) {
  return AUTH_MESSAGES.find(([pattern]) => pattern.test(message))?.[1] ?? message
}

// 화면에 보여줄 이름: 가입 때 입력한 크리에이터 이름, 없으면 이메일 앞부분
export function displayNameOf(user) {
  return user?.user_metadata?.display_name || user?.email?.split('@')[0] || ''
}
