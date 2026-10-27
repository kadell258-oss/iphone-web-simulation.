import {
  Calculator,
  Camera,
  Clock,
  CloudSun,
  Compass,
  Flower2,
  MessageCircle,
  Music,
  Settings,
  StickyNote,
  type LucideIcon,
} from 'lucide-react'

export type AppId =
  | 'camera'
  | 'messages'
  | 'photos'
  | 'settings'
  | 'safari'
  | 'music'
  | 'weather'
  | 'clock'
  | 'calculator'
  | 'notes'

export type StatusTone = 'white' | 'black'

export interface AppDefinition {
  id: AppId
  name: string
  icon: LucideIcon
  iconClassName: string
  tileClassName: string
  statusTone: StatusTone
}

export const APPS: Record<AppId, AppDefinition> = {
  camera: {
    id: 'camera',
    name: 'Kamera',
    icon: Camera,
    tileClassName: 'bg-gradient-to-b from-neutral-300 to-neutral-500',
    iconClassName: 'text-neutral-800',
    statusTone: 'white',
  },
  messages: {
    id: 'messages',
    name: 'Pesan',
    icon: MessageCircle,
    tileClassName: 'bg-gradient-to-b from-[#5ff777] to-[#11c731]',
    iconClassName: 'text-white fill-white',
    statusTone: 'black',
  },
  photos: {
    id: 'photos',
    name: 'Foto',
    icon: Flower2,
    tileClassName: 'bg-white',
    iconClassName: 'text-orange-500',
    statusTone: 'black',
  },
  settings: {
    id: 'settings',
    name: 'Pengaturan',
    icon: Settings,
    tileClassName: 'bg-gradient-to-b from-neutral-400 to-neutral-600',
    iconClassName: 'text-neutral-100',
    statusTone: 'black',
  },
  safari: {
    id: 'safari',
    name: 'Safari',
    icon: Compass,
    tileClassName: 'bg-white',
    iconClassName: 'text-[#1a8cff]',
    statusTone: 'black',
  },
  music: {
    id: 'music',
    name: 'Musik',
    icon: Music,
    tileClassName: 'bg-gradient-to-b from-[#ff5e7a] to-[#fa233b]',
    iconClassName: 'text-white',
    statusTone: 'white',
  },
  weather: {
    id: 'weather',
    name: 'Cuaca',
    icon: CloudSun,
    tileClassName: 'bg-gradient-to-b from-[#4aa8ff] to-[#1666d6]',
    iconClassName: 'text-white',
    statusTone: 'white',
  },
  clock: {
    id: 'clock',
    name: 'Jam',
    icon: Clock,
    tileClassName: 'bg-black ring-1 ring-white/15',
    iconClassName: 'text-white',
    statusTone: 'white',
  },
  calculator: {
    id: 'calculator',
    name: 'Kalkulator',
    icon: Calculator,
    tileClassName: 'bg-gradient-to-b from-neutral-700 to-neutral-900',
    iconClassName: 'text-[#ff9f0a]',
    statusTone: 'white',
  },
  notes: {
    id: 'notes',
    name: 'Catatan',
    icon: StickyNote,
    tileClassName: 'bg-gradient-to-b from-white to-neutral-100',
    iconClassName: 'text-[#f5c400]',
    statusTone: 'black',
  },
}

export const HOME_GRID: AppId[] = ['photos', 'weather', 'clock', 'calculator', 'notes', 'settings']
export const DOCK: AppId[] = ['messages', 'safari', 'music', 'camera']
