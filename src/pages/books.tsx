import { PowerIcon } from 'lucide-react'
import logo from '@/assets/logo.svg'
import { BookCard } from '@/components/book-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Book } from '@/types/book'

type BooksPageProps = {
  username: string
  books: Book[]
  onAddNewBook: () => void
  onDelete: (id: string) => void
  onLogout: () => void
}

export function BooksPage({
  username,
  books,
  onAddNewBook,
  onDelete,
  onLogout,
}: Readonly<BooksPageProps>) {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ETV" className="size-12 rounded-md" />
            <p className="text-sm text-neutral-950 sm:text-base">
              Welcome, <span className="italic text-primary">{username}!</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" className="h-10 min-w-40 px-6" onClick={onAddNewBook}>
              Add New Book
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 bg-white"
              aria-label="Log out"
              onClick={onLogout}
            >
              <PowerIcon />
            </Button>
          </div>
        </header>

        <section className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
            Registered Books
          </h1>

          {books.length === 0 ? (
            <Card className="bg-white shadow-sm">
              <CardContent>
                <p className="text-neutral-500">No books registered yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {books.map((book) => (
                <BookCard key={book.id} book={book} onDelete={onDelete} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
