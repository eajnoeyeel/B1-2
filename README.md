# 다음화 — 숏드라마 연재 플랫폼

AI 도구로 만든 숏드라마를 "영상 한 편"이 아니라 **작품(Series) 단위**로 등록하고, 장르와 연재 상태로 찾아보는 React SPA입니다.
Codyssey B1-2 과제("버튼 누르면 화면이 스르륵 바뀌는 요즘 웹사이트 만들기")의 결과물입니다.

- **배포 URL:** <DEPLOY_URL>
- **소스 코드:** <https://github.com/eajnoeyeel/B1-2>

> 구상 중인 숏드라마 플랫폼(Creator → Universe → Series → Season → Episode)에서 핵심 단위인 **Series** 하나만 잘라 CRUD로 구현했습니다. 과제의 "단일 핵심 데이터" 조건에 맞추기 위해 영상 업로드, 회차(Episode), 로그인은 범위에서 뺐습니다.

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| UI | React 19 (함수 컴포넌트 + Hooks), JavaScript |
| 빌드 | Vite 8 |
| 라우팅 | React Router 7 (`BrowserRouter`, 중첩 라우트 + `Outlet`, `useSearchParams`) |
| 스타일 | Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) (Radix 기반), lucide 아이콘 |
| 백엔드 | Supabase (PostgreSQL + 자동 REST API, `@supabase/supabase-js`) |
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
2. SQL Editor에서 [`supabase/schema.sql`](supabase/schema.sql)을 실행한다. (`series` 테이블, `updated_at` 트리거, RLS 정책)
3. (선택) [`supabase/seed.sql`](supabase/seed.sql)로 샘플 작품 8개를 넣는다.
4. Project Settings → API에서 Project URL과 anon key를 복사해 `.env`에 넣는다.

| 변수 | 설명 |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon(public) key |

`.env`는 `.gitignore`에 포함되어 저장소에 올라가지 않습니다. 배포 환경에서는 Vercel의 Environment Variables에 같은 두 값을 등록했습니다.
환경변수 없이 빌드되어도 앱이 흰 화면으로 멈추지 않고, 데이터 화면마다 "환경변수가 설정되지 않았습니다"라는 에러 상태가 표시됩니다.

## 데이터 (`series` 테이블)

| 필드 | 내용 | 검증 (프런트 + DB 제약) |
| --- | --- | --- |
| `title` | 작품 제목 | 필수, 40자 이하 |
| `creator` | 크리에이터 | 필수, 30자 이하 |
| `genre` | 로맨스·판타지·회귀·스릴러·호러·미스터리·액션·SF·코미디 | 목록 안의 값 |
| `status` | 연재 중 / 완결 / 휴재 | 목록 안의 값 |
| `release_day` | 연재 요일 (월~일) | 연재 중이면 필수 |
| `orientation` | 세로 / 가로 | 목록 안의 값 |
| `episode_count` | 공개된 회차 수 | 0~500 정수 |
| `cover_url` | 커버 이미지 주소 | 선택, `http(s)://`만 허용 |
| `description` | 작품 소개 | 필수, 600자 이하 |

커버 이미지가 없거나 주소가 깨지면, 장르 색 그라디언트에 제목을 크게 얹은 **9:16 포스터**를 자동으로 그립니다.

## 라우트

| 경로 | 페이지 | 내용 |
| --- | --- | --- |
| `/` | `HomePage` | 오늘 요일에 새 회차가 올라오는 작품, 새로 등록된 작품, 완결 작품 |
| `/series` | `ExplorePage` | 전체 작품 + 장르/연재 상태 필터, 검색, 정렬 |
| `/series/new` | `SeriesNewPage` | 등록 폼 (포스터 실시간 미리보기) |
| `/series/:id` | `SeriesDetailPage` | 상세 + 수정/삭제 |
| `/series/:id/edit` | `SeriesEditPage` | 수정 폼 |
| `*` | `NotFoundPage` | 404 |

모든 라우트는 `Layout`(상단 헤더, 모바일에서는 하단 탭 바)의 `<Outlet />` 안에서 렌더링됩니다.
`vercel.json`에서 모든 경로를 `index.html`로 rewrite하므로, 배포 URL에서 `/series/3` 같은 주소로 바로 접속하거나 새로고침해도 페이지가 열립니다.

