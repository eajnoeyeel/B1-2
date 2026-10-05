# 책갈피 — 독서 기록 SPA

읽은 책 · 읽는 책 · 읽고 싶은 책을 별점과 짧은 감상으로 기록하는 React SPA입니다.
Codyssey B1-2 과제("버튼 누르면 화면이 스르륵 바뀌는 요즘 웹사이트 만들기")의 결과물입니다.

- **배포 URL:** <DEPLOY_URL>
- **소스 코드:** <https://github.com/eajnoeyeel/B1-2>

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| UI | React 19 (함수 컴포넌트 + Hooks), JavaScript |
| 빌드 | Vite 8 |
| 라우팅 | React Router 7 (`BrowserRouter`, 중첩 라우트 + `Outlet`) |
| 백엔드 | Supabase (PostgreSQL + 자동 REST API, `@supabase/supabase-js`) |
| 스타일 | 순수 CSS (CSS 변수) |
| 품질 | oxlint, `node:test` (폼 검증 로직 단위 테스트) |
| 배포 | Vercel |

## 로컬 실행 방법

```bash
git clone https://github.com/eajnoeyeel/B1-2.git
cd B1-2
npm install

cp .env.example .env   # Supabase URL과 anon key 입력
npm run dev            # http://localhost:5173

npm test               # 폼 검증 단위 테스트
npm run lint
npm run build          # dist/ 에 배포용 빌드
```

### Supabase 준비

1. Supabase에서 프로젝트를 만든다.
2. SQL Editor에서 [`supabase/schema.sql`](supabase/schema.sql)을 실행한다. (`books` 테이블, `updated_at` 트리거, RLS 정책 생성)
3. Project Settings → API에서 Project URL과 anon key를 복사해 `.env`에 넣는다.

| 변수 | 설명 |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon(public) key |

`.env`는 `.gitignore`에 포함되어 저장소에 올라가지 않습니다. 배포 시에는 Vercel 대시보드의 Environment Variables에 같은 두 값을 등록했습니다.
환경변수가 빠진 채로 빌드되면 앱이 흰 화면으로 죽지 않고, 데이터 화면마다 "환경변수가 설정되지 않았습니다" 에러 상태가 표시됩니다.

## 라우트

| 경로 | 페이지 | 내용 |
| --- | --- | --- |
| `/` | `HomePage` | 소개, 상태별 통계, 최근 기록 3개 |
| `/books` | `BooksPage` | 전체 목록 + 상태 필터 + 검색 |
| `/books/new` | `BookNewPage` | 등록 폼 (실시간 미리보기) |
| `/books/:id` | `BookDetailPage` | 상세 + 수정/삭제 |
| `/books/:id/edit` | `BookEditPage` | 수정 폼 |
| `*` | `NotFoundPage` | 404 |

모든 라우트는 `Layout`(헤더 + 네비게이션)의 `<Outlet />` 안에서 렌더링됩니다.
Vercel에서 `/books/3`처럼 직접 접속하거나 새로고침해도 동작하도록 `vercel.json`에서 모든 경로를 `index.html`로 rewrite 합니다.

## 폴더 구조

```text
src/
├── App.jsx                 # 라우트 정의
├── main.jsx
├── index.css
├── pages/                  # 라우트 단위 화면 (데이터를 가져오고 흐름을 결정)
│   ├── HomePage.jsx
│   ├── BooksPage.jsx
│   ├── BookDetailPage.jsx
│   ├── BookNewPage.jsx
│   ├── BookEditPage.jsx
│   └── NotFoundPage.jsx
├── components/             # 재사용 UI 컴포넌트 (props만 보고 그림)
│   ├── Layout.jsx          ToastProvider.jsx
│   ├── Button.jsx          TextField.jsx
│   ├── Loading.jsx         ErrorState.jsx      EmptyState.jsx     DataState.jsx
│   ├── BookCard.jsx        BookList.jsx        BookForm.jsx
│   └── StatusFilter.jsx    StatusBadge.jsx     RatingStars.jsx
├── hooks/                  # 커스텀 훅
│   ├── useAsync.js         # 비동기 요청 → { data, loading, error, reload }
│   ├── useBooks.js         # useBooks(), useBook(id)
│   └── useToast.js         # 알림 Context 접근
└── lib/                    # React와 무관한 순수 로직
    ├── supabase.js         # Supabase 클라이언트
    ├── booksApi.js         # CRUD 함수 (fetch/create/update/delete)
    ├── book.js             # 상태 라벨, 검증(validateBook), payload 변환
    └── book.test.js
supabase/schema.sql         # 테이블/트리거/RLS 정의
```

