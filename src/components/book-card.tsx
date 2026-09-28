import { useState } from 'react'
import {
  BookmarkCheckIcon,
  BookmarkIcon,
  SquarePenIcon,
  Trash2Icon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
  isSaved: boolean
  isSaving: boolean
  onOpen: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onSave: (id: string) => void
}

export function BookCard({
  book,
  isDeleting,
  isSaved,
  isSaving,
  onOpen,
  onEdit,
  onDelete,
  onSave,
}: Readonly<BookCardProps>) {
  const { t, i18n } = useTranslation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
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

  function getSaveLabel() {
    if (isSaving) {
      return t('books.savingBook', { title: book.title })
    }

    if (isSaved) {
      return t('books.bookAlreadySaved', { title: book.title })
    }

    return t('books.saveBook', { title: book.title })
  }

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
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger
              disabled={isDeleting}
              render={
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
                  }}
                />
              }
            >
              <Trash2Icon className="size-4 text-primary" />
            </AlertDialogTrigger>
            <AlertDialogContent
              size="sm"
              onClick={(event) => event.stopPropagation()}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('books.deleteConfirmTitle')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('books.deleteConfirmDescription', { title: book.title })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  {t('books.deleteConfirmCancel')}
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={(event) => {
                    event.stopPropagation()
                    onDelete(book.id)
                    setIsDeleteDialogOpen(false)
                  }}
                >
                  {isDeleting
                    ? t('books.deleting', { title: book.title })
                    : t('books.deleteConfirmAction')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={getSaveLabel()}
            disabled={isSaving || isSaved}
            onClick={(event) => {
              event.stopPropagation()
              onSave(book.id)
            }}
          >
            {isSaved ? (
              <BookmarkCheckIcon className="size-4 text-primary" />
            ) : (
              <BookmarkIcon className="size-4 text-primary" />
            )}
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
