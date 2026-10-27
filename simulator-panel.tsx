'use client'

import { useEffect } from 'react'
import { Home, Lock, Power, SlidersHorizontal, Smartphone } from 'lucide-react'
import { APPS } from '@/lib/phone/apps'
import { cn } from '@/lib/utils'
import { usePhone } from './phone-context'

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-white/15 bg-white/5 px-1.5 font-mono text-[11px] text-white/80">
      {children}
    </kbd>
  )
}

export function SimulatorPanel() {
  const phone = usePhone()
  const { goHome, pressPower, setControlCenterOpen, controlCenterOpen } = phone

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return
      const key = e.key.toLowerCase()
      if (key === 'h') goHome()
      if (key === 'l') pressPower()
      if (key === 'c') setControlCenterOpen(!controlCenterOpen)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goHome, pressPower, setControlCenterOpen, controlCenterOpen])

  const status = phone.screenOff
    ? 'Layar mati'
    : phone.locked
      ? 'Layar Kunci'
      : phone.controlCenterOpen
        ? 'Control Center'
        : phone.activeApp && phone.appVisible
          ? APPS[phone.activeApp].name
          : 'Layar Utama'

  const actions = [
    { label: 'Layar Utama', icon: Home, onClick: goHome, kbd: 'H' },
    { label: 'Control Center', icon: SlidersHorizontal, onClick: () => setControlCenterOpen(!controlCenterOpen), kbd: 'C', active: controlCenterOpen },
    { label: phone.screenOff ? 'Nyalakan' : 'Kunci', icon: phone.screenOff ? Power : Lock, onClick: pressPower, kbd: 'L' },
  ]

  return (
    <aside className="flex w-full flex-col gap-5 text-white lg:max-w-[340px]">
      <header className="flex flex-col gap-2">
        <span className="flex items-center gap-2 text-[13px] font-medium text-white/50">
          <Smartphone className="size-4" />
          Simulator iPhone
        </span>
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-balance lg:text-[34px]">
          Coba iPhone langsung dari browser
        </h1>
        <p className="hidden text-[15px] leading-relaxed text-white/60 lg:block">
          Geser layar kunci ke atas, buka aplikasi dari layar utama, dan ketuk garis putih di bawah untuk kembali.
        </p>
      </header>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="relative flex size-2.5">
          <span className={cn('absolute inline-flex size-full rounded-full opacity-60', !phone.screenOff && 'animate-ping bg-[#34c759]')} />
          <span className={cn('relative inline-flex size-2.5 rounded-full', phone.screenOff ? 'bg-white/30' : 'bg-[#34c759]')} />
        </span>
        <span className="text-[14px] text-white/60">Layar saat ini</span>
        <span className="ml-auto text-[14px] font-semibold" aria-live="polite">
          {status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {actions.map(({ label, icon: Icon, onClick, kbd, active }) => (
          <button
            key={kbd}
            type="button"
            onClick={onClick}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 text-[13px] font-medium transition-colors',
              active ? 'border-[#0a84ff]/60 bg-[#0a84ff]/15 text-white' : 'border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/10',
            )}
          >
            <Icon className="size-5" />
            <span>{label}</span>
            <Kbd>{kbd}</Kbd>
          </button>
        ))}
      </div>

      <ul className="hidden flex-col gap-3 text-[14px] text-white/60 lg:flex">
        <li className="flex gap-3">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/40" />
          Tarik ke bawah dari pojok kanan atas layar untuk membuka Control Center.
        </li>
        <li className="flex gap-3">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/40" />
          Tombol fisik di sisi bingkai berfungsi: volume naik/turun dan tombol kunci.
        </li>
        <li className="flex gap-3">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/40" />
          Foto dari Kamera tersimpan di aplikasi Foto, dan musik yang diputar tampil di Dynamic Island.
        </li>
      </ul>
    </aside>
  )
}
