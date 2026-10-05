export default function RatingStars({ value }) {
  return (
    <span className="stars" aria-label={`별점 ${value}점`}>
      {'★'.repeat(value)}
      <span className="stars-off">{'★'.repeat(5 - value)}</span>
    </span>
  )
}
