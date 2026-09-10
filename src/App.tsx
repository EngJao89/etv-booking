import { useState } from 'react'
import { initialBooks } from '@/data/books'
import { AddBookPage } from '@/pages/add-book'
import { BooksPage } from '@/pages/books'
import { LoginPage } from '@/pages/login'
import type { Book } from '@/types/book'

type Screen = 'books' | 'add-book'

function App() {
  const [username, setUsername] = useState<string | null>(null)
  const [screen, setScreen] = useState<Screen>('books')
  const [books, setBooks] = useState(initialBooks)

  function handleLogout() {
    setUsername(null)
    setScreen('books')
  }

  function handleHome() {
    setScreen('books')
  }

  function handleAddNewBook() {
    setScreen('add-book')
  }

  function handleDelete(id: string) {
    setBooks((current) => current.filter((book) => book.id !== id))
  }

  function handleAddBook(book: Omit<Book, 'id'>) {
    setBooks((current) => [
      { ...book, id: crypto.randomUUID() },
      ...current,
    ])
    setScreen('books')
  }

  if (!username) {
    return <LoginPage onLogin={setUsername} />
  }

  if (screen === 'add-book') {
    return <AddBookPage onHome={handleHome} onAdd={handleAddBook} />
  }

  return (
    <BooksPage
      username={username}
      books={books}
      onAddNewBook={handleAddNewBook}
      onDelete={handleDelete}
      onLogout={handleLogout}
    />
  )
}

export default App
