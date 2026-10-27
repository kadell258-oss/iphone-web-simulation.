'use client'

import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000)
  return () => clearInterval(id)
}

const getSnapshot = () => Math.floor(Date.now() / 1000)
const getServerSnapshot = () => 0

export function useNow(): Date | null {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return seconds === 0 ? null : new Date(seconds * 1000)
}

const pad = (n: number) => n.toString().padStart(2, '0')

export function formatTime(date: Date | null) {
  if (!date) return '9.41'
  return `${pad(date.getHours())}.${pad(date.getMinutes())}`
}

const longDate = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export function formatLongDate(date: Date | null) {
  if (!date) return ''
  return longDate.format(date)
}

export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${Math.floor(s / 60)}:${pad(s % 60)}`
}
