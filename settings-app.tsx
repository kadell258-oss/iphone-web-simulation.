'use client'

import type { ReactNode } from 'react'
import {
  Accessibility,
  Antenna,
  Battery,
  Bell,
  Bluetooth,
  ChevronRight,
  Hourglass,
  Image as ImageIcon,
  Moon,
  Plane,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Sun,
  SunMedium,
  Volume2,
  Wifi,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { IOSRange, IOSToggle } from '../ios-controls'
import { usePhone } from '../phone-context'

function Row({
  icon: Icon,
  color,
  label,
  value,
  control,
  last,
}: {
  icon: LucideIcon
  color: string
  label: string
  value?: string
  control?: ReactNode
  last?: boolean
}) {
  return (
    <div className="flex min-h-[44px] items-center gap-3 pl-4">
      <span className={cn('flex size-[29px] shrink-0 items-center justify-center rounded-[7px] text-white', color)}>
        <Icon className="size-[18px]" strokeWidth={2.2} />
      </span>
      <div className={cn('flex flex-1 items-center justify-between gap-2 self-stretch pr-4', !last && 'border-b border-[#c6c6c8]/60')}>
        <span className="text-[17px]">{label}</span>
        {control ?? (
          <span className="flex items-center gap-1 text-[17px] text-[#8e8e93]">
            {value}
            <ChevronRight className="size-5 text-[#c4c4c6]" />
          </span>
        )}
      </div>
    </div>
  )
}

function Group({ children }: { children: ReactNode }) {
  return <div className="mx-4 overflow-hidden rounded-[10px] bg-white">{children}</div>
}

export function SettingsApp() {
  const p = usePhone()

  return (
    <div className="h-full overflow-y-auto bg-[#f2f2f7] pt-[54px] pb-12 text-black">
      <h1 className="px-4 pt-2 text-[34px] font-bold tracking-tight">Pengaturan</h1>
      <div className="mx-4 mt-2 mb-5 flex items-center gap-1.5 rounded-[10px] bg-[#7676801f] px-2 py-[7px] text-[17px] text-[#8e8e93]">
        <Search className="size-4" />
        Cari
      </div>

      <Group>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="flex size-[60px] items-center justify-center rounded-full bg-gradient-to-b from-neutral-400 to-neutral-500 text-[24px] font-semibold text-white">
            AP
          </span>
          <span className="flex-1">
            <span className="block text-[20px] font-medium">Adi Pratama</span>
            <span className="block text-[13px] text-neutral-500">Akun Apple, iCloud, dan lainnya</span>
          </span>
          <ChevronRight className="size-5 text-[#c4c4c6]" />
        </div>
      </Group>

      <div className="h-8" />
      <Group>
        <Row
          icon={Plane}
          color="bg-[#ff9500]"
          label="Mode Pesawat"
          control={<IOSToggle label="Mode Pesawat" checked={p.airplane} onChange={() => p.toggle('airplane')} />}
        />
        <Row icon={Wifi} color="bg-[#007aff]" label="Wi-Fi" control={<IOSToggle label="Wi-Fi" checked={p.wifi} onChange={() => p.toggle('wifi')} />} />
        <Row
          icon={Bluetooth}
          color="bg-[#007aff]"
          label="Bluetooth"
          control={<IOSToggle label="Bluetooth" checked={p.bluetooth} onChange={() => p.toggle('bluetooth')} />}
        />
        <Row
          icon={Antenna}
          color="bg-[#34c759]"
          label="Seluler"
          last
          control={<IOSToggle label="Seluler" checked={p.cellular} onChange={() => p.toggle('cellular')} />}
        />
      </Group>

      <div className="h-8" />
      <Group>
        <Row icon={Bell} color="bg-[#ff3b30]" label="Notifikasi" />
        <Row icon={Volume2} color="bg-[#ff2d55]" label="Suara & Haptik" value={`${Math.round(p.volume * 100)}%`} />
        <Row
          icon={Moon}
          color="bg-[#5856d6]"
          label="Fokus"
          control={<IOSToggle label="Fokus" checked={p.focus} onChange={() => p.toggle('focus')} />}
        />
        <Row icon={Hourglass} color="bg-[#5856d6]" label="Durasi Layar" last />
      </Group>

      <p className="mx-8 mt-8 mb-1.5 text-[13px] text-[#6d6d72] uppercase">Kecerahan</p>
      <Group>
        <div className="flex items-center gap-3 px-4 py-3">
          <Sun className="size-4 text-[#8e8e93]" />
          <IOSRange
            label="Kecerahan layar"
            value={p.brightness}
            onChange={p.setBrightness}
            className="flex-1"
            trackClassName="bg-[#e5e5ea]"
            fillClassName="bg-[#007aff]"
          />
          <SunMedium className="size-6 text-[#8e8e93]" />
        </div>
      </Group>

      <div className="h-8" />
      <Group>
        <Row icon={Settings} color="bg-[#8e8e93]" label="Umum" />
        <Row icon={SlidersHorizontal} color="bg-[#8e8e93]" label="Pusat Kontrol" />
        <Row icon={Accessibility} color="bg-[#007aff]" label="Aksesibilitas" />
        <Row icon={ImageIcon} color="bg-[#32ade6]" label="Wallpaper" />
        <Row icon={Battery} color="bg-[#34c759]" label="Baterai" value="82%" />
        <Row icon={Shield} color="bg-[#007aff]" label="Privasi & Keamanan" last />
      </Group>
    </div>
  )
}
