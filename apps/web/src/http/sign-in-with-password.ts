import { api } from './api-client'

interface ISignWithPasswordRequest {
  email: string
  password: string
}

interface ISignWithPasswordResponse {
  token: string
}

export async function signInWithPassword({
  email,
  password,
}: ISignWithPasswordRequest) {
  const response = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<ISignWithPasswordResponse>()

  return response
}
