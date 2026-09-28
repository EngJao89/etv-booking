import { useCallback, useEffect, useState } from 'react'
import { setAuthToken } from '@/lib/axios'
import { getPhotoUrlForUser, savePhotoUrlForUser } from '@/lib/photo-url'
import {
  SESSION_EXPIRED_EVENT,
  clearSession,
  loadSession,
  saveSession,
} from '@/lib/session'
import { AddBookPage } from '@/pages/add-book'
import { BookDetailsPage } from '@/pages/book-details'
import { BooksPage } from '@/pages/books'
import { EditBookPage } from '@/pages/edit-book'
import { LoginPage } from '@/pages/login'
import { NewUserPage } from '@/pages/new-user'
import { ProfilePage } from '@/pages/profile'
import { deleteBook, listBooks } from '@/services/books'
import {
  listSavedBooks,
  removeBookFromMyList,
  saveBookToMyList,
} from '@/services/saved-books'
import {
  PersonNotFoundError,
  resolveProfilePerson,
} from '@/services/persons'
import type { AuthSession } from '@/types/auth'
import type { Book } from '@/types/book'

type AuthScreen = 'login' | 'new-user'
type Screen = 'books' | 'add-book' | 'edit-book' | 'book-details' | 'profile'

function App() {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession())
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login')
  const [screen, setScreen] = useState<Screen>('books')
  const [books, setBooks] = useState<Book[]>([])
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [booksError, setBooksError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const [savedBooks, setSavedBooks] = useState<Book[]>([])
  const [isLoadingSavedBooks, setIsLoadingSavedBooks] = useState(false)
  const [savedBooksError, setSavedBooksError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [removingSavedId, setRemovingSavedId] = useState<string | null>(null)
  const [isSavedBooksOpen, setIsSavedBooksOpen] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
    const current = loadSession()
    return current ? getPhotoUrlForUser(current.username) : null
  })
  const [photoUser, setPhotoUser] = useState<string | null>(
    () => loadSession()?.username ?? null,
  )

  const sessionUser = session?.username ?? null
  if (sessionUser !== photoUser) {
    setPhotoUser(sessionUser)
    setPhotoUrl(sessionUser ? getPhotoUrlForUser(sessionUser) : null)
  }

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
      setDetailsId(null)
      setSavedBooks([])
      setSavedBooksError(null)
      setSavingId(null)
      setRemovingSavedId(null)
      setIsSavedBooksOpen(false)
      setPhotoUrl(null)
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired)
  }, [])

  useEffect(() => {
    setAuthToken(session?.accessToken ?? null)
  }, [session])

  useEffect(() => {
    if (!session) {
      return
    }

    const username = session.username
    let cancelled = false

    async function loadPhoto() {
      try {
        const person = await resolveProfilePerson(username)
        if (cancelled) {
          return
        }

        savePhotoUrlForUser(username, person.photoUrl)
        setPhotoUrl(person.photoUrl || null)
      } catch (error_) {
        if (cancelled) {
          return
        }

        if (error_ instanceof PersonNotFoundError) {
          setPhotoUrl(null)
        }
      }
    }

    void loadPhoto()

    return () => {
      cancelled = true
    }
  }, [session])

  useEffect(() => {
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

    async function loadSavedBooks() {
      setIsLoadingSavedBooks(true)
      setSavedBooksError(null)

      try {
        const nextSavedBooks = await listSavedBooks()
        if (!cancelled) {
          setSavedBooks(nextSavedBooks)
        }
      } catch (error_) {
        if (!cancelled) {
          setSavedBooksError(
            error_ instanceof Error ? error_.message : String(error_),
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSavedBooks(false)
        }
      }
    }

    void loadBooks()
    void loadSavedBooks()

    return () => {
      cancelled = true
    }
  }, [session, screen])

  function handleLogin(nextSession: AuthSession) {
    saveSession(nextSession)
    setAuthToken(nextSession.accessToken)
    setSession(nextSession)
    setAuthScreen('login')
    setPhotoUrl(getPhotoUrlForUser(nextSession.username))
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
    setDetailsId(null)
    setSavedBooks([])
    setSavedBooksError(null)
    setSavingId(null)
    setRemovingSavedId(null)
    setIsSavedBooksOpen(false)
    setPhotoUrl(null)
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
    setDetailsId(null)
    setScreen('books')
  }

  const handlePhotoUrlChange = useCallback(
    (nextPhotoUrl: string) => {
      if (!session) {
        return
      }

      savePhotoUrlForUser(session.username, nextPhotoUrl)
      setPhotoUrl(nextPhotoUrl.trim() || null)
    },
    [session],
  )

  function handleAddNewBook() {
    setScreen('add-book')
  }

  function handleProfile() {
    setScreen('profile')
  }

  function handleOpen(id: string) {
    setDetailsId(id)
    setScreen('book-details')
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setDetailsId(null)
    setScreen('edit-book')
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setBooksError(null)

    try {
      await deleteBook(id)
      setBooks((current) => current.filter((book) => book.id !== id))
      setSavedBooks((current) => current.filter((book) => book.id !== id))
    } catch (error_) {
      setBooksError(
        error_ instanceof Error ? error_.message : String(error_),
      )
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSaveBookToList(id: string) {
    if (savedBooks.some((book) => book.id === id)) {
      return
    }

    setSavingId(id)
    setSavedBooksError(null)

    try {
      const savedBook = await saveBookToMyList(id)
      setSavedBooks((current) => [
        savedBook,
        ...current.filter((book) => book.id !== savedBook.id),
      ])
    } catch (error_) {
      setSavedBooksError(
        error_ instanceof Error ? error_.message : String(error_),
      )
    } finally {
      setSavingId(null)
    }
  }

  async function handleRemoveSavedBook(id: string) {
    setRemovingSavedId(id)
    setSavedBooksError(null)

    try {
      await removeBookFromMyList(id)
      setSavedBooks((current) => current.filter((book) => book.id !== id))
    } catch (error_) {
      setSavedBooksError(
        error_ instanceof Error ? error_.message : String(error_),
      )
    } finally {
      setRemovingSavedId(null)
    }
  }

  async function handleSavedBooksOpenChange(open: boolean) {
    setIsSavedBooksOpen(open)

    if (!open) {
      return
    }

    setIsLoadingSavedBooks(true)
    setSavedBooksError(null)

    try {
      const nextSavedBooks = await listSavedBooks()
      setSavedBooks(nextSavedBooks)
    } catch (error_) {
      setSavedBooksError(
        error_ instanceof Error ? error_.message : String(error_),
      )
    } finally {
      setIsLoadingSavedBooks(false)
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

  if (screen === 'book-details' && detailsId) {
    return (
      <BookDetailsPage
        bookId={detailsId}
        onHome={handleHome}
        onEdit={handleEdit}
      />
    )
  }

  if (screen === 'profile') {
    return (
      <ProfilePage
        username={session.username}
        savedBooks={savedBooks}
        isLoadingSaved={isLoadingSavedBooks}
        savedError={savedBooksError}
        removingSavedId={removingSavedId}
        isSavedBooksOpen={isSavedBooksOpen}
        onHome={handleHome}
        onPhotoUrlChange={handlePhotoUrlChange}
        onSavedBooksOpenChange={handleSavedBooksOpenChange}
        onOpenBook={handleOpen}
        onRemoveSaved={handleRemoveSavedBook}
      />
    )
  }

  return (
    <BooksPage
      username={session.username}
      photoUrl={photoUrl}
      books={books}
      savedBooks={savedBooks}
      isLoading={isLoadingBooks}
      isLoadingSaved={isLoadingSavedBooks}
      error={booksError}
      savedError={savedBooksError}
      deletingId={deletingId}
      savingId={savingId}
      removingSavedId={removingSavedId}
      isSavedBooksOpen={isSavedBooksOpen}
      onSavedBooksOpenChange={handleSavedBooksOpenChange}
      onAddNewBook={handleAddNewBook}
      onProfile={handleProfile}
      onOpen={handleOpen}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSave={handleSaveBookToList}
      onRemoveSaved={handleRemoveSavedBook}
      onLogout={handleLogout}
    />
  )
}

export default App
