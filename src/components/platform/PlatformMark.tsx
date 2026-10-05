import { socialPlatforms } from '../../data/mockData'

const abbreviations: Record<string, string> = {
  instagram: 'IG',
  facebook: 'f',
  youtube: 'YT',
  linkedin: 'in',
  whatsapp: 'WA',
}

interface PlatformMarkProps {
  platformId: string
  large?: boolean
}

export function PlatformMark({ platformId, large = false }: PlatformMarkProps) {
  const platform = socialPlatforms.find(item => item.id === platformId)
  if (!platform) return null

  return (
    <span
      className={`platform-mark${large ? ' large' : ''}`}
      style={{ backgroundColor: platform.color }}
      role="img"
      aria-label={platform.name}
      title={platform.name}
    >
      {abbreviations[platform.id] ?? platform.name.slice(0, 2).toUpperCase()}
    </span>
  )
}
