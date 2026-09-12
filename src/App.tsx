import { useState } from 'react'
import { initialBooks } from '@/data/books'
import { setAuthToken } from '@/lib/axios'
import { AddBookPage } from '@/pages/add-book'
import { BooksPage } from '@/pages/books'
import { LoginPage } from '@/pages/login'
import type { AuthSession } from '@/types/auth'
import type { Book } from '@/types/book'

type Screen = 'books' | 'add-book'

function App() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [screen, setScreen] = useState<Screen>('books')
  const [books, setBooks] = useState(initialBooks)

  function handleLogin(nextSession: AuthSession) {
    setAuthToken(nextSession.accessToken)
    setSession(nextSession)
  }

  function handleLogout() {
    setAuthToken(null)
    setSession(null)
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

  if (!session) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (screen === 'add-book') {
    return <AddBookPage onHome={handleHome} onAdd={handleAddBook} />
  }

  return (
    <BooksPage
      username={session.username}
      books={books}
      onAddNewBook={handleAddNewBook}
      onDelete={handleDelete}
      onLogout={handleLogout}
    />
  )
}

export default App
