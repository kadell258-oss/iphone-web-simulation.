'use client'

import { useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function IOSToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-300',
        checked ? 'bg-[#34c759]' : 'bg-[#e9e9eb]',
      )}
    >
      <span
        className={cn(
          'absolute top-[2px] left-[2px] size-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)] transition-transform duration-300 ease-[cubic-bezier(.3,1.4,.6,1)]',
          checked && 'translate-x-[20px]',
        )}
      />
    </button>
  )
}

export function VerticalSlider({
  value,
  onChange,
  label,
  icon,
  className,
}: {
  value: number
  onChange: (value: number) => void
  label: string
  icon: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = (clientY: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    onChange(Math.min(1, Math.max(0, (rect.bottom - clientY) / rect.height)))
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    update(e.clientY)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') onChange(Math.min(1, value + 0.05))
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') onChange(Math.max(0, value - 0.05))
  }

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => dragging.current && update(e.clientY)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      onKeyDown={onKeyDown}
      className={cn(
        'relative cursor-ns-resize touch-none overflow-hidden rounded-[24px] bg-white/20 outline-none focus-visible:ring-2 focus-visible:ring-white',
        className,
      )}
    >
      <div className="absolute inset-x-0 bottom-0 bg-white transition-[height] duration-75" style={{ height: `${value * 100}%` }} />
      <div
        className={cn(
          'absolute inset-x-0 bottom-4 flex justify-center transition-colors',
          value > 0.12 ? 'text-neutral-500' : 'text-white',
        )}
      >
        {icon}
      </div>
    </div>
  )
}

export function IOSRange({
  value,
  onChange,
  label,
  className,
  trackClassName = 'bg-black/10',
  fillClassName = 'bg-white',
  min = 0,
  max = 1,
  step = 0.01,
}: {
  value: number
  onChange: (value: number) => void
  label: string
  className?: string
  trackClassName?: string
  fillClassName?: string
  min?: number
  max?: number
  step?: number
}) {
  const percent = ((value - min) / (max - min)) * 100
  return (
    <div className={cn('group relative flex h-6 items-center', className)}>
      <div className={cn('relative h-[7px] w-full overflow-hidden rounded-full transition-[height] group-active:h-[11px]', trackClassName)}>
        <div className={cn('absolute inset-y-0 left-0 rounded-full', fillClassName)} style={{ width: `${percent}%` }} />
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  )
}
