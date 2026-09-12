import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import logo from '@/assets/logo.svg'
import padlock from '@/assets/padlock.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signInSchema, type SignInFormValues } from '@/schemas/sign-in'
import { signIn } from '@/services/auth'
import type { AuthSession } from '@/types/auth'

type LoginPageProps = {
  onLogin: (session: AuthSession) => void
}

export function LoginPage({ onLogin }: Readonly<LoginPageProps>) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: SignInFormValues) {
    try {
      const session = await signIn(values)
      onLogin(session)
    } catch (error_) {
      setError('root', {
        message:
          error_ instanceof Error ? error_.message : 'Unable to sign in. Please try again.',
      })
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full max-w-88 flex-col gap-8"
          >
            <img src={logo} alt="ETV" className="size-14 rounded-md" />

            <div className="flex flex-col gap-5">
              <h1 className="text-left text-[1.75rem] leading-tight font-bold tracking-tight text-neutral-950">
                Access your Account
              </h1>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.username)}
                    className="h-11 bg-white px-3"
                    {...register('username')}
                  />
                  {errors.username ? (
                    <p role="alert" className="text-sm text-destructive">
                      {errors.username.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.password)}
                    className="h-11 bg-white px-3"
                    {...register('password')}
                  />
                  {errors.password ? (
                    <p role="alert" className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {errors.root ? (
                <p role="alert" className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Login'}
              </Button>
            </div>
          </form>
        </section>

        <section
          aria-hidden="true"
          className="hidden items-center justify-center p-10 lg:flex"
        >
          <div className="relative size-[min(22rem,70vw)] drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)]">
            <div className="absolute inset-[16%] rounded-full bg-white" />
            <img
              src={padlock}
              alt=""
              className="relative z-10 size-full object-contain"
            />
          </div>
        </section>
      </div>
    </main>
  )
}
