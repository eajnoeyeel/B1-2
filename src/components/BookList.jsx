import BookCard from './BookCard.jsx'

export default function BookList({ books }) {
  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard book={book} to={`/books/${book.id}`} />
        </li>
      ))}
    </ul>
  )
}
