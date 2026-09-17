import { isAxiosError } from 'axios'
import i18n from '@/i18n'
import { axios } from '@/lib/axios'
import type { Book } from '@/types/book'

export type CreateBookPayload = {
  title: string
  author: string
  price: number
  launchDate: string
}

type BookApiResponse = {
  id: number
  title: string
  author: string
  price: number
  launchDate: string | number | number[]
}

function getApiMessage(data: unknown) {
  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (!data || typeof data !== 'object') {
    return undefined
  }

  if ('message' in data && typeof data.message === 'string' && data.message.trim()) {
    return data.message
  }

  if ('detail' in data && typeof data.detail === 'string' && data.detail.trim()) {
    return data.detail
  }

  if ('title' in data && typeof data.title === 'string' && data.title.trim()) {
    return data.title
  }

  return undefined
}

function getCreateBookErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return i18n.t('addBook.unableToAdd')
  }

  if (!error.response) {
    return i18n.t('addBook.couldNotReachServer')
  }

  const { status, data } = error.response

  if (status === 401 || status === 403) {
    return i18n.t('addBook.unauthorized')
  }

  return getApiMessage(data) ?? i18n.t('addBook.unableToAdd')
}

function toReleaseDate(launchDate: BookApiResponse['launchDate']) {
  if (typeof launchDate === 'string') {
    return launchDate.slice(0, 10)
  }

  if (typeof launchDate === 'number') {
    return new Date(launchDate).toISOString().slice(0, 10)
  }

  if (Array.isArray(launchDate) && launchDate.length >= 3) {
    const [year, month, day] = launchDate
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  return ''
}

export function mapBookFromApi(data: BookApiResponse): Book {
  return {
    id: String(data.id),
    title: data.title,
    author: data.author,
    price: data.price,
    releaseDate: toReleaseDate(data.launchDate),
  }
}

function getListBooksErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return i18n.t('books.unableToLoad')
  }

  if (!error.response) {
    return i18n.t('books.couldNotReachServer')
  }

  const { status, data } = error.response

  if (status === 401 || status === 403) {
    return i18n.t('books.unauthorized')
  }

  return getApiMessage(data) ?? i18n.t('books.unableToLoad')
}

function isBookApiResponse(value: unknown): value is BookApiResponse {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'id' in value &&
      'title' in value &&
      'author' in value,
  )
}

function extractBookList(data: unknown): BookApiResponse[] {
  if (Array.isArray(data)) {
    return data.filter(isBookApiResponse)
  }

  if (!data || typeof data !== 'object') {
    return []
  }

  if ('content' in data && Array.isArray(data.content)) {
    return data.content.filter(isBookApiResponse)
  }

  if ('_embedded' in data && data._embedded && typeof data._embedded === 'object') {
    for (const value of Object.values(data._embedded as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        return value.filter(isBookApiResponse)
      }
    }
  }

  return []
}

function getTotalElements(data: unknown) {
  if (!data || typeof data !== 'object') {
    return undefined
  }

  if (
    'page' in data &&
    data.page &&
    typeof data.page === 'object' &&
    'totalElements' in data.page &&
    typeof data.page.totalElements === 'number'
  ) {
    return data.page.totalElements
  }

  if ('totalElements' in data && typeof data.totalElements === 'number') {
    return data.totalElements
  }

  return undefined
}

async function fetchBooksPage(page: number, size: number) {
  const { data } = await axios.get<unknown>('/api/book/v1', {
    params: {
      page,
      size,
      direction: 'asc',
    },
  })

  return {
    books: extractBookList(data).map(mapBookFromApi),
    totalElements: getTotalElements(data),
  }
}

export async function listBooks(): Promise<Book[]> {
  try {
    const firstPage = await fetchBooksPage(0, 12)

    if (
      typeof firstPage.totalElements === 'number' &&
      firstPage.totalElements > firstPage.books.length
    ) {
      const allBooks = await fetchBooksPage(0, firstPage.totalElements)
      return allBooks.books
    }

    return firstPage.books
  } catch (error) {
    throw new Error(getListBooksErrorMessage(error))
  }
}

export async function createBook(payload: CreateBookPayload): Promise<Book> {
  try {
    const { data } = await axios.post<BookApiResponse>('/api/book/v1', {
      author: payload.author,
      launchDate: payload.launchDate,
      price: payload.price,
      title: payload.title,
    })

    return mapBookFromApi(data)
  } catch (error) {
    throw new Error(getCreateBookErrorMessage(error))
  }
}
