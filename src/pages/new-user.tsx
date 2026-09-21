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
import { createPerson } from '@/services/persons'

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
      firstName: '',
      lastName: '',
      address: '',
      gender: '',
      enabled: true,
      profileUrl: '',
      photoUrl: '',
    },
  })

  async function onSubmit(values: NewUserFormValues) {
    try {
      await createPerson({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        address: values.address.trim(),
        gender: values.gender.trim(),
        enabled: values.enabled,
        profileUrl: values.profileUrl.trim(),
        photoUrl: values.photoUrl.trim(),
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

                <Field data-invalid={Boolean(errors.firstName) || undefined}>
                  <FieldLabel htmlFor="firstName" className="sr-only">
                    {t('newUser.fieldFirstName')}
                  </FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={t('newUser.fieldFirstName')}
                    autoComplete="given-name"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.firstName)}
                    className="h-11 bg-card px-3"
                    {...register('firstName')}
                  />
                  <FieldError errors={[errors.firstName]} />
                </Field>

                <Field data-invalid={Boolean(errors.lastName) || undefined}>
                  <FieldLabel htmlFor="lastName" className="sr-only">
                    {t('newUser.fieldLastName')}
                  </FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t('newUser.fieldLastName')}
                    autoComplete="family-name"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.lastName)}
                    className="h-11 bg-card px-3"
                    {...register('lastName')}
                  />
                  <FieldError errors={[errors.lastName]} />
                </Field>

                <Field data-invalid={Boolean(errors.address) || undefined}>
                  <FieldLabel htmlFor="address" className="sr-only">
                    {t('newUser.fieldAddress')}
                  </FieldLabel>
                  <Input
                    id="address"
                    type="text"
                    placeholder={t('newUser.fieldAddress')}
                    autoComplete="street-address"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.address)}
                    className="h-11 bg-card px-3"
                    {...register('address')}
                  />
                  <FieldError errors={[errors.address]} />
                </Field>

                <Field data-invalid={Boolean(errors.gender) || undefined}>
                  <FieldLabel htmlFor="gender" className="sr-only">
                    {t('newUser.fieldGender')}
                  </FieldLabel>
                  <Input
                    id="gender"
                    type="text"
                    placeholder={t('newUser.fieldGender')}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.gender)}
                    className="h-11 bg-card px-3"
                    {...register('gender')}
                  />
                  <FieldError errors={[errors.gender]} />
                </Field>

                <Field data-invalid={Boolean(errors.profileUrl) || undefined}>
                  <FieldLabel htmlFor="profileUrl" className="sr-only">
                    {t('newUser.fieldProfileUrl')}
                  </FieldLabel>
                  <Input
                    id="profileUrl"
                    type="text"
                    placeholder={t('newUser.fieldProfileUrl')}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.profileUrl)}
                    className="h-11 bg-card px-3"
                    {...register('profileUrl')}
                  />
                  <FieldError errors={[errors.profileUrl]} />
                </Field>

                <Field data-invalid={Boolean(errors.photoUrl) || undefined}>
                  <FieldLabel htmlFor="photoUrl" className="sr-only">
                    {t('newUser.fieldPhotoUrl')}
                  </FieldLabel>
                  <Input
                    id="photoUrl"
                    type="text"
                    placeholder={t('newUser.fieldPhotoUrl')}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.photoUrl)}
                    className="h-11 bg-card px-3"
                    {...register('photoUrl')}
                  />
                  <FieldError errors={[errors.photoUrl]} />
                </Field>

                <Field orientation="horizontal" className="items-center gap-2">
                  <input
                    id="enabled"
                    type="checkbox"
                    disabled={isSubmitting}
                    className="size-4 rounded border border-input accent-primary"
                    {...register('enabled')}
                  />
                  <FieldLabel htmlFor="enabled" className="font-normal text-foreground">
                    {t('newUser.fieldEnabled')}
                  </FieldLabel>
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
