import { useEffect, useState } from 'react'
import { setAuthToken } from '@/lib/axios'
import {
  SESSION_EXPIRED_EVENT,
  clearSession,
  loadSession,
  saveSession,
} from '@/lib/session'
import { AddBookPage } from '@/pages/add-book'
import { BooksPage } from '@/pages/books'
import { LoginPage } from '@/pages/login'
import { deleteBook, listBooks } from '@/services/books'
import type { AuthSession } from '@/types/auth'
import type { Book } from '@/types/book'

type Screen = 'books' | 'add-book'

function App() {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession())
  const [screen, setScreen] = useState<Screen>('books')
  const [books, setBooks] = useState<Book[]>([])
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [booksError, setBooksError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    function onSessionExpired() {
      setAuthToken(null)
      setSession(null)
      setScreen('books')
      setBooks([])
      setBooksError(null)
      setDeletingId(null)
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired)
  }, [])

  useEffect(() => {
    setAuthToken(session?.accessToken ?? null)

    if (!session?.accessToken || screen !== 'books') {
      return
    }

    let cancelled = false

    async function loadBooks() {
      setIsLoadingBooks(true)
      setBooksError(null)

      try {
        const nextBooks = await listBooks()
        if (!cancelled) {
          setBooks(nextBooks)
        }
      } catch (error_) {
        if (!cancelled) {
          setBooksError(
            error_ instanceof Error ? error_.message : String(error_),
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoadingBooks(false)
        }
      }
    }

    void loadBooks()

    return () => {
      cancelled = true
    }
  }, [session, screen])

  function handleLogin(nextSession: AuthSession) {
    saveSession(nextSession)
    setAuthToken(nextSession.accessToken)
    setSession(nextSession)
  }

  function handleLogout() {
    clearSession()
    setAuthToken(null)
    setSession(null)
    setScreen('books')
    setBooks([])
    setBooksError(null)
    setDeletingId(null)
  }

  function handleHome() {
    setScreen('books')
  }

  function handleAddNewBook() {
    setScreen('add-book')
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setBooksError(null)

    try {
      await deleteBook(id)
      setBooks((current) => current.filter((book) => book.id !== id))
    } catch (error_) {
      setBooksError(
        error_ instanceof Error ? error_.message : String(error_),
      )
    } finally {
      setDeletingId(null)
    }
  }

  function handleAddBook(book: Book) {
    setBooks((current) => [book, ...current.filter((item) => item.id !== book.id)])
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
      isLoading={isLoadingBooks}
      error={booksError}
      deletingId={deletingId}
      onAddNewBook={handleAddNewBook}
      onDelete={handleDelete}
      onLogout={handleLogout}
    />
  )
}

export default App
