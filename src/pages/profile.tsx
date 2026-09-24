import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon, ChevronDownIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/logo.svg'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from 'cn'
import { savePersonIdForUser } from '@/lib/person-id'
import {
  PERSON_GENDERS,
  createProfileSchema,
  normalizePersonGender,
  type PersonGender,
  type ProfileFormValues,
} from '@/schemas/profile'
import {
  PersonNotFoundError,
  createPerson,
  resolveProfilePerson,
  updatePerson,
} from '@/services/persons'

type ProfilePageProps = {
  username: string
  onHome: () => void
}

type ProfileMode = 'edit' | 'create'

export function ProfilePage({ username, onHome }: Readonly<ProfilePageProps>) {
  const { t } = useTranslation()
  const profileSchema = useMemo(() => createProfileSchema(t), [t])
  const [personId, setPersonId] = useState<string | null>(null)
  const [mode, setMode] = useState<ProfileMode>('edit')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      gender: undefined,
      enabled: true,
      profileUrl: '',
      photoUrl: '',
    },
  })

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      setIsLoading(true)
      setLoadError(null)
      setMode('edit')

      try {
        const person = await resolveProfilePerson(username)
        if (cancelled) {
          return
        }

        setPersonId(person.id)
        setMode('edit')
        savePersonIdForUser(username, person.id)
        reset({
          firstName: person.firstName,
          lastName: person.lastName,
          address: person.address,
          gender: normalizePersonGender(person.gender) || undefined,
          enabled: person.enabled,
          profileUrl: person.profileUrl,
          photoUrl: person.photoUrl,
        })
      } catch (error_) {
        if (cancelled) {
          return
        }

        setPersonId(null)

        if (error_ instanceof PersonNotFoundError) {
          setMode('create')
          setLoadError(null)
          reset({
            firstName: '',
            lastName: '',
            address: '',
            gender: undefined,
            enabled: true,
            profileUrl: '',
            photoUrl: '',
          })
          return
        }

        setMode('edit')
        setLoadError(
          error_ instanceof Error ? error_.message : t('profile.unableToLoad'),
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [username, reset, t])

  async function onSubmit(values: ProfileFormValues) {
    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      address: values.address.trim(),
      gender: values.gender,
      enabled: values.enabled,
      profileUrl: values.profileUrl.trim(),
      photoUrl: values.photoUrl.trim(),
    }

    try {
      if (mode === 'create' || !personId) {
        const person = await createPerson(payload)
        setPersonId(person.id)
        setMode('edit')
        savePersonIdForUser(username, person.id)
        onHome()
        return
      }

      const person = await updatePerson({
        id: personId,
        ...payload,
      })
      setPersonId(person.id)
      savePersonIdForUser(username, person.id)
      onHome()
    } catch (error_) {
      let fallbackMessage = t('profile.unableToSave')
      if (mode === 'create') {
        fallbackMessage = t('profile.unableToCreate')
      }

      setError('root', {
        message: error_ instanceof Error ? error_.message : fallbackMessage,
      })
    }
  }

  const isBusy = isLoading || isSubmitting
  const isFormLocked = isBusy || Boolean(loadError)
  const isCreateMode = mode === 'create'

  function getSubmitLabel() {
    if (isCreateMode) {
      return isSubmitting ? t('profile.creating') : t('profile.create')
    }

    return isSubmitting ? t('profile.saving') : t('profile.save')
  }

  const descriptionLine1 = isCreateMode
    ? t('profile.createDescriptionLine1')
    : t('profile.descriptionLine1')
  const descriptionLine2 = isCreateMode
    ? t('profile.createDescriptionLine2')
    : t('profile.descriptionLine2')

  return (
    <main className="relative min-h-svh bg-background">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <div className="mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-16">
        <section className="flex flex-col items-start gap-8">
          <img src={logo} alt={t('app.logoAlt')} className="size-24 rounded-md" />

          <div className="flex max-w-sm flex-col gap-3">
            <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-foreground">
              {t('profile.title')}
            </h1>
            <p className="text-muted-foreground">
              {descriptionLine1}
              <br />
              {descriptionLine2}
            </p>
          </div>

          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-primary"
            onClick={onHome}
          >
            <ArrowLeftIcon className="size-4" />
            {t('profile.home')}
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
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">{t('profile.loading')}</p>
                ) : null}
                {isCreateMode && !isLoading ? (
                  <p className="text-sm text-muted-foreground">{t('profile.notFound')}</p>
                ) : null}
                {loadError ? <FieldError>{loadError}</FieldError> : null}
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
                    disabled={isFormLocked}
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
                    disabled={isFormLocked}
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
                    disabled={isFormLocked}
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
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => {
                      function genderLabel(value: ProfileFormValues['gender'] | undefined) {
                        if (value === 'Male') {
                          return t('newUser.genderMale')
                        }
                        if (value === 'Female') {
                          return t('newUser.genderFemale')
                        }
                        return null
                      }

                      const selectedLabel = genderLabel(field.value)

                      return (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            disabled={isFormLocked}
                            render={
                              <Button
                                id="gender"
                                type="button"
                                variant="outline"
                                aria-invalid={Boolean(errors.gender)}
                                className={cn(
                                  'h-11 w-full justify-between bg-card px-3 font-normal shadow-xs dark:bg-input/30',
                                  !selectedLabel && 'text-muted-foreground',
                                )}
                              />
                            }
                          >
                            <span>{selectedLabel ?? t('newUser.fieldGender')}</span>
                            <ChevronDownIcon className="size-4 opacity-60" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="w-(--anchor-width)"
                          >
                            <DropdownMenuRadioGroup
                              value={field.value ?? ''}
                              onValueChange={(value) => {
                                if (
                                  PERSON_GENDERS.includes(value as PersonGender)
                                ) {
                                  field.onChange(value as PersonGender)
                                }
                              }}
                            >
                              <DropdownMenuRadioItem value="Male">
                                {t('newUser.genderMale')}
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="Female">
                                {t('newUser.genderFemale')}
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    }}
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
                    disabled={isFormLocked}
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
                    disabled={isFormLocked}
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
                    disabled={isFormLocked}
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
              disabled={isFormLocked}
            >
              {getSubmitLabel()}
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}
