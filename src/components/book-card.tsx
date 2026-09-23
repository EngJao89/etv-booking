import { SquarePenIcon, Trash2Icon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Book } from '@/types/book'

function BookField({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-semibold text-foreground">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

type BookCardProps = {
  book: Book
  isDeleting: boolean
  onOpen: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function BookCard({
  book,
  isDeleting,
  onOpen,
  onEdit,
  onDelete,
}: Readonly<BookCardProps>) {
  const { t, i18n } = useTranslation()
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
    <Card
      role="button"
      tabIndex={0}
      className="cursor-pointer shadow-sm transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label={t('books.viewDetails', { title: book.title })}
      onClick={() => onOpen(book.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(book.id)
        }
      }}
    >
      <CardHeader>
        <BookField label={t('books.title')} value={book.title} />
        <CardAction className="flex flex-col gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={t('books.edit', { title: book.title })}
            onClick={(event) => {
              event.stopPropagation()
              onEdit(book.id)
            }}
          >
            <SquarePenIcon className="size-4 text-primary" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={
              isDeleting
                ? t('books.deleting', { title: book.title })
                : t('books.delete', { title: book.title })
            }
            disabled={isDeleting}
            onClick={(event) => {
              event.stopPropagation()
              onDelete(book.id)
            }}
          >
            <Trash2Icon className="size-4 text-primary" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="gap-4">
        <BookField label={t('books.author')} value={book.author} />
        <BookField label={t('books.price')} value={priceFormatter.format(book.price)} />
        <BookField
          label={t('books.releaseDate')}
          value={dateFormatter.format(new Date(`${book.releaseDate}T00:00:00`))}
        />
      </CardContent>
    </Card>
  )
}
