'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, Cloud, CloudRain, CloudSun, Ellipsis, Share, Sun } from 'lucide-react'
import { formatDuration, useNow } from '@/lib/phone/use-now'
import { cn } from '@/lib/utils'
import { usePhone } from '../phone-context'

const HOURLY = [
  { h: 'Kini', t: 31, icon: CloudSun },
  { h: '11', t: 32, icon: Sun },
  { h: '12', t: 33, icon: Sun },
  { h: '13', t: 33, icon: CloudSun },
  { h: '14', t: 32, icon: Cloud },
  { h: '15', t: 30, icon: CloudRain },
  { h: '16', t: 29, icon: CloudRain },
]

const DAILY = [
  { d: 'Hari ini', lo: 25, hi: 33, icon: CloudSun },
  { d: 'Rab', lo: 25, hi: 32, icon: CloudRain },
  { d: 'Kam', lo: 24, hi: 31, icon: CloudRain },
  { d: 'Jum', lo: 25, hi: 33, icon: Sun },
  { d: 'Sab', lo: 26, hi: 34, icon: Sun },
  { d: 'Min', lo: 25, hi: 32, icon: Cloud },
]

export function WeatherApp() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#2a6fd6] via-[#4a8fe0] to-[#7ab3ec] pt-[70px] pb-12 text-white">
      <div className="text-center">
        <h1 className="text-[34px]">Jakarta</h1>
        <p className="text-[96px] leading-none font-extralight">31°</p>
        <p className="text-[20px] font-medium">Cerah Berawan</p>
        <p className="text-[20px] font-medium">T:33° R:25°</p>
      </div>

      <section className="mx-4 mt-10 rounded-[16px] bg-white/15 p-3 backdrop-blur" aria-label="Prakiraan per jam">
        <p className="border-b border-white/20 pb-2 text-[13px] text-white/80">Hujan ringan diperkirakan sekitar pukul 15.00.</p>
        <div className="flex justify-between pt-3">
          {HOURLY.map(({ h, t, icon: Icon }) => (
            <div key={h} className="flex flex-col items-center gap-2 text-[15px] font-medium">
              <span>{h}</span>
              <Icon className="size-6 fill-white/30" />
              <span>{t}°</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 mt-3 rounded-[16px] bg-white/15 px-3 py-2 backdrop-blur" aria-label="Prakiraan harian">
        <p className="pb-1 text-[12px] font-medium text-white/70 uppercase">Prakiraan 6 Hari</p>
        {DAILY.map(({ d, lo, hi, icon: Icon }) => (
          <div key={d} className="flex items-center gap-3 border-t border-white/20 py-2.5 text-[17px] font-medium">
            <span className="w-20">{d}</span>
            <Icon className="size-6" />
            <span className="ml-auto w-8 text-right text-white/60">{lo}°</span>
            <span className="relative h-1 w-24 rounded-full bg-black/15">
              <span
                className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[#9be15d] to-[#fca84c]"
                style={{ left: `${((lo - 23) / 12) * 100}%`, right: `${100 - ((hi - 23) / 12) * 100}%` }}
              />
            </span>
            <span className="w-8">{hi}°</span>
          </div>
        ))}
      </section>
    </div>
  )
}

export function ClockApp() {
  const now = useNow()
  const [running, setRunning] = useState(false)
  const [ms, setMs] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const startRef = useRef(0)

  useEffect(() => {
    if (!running) return
    startRef.current = performance.now() - ms
    let raf = 0
    const tick = () => {
      setMs(performance.now() - startRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const centi = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, '0')
  const secondsAngle = ((now?.getSeconds() ?? 0) / 60) * 360
  const minutesAngle = (((now?.getMinutes() ?? 0) + (now?.getSeconds() ?? 0) / 60) / 60) * 360
  const hoursAngle = ((((now?.getHours() ?? 0) % 12) + (now?.getMinutes() ?? 0) / 60) / 12) * 360

  return (
    <div className="flex h-full flex-col bg-black px-5 pt-[64px] pb-12 text-white">
      <h1 className="text-[34px] font-bold">Stopwatch</h1>
      <div className="mx-auto mt-4 flex size-[140px] items-center justify-center rounded-full border border-white/20" aria-hidden="true">
        <div className="relative size-full">
          {[hoursAngle, minutesAngle].map((a, i) => (
            <span
              key={i}
              className={cn('absolute bottom-1/2 left-1/2 origin-bottom rounded-full bg-white', i === 0 ? 'h-[34px] w-[4px]' : 'h-[52px] w-[3px]')}
              style={{ transform: `translateX(-50%) rotate(${a}deg)` }}
            />
          ))}
          <span className="absolute bottom-1/2 left-1/2 h-[60px] w-[1.5px] origin-bottom bg-[#ff9f0a]" style={{ transform: `translateX(-50%) rotate(${secondsAngle}deg)` }} />
          <span className="absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full bg-[#ff9f0a]" />
        </div>
      </div>
      <p className="mt-6 text-center text-[64px] font-thin tabular-nums" aria-live="off">
        {formatDuration(ms / 1000).padStart(5, '0')},{centi}
      </p>
      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={() => (running ? setLaps((l) => [ms, ...l]) : (setMs(0), setLaps([])))}
          className="flex size-[78px] items-center justify-center rounded-full bg-[#333] text-[16px] ring-2 ring-black ring-offset-2 ring-offset-[#333] transition-opacity active:opacity-70"
        >
          {running ? 'Putaran' : 'Atur Ulang'}
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className={cn(
            'flex size-[78px] items-center justify-center rounded-full text-[16px] ring-2 ring-black ring-offset-2 transition-colors active:opacity-70',
            running ? 'bg-[#3a1210] text-[#ff453a] ring-offset-[#3a1210]' : 'bg-[#0b2a12] text-[#30d158] ring-offset-[#0b2a12]',
          )}
        >
          {running ? 'Berhenti' : 'Mulai'}
        </button>
      </div>
      <ul className="mt-4 flex-1 overflow-y-auto text-[17px] tabular-nums">
        {laps.map((l, i) => (
          <li key={`${l}-${i}`} className="flex justify-between border-t border-white/15 py-2.5">
            <span>Putaran {laps.length - i}</span>
            <span>{formatDuration(l / 1000)},{Math.floor((l % 1000) / 10).toString().padStart(2, '0')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

type Op = '+' | '−' | '×' | '÷'

function apply(a: number, b: number, op: Op) {
  if (op === '+') return a + b
  if (op === '−') return a - b
  if (op === '×') return a * b
  return b === 0 ? NaN : a / b
}

function formatDisplay(value: string) {
  if (value === 'Error') return value
  const [int, dec] = value.split('.')
  const formatted = Number(int).toLocaleString('id-ID')
  return dec !== undefined ? `${formatted},${dec}` : value.startsWith('-0') ? '-0' : formatted
}

export function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [stored, setStored] = useState<number | null>(null)
  const [op, setOp] = useState<Op | null>(null)
  const [fresh, setFresh] = useState(true)

  const digit = (d: string) => {
    if (display.replace(/[-.]/g, '').length >= 9 && !fresh) return
    if (d === '.') {
      if (fresh) return (setDisplay('0.'), setFresh(false))
      if (!display.includes('.')) setDisplay(display + '.')
      return
    }
    setDisplay(fresh || display === '0' ? d : display + d)
    setFresh(false)
  }

  const result = (value: number) => (Number.isFinite(value) ? String(parseFloat(value.toPrecision(9))) : 'Error')

  const chooseOp = (next: Op) => {
    const current = parseFloat(display)
    if (stored !== null && op && !fresh) {
      const r = result(apply(stored, current, op))
      setDisplay(r)
      setStored(parseFloat(r))
    } else {
      setStored(current)
    }
    setOp(next)
    setFresh(true)
  }

  const equals = () => {
    if (stored === null || !op) return
    setDisplay(result(apply(stored, parseFloat(display), op)))
    setStored(null)
    setOp(null)
    setFresh(true)
  }

  const clear = () => {
    setDisplay('0')
    setStored(null)
    setOp(null)
    setFresh(true)
  }

  const keys: { label: string; onPress: () => void; kind: 'fn' | 'num' | 'op'; wide?: boolean; active?: boolean }[] = [
    { label: display === '0' ? 'AC' : 'C', onPress: clear, kind: 'fn' },
    { label: '+/−', onPress: () => setDisplay(display.startsWith('-') ? display.slice(1) : `-${display}`), kind: 'fn' },
    { label: '%', onPress: () => setDisplay(result(parseFloat(display) / 100)), kind: 'fn' },
    { label: '÷', onPress: () => chooseOp('÷'), kind: 'op', active: op === '÷' && fresh },
    ...['7', '8', '9'].map((d) => ({ label: d, onPress: () => digit(d), kind: 'num' as const })),
    { label: '×', onPress: () => chooseOp('×'), kind: 'op', active: op === '×' && fresh },
    ...['4', '5', '6'].map((d) => ({ label: d, onPress: () => digit(d), kind: 'num' as const })),
    { label: '−', onPress: () => chooseOp('−'), kind: 'op', active: op === '−' && fresh },
    ...['1', '2', '3'].map((d) => ({ label: d, onPress: () => digit(d), kind: 'num' as const })),
    { label: '+', onPress: () => chooseOp('+'), kind: 'op', active: op === '+' && fresh },
    { label: '0', onPress: () => digit('0'), kind: 'num', wide: true },
    { label: ',', onPress: () => digit('.'), kind: 'num' },
    { label: '=', onPress: equals, kind: 'op' },
  ]

  const text = formatDisplay(display)

  return (
    <div className="flex h-full flex-col justify-end bg-black px-4 pb-[44px] text-white">
      <p
        className={cn('px-3 pb-3 text-right font-light tabular-nums', text.length > 8 ? 'text-[58px]' : 'text-[84px]', 'leading-none')}
        aria-live="polite"
      >
        {text}
      </p>
      <div className="grid grid-cols-4 gap-3.5">
        {keys.map((k) => (
          <button
            key={k.label === 'C' ? 'AC' : k.label}
            type="button"
            onClick={k.onPress}
            className={cn(
              'flex h-[78px] items-center rounded-full text-[34px] transition-[filter,background-color,color] duration-150 active:brightness-150',
              k.wide ? 'col-span-2 justify-start pl-[30px]' : 'justify-center',
              k.kind === 'fn' && 'bg-[#a5a5a5] text-[28px] font-medium text-black',
              k.kind === 'num' && 'bg-[#333]',
              k.kind === 'op' && (k.active ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a]'),
            )}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function NotesApp() {
  const { note, setNote } = usePhone()
  return (
    <div className="flex h-full flex-col bg-white pt-[54px] text-black">
      <div className="flex items-center justify-between px-2 py-2 text-[17px] text-[#e2a500]">
        <span className="flex items-center">
          <ChevronLeft className="size-7" />
          Catatan
        </span>
        <span className="flex items-center gap-4 pr-2">
          <Share className="size-5" />
          <Ellipsis className="size-6" />
        </span>
      </div>
      <p className="text-center text-[13px] text-[#8e8e93]">Diedit hari ini</p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        aria-label="Isi catatan"
        className="mt-2 flex-1 resize-none px-5 pb-12 text-[17px] leading-relaxed outline-none first-line:text-[28px] first-line:font-bold"
      />
    </div>
  )
}
