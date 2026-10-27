'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ChevronLeft, Heart, Share, Trash2 } from 'lucide-react'
import { LIBRARY_PHOTOS, PHOTO_FILTERS } from '@/lib/phone/data'
import { cn } from '@/lib/utils'
import { usePhone } from '../phone-context'

interface Tile {
  id: string
  src: string
  alt: string
  style: React.CSSProperties
}

const TABS = ['Tahun', 'Bulan', 'Hari', 'Semua']

export function PhotosApp() {
  const { captures } = usePhone()
  const [selected, setSelected] = useState<Tile | null>(null)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [tab, setTab] = useState('Semua')

  const tiles = useMemo<Tile[]>(() => {
    const fromCamera = captures.map((c) => ({
      id: c.id,
      src: c.src,
      alt: 'Foto dari Kamera',
      style: { transform: `scale(${c.zoom}) scaleX(${c.mirrored ? -1 : 1})`, filter: c.filter },
    }))
    const library = PHOTO_FILTERS.flatMap((filter, fi) =>
      LIBRARY_PHOTOS.map((p, pi) => ({ id: `lib-${fi}-${pi}`, src: p.src, alt: p.alt, style: { filter } })),
    )
    return [...fromCamera, ...library]
  }, [captures])

  const toggleLike = (id: string) =>
    setLiked((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="relative h-full bg-white text-black">
      <div className="h-full overflow-y-auto pt-[54px] pb-24">
        <div className="flex items-end justify-between px-4 pb-2">
          <div>
            <h1 className="text-[34px] font-bold tracking-tight">Pustaka</h1>
            <p className="text-[13px] text-[#8e8e93]">{tiles.length} Foto</p>
          </div>
          <span className="mb-1 rounded-full bg-[#7676801f] px-3 py-1 text-[15px] font-medium text-[#007aff]">Pilih</span>
        </div>
        <div className="grid grid-cols-3 gap-[2px]">
          {tiles.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t)}
              className="relative aspect-square overflow-hidden bg-neutral-200 transition-opacity hover:opacity-90 active:opacity-70"
              aria-label={`Lihat ${t.alt}`}
            >
              <Image src={t.src} alt="" fill sizes="130px" className="object-cover" style={t.style} />
              {liked.has(t.id) && <Heart className="absolute bottom-1 left-1 size-3.5 fill-white text-white" />}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[34px] flex justify-center">
        <div className="flex gap-1 rounded-full bg-white/80 p-1 shadow-lg ring-1 ring-black/5 backdrop-blur-xl">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn('rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors', tab === t ? 'bg-neutral-800 text-white' : 'text-neutral-700')}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="absolute inset-0 z-10 flex animate-[fade-in_0.25s_ease-out] flex-col bg-black pt-[54px] text-white">
          <div className="flex items-center justify-between px-3 py-2">
            <button type="button" onClick={() => setSelected(null)} className="flex items-center text-[17px] text-[#0a84ff]">
              <ChevronLeft className="size-7" />
              Kembali
            </button>
            <span className="text-[13px] text-white/70">Hari Ini</span>
            <span className="w-20" />
          </div>
          <div className="relative flex-1 overflow-hidden">
            <Image src={selected.src} alt={selected.alt} fill sizes="400px" className="animate-[pop_0.3s_ease-out] object-contain" style={selected.style} />
          </div>
          <div className="flex items-center justify-between px-8 pt-3 pb-[44px] text-[#0a84ff]">
            <Share className="size-6" />
            <button type="button" onClick={() => toggleLike(selected.id)} aria-label="Favorit" aria-pressed={liked.has(selected.id)}>
              <Heart className={cn('size-6 transition-transform active:scale-125', liked.has(selected.id) && 'fill-current')} />
            </button>
            <Trash2 className="size-6" />
          </div>
        </div>
      )}
    </div>
  )
}
