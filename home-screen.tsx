'use client'

import Image from 'next/image'
import { CloudSun, Search } from 'lucide-react'
import { DOCK, HOME_GRID } from '@/lib/phone/apps'
import { useNow } from '@/lib/phone/use-now'
import { cn } from '@/lib/utils'
import { AppIcon, originFromEvent } from './app-icon'
import { usePhone } from './phone-context'

function WeatherWidget() {
  const { openApp } = usePhone()
  return (
    <button
      type="button"
      onClick={(e) => openApp('weather', originFromEvent(e))}
      className="flex aspect-square flex-col rounded-[22px] bg-gradient-to-b from-[#3b8fe8] to-[#1d5fc4] p-3.5 text-left text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-95"
      aria-label="Widget Cuaca: Jakarta 31 derajat, cerah berawan"
    >
      <span className="text-[14px] font-semibold">Jakarta</span>
      <span className="text-[42px] leading-none font-light">31°</span>
      <span className="mt-auto">
        <CloudSun className="size-5 fill-yellow-300 text-yellow-300" />
        <span className="mt-1 block text-[12px] font-semibold">Cerah Berawan</span>
        <span className="block text-[12px] font-medium opacity-90">T:33° R:25°</span>
      </span>
    </button>
  )
}

function CalendarWidget() {
  const now = useNow()
  const weekday = now ? new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(now) : ''
  return (
    <div className="flex aspect-square flex-col rounded-[22px] bg-white p-3.5 text-black shadow-lg">
      <span className="text-[12px] font-bold tracking-wide text-[#ff3b30] uppercase">{weekday}</span>
      <span className="text-[42px] leading-none font-light">{now?.getDate() ?? ''}</span>
      <span className="mt-auto flex gap-1.5">
        <span className="w-[3px] rounded-full bg-[#5856d6]" />
        <span>
          <span className="block text-[12px] leading-tight font-semibold">Ngopi dengan Rani</span>
          <span className="block text-[11px] text-neutral-500">17.00 – 18.30</span>
        </span>
      </span>
    </div>
  )
}

export function HomeScreen() {
  const { locked, activeApp, appVisible } = usePhone()
  const appOpen = activeApp !== null && appVisible

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image src="/images/wallpaper.png" alt="" fill sizes="400px" className="object-cover" />
      <div
        className={cn(
          'relative flex h-full flex-col px-[26px] pt-[66px] pb-[14px] transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(.32,.72,0,1)]',
          locked && 'scale-[1.15] opacity-0',
          appOpen && 'scale-[0.92] blur-[2px] brightness-75',
        )}
        aria-hidden={locked || appOpen}
      >
        <div className="grid grid-cols-2 gap-[22px]">
          <WeatherWidget />
          <CalendarWidget />
        </div>

        <div className="mt-7 grid grid-cols-4 gap-x-[22px] gap-y-6">
          {HOME_GRID.map((id) => (
            <AppIcon key={id} id={id} />
          ))}
        </div>

        <div className="mt-auto flex justify-center pb-4">
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-xl">
            <Search className="size-3.5" strokeWidth={2.5} />
            Cari
          </span>
        </div>

        <nav
          aria-label="Dock"
          className="-mx-[12px] flex justify-between rounded-[38px] bg-white/25 px-[17px] py-[16px] backdrop-blur-2xl"
        >
          {DOCK.map((id) => (
            <AppIcon key={id} id={id} showLabel={false} />
          ))}
        </nav>
      </div>
    </div>
  )
}
