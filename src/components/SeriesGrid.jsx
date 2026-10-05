import SeriesCard from './SeriesCard.jsx'

export default function SeriesGrid({ series }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {series.map((item) => (
        <li key={item.id}>
          <SeriesCard series={item} />
        </li>
      ))}
    </ul>
  )
}
