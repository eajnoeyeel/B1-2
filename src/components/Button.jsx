import { Link } from 'react-router-dom'

// variant: primary | secondary | danger. to가 있으면 링크로 렌더링한다.
export default function Button({ variant = 'primary', to, className = '', ...props }) {
  const classes = `btn btn-${variant} ${className}`.trim()
  if (to) return <Link to={to} className={classes} {...props} />
  return <button type="button" className={classes} {...props} />
}