## 설계 설명

### 1. 컴포넌트를 나눈 기준

- **페이지(`pages/`)** 는 "어떤 데이터를 가져와서, 성공하면 어디로 이동할지"를 결정합니다. URL 파라미터, 내비게이션, API 호출이 여기에만 있습니다.
- **UI 컴포넌트(`components/`)** 는 받은 props만 보고 화면을 그립니다. Supabase나 라우트 파라미터를 직접 알지 못하므로 어느 페이지에서나 재사용됩니다.
  - 예: `BookForm`은 등록/수정 화면이 함께 씁니다. 저장 함수는 `onSubmit` prop으로 받기 때문에 폼 자체는 "등록인지 수정인지" 모릅니다.
  - 예: `BookCard`는 목록에서는 `to` prop을 받아 링크 카드가 되고, 폼 옆에서는 `to` 없이 미리보기 카드가 됩니다.
- **같은 화면 패턴은 한 번만 만든다:** 로딩/에러/빈 상태는 `Loading`, `ErrorState`, `EmptyState`로 만들고, 이 셋을 고르는 순서(로딩 → 에러 → 빈 → 성공)는 `DataState` 하나에 모았습니다. 홈·목록·상세·수정 4개 화면이 모두 `DataState`를 쓰므로 상태 표현이 일관됩니다.

재사용 컴포넌트(prop에 따라 표시/동작이 달라지는 것) 13개:

| 컴포넌트 | 주요 props | 달라지는 것 |
| --- | --- | --- |
| `Button` | `variant`, `to`, `disabled` | 스타일, `<button>`/`<Link>` 전환 |
| `TextField` | `as`, `label`, `error`, `hint` | input/textarea/select, 에러 메시지 |
| `Loading` | `message` | 문구 |
| `ErrorState` | `message`, `onRetry` | 에러 상세, 재시도 버튼 유무 |
| `EmptyState` | `message`, `children` | 문구, 행동 버튼 |
| `DataState` | `loading`, `error`, `isEmpty`, `children` | 네 가지 상태 중 무엇을 그릴지 |
| `BookCard` | `book`, `to` | 내용, 링크 여부 |
| `BookList` | `books` | 카드 목록 |
| `BookForm` | `initialValues`, `submitLabel`, `onSubmit`, `onCancel` | 등록/수정 겸용 |
| `StatusFilter` | `value`, `onChange`, `counts` | 선택된 탭, 개수 |
| `StatusBadge` | `status` | 라벨, 색 |
| `RatingStars` | `value` | 별 개수 |
| `ToastProvider` | `children` | 알림 영역 제공 |

### 2. props와 state, 상태를 둔 위치

- **state**는 컴포넌트가 스스로 바꾸는 값, **props**는 부모가 내려준 읽기 전용 값입니다.
- 상태는 **그 값을 쓰는 컴포넌트들의 가장 가까운 공통 부모**에 두었습니다.

