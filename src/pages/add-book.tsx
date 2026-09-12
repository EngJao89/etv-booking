import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import logo from '@/assets/logo.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addBookSchema, parsePrice, type AddBookFormValues } from '@/schemas/add-book'
import type { Book } from '@/types/book'

type AddBookPageProps = {
  onHome: () => void
  onAdd: (book: Omit<Book, 'id'>) => void
}

export function AddBookPage({ onHome, onAdd }: Readonly<AddBookPageProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddBookFormValues>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      title: '',
      author: '',
      releaseDate: '',
      price: '',
    },
  })

  function onSubmit(values: AddBookFormValues) {
    onAdd({
      title: values.title,
      author: values.author,
      releaseDate: values.releaseDate,
      price: parsePrice(values.price),
    })
  }

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-16">
        <section className="flex flex-col items-start gap-8">
          <img src={logo} alt="ETV" className="size-24 rounded-md" />

          <div className="flex max-w-sm flex-col gap-3">
            <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-neutral-950">
              Add New Book
            </h1>
            <p className="text-neutral-500">
              Enter the book information and click on
              <br />
              'Add'!
            </p>
          </div>

          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-primary"
            onClick={onHome}
          >
            <ArrowLeftIcon className="size-4" />
            Home
          </Button>
        </section>

        <section className="flex justify-center lg:justify-end">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full max-w-md flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="sr-only">
                Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Title"
                aria-invalid={Boolean(errors.title)}
                className="h-11 bg-white px-3"
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
                Author
              </label>
              <Input
                id="author"
                type="text"
                placeholder="Author"
                aria-invalid={Boolean(errors.author)}
                className="h-11 bg-white px-3"
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
                Release date
              </label>
              <Input
                id="releaseDate"
                type="date"
                lang="pt-BR"
                aria-invalid={Boolean(errors.releaseDate)}
                className="h-11 bg-white px-3"
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
                Price
              </label>
              <Input
                id="price"
                type="text"
                inputMode="decimal"
                placeholder="Price"
                aria-invalid={Boolean(errors.price)}
                className="h-11 bg-white px-3"
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
              disabled={isSubmitting}
            >
              Add
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}
