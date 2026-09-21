export type SignInRequest = {
  username: string
  password: string
}

export type CreateUserRequest = {
  username: string
  password: string
  fullname: string
}

export type SignInResponse = {
  username: string
  authenticated: boolean
  created: number
  expiration: number
  accessToken: string
  refreshToken: string
}

export type AuthSession = {
  username: string
  accessToken: string
  refreshToken: string
}
