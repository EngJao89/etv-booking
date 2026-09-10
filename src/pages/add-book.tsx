import { ArrowLeftIcon } from 'lucide-react'
import logo from '@/assets/logo.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Book } from '@/types/book'

type AddBookPageProps = {
  onHome: () => void
  onAdd: (book: Omit<Book, 'id'>) => void
}

function readInput(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name)
  if (!(field instanceof HTMLInputElement)) return ''
  return field.value.trim()
}

function parsePrice(value: string) {
  const normalized = value.replace(/\s/g, '').replace('R$', '').replace(',', '.')
  return Number(normalized)
}

export function AddBookPage({ onHome, onAdd }: Readonly<AddBookPageProps>) {
  function handleSubmit(event: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    event.preventDefault()

    const form = event.currentTarget
    const title = readInput(form, 'title')
    const author = readInput(form, 'author')
    const releaseDate = readInput(form, 'releaseDate')
    const price = parsePrice(readInput(form, 'price'))

    if (!title || !author || !releaseDate || !Number.isFinite(price)) return

    onAdd({ title, author, price, releaseDate })
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
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-3"
          >
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Title"
              required
              className="h-11 bg-white px-3"
            />

            <label htmlFor="author" className="sr-only">
              Author
            </label>
            <Input
              id="author"
              name="author"
              type="text"
              placeholder="Author"
              required
              className="h-11 bg-white px-3"
            />

            <label htmlFor="releaseDate" className="sr-only">
              Release date
            </label>
            <Input
              id="releaseDate"
              name="releaseDate"
              type="date"
              lang="pt-BR"
              required
              className="h-11 bg-white px-3"
            />

            <label htmlFor="price" className="sr-only">
              Price
            </label>
            <Input
              id="price"
              name="price"
              type="text"
              inputMode="decimal"
              placeholder="Price"
              required
              className="h-11 bg-white px-3"
            />

            <Button type="submit" size="lg" className="mt-1 h-11 w-full text-base">
              Add
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}
