import { SquarePenIcon, Trash2Icon } from 'lucide-react'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Book } from '@/types/book'

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

function BookField({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-semibold text-neutral-950">{label}</span>
      <span className="text-neutral-500">{value}</span>
    </div>
  )
}

type BookCardProps = {
  book: Book
  onDelete: (id: string) => void
}

export function BookCard({ book, onDelete }: Readonly<BookCardProps>) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <BookField label="Title:" value={book.title} />
        <CardAction className="flex flex-col gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Edit ${book.title}`}
          >
            <SquarePenIcon className="size-4 text-primary" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete ${book.title}`}
            onClick={() => onDelete(book.id)}
          >
            <Trash2Icon className="size-4 text-primary" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="gap-4">
        <BookField label="Author:" value={book.author} />
        <BookField label="Price:" value={priceFormatter.format(book.price)} />
        <BookField
          label="Release Date:"
          value={dateFormatter.format(new Date(`${book.releaseDate}T00:00:00`))}
        />
      </CardContent>
    </Card>
  )
}
