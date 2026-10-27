'use client'

import Image from 'next/image'
import { useRef, useState, type PointerEvent } from 'react'
import { Camera, Flashlight, Lock, LockOpen, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { TRACKS } from '@/lib/phone/data'
import { formatLongDate, formatTime, useNow } from '@/lib/phone/use-now'
import { cn } from '@/lib/utils'
import { AppGlyph } from './app-icon'
import { usePhone } from './phone-context'

const UNLOCK_THRESHOLD = 0.22

export function LockScreen() {
  const now = useNow()
  const { locked, unlock, openApp, flashlight, toggle, playing, trackIndex, togglePlay, skip } = usePhone()
  const [drag, setDrag] = useState(0)
  const start = useRef<{ y: number; h: number } | null>(null)
  const track = TRACKS[trackIndex]

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    start.current = { y: e.clientY, h: e.currentTarget.getBoundingClientRect().height }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return
    const d = Math.max(0, (start.current.y - e.clientY) / start.current.h)
    if (d > 0.02 && !e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId)
    setDrag(d)
  }
  const onPointerEnd = () => {
    if (drag > UNLOCK_THRESHOLD) unlock()
    start.current = null
    setDrag(0)
  }

  const dragging = drag > 0
  const translate = locked ? -drag * 100 : -100

  return (
    <div
      aria-hidden={!locked}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      className={cn(
        'absolute inset-0 z-30 touch-none overflow-hidden select-none',
        !dragging && 'transition-[transform,opacity] duration-500 ease-[cubic-bezier(.32,.72,0,1)]',
        !locked && 'pointer-events-none',
      )}
      style={{ transform: `translateY(${translate}%)`, opacity: locked ? 1 - drag * 0.6 : 0 }}
    >
      <Image src="/images/wallpaper.png" alt="" fill priority sizes="400px" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />

      <div className="relative flex h-full flex-col items-center pt-[58px] text-white">
        {locked ? <Lock className="size-[18px]" strokeWidth={2.5} /> : <LockOpen className="size-[18px]" strokeWidth={2.5} />}
        <p className="mt-2 text-[20px] font-semibold capitalize opacity-90">{formatLongDate(now)}</p>
        <p className="-mt-1 text-[96px] leading-none font-bold tracking-[-0.04em] tabular-nums [text-shadow:0_2px_20px_rgba(0,0,0,0.15)]">
          {formatTime(now)}
        </p>

        <div className="mt-auto flex w-full flex-col gap-2 px-3">
          {playing && (
            <div className="rounded-[24px] bg-black/30 p-3.5 backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <span className="relative size-11 overflow-hidden rounded-lg">
                  <Image src="/images/album.png" alt="" fill sizes="44px" style={{ filter: `hue-rotate(${track.hue}deg)` }} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">{track.title}</p>
                  <p className="truncate text-[13px] text-white/60">{track.artist}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center gap-10">
                <button type="button" aria-label="Lagu sebelumnya" onClick={() => skip(-1)} onPointerDown={(e) => e.stopPropagation()}>
                  <SkipBack className="size-6 fill-white" />
                </button>
                <button type="button" aria-label={playing ? 'Jeda' : 'Putar'} onClick={togglePlay} onPointerDown={(e) => e.stopPropagation()}>
                  {playing ? <Pause className="size-8 fill-white" /> : <Play className="size-8 fill-white" />}
                </button>
                <button type="button" aria-label="Lagu berikutnya" onClick={() => skip(1)} onPointerDown={(e) => e.stopPropagation()}>
                  <SkipForward className="size-6 fill-white" />
                </button>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => openApp('messages', { x: 50, y: 70 })}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex items-start gap-3 rounded-[24px] bg-white/25 p-3.5 text-left backdrop-blur-2xl transition-transform active:scale-[0.97]"
          >
            <AppGlyph id="messages" size={38} />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold">Rani</span>
                <span className="text-[13px] text-white/70">sekarang</span>
              </span>
              <span className="block truncate text-[15px] leading-snug text-white/90">Oke siap! Jangan telat lagi ya</span>
            </span>
          </button>
        </div>

        <div className="mt-6 flex w-full items-end justify-between px-[46px] pb-[46px]">
          <button
            type="button"
            aria-label="Senter"
            aria-pressed={flashlight}
            onClick={() => toggle('flashlight')}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              'flex size-[50px] items-center justify-center rounded-full backdrop-blur-xl transition-all active:scale-90',
              flashlight ? 'bg-white text-black' : 'bg-black/35 text-white',
            )}
          >
            <Flashlight className="size-[22px]" />
          </button>
          <p className="animate-[shimmer_2.4s_linear_infinite] bg-[linear-gradient(90deg,rgba(255,255,255,0.45)_35%,#fff_50%,rgba(255,255,255,0.45)_65%)] bg-[length:200%_100%] bg-clip-text pb-3 text-[15px] font-medium whitespace-nowrap text-transparent">
            Geser ke atas untuk membuka
          </p>
          <button
            type="button"
            aria-label="Buka Kamera"
            onClick={() => openApp('camera', { x: 85, y: 92 })}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex size-[50px] items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-xl transition-transform active:scale-90"
          >
            <Camera className="size-[22px]" />
          </button>
        </div>
      </div>
    </div>
  )
}
