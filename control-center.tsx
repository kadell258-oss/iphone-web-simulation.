'use client'

import Image from 'next/image'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import {
  Antenna,
  Bluetooth,
  Calculator,
  Camera,
  Flashlight,
  Moon,
  Pause,
  Play,
  Plane,
  RotateCcwSquare,
  ScreenShare,
  SkipBack,
  SkipForward,
  SunMedium,
  Timer,
  Volume2,
  Wifi,
} from 'lucide-react'
import { TRACKS } from '@/lib/phone/data'
import { cn } from '@/lib/utils'
import { VerticalSlider } from './ios-controls'
import { usePhone } from './phone-context'

function CircleToggle({
  active,
  onClick,
  label,
  activeClassName,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  activeClassName: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex size-[58px] items-center justify-center rounded-full text-white transition-all duration-200 active:scale-90',
        active ? activeClassName : 'bg-white/20 hover:bg-white/30',
      )}
    >
      {children}
    </button>
  )
}

function Tile({
  active,
  onClick,
  label,
  children,
  className,
}: {
  active?: boolean
  onClick: () => void
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-[24px] transition-all duration-200 active:scale-90',
        active ? 'bg-white text-neutral-900' : 'bg-white/20 text-white hover:bg-white/30',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function ControlCenter() {
  const phone = usePhone()
  const { controlCenterOpen: open, setControlCenterOpen } = phone
  const track = TRACKS[phone.trackIndex]
  const startY = useRef<number | null>(null)

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startY.current = e.clientY
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startY.current !== null && startY.current - e.clientY > 40) setControlCenterOpen(false)
    startY.current = null
  }

  return (
    <div
      className={cn(
        'absolute inset-0 z-[45] transition-opacity duration-300',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!open}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Tutup Control Center"
        onClick={() => setControlCenterOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-[28px] backdrop-saturate-150"
      />

      <div
        role="dialog"
        aria-label="Control Center"
        className={cn(
          'relative grid origin-top-right grid-cols-4 auto-rows-[72px] gap-[15px] px-[28px] pt-[86px] transition-transform duration-500 ease-[cubic-bezier(.32,1.2,.4,1)]',
          open ? 'scale-100 translate-y-0' : 'scale-90 -translate-y-6',
        )}
      >
        <div className="col-span-2 row-span-2 grid grid-cols-2 place-items-center rounded-[28px] bg-white/15 p-2">
          <CircleToggle label="Mode Pesawat" active={phone.airplane} onClick={() => phone.toggle('airplane')} activeClassName="bg-[#ff9f0a]">
            <Plane className="size-6 fill-current" />
          </CircleToggle>
          <CircleToggle label="Data Seluler" active={phone.cellular} onClick={() => phone.toggle('cellular')} activeClassName="bg-[#34c759]">
            <Antenna className="size-6" />
          </CircleToggle>
          <CircleToggle label="Wi-Fi" active={phone.wifi} onClick={() => phone.toggle('wifi')} activeClassName="bg-[#0a84ff]">
            <Wifi className="size-6" strokeWidth={2.4} />
          </CircleToggle>
          <CircleToggle label="Bluetooth" active={phone.bluetooth} onClick={() => phone.toggle('bluetooth')} activeClassName="bg-[#0a84ff]">
            <Bluetooth className="size-6" strokeWidth={2.4} />
          </CircleToggle>
        </div>

        <div className="col-span-2 row-span-2 flex flex-col rounded-[28px] bg-white/15 p-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-lg">
              <Image src="/images/album.png" alt="" fill sizes="44px" style={{ filter: `hue-rotate(${track.hue}deg)` }} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-semibold">{track.title}</span>
              <span className="block truncate text-[12px] text-white/60">{track.artist}</span>
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between px-1">
            <button type="button" aria-label="Lagu sebelumnya" onClick={() => phone.skip(-1)} className="active:scale-90">
              <SkipBack className="size-5 fill-white" />
            </button>
            <button type="button" aria-label={phone.playing ? 'Jeda' : 'Putar'} onClick={phone.togglePlay} className="active:scale-90">
              {phone.playing ? <Pause className="size-7 fill-white" /> : <Play className="size-7 fill-white" />}
            </button>
            <button type="button" aria-label="Lagu berikutnya" onClick={() => phone.skip(1)} className="active:scale-90">
              <SkipForward className="size-5 fill-white" />
            </button>
          </div>
        </div>

        <Tile label="Kunci Orientasi" active={phone.rotationLock} onClick={() => phone.toggle('rotationLock')}>
          <RotateCcwSquare className={cn('size-6', phone.rotationLock && 'text-[#ff3b30]')} />
        </Tile>
        <Tile label="Pencerminan Layar" onClick={() => undefined}>
          <ScreenShare className="size-6" />
        </Tile>
        <VerticalSlider
          label="Kecerahan"
          value={phone.brightness}
          onChange={phone.setBrightness}
          icon={<SunMedium className="size-6" />}
          className="col-start-3 row-span-2 row-start-3"
        />
        <VerticalSlider
          label="Volume"
          value={phone.volume}
          onChange={phone.setVolume}
          icon={<Volume2 className="size-6" />}
          className="col-start-4 row-span-2 row-start-3"
        />

        <Tile
          label="Fokus"
          active={phone.focus}
          onClick={() => phone.toggle('focus')}
          className="col-span-2 col-start-1 row-start-4 justify-start gap-3 px-4"
        >
          <span className={cn('flex size-9 items-center justify-center rounded-full', phone.focus ? 'bg-[#5e5ce6] text-white' : 'bg-white/20')}>
            <Moon className="size-5 fill-current" />
          </span>
          <span className="text-left">
            <span className="block text-[14px] font-semibold">Fokus</span>
            <span className={cn('block text-[12px]', phone.focus ? 'text-neutral-500' : 'text-white/60')}>
              {phone.focus ? 'Jangan Ganggu' : 'Mati'}
            </span>
          </span>
        </Tile>

        <Tile label="Senter" active={phone.flashlight} onClick={() => phone.toggle('flashlight')} className="rounded-full">
          <Flashlight className="size-6" />
        </Tile>
        <Tile label="Timer" onClick={() => phone.openApp('clock', { x: 40, y: 80 })} className="rounded-full">
          <Timer className="size-6" />
        </Tile>
        <Tile label="Kalkulator" onClick={() => phone.openApp('calculator', { x: 62, y: 80 })} className="rounded-full">
          <Calculator className="size-6" />
        </Tile>
        <Tile label="Kamera" onClick={() => phone.openApp('camera', { x: 85, y: 80 })} className="rounded-full">
          <Camera className="size-6" />
        </Tile>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[58px] text-center text-[13px] font-medium text-white/50">
        Geser ke atas atau ketuk di luar untuk menutup
      </div>
    </div>
  )
}