| 상태 | 위치 | 이유 |
| --- | --- | --- |
| 폼 입력값, 필드 에러, 제출 중, 제출 실패 | `BookForm` | 폼 안에서만 쓰임. 미리보기 `BookCard`에는 `values`를 props로 내려줌(하향) |
| 상태 필터, 검색어 | `BooksPage` | `StatusFilter`(입력)와 `BookList`(결과)가 함께 써야 하므로 공통 부모로 끌어올림(상향). 자식은 `onChange` 콜백으로 부모 상태를 바꿈 |
| 목록/상세 데이터, 로딩, 에러 | `useAsync` 훅 (각 페이지) | 페이지마다 독립적으로 요청 |
| 삭제 확인 중, 삭제 중, 삭제 에러 | `BookDetailPage` | 상세 화면 안에서만 쓰임 |
| 알림(toast) | `ToastProvider` (Context, 전역) | 저장 후 다른 페이지로 이동해도 알림이 유지돼야 하므로 라우트 바깥에 둠 |

화면에서 계산할 수 있는 값은 state로 따로 두지 않았습니다. 예를 들어 필터링된 목록과 탭별 개수는 `books` + `status` + `query`에서 매번 계산(`useMemo`)합니다.

### 3. useEffect와 데이터 요청

데이터 요청은 `hooks/useAsync.js` 한 곳에만 있습니다.

```js
useEffect(() => {
  let ignore = false
  setState(... loading ...)
  asyncFn().then(
    (data) => !ignore && setState({ status: 'success', data }),
    (error) => !ignore && setState({ status: 'error', error }),
  )
  return () => { ignore = true }
}, [asyncFn, reloadKey])
```

- **언제 실행되나:** 컴포넌트가 처음 화면에 나타난 직후(렌더링이 화면에 반영된 뒤), 그리고 의존성 값이 바뀐 뒤.
- **의존성:**
  - `asyncFn` — `useBook(id)`는 `useCallback(() => fetchBook(id), [id])`로 함수를 만듭니다. 그래서 **`id`가 바뀔 때만** 함수가 새로 만들어지고 effect가 다시 실행됩니다. (`useCallback`이 없으면 렌더링할 때마다 새 함수가 되어 요청이 무한 반복됩니다.)
  - `reloadKey` — "다시 시도" 버튼이 `reload()`로 이 숫자를 올리면 같은 요청을 다시 보냅니다.
- **cleanup(`ignore = true`):** 응답이 오기 전에 페이지를 떠나거나 `id`가 바뀌면 이전 effect의 cleanup이 먼저 실행됩니다. 늦게 도착한 이전 응답이 새 화면을 덮어쓰는 경쟁 상태를 막습니다.
- 등록/수정/삭제는 effect가 아니라 **이벤트 핸들러**(`onSubmit`, `onClick`)에서 호출합니다. "화면이 보이면 가져온다"는 effect, "사용자가 눌렀을 때 바꾼다"는 이벤트로 구분했습니다.

### 4. 비동기 상태를 UI로 표현한 방법

`useAsync`는 `status`를 `'loading' | 'success' | 'error'` 중 하나로만 가지므로 "로딩 중이면서 에러" 같은 모순된 조합이 생기지 않습니다. 빈 상태는 성공했지만 데이터가 없는 경우입니다.

| 상태 | 조건 | 화면 |
| --- | --- | --- |
| 로딩 | `status === 'loading'` | 스피너 + "불러오는 중..." |
| 실패 | `status === 'error'` | "요청에 실패했습니다. 다시 시도하세요." + 원인 + **다시 시도** 버튼 |
| 빈 상태 | 목록이 `[]`, 상세가 `null` | "표시할 데이터가 없습니다." / "해당 기록을 찾을 수 없습니다." + 이동 버튼 |
| 성공 | 그 외 | 실제 내용 |

목록에서는 필터 결과가 비었을 때("조건에 맞는 책이 없습니다.")와 데이터 자체가 없을 때를 구분합니다.

폼 제출은 별도로:
- 제출 전 `validateBook`으로 필수값/길이/범위 검사 → 각 필드 아래에 에러 표시, 입력을 고치면 그 필드 에러가 사라짐
- 제출 중: 버튼 비활성화 + "저장 중..."
- 요청 실패: 폼 상단에 "저장하지 못했습니다. (원인)" 표시, 입력값은 유지

### 5. 하나의 기능이 연결되는 흐름 — "새 기록 등록"

