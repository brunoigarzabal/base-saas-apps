'use client'

import { FormEvent, useState, useTransition } from 'react'
import Link from 'next/link'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { GithubIcon } from '@/assets'

import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState<{
    success: boolean
    message: string | null
    errors: Record<string, string[]> | null
  }>({
    success: false,
    message: null,
    errors: null,
  })

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const state = await signInWithEmailAndPassword(formData)
      console.log(state)
      setFormState(state)
    })
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      {!formState.success && formState.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{formState.message}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
        {formState.errors?.email && (
          <p className="text-xs text-destructive">{formState.errors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" />
        {formState.errors?.password && (
          <p className="text-xs text-destructive">
            {formState.errors.password}
          </p>
        )}
        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Sign in with email'
        )}
      </Button>

      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-up">Don't have an account? Sign up</Link>
      </Button>

      <Separator />

      <Button variant="outline" className="w-full">
        <GithubIcon className="size-4 mr-2" />
        Sign in with Github
      </Button>
    </form>
  )
}
