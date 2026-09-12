import { z } from 'zod'

export function parsePrice(value: string) {
  const normalized = value.replaceAll(/\s/g, '').replace('R$', '').replace(',', '.')
  return Number(normalized)
}

export const addBookSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  author: z.string().trim().min(1, 'Author is required'),
  releaseDate: z.string().min(1, 'Release date is required'),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine((value) => {
      const price = parsePrice(value)
      return Number.isFinite(price) && price > 0
    }, 'Enter a valid price'),
})

export type AddBookFormValues = z.infer<typeof addBookSchema>
