import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/logo.svg'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getBook } from '@/services/books'
import type { Book } from '@/types/book'

type BookDetailsPageProps = {
  bookId: string
  onHome: () => void
  onEdit: (id: string) => void
}

function DetailField({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="text-base text-muted-foreground">{value}</span>
    </div>
  )
}

export function BookDetailsPage({
  bookId,
  onHome,
  onEdit,
}: Readonly<BookDetailsPageProps>) {
  const { t, i18n } = useTranslation()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadBook() {
      setIsLoading(true)
      setError(null)

      try {
        const nextBook = await getBook(bookId)
        if (!cancelled) {
          setBook(nextBook)
        }
      } catch (error_) {
        if (!cancelled) {
          setBook(null)
          setError(
            error_ instanceof Error ? error_.message : t('bookDetails.unableToLoad'),
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadBook()

    return () => {
      cancelled = true
    }
  }, [bookId, t])

  const priceFormatter = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <main className="relative min-h-svh bg-background">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-16">
        <section className="flex flex-col items-start gap-8">
          <img src={logo} alt={t('app.logoAlt')} className="size-24 rounded-md" />

          <div className="flex max-w-sm flex-col gap-3">
            <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-foreground">
              {t('bookDetails.title')}
            </h1>
            <p className="text-muted-foreground">{t('bookDetails.description')}</p>
          </div>

          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-primary"
            onClick={onHome}
          >
            <ArrowLeftIcon className="size-4" />
            {t('bookDetails.home')}
          </Button>
        </section>

        <section className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md shadow-sm">
            <CardContent className="flex flex-col gap-5">
              {isLoading ? (
                <p className="text-muted-foreground">{t('bookDetails.loading')}</p>
              ) : null}

              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              {book ? (
                <>
                  <DetailField label={t('books.title')} value={book.title} />
                  <DetailField label={t('books.author')} value={book.author} />
                  <DetailField
                    label={t('books.price')}
                    value={priceFormatter.format(book.price)}
                  />
                  <DetailField
                    label={t('books.releaseDate')}
                    value={dateFormatter.format(
                      new Date(`${book.releaseDate}T00:00:00`),
                    )}
                  />

                  <Button
                    type="button"
                    size="lg"
                    className="mt-2 h-11 w-full text-base"
                    onClick={() => onEdit(book.id)}
                  >
                    {t('bookDetails.edit')}
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
