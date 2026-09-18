import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/logo.svg'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createAddBookSchema, parsePrice, type AddBookFormValues } from '@/schemas/add-book'
import { getBook, updateBook } from '@/services/books'
import type { Book } from '@/types/book'

type EditBookPageProps = {
  bookId: string
  onHome: () => void
  onSave: (book: Book) => void
}

export function EditBookPage({ bookId, onHome, onSave }: Readonly<EditBookPageProps>) {
  const { t, i18n } = useTranslation()
  const bookSchema = useMemo(() => createAddBookSchema(t), [t])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddBookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      releaseDate: '',
      price: '',
    },
  })

  useEffect(() => {
    let cancelled = false

    async function loadBook() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const book = await getBook(bookId)
        if (cancelled) {
          return
        }

        reset({
          title: book.title,
          author: book.author,
          releaseDate: book.releaseDate,
          price: String(book.price),
        })
      } catch (error_) {
        if (!cancelled) {
          setLoadError(
            error_ instanceof Error ? error_.message : t('editBook.unableToLoad'),
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
  }, [bookId, reset, t])

  async function onSubmit(values: AddBookFormValues) {
    try {
      const book = await updateBook({
        id: bookId,
        title: values.title.trim(),
        author: values.author.trim(),
        launchDate: `${values.releaseDate}T00:00:00.000Z`,
        price: parsePrice(values.price),
      })
      onSave(book)
    } catch (error_) {
      setError('root', {
        message:
          error_ instanceof Error ? error_.message : t('editBook.unableToSave'),
      })
    }
  }

  const isBusy = isLoading || isSubmitting

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
              {t('editBook.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('editBook.descriptionLine1')}
              <br />
              {t('editBook.descriptionLine2')}
            </p>
          </div>

          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-primary"
            onClick={onHome}
          >
            <ArrowLeftIcon className="size-4" />
            {t('editBook.home')}
          </Button>
        </section>

        <section className="flex justify-center lg:justify-end">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full max-w-md flex-col gap-3"
          >
            {isLoading ? (
              <p className="text-sm text-muted-foreground">{t('editBook.loading')}</p>
            ) : null}
            {loadError ? (
              <p role="alert" className="text-sm text-destructive">
                {loadError}
              </p>
            ) : null}
            {errors.root ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.root.message}
              </p>
            ) : null}
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="sr-only">
                {t('addBook.fieldTitle')}
              </label>
              <Input
                id="title"
                type="text"
                placeholder={t('addBook.fieldTitle')}
                disabled={isBusy || Boolean(loadError)}
                aria-invalid={Boolean(errors.title)}
                className="h-11 bg-card px-3"
                {...register('title')}
              />
              {errors.title ? (
                <p role="alert" className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="author" className="sr-only">
                {t('addBook.fieldAuthor')}
              </label>
              <Input
                id="author"
                type="text"
                placeholder={t('addBook.fieldAuthor')}
                disabled={isBusy || Boolean(loadError)}
                aria-invalid={Boolean(errors.author)}
                className="h-11 bg-card px-3"
                {...register('author')}
              />
              {errors.author ? (
                <p role="alert" className="text-sm text-destructive">
                  {errors.author.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="releaseDate" className="sr-only">
                {t('addBook.fieldReleaseDate')}
              </label>
              <Input
                id="releaseDate"
                type="date"
                lang={i18n.language}
                disabled={isBusy || Boolean(loadError)}
                aria-invalid={Boolean(errors.releaseDate)}
                className="h-11 bg-card px-3"
                {...register('releaseDate')}
              />
              {errors.releaseDate ? (
                <p role="alert" className="text-sm text-destructive">
                  {errors.releaseDate.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="price" className="sr-only">
                {t('addBook.fieldPrice')}
              </label>
              <Input
                id="price"
                type="text"
                inputMode="decimal"
                placeholder={t('addBook.fieldPrice')}
                disabled={isBusy || Boolean(loadError)}
                aria-invalid={Boolean(errors.price)}
                className="h-11 bg-card px-3"
                {...register('price')}
              />
              {errors.price ? (
                <p role="alert" className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-1 h-11 w-full text-base"
              disabled={isBusy || Boolean(loadError)}
            >
              {isSubmitting ? t('editBook.saving') : t('editBook.save')}
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}