1. **라우팅:** 헤더의 "새 기록" `NavLink` 클릭 → URL이 `/books/new`로 바뀌고 `BookNewPage`가 렌더링됨
2. **컴포넌트:** `BookNewPage`가 `BookForm`에 `onSubmit={handleSubmit}`을 props로 전달
3. **상태:** 입력할 때마다 `onChange` → `setValues` → `values` 변경 (controlled input)
4. **렌더링:** `values`가 바뀌어 `BookForm`이 다시 렌더링되고, props로 받은 미리보기 `BookCard`도 바로 바뀜
5. **이벤트:** 저장 클릭 → `handleSubmit` → 검증 실패면 `errors` 상태 변경 → 에러 메시지 렌더링
6. **비동기:** 검증 통과 → `submitting = true`(버튼 비활성) → `createBook()` → Supabase INSERT
7. **결과:** 성공하면 `toast.show()`(전역 상태) → `navigate('/books/:id')` → 상세 페이지의 `useBook(id)` effect가 새 데이터를 가져옴 → 알림이 3초 후 사라짐. 실패하면 `submitError` 상태로 폼 상단에 메시지

### 6. 상태 변경 → 렌더링 변화 지점

| 사용자 이벤트 | 바뀌는 상태 | 렌더링 변화 |
| --- | --- | --- |
| 필터 탭 클릭 | `status` (`BooksPage`) | 목록이 해당 상태의 책만 표시, 선택 탭 강조 |
| 검색어 입력 | `query` (`BooksPage`) | 제목/저자에 검색어가 포함된 책만 표시 |
| 폼 입력 | `values` (`BookForm`) | 오른쪽 미리보기 카드, 글자 수 표시 |
| 빈 폼 제출 | `errors` (`BookForm`) | 필드별 에러 메시지 |
| 저장/수정/삭제 성공 | `toast` (Context) | 하단 알림 표시 → 3초 후 사라짐 |
| 삭제 클릭 | `confirming` (`BookDetailPage`) | 버튼 줄이 "정말 삭제할까요? [삭제 확인] [취소]"로 바뀜 |
| 다시 시도 클릭 | `reloadKey` (`useAsync`) | 에러 → 로딩 → 결과 |

## 보너스 과제

- **전역 상태 (Context):** 알림(toast)을 `ToastProvider` + `useToast()`로 관리합니다. 등록 화면에서 띄운 알림이 상세 페이지로 이동한 뒤에도 보입니다.
- **성능 최적화 (메모이제이션):**
  - `useMemo` — `BooksPage`의 필터링 결과와 탭별 개수. 관련 없는 상태가 바뀔 때 다시 계산하지 않음
  - `useCallback` — `useBook`의 요청 함수(`id`가 같으면 effect 재실행 안 함), `ToastProvider`의 `show`
  - `React.memo` — `BookCard`. 필터를 바꿔도 props가 그대로인 카드는 다시 렌더링하지 않음
- **인증:** 적용하지 않았습니다. 대신 RLS를 끄지 않고 "anon 역할 전체 허용" 정책을 명시해 두어, 인증을 붙일 때 정책만 `auth.uid() = user_id`로 바꾸면 되도록 했습니다.

## 검증

로컬과 배포 환경에서 아래 흐름을 브라우저로 직접 확인했습니다.

- 목록 조회, 상태 필터, 검색, 필터 결과 없음 표시
- 상세 조회, 존재하지 않는 id(`/books/9999`)와 잘못된 id(`/books/abc`)에서 "찾을 수 없음" 표시
- 빈 폼 제출 시 필드별 에러, 입력하면 에러가 사라지고 미리보기 반영
- 등록 → 상세로 이동 + 알림, 수정 → 상세로 이동 + 알림(수정일 표시), 삭제 확인 → 목록으로 이동 + 알림
- 잘못된 Supabase URL로 실행 시 로딩 → 에러 상태 + 다시 시도 버튼
- 없는 경로(`/nope`)에서 404 페이지, 배포 URL에서 하위 경로 직접 접속/새로고침
