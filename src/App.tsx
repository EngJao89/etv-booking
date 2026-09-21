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
import { EditBookPage } from '@/pages/edit-book'
import { LoginPage } from '@/pages/login'
import { NewUserPage } from '@/pages/new-user'
import { deleteBook, listBooks } from '@/services/books'
import type { AuthSession } from '@/types/auth'
import type { Book } from '@/types/book'

type AuthScreen = 'login' | 'new-user'
type Screen = 'books' | 'add-book' | 'edit-book'

function App() {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession())
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login')
  const [screen, setScreen] = useState<Screen>('books')
  const [books, setBooks] = useState<Book[]>([])
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [booksError, setBooksError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    function onSessionExpired() {
      setAuthToken(null)
      setSession(null)
      setAuthScreen('login')
      setScreen('books')
      setBooks([])
      setBooksError(null)
      setDeletingId(null)
      setEditingId(null)
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
    setAuthScreen('login')
  }

  function handleLogout() {
    clearSession()
    setAuthToken(null)
    setSession(null)
    setAuthScreen('login')
    setScreen('books')
    setBooks([])
    setBooksError(null)
    setDeletingId(null)
    setEditingId(null)
  }

  function handleNewUser() {
    setAuthScreen('new-user')
  }

  function handleBackToLogin() {
    setAuthScreen('login')
  }

  function handleUserCreated() {
    setAuthScreen('login')
  }

  function handleHome() {
    setEditingId(null)
    setScreen('books')
  }

  function handleAddNewBook() {
    setScreen('add-book')
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setScreen('edit-book')
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

  function handleSaveBook(book: Book) {
    setBooks((current) =>
      current.map((item) => (item.id === book.id ? book : item)),
    )
    setEditingId(null)
    setScreen('books')
  }

  if (!session) {
    if (authScreen === 'new-user') {
      return (
        <NewUserPage onBackToLogin={handleBackToLogin} onCreated={handleUserCreated} />
      )
    }

    return <LoginPage onLogin={handleLogin} onNewUser={handleNewUser} />
  }

  if (screen === 'add-book') {
    return <AddBookPage onHome={handleHome} onAdd={handleAddBook} />
  }

  if (screen === 'edit-book' && editingId) {
    return (
      <EditBookPage bookId={editingId} onHome={handleHome} onSave={handleSaveBook} />
    )
  }

  return (
    <BooksPage
      username={session.username}
      books={books}
      isLoading={isLoadingBooks}
      error={booksError}
      deletingId={deletingId}
      onAddNewBook={handleAddNewBook}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onLogout={handleLogout}
    />
  )
}

export default App