## 폴더 구조

```text
src/
├── App.jsx                 # 라우트 정의
├── main.jsx
├── index.css               # Tailwind + 테마 토큰
├── pages/                  # 라우트 단위 화면: 데이터를 가져오고 이동 흐름을 결정
│   ├── HomePage.jsx        ExplorePage.jsx      NotFoundPage.jsx
│   └── SeriesDetailPage.jsx  SeriesNewPage.jsx  SeriesEditPage.jsx
├── components/             # 직접 만든 재사용 컴포넌트: props만 보고 화면을 그림
│   ├── Layout.jsx          ToastProvider.jsx
│   ├── DataState.jsx       Loading.jsx          ErrorState.jsx      EmptyState.jsx
│   ├── SeriesPoster.jsx    SeriesCard.jsx       SeriesGrid.jsx      SeriesRail.jsx
│   ├── SeriesForm.jsx      FormField.jsx        SegmentedControl.jsx
│   ├── GenreFilter.jsx     StatusBadge.jsx      DeleteSeriesDialog.jsx
│   └── ui/                 # shadcn/ui가 생성한 기본 부품 (button, input, alert-dialog …)
├── hooks/
│   ├── useAsync.js         # 비동기 요청 → { data, loading, error, reload }
│   ├── useSeries.js        # useSeriesList(), useSeries(id)
│   └── useToast.js         # 알림 Context 접근
└── lib/                    # React와 무관한 순수 로직
    ├── supabase.js         # Supabase 클라이언트
    ├── seriesApi.js        # CRUD 함수
    ├── series.js           # 장르·상태 상수, 검증(validateSeries), 폼↔DB 변환
    ├── series.test.js
    └── utils.js            # shadcn/ui 클래스 병합 헬퍼(cn)
supabase/
├── schema.sql              # 테이블, 트리거, RLS
└── seed.sql                # 샘플 작품
```

## 설계 설명

### 1. 컴포넌트를 나눈 기준

- **페이지(`pages/`)** 는 "어떤 데이터를 가져와서, 성공하면 어디로 이동할지"를 정합니다. URL 파라미터 읽기, 페이지 이동, API 호출은 페이지에만 있습니다.
- **UI 컴포넌트(`components/`)** 는 받은 props만 보고 화면을 그립니다. Supabase나 라우트를 모르기 때문에 어느 페이지에서든 다시 쓸 수 있습니다.
  - `SeriesForm`은 등록과 수정 화면이 함께 씁니다. 저장 함수를 `onSubmit` prop으로 받으므로 폼은 자신이 등록용인지 수정용인지 모릅니다.
  - `SeriesPoster`는 홈 레일, 탐색 그리드, 상세, 폼 미리보기에서 같은 컴포넌트를 씁니다. 글자 크기를 포스터 너비(container query 단위 `cqi`) 기준으로 잡아서, 크기가 달라도 비율이 유지됩니다.
  - `SegmentedControl`은 폼의 연재 상태·화면 방향 선택과 탐색 화면의 연재 상태 필터에 함께 쓰입니다.
- **같은 화면 패턴은 한 번만 만든다:** 로딩(`Loading`), 에러(`ErrorState`), 빈 상태(`EmptyState`)를 각각 컴포넌트로 만들고, 셋 중 무엇을 보여줄지 정하는 순서(로딩 → 에러 → 빈 → 성공)는 `DataState` 한 곳에 모았습니다. 홈, 탐색, 상세, 수정 네 화면이 모두 `DataState`를 쓰므로 상태 표현이 같습니다.
- **shadcn/ui와의 관계:** `components/ui/`는 shadcn이 생성한 기본 부품(버튼, 입력창, 확인 창 등)입니다. 과제의 재사용 컴포넌트 요건은 그 위에 직접 만든 아래 16개로 충족합니다.

