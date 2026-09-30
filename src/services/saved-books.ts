import { isAxiosError } from 'axios'
import { translate } from '@/i18n'
import { getApiErrorMessage } from '@/lib/api-error'
import { axios } from '@/lib/axios'
import { mapBookFromApi } from '@/services/books'
import type { Book } from '@/types/book'

type BookApiResponse = {
  id: number
  title: string
  author: string
  price: number
  launchDate: string | number | number[]
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

function getSavedBooksErrorMessage(
  error: unknown,
  fallbackKey:
    | 'books.unableToLoadSaved'
    | 'books.unableToSaveBook'
    | 'books.unableToRemoveSaved',
) {
  if (!isAxiosError(error)) {
    return translate(fallbackKey)
  }

  if (!error.response) {
    return translate('books.couldNotReachServer')
  }

  const { status, data } = error.response

  if (status === 401 || status === 403) {
    return translate('books.unauthorized')
  }

  if (status === 404) {
    return translate('books.savedNotFound')
  }

  return getApiErrorMessage(data) ?? translate(fallbackKey)
}

export async function listSavedBooks(): Promise<Book[]> {
  try {
    const { data } = await axios.get<unknown>('/api/person/v1/me/books')

    if (!Array.isArray(data)) {
      return []
    }

    return data.filter(isBookApiResponse).map(mapBookFromApi)
  } catch (error) {
    throw new Error(getSavedBooksErrorMessage(error, 'books.unableToLoadSaved'))
  }
}

export async function saveBookToMyList(bookId: string): Promise<Book> {
  try {
    const { data } = await axios.post<BookApiResponse>(
      `/api/person/v1/me/books/${encodeURIComponent(bookId)}`,
    )

    return mapBookFromApi(data)
  } catch (error) {
    throw new Error(getSavedBooksErrorMessage(error, 'books.unableToSaveBook'))
  }
}

export async function removeBookFromMyList(bookId: string): Promise<void> {
  try {
    await axios.delete(`/api/person/v1/me/books/${encodeURIComponent(bookId)}`)
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return
    }

    throw new Error(
      getSavedBooksErrorMessage(error, 'books.unableToRemoveSaved'),
    )
  }
}
