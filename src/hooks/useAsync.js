import { useCallback, useEffect, useState } from 'react'

// asyncFn이 바뀌거나 reload()가 호출될 때마다 다시 요청한다.
// asyncFn은 호출하는 쪽에서 useCallback으로 고정해야 매 렌더마다 재요청되지 않는다.
export function useAsync(asyncFn) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    // 응답이 오기 전에 id가 바뀌거나 페이지를 떠나면, 늦게 도착한 응답은 버린다.
    let ignore = false
    // id가 바뀌어 재요청할 때 이전 데이터 대신 로딩을 보여주려면 여기서 리셋해야 한다.
    // oxlint-disable-next-line react/set-state-in-effect
    setState((prev) => ({ ...prev, status: 'loading', error: null }))
    asyncFn().then(
      (data) => !ignore && setState({ status: 'success', data, error: null }),
      (error) => !ignore && setState({ status: 'error', data: null, error }),
    )
    return () => {
      ignore = true
    }
  }, [asyncFn, reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  return { ...state, loading: state.status === 'loading', reload }
}
