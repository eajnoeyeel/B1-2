// as: input | textarea | select. error가 있으면 필드 아래에 메시지를 붙인다.
export default function TextField({ as: Tag = 'input', label, name, error, hint, children, ...props }) {
  const id = `field-${name}`
  const errorId = `${id}-error`
  return (
    <div className={`field ${error ? 'field-invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <Tag id={id} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props}>
        {children}
      </Tag>
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}
