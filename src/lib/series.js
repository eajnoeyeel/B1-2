// 장르별 라벨과 포스터 색상(oklch hue)
export const GENRES = {
  romance: { label: '로맨스', hue: 5 },
  fantasy: { label: '판타지', hue: 300 },
  regression: { label: '회귀', hue: 265 },
  thriller: { label: '스릴러', hue: 28 },
  horror: { label: '호러', hue: 145 },
  mystery: { label: '미스터리', hue: 220 },
  action: { label: '액션', hue: 50 },
  scifi: { label: 'SF', hue: 195 },
  comedy: { label: '코미디', hue: 95 },
}

export const STATUSES = { ongoing: '연재 중', completed: '완결', hiatus: '휴재' }

export const ORIENTATIONS = { vertical: '세로', horizontal: '가로' }

// 0 = 일요일 (Date#getDay 순서)
export const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
export const DAY_LABELS = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일' }

export const LIMITS = { title: 40, creator: 30, description: 600, episodes: 500 }

export const EMPTY_SERIES = {
  title: '',
  creator: '',
  genre: 'romance',
  status: 'ongoing',
  release_day: '',
  orientation: 'vertical',
  episode_count: 0,
  cover_url: '',
  description: '',
}

export function todayKey(date = new Date()) {
  return DAYS[date.getDay()]
}

function isHttpUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

// 폼 값 → { 필드명: 에러 메시지 }. 빈 객체면 통과.
export function validateSeries(values) {
  const errors = {}
  const title = values.title.trim()
  const creator = values.creator.trim()
  const description = values.description.trim()
  const cover = values.cover_url.trim()

  if (!title) errors.title = '작품 제목을 입력해 주세요.'
  else if (title.length > LIMITS.title) errors.title = `제목은 ${LIMITS.title}자 이하로 입력해 주세요.`

  if (!creator) errors.creator = '크리에이터 이름을 입력해 주세요.'
  else if (creator.length > LIMITS.creator) errors.creator = `${LIMITS.creator}자 이하로 입력해 주세요.`

  if (!(values.genre in GENRES)) errors.genre = '장르를 선택해 주세요.'
  if (!(values.status in STATUSES)) errors.status = '연재 상태를 선택해 주세요.'
  if (!(values.orientation in ORIENTATIONS)) errors.orientation = '화면 방향을 선택해 주세요.'
  if (values.release_day && !(values.release_day in DAY_LABELS)) errors.release_day = '연재 요일을 다시 선택해 주세요.'
  if (values.status === 'ongoing' && !values.release_day) errors.release_day = '연재 중인 작품은 연재 요일이 필요해요.'

  const episodes = values.episode_count
  if (!Number.isInteger(episodes) || episodes < 0 || episodes > LIMITS.episodes) {
    errors.episode_count = `회차 수는 0~${LIMITS.episodes} 사이의 정수로 입력해 주세요.`
  }

  if (cover && !isHttpUrl(cover)) errors.cover_url = 'http:// 또는 https://로 시작하는 이미지 주소를 입력해 주세요.'

  if (!description) errors.description = '작품 소개를 입력해 주세요.'
  else if (description.length > LIMITS.description) errors.description = `소개는 ${LIMITS.description}자 이하로 입력해 주세요.`

  return errors
}

// DB에 보낼 값만 골라 정리한 새 객체. 빈 선택값은 null로 저장한다.
export function toSeriesPayload(values) {
  return {
    title: values.title.trim(),
    creator: values.creator.trim(),
    genre: values.genre,
    status: values.status,
    release_day: values.release_day || null,
    orientation: values.orientation,
    episode_count: values.episode_count,
    cover_url: values.cover_url.trim() || null,
    description: values.description.trim(),
  }
}

// DB 행 → 폼 초기값. 폼이 쓰는 필드만 고르고, null은 폼 기본값('')으로 바꾼다.
export function toFormValues(series) {
  return Object.fromEntries(Object.keys(EMPTY_SERIES).map((key) => [key, series[key] ?? EMPTY_SERIES[key]]))
}
