'use server'

import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { HTTPError } from 'ky'

const signInWithEmailAndPasswordSchema = z.object({
  email: z.email({ message: 'Please, provide a valid email address' }),
  password: z
    .string()
    .min(6, 'Please, provide a password with at least 6 characters'),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInWithEmailAndPasswordSchema.safeParse({
    email: data.get('email'),
    password: data.get('password'),
  })

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return { success: false, message, errors: null }
    }

    return { success: false, message: 'Something went wrong', errors: null }
  }

  return { success: true, message: null, errors: null }
}
