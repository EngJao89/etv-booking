import { PowerIcon } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import logo from '@/assets/logo.svg'
import { BookCard } from '@/components/book-card'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserAvatar } from '@/components/user-avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Book } from '@/types/book'

type BooksPageProps = {
  username: string
  photoUrl: string | null
  books: Book[]
  isLoading: boolean
  error: string | null
  deletingId: string | null
  onAddNewBook: () => void
  onProfile: () => void
  onOpen: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onLogout: () => void
}

export function BooksPage({
  username,
  photoUrl,
  books,
  isLoading,
  error,
  deletingId,
  onAddNewBook,
  onProfile,
  onOpen,
  onEdit,
  onDelete,
  onLogout,
}: Readonly<BooksPageProps>) {
  const { t } = useTranslation()

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
                  onOpen={onOpen}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}
