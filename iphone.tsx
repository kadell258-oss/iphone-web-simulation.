'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { APPS } from '@/lib/phone/apps'
import { cn } from '@/lib/utils'
import { AppWindow } from './app-window'
import { ControlCenter } from './control-center'
import { DynamicIsland } from './dynamic-island'
import { HomeScreen } from './home-screen'
import { LockScreen } from './lock-screen'
import { usePhone } from './phone-context'
import { StatusBar } from './status-bar'

const SCREEN_W = 393
const SCREEN_H = 852
const SCREEN_RADIUS = 55
const BAND = 4
const BEZEL_INNER = 8
const BEZEL = BAND + BEZEL_INNER
const FRAME_RADIUS = SCREEN_RADIUS + BEZEL
const FRAME_W = SCREEN_W + BEZEL * 2
const FRAME_H = SCREEN_H + BEZEL * 2

function useFitScale(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(0.8)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.min(1.15, (width - 48) / (FRAME_W + 24), (height - 24) / FRAME_H))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return scale
}

function SideButton({
  className,
  label,
  side,
  onClick,
}: {
  className: string
  label: string
  side: 'left' | 'right'
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'absolute w-[5px] outline-none transition-transform duration-100 focus-visible:ring-2 focus-visible:ring-[#0a84ff]',
        side === 'left'
          ? '-left-[3px] origin-right rounded-l-[3px] bg-[linear-gradient(90deg,#1c1d20_0%,#55575c_45%,#2c2d31_100%)] active:scale-x-50'
          : '-right-[3px] origin-left rounded-r-[3px] bg-[linear-gradient(270deg,#1c1d20_0%,#55575c_45%,#2c2d31_100%)] active:scale-x-50',
        'shadow-[0_0_0_0.5px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.5)]',
        className,
      )}
    />
  )
}

function AntennaBand({ className }: { className: string }) {
  return <span aria-hidden="true" className={cn('pointer-events-none absolute z-[1] bg-[#0b0b0d]/90', className)} />
}

function HomeBar({ tone }: { tone: 'white' | 'black' }) {
  const { goHome } = usePhone()
  return (
    <button
      type="button"
      onClick={goHome}
      aria-label="Kembali ke Layar Utama"
      className="group absolute inset-x-0 bottom-0 z-[70] flex h-[34px] items-end justify-center pb-[8px] outline-none"
    >
      <span
        className={cn(
          'h-[5px] w-[134px] rounded-full transition-all duration-200 group-hover:w-[150px] group-active:scale-90 group-focus-visible:ring-2 group-focus-visible:ring-[#0a84ff]',
          tone === 'white' ? 'bg-white' : 'bg-black',
        )}
      />
    </button>
  )
}

function ControlCenterHandle() {
  const { setControlCenterOpen, controlCenterOpen, screenOff } = usePhone()
  const start = useRef<number | null>(null)

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    start.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    if (start.current !== null) {
      const delta = e.clientY - start.current
      if (delta > 20 || Math.abs(delta) < 6) setControlCenterOpen(true)
    }
    start.current = null
  }

  if (controlCenterOpen || screenOff) return null
  return (
    <button
      type="button"
      aria-label="Buka Control Center (geser ke bawah dari kanan atas)"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setControlCenterOpen(true)}
      className="group absolute top-0 right-0 z-[65] flex h-[54px] w-[78px] touch-none items-start justify-center pt-[3px] outline-none"
    >
      <span className="h-[4px] w-[42px] rounded-full bg-white/0 transition-colors group-hover:bg-white/70 group-focus-visible:bg-white/70 mix-blend-difference" />
    </button>
  )
}

