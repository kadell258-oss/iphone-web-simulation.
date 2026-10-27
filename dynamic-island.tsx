'use client'

import Image from 'next/image'
import { TRACKS } from '@/lib/phone/data'
import { cn } from '@/lib/utils'
import { usePhone } from './phone-context'

export function DynamicIsland() {
  const { playing, activeApp, appVisible, locked, trackIndex, openApp, screenOff } = usePhone()
  const expanded = playing && !locked && !screenOff && !(activeApp === 'music' && appVisible)
  const track = TRACKS[trackIndex]

  return (
    <button
      type="button"
      onClick={() => expanded && openApp('music', { x: 50, y: 3 })}
      aria-label={expanded ? `Sedang diputar: ${track.title}. Buka Musik` : 'Dynamic Island'}
      tabIndex={expanded ? 0 : -1}
      className={cn(
        'absolute top-[11px] left-1/2 z-[60] flex h-[37px] -translate-x-1/2 items-center justify-between overflow-hidden rounded-full bg-black px-[7px] transition-[width] duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]',
        expanded ? 'w-[230px] cursor-pointer' : 'w-[126px] cursor-default',
      )}
    >
      <span
        className={cn(
          'relative size-[24px] shrink-0 overflow-hidden rounded-[7px] transition-opacity duration-300',
          expanded ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Image src="/images/album.png" alt="" fill sizes="24px" className="object-cover" style={{ filter: `hue-rotate(${track.hue}deg)` }} />
      </span>
      <span
        className={cn('flex h-[14px] items-center gap-[2px] pr-[6px] transition-opacity duration-300', expanded ? 'opacity-100' : 'opacity-0')}
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-[2.5px] origin-center rounded-full bg-[#ff5e7a] animate-[eq_0.9s_ease-in-out_infinite]"
            style={{ height: 14, animationDelay: `${i * 0.13}s` }}
          />
        ))}
      </span>
      <span
        className={cn(
          'absolute top-1/2 right-[22px] size-[11px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#2b3550,#0a0c14_70%)] transition-opacity',
          expanded ? 'opacity-0' : 'opacity-100',
        )}
        aria-hidden="true"
      />
    </button>
  )
}
