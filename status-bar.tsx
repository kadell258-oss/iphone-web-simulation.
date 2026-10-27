'use client'

import { Plane, Wifi } from 'lucide-react'
import type { StatusTone } from '@/lib/phone/apps'
import { formatTime, useNow } from '@/lib/phone/use-now'
import { cn } from '@/lib/utils'
import { usePhone } from './phone-context'

function SignalBars({ active }: { active: boolean }) {
  return (
    <span className="flex h-[12px] items-end gap-[1.5px]" aria-hidden="true">
      {[4, 6.5, 9, 12].map((h, i) => (
        <span
          key={h}
          className={cn('w-[3px] rounded-[1px] bg-current', !active && 'opacity-30', active && i === 3 && 'opacity-30')}
          style={{ height: h }}
        />
      ))}
    </span>
  )
}

function Battery({ level = 0.82 }: { level?: number }) {
  return (
    <span className="flex items-center gap-[1px]" aria-hidden="true">
      <span className="relative flex h-[13px] w-[25px] items-center rounded-[4px] border border-current/40 p-[1.5px]">
        <span className="h-full rounded-[2px] bg-current" style={{ width: `${level * 100}%` }} />
      </span>
      <span className="h-[4px] w-[1.5px] rounded-r-full bg-current/40" />
    </span>
  )
}

export function StatusBar({ tone }: { tone: StatusTone }) {
  const now = useNow()
  const { locked, airplane, cellular, wifi, controlCenterOpen, activeApp, appVisible } = usePhone()
  const showCarrier = locked || controlCenterOpen
  const cameraInUse = activeApp === 'camera' && appVisible && !locked

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 z-50 flex h-[54px] items-center justify-between px-[34px] pt-[6px] transition-colors duration-300',
        tone === 'white' ? 'text-white' : 'text-black',
      )}
    >
      <span className="w-[100px] text-center text-[17px] font-semibold tracking-tight">
        {showCarrier ? (
          <span className="text-[15px]">{airplane ? '' : 'Telkomsel'}</span>
        ) : (
          formatTime(now)
        )}
      </span>
      <span className="flex w-[100px] items-center justify-center gap-[6px]">
        {cameraInUse && <span className="absolute right-[128px] size-[6px] rounded-full bg-[#34c759]" />}
        {airplane ? <Plane className="size-[15px] fill-current" /> : <SignalBars active={cellular} />}
        {wifi && <Wifi className="size-[17px]" strokeWidth={2.6} />}
        <Battery />
      </span>
    </div>
  )
}
