export type Person = {
  id: string
  firstName: string
  lastName: string
  address: string
  gender: string
  enabled: boolean
  profileUrl: string
  photoUrl: string
}

export type CreatePersonPayload = {
  firstName: string
  lastName: string
  address: string
  gender: string
  enabled: boolean
  profileUrl: string
  photoUrl: string
}