| 컴포넌트 | 주요 props | 달라지는 것 |
| --- | --- | --- |
| `SeriesPoster` | `series`, `className` | 커버 이미지 또는 장르 색 + 제목 포스터 |
| `SeriesCard` | `series` | 포스터, 제목, 상태, 회차 |
| `SeriesGrid` | `series` | 카드 그리드 |
| `SeriesRail` | `title`, `series`, `emptyMessage`, `action` | 가로 스크롤 줄, 비었을 때 문구 |
| `SeriesForm` | `initialValues`, `submitLabel`, `onSubmit`, `onCancel` | 등록/수정 겸용 |
| `FormField` | `label`, `htmlFor`, `error`, `hint` | 에러 또는 도움말 |
| `SegmentedControl` | `value`, `onChange`, `options` | 선택지와 선택 상태 |
| `GenreFilter` | `value`, `onChange`, `counts` | 선택된 장르, 장르별 개수 |
| `StatusBadge` | `status` | 라벨과 색 |
| `DeleteSeriesDialog` | `seriesTitle`, `onDelete` | 확인 문구, 삭제 중/실패 표시 |
| `DataState` | `loading`, `error`, `isEmpty`, `loadingVariant`, `children` | 네 가지 상태 중 무엇을 그릴지 |
| `Loading` | `variant`, `count` | 그리드형/상세형 스켈레톤 |
| `ErrorState` | `message`, `onRetry` | 원인, 다시 시도 버튼 |
| `EmptyState` | `message`, `description`, `children` | 문구, 행동 버튼 |
| `ToastProvider` | `children` | 알림 영역 제공 |
| `Layout` | (라우트 `Outlet`) | 현재 경로에 따른 메뉴 강조 |

### 2. props와 state, 상태를 둔 위치

- **state**는 컴포넌트가 스스로 바꾸는 값이고, **props**는 부모가 내려준 읽기 전용 값입니다.
- 상태는 **그 값을 쓰는 컴포넌트들의 가장 가까운 공통 부모**에 두었습니다.

| 상태 | 위치 | 이유 |
| --- | --- | --- |
| 폼 입력값, 필드 에러, 제출 중, 제출 실패 | `SeriesForm` (`useState`) | 폼 안에서만 쓰입니다. 미리보기 `SeriesPoster`에는 `values`를 props로 내려줍니다(하향). |
| 장르, 연재 상태, 검색어, 정렬 | `ExplorePage` (URL 쿼리, `useSearchParams`) | `GenreFilter`와 `SegmentedControl`(입력), `SeriesGrid`(결과)가 함께 써야 해서 공통 부모로 끌어올렸습니다(상향). 자식은 `onChange` 콜백으로 부모 상태를 바꿉니다. URL에 두었기 때문에 상세에서 뒤로 가도 필터가 유지되고, 링크로 공유할 수 있습니다. |
| 목록/상세 데이터, 로딩, 에러 | `useAsync` 훅 (각 페이지) | 페이지마다 독립적으로 요청합니다. |
| 삭제 확인 창 열림, 삭제 중, 삭제 실패 | `DeleteSeriesDialog` | 확인 창 안에서만 쓰입니다. |
| 알림(toast) | `ToastProvider` (Context, 전역) | 저장한 뒤 다른 페이지로 이동해도 알림이 남아 있어야 해서 라우트 바깥에 두었습니다. |

화면에서 계산할 수 있는 값은 state로 따로 두지 않았습니다. 필터링·정렬된 목록, 장르별 개수, "오늘 새 회차" 목록은 원본 데이터와 필터 값에서 매번 계산합니다.

### 3. useEffect와 데이터 요청

데이터 요청은 `hooks/useAsync.js` 한 곳에서만 합니다.

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

- **언제 실행되나:** 컴포넌트가 처음 화면에 그려진 직후, 그리고 의존성 값이 바뀐 뒤에 실행됩니다.
- **의존성:**
  - `asyncFn`: `useSeries(id)`는 요청 함수를 `useCallback(() => fetchSeries(id), [id])`로 만듭니다. 그래서 **`id`가 바뀔 때만** 새 함수가 만들어지고 effect가 다시 실행됩니다. `useCallback`이 없으면 렌더링할 때마다 새 함수가 생겨 요청이 끝없이 반복됩니다.
  - `reloadKey`: "다시 시도" 버튼이 `reload()`로 이 숫자를 올리면 같은 요청을 다시 보냅니다.
