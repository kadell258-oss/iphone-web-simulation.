'use client'

import Image from 'next/image'
import { useEffect, useState, type MouseEvent } from 'react'
import { ChevronUp, CircleDot, RefreshCcw, Zap, ZapOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePhone } from '../phone-context'

const MODES = ['VIDEO', 'FOTO', 'POTRET', 'PANO'] as const
type Mode = (typeof MODES)[number]
const ZOOMS = [0.5, 1, 2] as const
const SCENE = '/images/camera-scene.png'

function zoomScale(zoom: number) {
  return zoom === 0.5 ? 1 : zoom === 1 ? 1.35 : 2.1
}

export function CameraApp() {
  const { addCapture, captures, openApp } = usePhone()
  const [mode, setMode] = useState<Mode>('FOTO')
  const [zoom, setZoom] = useState<number>(1)
  const [flash, setFlash] = useState(false)
  const [front, setFront] = useState(false)
  const [shutterFlash, setShutterFlash] = useState(0)
  const [focus, setFocus] = useState<{ x: number; y: number; key: number } | null>(null)
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!recording) return
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [recording])

  const filter = mode === 'POTRET' ? 'saturate(1.15) contrast(1.05)' : ''
  const scale = zoomScale(zoom)
  const latest = captures[0]

  const shoot = () => {
    if (mode === 'VIDEO') {
      if (recording) {
        setRecording(false)
        setElapsed(0)
        addCapture({ src: SCENE, zoom: scale, mirrored: front, filter })
      } else {
        setRecording(true)
      }
      return
    }
    setShutterFlash((n) => n + 1)
    addCapture({ src: SCENE, zoom: scale, mirrored: front, filter })
  }

  const tapFocus = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setFocus({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, key: Date.now() })
  }

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="flex h-full flex-col bg-black pt-[54px] text-white">
      <div className="flex h-11 items-center justify-between px-5">
        <button
          type="button"
          onClick={() => setFlash((f) => !f)}
          aria-label={flash ? 'Matikan flash' : 'Nyalakan flash'}
          className={cn('flex size-8 items-center justify-center rounded-full', flash ? 'bg-[#ffd60a] text-black' : 'bg-white/15')}
        >
          {flash ? <Zap className="size-4 fill-current" /> : <ZapOff className="size-4" />}
        </button>
        {recording ? (
          <span className="rounded-md bg-[#ff3b30] px-2 py-0.5 text-[15px] font-medium tabular-nums">
            00:{pad(Math.floor(elapsed / 60))}:{pad(elapsed % 60)}
          </span>
        ) : (
          <ChevronUp className="size-5 opacity-80" />
        )}
        <span className="flex size-8 items-center justify-center rounded-full bg-white/15">
          <CircleDot className="size-4" />
        </span>
      </div>

      <div
        className="relative mt-1 aspect-[3/4] w-full cursor-crosshair overflow-hidden"
        onClick={tapFocus}
        role="img"
        aria-label="Jendela bidik kamera"
      >
        <Image
          src={SCENE}
          alt=""
          fill
          sizes="400px"
          className="object-cover transition-transform duration-500 ease-out"
          style={{ transform: `scale(${scale}) scaleX(${front ? -1 : 1})`, filter }}
        />
        {mode === 'POTRET' && (
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)] backdrop-blur-[0px]" />
        )}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="border-[0.5px] border-white/20" />
          ))}
        </div>
        {focus && (
          <span
            key={focus.key}
            className="pointer-events-none absolute size-20 -translate-x-1/2 -translate-y-1/2 animate-[focus-box_0.9s_ease-out_forwards] border border-[#ffd60a]"
            style={{ left: `${focus.x}%`, top: `${focus.y}%` }}
          />
        )}
        {mode === 'POTRET' && (
          <span className="absolute top-3 left-1/2 -translate-x-1/2 rounded bg-[#ffd60a] px-2 py-0.5 text-[11px] font-semibold text-black">
            CAHAYA ALAMI
          </span>
        )}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/40 p-1 backdrop-blur">
          {ZOOMS.map((z) => (
            <button
              key={z}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setZoom(z)
              }}
              aria-label={`Zoom ${z}x`}
              className={cn(
                'flex items-center justify-center rounded-full bg-black/50 font-semibold transition-all',
                zoom === z ? 'size-9 text-[12px] text-[#ffd60a]' : 'size-7 text-[10px]',
              )}
            >
              {zoom === z ? `${z}×` : z === 0.5 ? '.5' : z}
            </button>
          ))}
        </div>
        <span key={shutterFlash} className={cn('pointer-events-none absolute inset-0 bg-black opacity-0', shutterFlash > 0 && 'animate-[shutter_0.25s_ease-out]')} />
      </div>

      <div className="mt-4 flex justify-center gap-5 text-[13px] font-semibold tracking-wide">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m)
              setRecording(false)
              setElapsed(0)
            }}
            className={cn('transition-colors', mode === m ? 'text-[#ffd60a]' : 'text-white/80 hover:text-white')}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between px-8 pb-[46px]">
        <button
          type="button"
          aria-label="Buka foto terakhir"
          onClick={() => openApp('photos', { x: 15, y: 88 })}
          className="relative size-12 overflow-hidden rounded-lg bg-neutral-800 ring-1 ring-white/20"
        >
          {latest && (
            <Image
              key={latest.id}
              src={latest.src}
              alt=""
              fill
              sizes="48px"
              className="animate-[pop_0.35s_ease-out] object-cover"
              style={{ transform: `scale(${latest.zoom}) scaleX(${latest.mirrored ? -1 : 1})`, filter: latest.filter }}
            />
          )}
        </button>
        <button
          type="button"
          onClick={shoot}
          aria-label={mode === 'VIDEO' ? (recording ? 'Hentikan rekaman' : 'Mulai rekam') : 'Ambil foto'}
          className="flex size-[78px] items-center justify-center rounded-full border-[4px] border-white"
        >
          <span
            className={cn(
              'transition-all duration-300 active:scale-90',
              mode === 'VIDEO' ? 'bg-[#ff3b30]' : 'bg-white',
              recording ? 'size-7 rounded-md' : 'size-[62px] rounded-full',
            )}
          />
        </button>
        <button
          type="button"
          onClick={() => setFront((f) => !f)}
          aria-label="Ganti kamera depan/belakang"
          className="flex size-12 items-center justify-center rounded-full bg-white/15 transition-transform active:rotate-180"
        >
          <RefreshCcw className="size-5" />
        </button>
      </div>
    </div>
  )
}