function VolumeHud() {
  const { volume, volumeHud } = usePhone()
  return (
    <div
      className={cn(
        'pointer-events-none absolute top-[150px] left-[10px] z-[66] flex h-[150px] w-[44px] flex-col items-center justify-end overflow-hidden rounded-[22px] bg-black/40 backdrop-blur-xl transition-all duration-300',
        volumeHud ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0',
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 bottom-0 bg-white" style={{ height: `${volume * 100}%` }} />
      <span className="relative pb-3 text-neutral-500 mix-blend-difference">
        {volume === 0 ? <VolumeX className="size-5 text-white" /> : <Volume2 className="size-5 text-white" />}
      </span>
    </div>
  )
}

export function IPhone() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scale = useFitScale(containerRef)
  const phone = usePhone()

  const appShown = phone.activeApp && phone.appVisible && !phone.locked
  const tone = phone.locked || phone.controlCenterOpen ? 'white' : appShown ? APPS[phone.activeApp!].statusTone : 'white'
  const homeBarTone = appShown && tone === 'black' ? 'black' : 'white'

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center">
      <div style={{ width: FRAME_W * scale, height: FRAME_H * scale }} className="relative shrink-0">
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[26px] left-1/2 h-[60px] w-[78%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-[28px]"
          />

          <SideButton side="left" label="Tombol Aksi" className="top-[184px] h-[34px]" />
          <SideButton side="left" label="Volume Naik" onClick={() => phone.nudgeVolume(1 / 16)} className="top-[244px] h-[62px]" />
          <SideButton side="left" label="Volume Turun" onClick={() => phone.nudgeVolume(-1 / 16)} className="top-[320px] h-[62px]" />
          <SideButton side="right" label="Tombol Samping (Kunci)" onClick={phone.pressPower} className="top-[280px] h-[100px]" />

          <div
            className="absolute inset-0"
            style={{
              borderRadius: FRAME_RADIUS,
              padding: BAND,
              background:
                'linear-gradient(145deg,#6a6c71 0%,#34363a 14%,#1d1e21 38%,#17181a 62%,#2a2b2f 86%,#5a5c61 100%)',
              boxShadow: [
                '0 0 0 1px #070708',
                '0 2px 4px rgba(0,0,0,0.35)',
                '0 24px 48px -12px rgba(0,0,0,0.55)',
                '0 60px 110px -30px rgba(0,0,0,0.6)',
              ].join(','),
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: FRAME_RADIUS,
                boxShadow: 'inset 0 1px 0.5px rgba(255,255,255,0.22), inset 0 -1px 0.5px rgba(255,255,255,0.08), inset 1px 0 0.5px rgba(255,255,255,0.1), inset -1px 0 0.5px rgba(255,255,255,0.06)',
              }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                borderRadius: FRAME_RADIUS,
                background:
                  'linear-gradient(115deg,rgba(255,255,255,0.18) 0%,transparent 12%,transparent 70%,rgba(255,255,255,0.1) 92%,transparent 100%)',
              }}
            />

            <AntennaBand className="top-[86px] left-0 h-[3px] w-[4px]" />
            <AntennaBand className="top-[86px] right-0 h-[3px] w-[4px]" />
            <AntennaBand className="bottom-[86px] left-0 h-[3px] w-[4px]" />
            <AntennaBand className="bottom-[86px] right-0 h-[3px] w-[4px]" />
            <AntennaBand className="top-0 right-[96px] h-[4px] w-[3px]" />
            <AntennaBand className="bottom-0 left-[96px] h-[4px] w-[3px]" />

            <div
              className="relative h-full w-full bg-black"
              style={{
                borderRadius: FRAME_RADIUS - BAND,
                padding: BEZEL_INNER,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 6px rgba(0,0,0,0.9)',
              }}
            >
              <div
                data-phone-screen
                className="relative isolate h-full w-full overflow-hidden bg-black font-sans select-none [transform:translateZ(0)]"
                style={{
                  width: SCREEN_W,
                  height: SCREEN_H,
                  borderRadius: SCREEN_RADIUS,
                  clipPath: `inset(0 round ${SCREEN_RADIUS}px)`,
                }}
              >
                <HomeScreen />
                <AppWindow />
                <LockScreen />
                <ControlCenter />
                <StatusBar tone={tone} />
                <VolumeHud />
                <DynamicIsland />
                <ControlCenterHandle />
                <HomeBar tone={homeBarTone} />

                {phone.flashlight && (
                  <div className="pointer-events-none absolute top-[60px] right-[30px] z-[66] size-2 animate-pulse rounded-full bg-[#ffd60a]" aria-hidden="true" />
                )}

                <div
                  className="pointer-events-none absolute inset-0 z-[80] bg-black transition-opacity duration-200"
                  style={{ opacity: Math.max(0, 0.9 - phone.brightness) * 0.75 }}
                  aria-hidden="true"
                />

                <button
                  type="button"
                  aria-label="Nyalakan layar"
                  tabIndex={phone.screenOff ? 0 : -1}
                  onClick={phone.wake}
                  className={cn(
                    'absolute inset-0 z-[90] bg-black transition-opacity duration-500',
                    phone.screenOff ? 'opacity-100' : 'pointer-events-none opacity-0',
                  )}
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[95]"
                  style={{
                    borderRadius: SCREEN_RADIUS,
                    background:
                      'linear-gradient(118deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.025) 28%,transparent 42%)',
                    boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.06)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
