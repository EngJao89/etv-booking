import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/logo.svg'
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
import { createNewUserSchema, type NewUserFormValues } from '@/schemas/new-user'
import { createUser } from '@/services/auth'

type NewUserPageProps = {
  onBackToLogin: () => void
  onCreated: () => void
}

export function NewUserPage({ onBackToLogin, onCreated }: Readonly<NewUserPageProps>) {
  const { t } = useTranslation()
  const newUserSchema = useMemo(() => createNewUserSchema(t), [t])
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      username: '',
      password: '',
      fullname: '',
    },
  })

  async function onSubmit(values: NewUserFormValues) {
    try {
      await createUser({
        username: values.username.trim(),
        password: values.password,
        fullname: values.fullname.trim(),
      })
      onCreated()
    } catch (error_) {
      setError('root', {
        message:
          error_ instanceof Error ? error_.message : t('newUser.unableToCreate'),
      })
    }
  }

  return (
    <main className="relative min-h-svh bg-background">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-16">
        <section className="flex flex-col items-start gap-8">
          <img src={logo} alt={t('app.logoAlt')} className="size-24 rounded-md" />

          <div className="flex max-w-sm flex-col gap-3">
            <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-foreground">
              {t('newUser.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('newUser.descriptionLine1')}
              <br />
              {t('newUser.descriptionLine2')}
            </p>
          </div>

          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-primary"
            onClick={onBackToLogin}
          >
            <ArrowLeftIcon className="size-4" />
            {t('newUser.backToLogin')}
          </Button>
        </section>

        <section className="flex justify-center lg:justify-end">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full max-w-md flex-col gap-3"
          >
            <FieldSet className="min-w-0 gap-3 border-0 p-0">
              <FieldGroup className="gap-3">
                {errors.root ? <FieldError>{errors.root.message}</FieldError> : null}

                <Field data-invalid={Boolean(errors.username) || undefined}>
                  <FieldLabel htmlFor="username" className="sr-only">
                    {t('newUser.fieldUsername')}
                  </FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder={t('newUser.fieldUsername')}
                    autoComplete="username"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.username)}
                    className="h-11 bg-card px-3"
                    {...register('username')}
                  />
                  <FieldError errors={[errors.username]} />
                </Field>

                <Field data-invalid={Boolean(errors.fullname) || undefined}>
                  <FieldLabel htmlFor="fullname" className="sr-only">
                    {t('newUser.fieldFullname')}
                  </FieldLabel>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder={t('newUser.fieldFullname')}
                    autoComplete="name"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.fullname)}
                    className="h-11 bg-card px-3"
                    {...register('fullname')}
                  />
                  <FieldError errors={[errors.fullname]} />
                </Field>

                <Field data-invalid={Boolean(errors.password) || undefined}>
                  <FieldLabel htmlFor="password" className="sr-only">
                    {t('newUser.fieldPassword')}
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('newUser.fieldPassword')}
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.password)}
                    className="h-11 bg-card px-3"
                    {...register('password')}
                  />
                  <FieldError errors={[errors.password]} />
                </Field>
              </FieldGroup>
            </FieldSet>

            <Button
              type="submit"
              size="lg"
              className="mt-1 h-11 w-full text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('newUser.creating') : t('newUser.create')}
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}