- **cleanup(`ignore = true`):** 응답이 오기 전에 페이지를 떠나거나 `id`가 바뀌면, 이전 effect의 cleanup이 먼저 실행됩니다. 늦게 도착한 이전 응답이 새 화면을 덮어쓰지 못하게 막습니다.
- 등록, 수정, 삭제는 effect가 아니라 **이벤트 핸들러**(`onSubmit`, `onClick`)에서 호출합니다. "화면이 보이면 가져온다"는 effect로, "사용자가 눌렀을 때 바꾼다"는 이벤트로 나눴습니다.

### 4. 비동기 상태를 UI로 표현한 방법

`useAsync`의 `status`는 `'loading' | 'success' | 'error'` 중 하나만 가집니다. 그래서 "로딩 중이면서 에러" 같은 모순된 조합이 생기지 않습니다. 빈 상태는 요청은 성공했지만 데이터가 없는 경우입니다.

| 상태 | 조건 | 화면 |
| --- | --- | --- |
| 로딩 | `status === 'loading'` | 실제 화면과 같은 모양의 스켈레톤 (포스터 그리드 또는 상세 레이아웃) |
| 실패 | `status === 'error'` | "요청에 실패했어요. 다시 시도해 주세요." + 원인 + **다시 시도** 버튼 |
| 빈 상태 | 목록이 `[]`, 상세가 `null` | "아직 등록된 작품이 없어요." / "작품을 찾을 수 없어요." + 이동 버튼 |
| 성공 | 그 외 | 실제 내용 |

탐색 화면에서는 "작품이 하나도 없음"과 "필터 결과가 없음"을 구분합니다. 필터 결과가 없으면 "필터 초기화" 버튼을 보여줍니다.

폼과 삭제는 따로 이렇게 처리합니다.
- 제출 전에 `validateSeries`로 필수값, 길이, 범위, URL 형식을 검사합니다. 각 필드 아래에 에러를 표시하고 첫 번째 에러 필드로 포커스를 옮깁니다. 입력을 고치면 그 필드의 에러가 사라집니다.
- 제출하는 동안에는 버튼을 비활성화하고 스피너와 "저장 중…"을 보여줍니다.
- 요청이 실패하면 폼 상단에 "저장하지 못했어요. (원인)"을 표시하고 입력값은 그대로 둡니다.
- 삭제는 확인 창을 거칩니다. 요청 중에는 창이 닫히지 않고, 실패하면 창 안에 원인을 표시합니다.

### 5. 하나의 기능이 연결되는 흐름: "작품 등록"

1. **라우팅:** "작품 등록"(데스크톱 헤더, 모바일 하단 탭)을 누르면 URL이 `/series/new`로 바뀌고 `SeriesNewPage`가 렌더링됩니다.
2. **컴포넌트:** `SeriesNewPage`가 `SeriesForm`에 `onSubmit={handleSubmit}`을 props로 넘깁니다.
3. **상태:** 글자를 입력할 때마다 `onChange` → `setValues`로 `values`가 바뀝니다(controlled input).
4. **렌더링:** `values`가 바뀌면 `SeriesForm`이 다시 렌더링되고, props로 받는 미리보기 포스터의 제목, 장르 색, 크리에이터도 바로 바뀝니다.
5. **이벤트:** "작품 등록"을 누르면 `handleSubmit`이 실행됩니다. 검증에 실패하면 `errors` 상태가 바뀌어 에러 메시지가 렌더링됩니다.
6. **비동기:** 검증을 통과하면 `submitting = true`(버튼 비활성) → `createSeries()` → Supabase INSERT 순서로 진행됩니다.
7. **결과:** 성공하면 `toast.show()`(전역 상태) → `navigate('/series/:id')` → 상세 페이지의 `useSeries(id)` effect가 새 데이터를 가져옵니다. 알림은 3초 뒤 사라집니다. 실패하면 `submitError` 상태로 폼 상단에 메시지가 나타납니다.

### 6. 상태 변경 → 렌더링 변화 지점

