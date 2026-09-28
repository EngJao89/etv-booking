import { BookmarkXIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import type { Book } from '@/types/book'

type SavedBooksDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  books: Book[]
  isLoading: boolean
  error: string | null
  removingId: string | null
  onOpenBook: (id: string) => void
  onRemove: (id: string) => void
}

export function SavedBooksDrawer({
  open,
  onOpenChange,
  books,
  isLoading,
  error,
  removingId,
  onOpenBook,
  onRemove,
}: Readonly<SavedBooksDrawerProps>) {
  const { t, i18n } = useTranslation()
  const priceFormatter = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      swipeDirection="right"
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t('books.savedBooks')}</DrawerTitle>
          <DrawerDescription>{t('books.savedBooksDescription')}</DrawerDescription>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {isLoading && books.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('books.savedLoading')}</p>
          ) : null}

          {!isLoading && !error && books.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('books.savedEmpty')}</p>
          ) : null}

          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-3"
            >
              <button
                type="button"
                className="min-w-0 flex-1 cursor-pointer text-left"
                onClick={() => {
                  onOpenBook(book.id)
                  onOpenChange(false)
                }}
              >
                <p className="truncate font-medium text-foreground">{book.title}</p>
                <p className="truncate text-sm text-muted-foreground">{book.author}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {priceFormatter.format(book.price)}
                </p>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={t('books.removeFromSaved', { title: book.title })}
                disabled={removingId === book.id}
                onClick={() => onRemove(book.id)}
              >
                <BookmarkXIcon className="size-4 text-primary" />
              </Button>
            </div>
          ))}
        </div>

        <DrawerFooter>
          <DrawerClose
            render={<Button type="button" variant="outline" className="w-full" />}
          >
            {t('books.closeSavedBooks')}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
