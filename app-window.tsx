'use client'

import { useEffect, useState, type ComponentType } from 'react'
import type { AppId } from '@/lib/phone/apps'
import { cn } from '@/lib/utils'
import { CameraApp } from './apps/camera-app'
import { MessagesApp } from './apps/messages-app'
import { MusicApp } from './apps/music-app'
import { PhotosApp } from './apps/photos-app'
import { SafariApp } from './apps/safari-app'
import { SettingsApp } from './apps/settings-app'
import { CalculatorApp, ClockApp, NotesApp, WeatherApp } from './apps/utility-apps'
import { usePhone } from './phone-context'

const APP_COMPONENTS: Record<AppId, ComponentType> = {
  camera: CameraApp,
  messages: MessagesApp,
  photos: PhotosApp,
  settings: SettingsApp,
  safari: SafariApp,
  music: MusicApp,
  weather: WeatherApp,
  clock: ClockApp,
  calculator: CalculatorApp,
  notes: NotesApp,
}

export function AppWindow() {
  const { activeApp, appVisible, origin, locked } = usePhone()
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (!appVisible) {
      setEntered(false)
      return
    }
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
    return () => cancelAnimationFrame(id)
  }, [appVisible, activeApp])

  if (!activeApp) return null
  const App = APP_COMPONENTS[activeApp]
  const shown = entered && appVisible

  return (
    <div
      className={cn(
        'absolute inset-0 z-20 overflow-hidden rounded-[inherit] transition-[transform,opacity,border-radius] duration-[380ms] ease-[cubic-bezier(.32,.72,0,1)] will-change-transform',
        shown ? 'scale-100 opacity-100' : 'scale-[0.12] opacity-0 rounded-[60px]',
        locked && 'pointer-events-none',
      )}
      style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
      aria-hidden={locked}
    >
      <App key={activeApp} />
    </div>
  )
}
