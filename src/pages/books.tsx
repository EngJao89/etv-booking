import { BookmarkIcon, PowerIcon } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import logo from '@/assets/logo.svg'
import { BookCard } from '@/components/book-card'
import { SavedBooksDrawer } from '@/components/saved-books-drawer'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserAvatar } from '@/components/user-avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Book } from '@/types/book'

type BooksPageProps = {
  username: string
  photoUrl: string | null
  books: Book[]
  savedBooks: Book[]
  isLoading: boolean
  isLoadingSaved: boolean
  error: string | null
  savedError: string | null
  deletingId: string | null
  savingId: string | null
  removingSavedId: string | null
  isSavedBooksOpen: boolean
  onSavedBooksOpenChange: (open: boolean) => void
  onAddNewBook: () => void
  onProfile: () => void
  onOpen: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onSave: (id: string) => void
  onRemoveSaved: (id: string) => void
  onLogout: () => void
}

export function BooksPage({
  username,
  photoUrl,
  books,
  savedBooks,
  isLoading,
  isLoadingSaved,
  error,
  savedError,
  deletingId,
  savingId,
  removingSavedId,
  isSavedBooksOpen,
  onSavedBooksOpenChange,
  onAddNewBook,
  onProfile,
  onOpen,
  onEdit,
  onDelete,
  onSave,
  onRemoveSaved,
  onLogout,
}: Readonly<BooksPageProps>) {
  const { t } = useTranslation()
  const savedIds = new Set(savedBooks.map((book) => book.id))

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt={t('app.logoAlt')} className="size-12 rounded-md" />
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label={t('profile.title')}
                onClick={onProfile}
              >
                <UserAvatar photoUrl={photoUrl} name={username} size="lg" />
              </button>
              <p className="text-sm text-foreground sm:text-base">
                <Trans
                  i18nKey="books.welcome"
                  values={{ username }}
                  components={{
                    name: (
                      <button
                        type="button"
                        className="cursor-pointer italic text-primary underline-offset-4 hover:underline"
                        onClick={onProfile}
                      />
                    ),
                  }}
                />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" className="h-10 min-w-40 px-6" onClick={onAddNewBook}>
              {t('books.addNewBook')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-2 bg-card px-4"
              onClick={() => onSavedBooksOpenChange(true)}
            >
              <BookmarkIcon className="size-4" />
              {t('books.openSavedBooks')}
            </Button>
            <ThemeToggle />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 bg-card"
              aria-label={t('books.logOut')}
              onClick={onLogout}
            >
              <PowerIcon />
            </Button>
          </div>
        </header>

        <section className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t('books.registeredBooks')}
          </h1>

          {error ? (
            <Card className="shadow-sm">
              <CardContent>
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {savedError ? (
            <Card className="shadow-sm">
              <CardContent>
                <p role="alert" className="text-sm text-destructive">
                  {savedError}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {isLoading && books.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent>
                <p className="text-muted-foreground">{t('books.loading')}</p>
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && !error && books.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent>
                <p className="text-muted-foreground">{t('books.empty')}</p>
              </CardContent>
            </Card>
          ) : null}

          {books.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isDeleting={deletingId === book.id}
                  isSaved={savedIds.has(book.id)}
                  isSaving={savingId === book.id}
                  onOpen={onOpen}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSave={onSave}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <SavedBooksDrawer
        open={isSavedBooksOpen}
        onOpenChange={onSavedBooksOpenChange}
        books={savedBooks}
        isLoading={isLoadingSaved}
        error={savedError}
        removingId={removingSavedId}
        onOpenBook={onOpen}
        onRemove={onRemoveSaved}
      />
    </main>
  )
}
