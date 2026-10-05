import { useState } from 'react'

// controlled input 폼의 공통 상태: 값, 필드 에러, 제출 중, 제출 실패.
// submit(validate, action): 검증 → 실패 시 첫 에러 필드로 포커스 → 통과 시 action 실행
// action이 throw하면 submitError에 메시지를 담고 입력값은 그대로 둔다.
export function useFormState(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
    // 사용자가 고치기 시작하면 그 필드의 에러는 지운다.
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest)
  }

  async function submit(validate, action) {
    const nextErrors = validate(values)
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      document.getElementById(firstError)?.focus()
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      await action(values)
    } catch (error) {
      setSubmitError(error.message)
      setSubmitting(false)
    }
  }

  // <Input {...fieldProps('title')} /> — id/name/value/onChange와 에러 aria 속성을 한 번에 연결한다.
  // parse: 문자열 입력을 저장 전에 바꿀 때 사용 (예: 숫자 필드)
  function fieldProps(name, parse = (value) => value) {
    return {
      id: name,
      name,
      value: values[name],
      onChange: (event) => setField(name, parse(event.target.value)),
      ...(errors[name] && { 'aria-invalid': true, 'aria-describedby': `${name}-error` }),
    }
  }

  return { values, errors, submitting, submitError, setField, submit, fieldProps }
}
