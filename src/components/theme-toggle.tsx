import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme, type Theme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const options: { value: Theme; label: string; icon: typeof SunIcon }[] = [
    { value: 'light', label: t('theme.light'), icon: SunIcon },
    { value: 'dark', label: t('theme.dark'), icon: MoonIcon },
    { value: 'system', label: t('theme.system'), icon: MonitorIcon },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 bg-card"
            aria-label={t('theme.change')}
          />
        }
      >
        {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={theme === option.value ? 'bg-accent' : undefined}
            >
              <Icon />
              {option.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
