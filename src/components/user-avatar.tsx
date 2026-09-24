import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { cn } from 'cn'

type UserAvatarProps = {
  photoUrl?: string | null
  name: string
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return '?'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export function UserAvatar({
  photoUrl,
  name,
  size = 'default',
  className,
}: Readonly<UserAvatarProps>) {
  const trimmedUrl = photoUrl?.trim() ?? ''

  return (
    <Avatar size={size} className={cn(className)}>
      {trimmedUrl ? <AvatarImage src={trimmedUrl} alt={name} /> : null}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
