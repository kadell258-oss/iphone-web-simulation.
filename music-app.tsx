'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Cast, Ellipsis, ListMusic, MessageSquareQuote, Pause, Play, SkipBack, SkipForward, Star, Volume1, Volume2 } from 'lucide-react'
import { TRACKS } from '@/lib/phone/data'
import { formatDuration } from '@/lib/phone/use-now'
import { cn } from '@/lib/utils'
import { IOSRange } from '../ios-controls'
import { usePhone } from '../phone-context'

export function MusicApp() {
  const p = usePhone()
  const [showQueue, setShowQueue] = useState(false)
  const track = TRACKS[p.trackIndex]
  const hue = { filter: `hue-rotate(${track.hue}deg)` }

  return (
    <div className="relative h-full overflow-hidden bg-neutral-900 text-white">
      <Image src="/images/album.png" alt="" fill sizes="400px" className="scale-150 object-cover blur-3xl" style={hue} />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative flex h-full flex-col px-7 pt-[62px] pb-[42px]">
        <span className="mx-auto mb-6 h-[5px] w-10 rounded-full bg-white/40" />

        <div className="relative aspect-square w-full">
          {showQueue ? (
            <ul className="h-full animate-[fade-in_0.25s_ease-out] space-y-1 overflow-y-auto">
              <li className="pb-2 text-[17px] font-semibold">Berikutnya</li>
              {TRACKS.map((t, i) => (
                <li key={t.title}>
                  <button
                    type="button"
                    onClick={() => p.selectTrack(i)}
                    className={cn('flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/10', i === p.trackIndex && 'bg-white/15')}
                  >
                    <span className="relative size-12 overflow-hidden rounded-md">
                      <Image src="/images/album.png" alt="" fill sizes="48px" style={{ filter: `hue-rotate(${t.hue}deg)` }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{t.title}</span>
                      <span className="block truncate text-[13px] text-white/60">{t.artist}</span>
                    </span>
                    <span className="text-[13px] text-white/60 tabular-nums">{formatDuration(t.duration)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div
              className={cn(
                'relative h-full w-full overflow-hidden rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(.3,1.4,.5,1)]',
                p.playing ? 'scale-100' : 'scale-[0.82]',
              )}
            >
              <Image src="/images/album.png" alt={`Sampul album ${track.title}`} fill sizes="340px" className="object-cover" style={hue} priority />
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-[21px] font-semibold">{track.title}</h1>
            <p className="truncate text-[19px] text-white/60">{track.artist}</p>
          </div>
          <div className="flex gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-white/15">
              <Star className="size-4" />
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-white/15">
              <Ellipsis className="size-4" />
            </span>
          </div>
        </div>

        <IOSRange
          label="Posisi lagu"
          value={p.progress}
          max={track.duration}
          step={1}
          onChange={p.seek}
          className="mt-5"
          trackClassName="bg-white/25"
          fillClassName="bg-white/80"
        />
        <div className="flex justify-between text-[12px] font-medium text-white/50 tabular-nums">
          <span>{formatDuration(p.progress)}</span>
          <span>-{formatDuration(track.duration - p.progress)}</span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-14">
          <button type="button" aria-label="Lagu sebelumnya" onClick={() => p.skip(-1)} className="transition-transform active:scale-75">
            <SkipBack className="size-9 fill-white" />
          </button>
          <button type="button" aria-label={p.playing ? 'Jeda' : 'Putar'} onClick={p.togglePlay} className="transition-transform active:scale-75">
            {p.playing ? <Pause className="size-12 fill-white" /> : <Play className="size-12 fill-white" />}
          </button>
          <button type="button" aria-label="Lagu berikutnya" onClick={() => p.skip(1)} className="transition-transform active:scale-75">
            <SkipForward className="size-9 fill-white" />
          </button>
        </div>

        <div className="mt-auto flex items-center gap-3 text-white/60">
          <Volume1 className="size-4" />
          <IOSRange label="Volume" value={p.volume} onChange={p.setVolume} className="flex-1" trackClassName="bg-white/25" fillClassName="bg-white/80" />
          <Volume2 className="size-4" />
        </div>

        <div className="mt-6 flex items-center justify-around text-white/70">
          <MessageSquareQuote className="size-6" />
          <Cast className="size-6" />
          <button type="button" aria-label="Antrean lagu" aria-pressed={showQueue} onClick={() => setShowQueue((s) => !s)}>
            <ListMusic className={cn('size-6 transition-colors', showQueue && 'text-white')} />
          </button>
        </div>
      </div>
    </div>
  )
}