| 사용자 이벤트 | 바뀌는 상태 | 렌더링 변화 |
| --- | --- | --- |
| 장르 칩 클릭 | `genre` (URL) | 해당 장르 작품만 표시, 칩 강조 |
| 연재 상태 선택 | `status` (URL) | 연재 중/완결/휴재 작품만 표시 |
| 검색어 입력 | `q` (URL) | 제목·크리에이터에 검색어가 들어간 작품만 표시 |
| 정렬 변경 | `sort` (URL) | 최근 등록순/회차 많은 순/제목순으로 재배열 |
| 폼 입력 | `values` (`SeriesForm`) | 미리보기 포스터, 소개 글자 수 |
| 빈 폼 제출 | `errors` (`SeriesForm`) | 필드별 에러 메시지, 빨간 테두리 |
| 저장/수정/삭제 성공 | `toast` (Context) | 하단 알림 표시 → 3초 뒤 사라짐 |
| 삭제 클릭 | `open` (`DeleteSeriesDialog`) | 확인 창 표시 |
| 다시 시도 클릭 | `reloadKey` (`useAsync`) | 에러 → 로딩 → 결과 |

## 보너스 과제

- **전역 상태 (Context):** 알림(toast)을 `ToastProvider` + `useToast()`로 관리합니다. 등록 화면에서 띄운 알림이 상세 페이지로 이동한 뒤에도 보입니다.
- **성능 최적화 (메모이제이션):**
  - `useMemo`: 탐색 화면의 필터·정렬 결과와 장르별 개수. 관련 없는 상태가 바뀔 때는 다시 계산하지 않습니다.
  - `useCallback`: `useSeries`의 요청 함수(`id`가 같으면 effect를 다시 실행하지 않음), `ToastProvider`의 `show`.
  - `React.memo`: `SeriesCard`. 필터를 바꿔도 props가 그대로인 카드는 다시 렌더링하지 않습니다.
- **인증:** 적용하지 않았습니다. RLS를 끄지 않고 "anon 역할 전체 허용" 정책을 명시해 두었으므로, 인증을 붙일 때는 정책을 `auth.uid() = user_id` 조건으로 바꾸면 됩니다. 지금은 URL을 아는 누구나 작품을 수정·삭제할 수 있다는 한계가 있습니다.

## UI/UX에서 신경 쓴 점

- **세로 포스터 중심:** 숏드라마는 9:16 세로 화면이 기본이라, 모든 목록을 세로 포스터로 보여줍니다. 커버 이미지가 없는 작품도 장르 색과 제목 타이포그래피로 포스터가 만들어집니다.
- **색:** 극장 커튼 같은 짙은 자주색 배경에 간판 조명 같은 금색 하나만 강조색으로 씁니다.
- **글꼴:** 제목은 포스터 느낌의 Black Han Sans, 본문은 Pretendard를 씁니다.
- **모바일:** 하단 탭 바, 2열 포스터 그리드, 가로로 넘기는 장르 칩과 작품 레일.
- **접근성:** 키보드 포커스 표시, 에러 필드에 `aria-invalid`/`aria-describedby`, 알림에 `aria-live`, `prefers-reduced-motion`이면 애니메이션을 끕니다.

## 검증

로컬과 배포 환경에서 아래 흐름을 브라우저로 직접 확인했습니다.

- 홈: 오늘 요일 작품 레일, 새로 등록된 작품, 완결 작품
- 탐색: 장르·연재 상태 필터, 검색, 정렬, 필터 결과 없음 → 필터 초기화, 필터 값의 URL 유지
- 상세 조회, 없는 id(`/series/9999`)와 잘못된 id(`/series/abc`)에서 "작품을 찾을 수 없어요" 표시
- 빈 폼 제출 → 필드별 에러와 첫 에러 필드로 포커스 이동, 입력하면 에러가 사라지고 미리보기에 반영
- 등록 → 상세로 이동 + 알림, 수정 → 상세로 이동 + 알림(수정일 표시), 삭제 확인 창 → 탐색으로 이동 + 알림
- DB 권한을 잠시 막은 상태에서 수정/삭제 → 폼 상단과 확인 창에 실패 원인 표시
- 잘못된 Supabase 주소로 실행 → 스켈레톤 → 에러 상태 + 다시 시도 버튼
- 없는 경로(`/nope`) → 404 페이지
- 모바일 너비(390px)에서 홈·탐색·등록 화면
