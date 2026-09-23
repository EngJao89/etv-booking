import { LanguagesIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { setAppLanguage, type AppLanguage } from '@/i18n'

const options: { value: AppLanguage; labelKey: 'language.en' | 'language.pt' }[] = [
  { value: 'en', labelKey: 'language.en' },
  { value: 'pt', labelKey: 'language.pt' },
]

export function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language.startsWith('pt') ? 'pt' : 'en'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 bg-card"
            aria-label={t('language.change')}
          />
        }
      >
        <LanguagesIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setAppLanguage(option.value)}
            className={currentLanguage === option.value ? 'bg-accent' : undefined}
          >
            {t(option.labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
