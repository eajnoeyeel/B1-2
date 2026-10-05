import { supabase } from './supabase.js'

const TABLE = 'series'

function table() {
  if (!supabase) {
    throw new Error('Supabase 환경변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)가 설정되지 않았습니다.')
  }
  return supabase.from(TABLE)
}

// Supabase는 실패해도 throw하지 않고 { error }를 돌려주므로, 여기서 throw로 바꿔
// 호출하는 쪽(훅/폼)이 try/catch 한 가지 방식으로만 실패를 다루게 한다.
function unwrap({ data, error }) {
  if (error) throw new Error(error.message)
  return data
}

export async function fetchSeriesList() {
  return unwrap(await table().select('*').order('id', { ascending: false }))
}

// 없는 id면 null을 돌려준다. 숫자가 아닌 id는 DB까지 보내지 않는다.
export async function fetchSeries(id) {
  if (!/^\d+$/.test(id)) return null
  return unwrap(await table().select('*').eq('id', id).maybeSingle())
}

export async function createSeries(payload) {
  return unwrap(await table().insert(payload).select().single())
}

export async function updateSeries(id, payload) {
  return unwrap(await table().update(payload).eq('id', id).select().single())
}

export async function deleteSeries(id) {
  unwrap(await table().delete().eq('id', id))
}
