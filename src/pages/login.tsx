import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/logo.svg'
import padlock from '@/assets/padlock.png'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createSignInSchema, type SignInFormValues } from '@/schemas/sign-in'
import { signIn } from '@/services/auth'
import type { AuthSession } from '@/types/auth'

type LoginPageProps = {
  onLogin: (session: AuthSession) => void
  onNewUser: () => void
}

export function LoginPage({ onLogin, onNewUser }: Readonly<LoginPageProps>) {
  const { t } = useTranslation()
  const signInSchema = useMemo(() => createSignInSchema(t), [t])
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
          error_ instanceof Error ? error_.message : t('signIn.unableToSignIn'),
      })
    }
  }

  return (
    <main className="relative min-h-svh bg-background">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full max-w-88 flex-col gap-8"
          >
            <img src={logo} alt={t('app.logoAlt')} className="size-14 rounded-md" />

            <div className="flex flex-col gap-5">
              <h1 className="text-left text-[1.75rem] leading-tight font-bold tracking-tight text-foreground">
                {t('signIn.title')}
              </h1>

              <FieldSet className="min-w-0 gap-3 border-0 p-0">
                <FieldGroup className="gap-3">
                  <Field data-invalid={Boolean(errors.username) || undefined}>
                    <FieldLabel htmlFor="username" className="sr-only">
                      {t('signIn.username')}
                    </FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder={t('signIn.username')}
                      autoComplete="username"
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.username)}
                      className="h-11 bg-card px-3"
                      {...register('username')}
                    />
                    <FieldError errors={[errors.username]} />
                  </Field>

                  <Field data-invalid={Boolean(errors.password) || undefined}>
                    <FieldLabel htmlFor="password" className="sr-only">
                      {t('signIn.password')}
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('signIn.password')}
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.password)}
                      className="h-11 bg-card px-3"
                      {...register('password')}
                    />
                    <FieldError errors={[errors.password]} />
                  </Field>
                </FieldGroup>
              </FieldSet>

              {errors.root ? <FieldError>{errors.root.message}</FieldError> : null}

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('signIn.signingIn') : t('signIn.login')}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 w-full bg-card text-base"
                disabled={isSubmitting}
                onClick={onNewUser}
              >
                {t('signIn.newUser')}
              </Button>
            </div>
          </form>
        </section>

        <section
          aria-hidden="true"
          className="hidden items-center justify-center p-10 lg:flex"
        >
          <div className="relative size-[min(22rem,70vw)] drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)]">
            <div className="absolute inset-[16%] rounded-full bg-card" />
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
