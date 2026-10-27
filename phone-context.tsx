'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { AppId } from '@/lib/phone/apps'
import { TRACKS } from '@/lib/phone/data'

export interface Origin {
  x: number
  y: number
}

export interface Capture {
  id: string
  src: string
  zoom: number
  mirrored: boolean
  filter: string
}

interface PhoneState {
  locked: boolean
  screenOff: boolean
  activeApp: AppId | null
  appVisible: boolean
  origin: Origin
  controlCenterOpen: boolean
  wifi: boolean
  bluetooth: boolean
  airplane: boolean
  cellular: boolean
  flashlight: boolean
  rotationLock: boolean
  focus: boolean
  brightness: number
  volume: number
  volumeHud: boolean
  trackIndex: number
  playing: boolean
  progress: number
  captures: Capture[]
  note: string
}

interface PhoneActions {
  openApp: (id: AppId, origin?: Origin) => void
  goHome: () => void
  pressPower: () => void
  unlock: () => void
  wake: () => void
  setControlCenterOpen: (open: boolean) => void
  toggle: (key: 'wifi' | 'bluetooth' | 'airplane' | 'cellular' | 'flashlight' | 'rotationLock' | 'focus') => void
  setBrightness: (value: number) => void
  setVolume: (value: number) => void
  nudgeVolume: (delta: number) => void
  togglePlay: () => void
  skip: (direction: 1 | -1) => void
  seek: (seconds: number) => void
  selectTrack: (index: number) => void
  addCapture: (capture: Omit<Capture, 'id'>) => void
  setNote: (note: string) => void
}

type PhoneContextValue = PhoneState & PhoneActions

const PhoneContext = createContext<PhoneContextValue | null>(null)

const APP_CLOSE_MS = 380
const DEFAULT_ORIGIN: Origin = { x: 50, y: 50 }
const clamp = (v: number) => Math.min(1, Math.max(0, v))

const DEFAULT_NOTE = `Daftar belanja minggu ini

- Kopi arabika 250 gr
- Susu oat
- Roti gandum
- Alpukat 3 buah
- Telur 1 lusin

Jangan lupa bayar listrik sebelum tanggal 20!`

export function PhoneProvider({ children }: { children: ReactNode }) {
  const [locked, setLocked] = useState(true)
  const [screenOff, setScreenOff] = useState(false)
  const [activeApp, setActiveApp] = useState<AppId | null>(null)
  const [appVisible, setAppVisible] = useState(false)
  const [origin, setOrigin] = useState<Origin>(DEFAULT_ORIGIN)
  const [controlCenterOpen, setControlCenterOpen] = useState(false)
  const [toggles, setToggles] = useState({
    wifi: true,
    bluetooth: true,
    airplane: false,
    cellular: true,
    flashlight: false,
    rotationLock: true,
    focus: false,
  })
  const [brightness, setBrightnessState] = useState(0.85)
  const [volume, setVolumeState] = useState(0.6)
  const [volumeHud, setVolumeHud] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(42)
  const [captures, setCaptures] = useState<Capture[]>([])
  const [note, setNote] = useState(DEFAULT_NOTE)

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hudTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!playing) return
    const duration = TRACKS[trackIndex].duration
    if (progress >= duration) {
      setTrackIndex((i) => (i + 1) % TRACKS.length)
      setProgress(0)
      return
    }
    const id = setTimeout(() => setProgress((p) => p + 1), 1000)
    return () => clearTimeout(id)
  }, [playing, trackIndex, progress])

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
      if (hudTimer.current) clearTimeout(hudTimer.current)
    },
    [],
  )

  const openApp = useCallback((id: AppId, nextOrigin?: Origin) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setControlCenterOpen(false)
    setLocked(false)
    setOrigin(nextOrigin ?? DEFAULT_ORIGIN)
    setActiveApp(id)
    setAppVisible(true)
  }, [])

  const closeApp = useCallback(() => {
    setAppVisible(false)
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setActiveApp(null), APP_CLOSE_MS)
  }, [])

  const goHome = useCallback(() => {
    if (screenOff) {
      setScreenOff(false)
      return
    }
    if (controlCenterOpen) {
      setControlCenterOpen(false)
      return
    }
    if (locked) {
      setLocked(false)
      return
    }
    if (activeApp) closeApp()
  }, [screenOff, controlCenterOpen, locked, activeApp, closeApp])

  const pressPower = useCallback(() => {
    if (screenOff) {
      setScreenOff(false)
      return
    }
    setControlCenterOpen(false)
    setLocked(true)
    setScreenOff(true)
  }, [screenOff])

  const toggle = useCallback<PhoneActions['toggle']>((key) => {
    setToggles((t) => {
      const next = { ...t, [key]: !t[key] }
      if (key === 'airplane' && next.airplane) next.cellular = false
      if (key === 'airplane' && !next.airplane) next.cellular = true
      if (key === 'cellular' && next.cellular) next.airplane = false
      return next
    })
  }, [])

  const setVolume = useCallback((v: number) => setVolumeState(clamp(v)), [])

  const nudgeVolume = useCallback((delta: number) => {
    setVolumeState((v) => clamp(Math.round((v + delta) * 16) / 16))
    setVolumeHud(true)
    if (hudTimer.current) clearTimeout(hudTimer.current)
    hudTimer.current = setTimeout(() => setVolumeHud(false), 1400)
  }, [])

  const skip = useCallback((direction: 1 | -1) => {
    setTrackIndex((i) => (i + direction + TRACKS.length) % TRACKS.length)
    setProgress(0)
  }, [])

  const selectTrack = useCallback((index: number) => {
    setTrackIndex(index)
    setProgress(0)
    setPlaying(true)
  }, [])

  const addCapture = useCallback((capture: Omit<Capture, 'id'>) => {
    setCaptures((c) => [{ ...capture, id: `${Date.now()}` }, ...c])
  }, [])

  const value = useMemo<PhoneContextValue>(
    () => ({
      locked,
      screenOff,
      activeApp,
      appVisible,
      origin,
      controlCenterOpen,
      ...toggles,
      brightness,
      volume,
      volumeHud,
      trackIndex,
      playing,
      progress,
      captures,
      note,
      openApp,
      goHome,
      pressPower,
      unlock: () => setLocked(false),
      wake: () => setScreenOff(false),
      setControlCenterOpen,
      toggle,
      setBrightness: (v) => setBrightnessState(clamp(v)),
      setVolume,
      nudgeVolume,
      togglePlay: () => setPlaying((p) => !p),
      skip,
      seek: (s) => setProgress(Math.max(0, Math.min(TRACKS[trackIndex].duration - 1, s))),
      selectTrack,
      addCapture,
      setNote,
    }),
    [
      locked,
      screenOff,
      activeApp,
      appVisible,
      origin,
      controlCenterOpen,
      toggles,
      brightness,
      volume,
      volumeHud,
      trackIndex,
      playing,
      progress,
      captures,
      note,
      openApp,
      goHome,
      pressPower,
      toggle,
      setVolume,
      nudgeVolume,
      skip,
      selectTrack,
      addCapture,
    ],
  )

  return <PhoneContext.Provider value={value}>{children}</PhoneContext.Provider>
}

export function usePhone() {
  const ctx = useContext(PhoneContext)
  if (!ctx) throw new Error('usePhone must be used within PhoneProvider')
  return ctx
}
