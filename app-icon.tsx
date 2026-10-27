'use client'

import type { MouseEvent } from 'react'
import { APPS, type AppId } from '@/lib/phone/apps'
import { cn } from '@/lib/utils'
import { usePhone, type Origin } from './phone-context'

export function originFromEvent(event: MouseEvent<HTMLElement>): Origin | undefined {
  const screen = event.currentTarget.closest('[data-phone-screen]')
  if (!screen) return undefined
  const s = screen.getBoundingClientRect()
  const r = event.currentTarget.getBoundingClientRect()
  return {
    x: ((r.left + r.width / 2 - s.left) / s.width) * 100,
    y: ((r.top + r.height / 2 - s.top) / s.height) * 100,
  }
}

export function AppGlyph({ id, size = 62 }: { id: AppId; size?: number }) {
  const app = APPS[id]
  const Icon = app.icon
  return (
    <span
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-[22.5%] shadow-[0_4px_12px_rgba(0,0,0,0.25)]',
        app.tileClassName,
      )}
      style={{ width: size, height: size }}
    >
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/25 to-transparent opacity-60" />
      <Icon className={cn('relative', app.iconClassName)} style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={1.8} />
    </span>
  )
}

export function AppIcon({ id, showLabel = true }: { id: AppId; showLabel?: boolean }) {
  const { openApp } = usePhone()
  const app = APPS[id]
  return (
    <button
      type="button"
      onClick={(e) => openApp(id, originFromEvent(e))}
      className="group flex flex-col items-center gap-1.5 outline-none"
      aria-label={`Buka ${app.name}`}
    >
      <span className="transition-transform duration-200 ease-out group-hover:scale-[1.06] group-active:scale-90 group-active:brightness-75 group-focus-visible:ring-2 group-focus-visible:ring-white rounded-[22.5%]">
        <AppGlyph id={id} />
      </span>
      {showLabel && (
        <span className="text-[12px] leading-none font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
          {app.name}
        </span>
      )}
    </button>
  )
}
