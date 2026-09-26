import { z } from 'zod'

export function parsePrice(value: string) {
  const normalized = value.replaceAll(/\s/g, '').replace('R$', '').replace(',', '.')
  return Number(normalized)
}

type Translate = (key: string) => string

export function createAddBookSchema(t: Translate) {
  return z.object({
    title: z.string().trim().min(1, t('addBook.titleRequired')),
    author: z.string().trim().min(1, t('addBook.authorRequired')),
    releaseDate: z.string().min(1, t('addBook.releaseDateRequired')),
    price: z
      .string()
      .trim()
      .min(1, t('addBook.priceRequired'))
      .refine((value) => {
        const price = parsePrice(value)
        return Number.isFinite(price) && price > 0
      }, t('addBook.priceInvalid')),
  })
}

export type AddBookFormValues = z.infer<ReturnType<typeof createAddBookSchema>>
