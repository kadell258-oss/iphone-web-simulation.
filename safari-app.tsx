'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Copy, RotateCcw, Search, Share, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAVORITES = [
  { name: 'Apple', domain: 'apple.com', color: 'bg-neutral-900' },
  { name: 'Google', domain: 'google.com', color: 'bg-[#4285f4]' },
  { name: 'Wikipedia', domain: 'id.wikipedia.org', color: 'bg-neutral-500' },
  { name: 'YouTube', domain: 'youtube.com', color: 'bg-[#ff0033]' },
  { name: 'Tokopedia', domain: 'tokopedia.com', color: 'bg-[#03ac0e]' },
  { name: 'Kompas', domain: 'kompas.com', color: 'bg-[#0a3d91]' },
  { name: 'GitHub', domain: 'github.com', color: 'bg-[#24292f]' },
  { name: 'Vercel', domain: 'vercel.com', color: 'bg-black' },
]

interface Page {
  query: string
  domain: string
}

export function SafariApp() {
  const [input, setInput] = useState('')
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const navigate = (query: string, domain?: string) => {
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setInput(domain ?? q)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setPage({ query: q, domain: domain ?? (q.includes('.') ? q : 'google.com') })
      setLoading(false)
    }, 900)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(input)
  }

  return (
    <div className="flex h-full flex-col bg-[#f2f2f7] text-black">
      <div className="flex-1 overflow-y-auto pt-[54px]">
        {page ? (
          <article className="min-h-full animate-[fade-in_0.3s_ease-out] bg-white px-5 py-4">
            <p className="text-[13px] text-[#8e8e93]">{page.domain}</p>
            <h1 className="mt-1 text-[26px] leading-tight font-bold text-balance">Hasil untuk &ldquo;{page.query}&rdquo;</h1>
            <ul className="mt-4 space-y-5">
              {['Panduan lengkap', 'Berita terbaru', 'Tips & trik', 'Diskusi komunitas'].map((title, i) => (
                <li key={title}>
                  <p className="text-[12px] text-[#34a853]">
                    {page.domain} › {['panduan', 'berita', 'tips', 'forum'][i]}
                  </p>
                  <p className="text-[17px] font-semibold text-[#1a0dab]">
                    {title} tentang {page.query}
                  </p>
                  <p className="text-[14px] leading-snug text-neutral-600">
                    Temukan informasi seputar {page.query} yang dirangkum dari berbagai sumber terpercaya, diperbarui setiap hari.
                  </p>
                </li>
              ))}
            </ul>
          </article>
        ) : (
          <div className="px-5 pt-4 pb-6">
            <h2 className="text-[22px] font-bold">Favorit</h2>
            <div className="mt-3 grid grid-cols-4 gap-x-4 gap-y-4">
              {FAVORITES.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => navigate(f.name, f.domain)}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      'flex size-[62px] items-center justify-center rounded-[14px] text-[26px] font-semibold text-white shadow-sm transition-transform group-hover:scale-105 group-active:scale-90',
                      f.color,
                    )}
                  >
                    {f.name[0]}
                  </span>
                  <span className="text-[12px] text-neutral-700">{f.name}</span>
                </button>
              ))}
            </div>

            <h2 className="mt-7 text-[22px] font-bold">Laporan Privasi</h2>
            <div className="mt-3 flex items-center gap-3 rounded-[14px] bg-white p-4">
              <Shield className="size-8 shrink-0 text-neutral-700" />
              <p className="text-[14px] leading-snug text-neutral-700">
                Dalam 7 hari terakhir, Safari telah mencegah <strong>48 pelacak</strong> membuat profil tentang Anda.
              </p>
            </div>

            <h2 className="mt-7 text-[22px] font-bold">Daftar Bacaan</h2>
            <div className="mt-3 divide-y divide-neutral-200 rounded-[14px] bg-white">
              {['10 Kafe Terbaik di Jakarta Selatan', 'Cara Memotret Senja dengan iPhone'].map((t) => (
                <button key={t} type="button" onClick={() => navigate(t, 'reader.app')} className="flex w-full items-center gap-3 p-3 text-left">
                  <BookOpen className="size-5 text-[#007aff]" />
                  <span className="text-[15px]">{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 bg-[#f9f9f9]/95 px-4 pt-2.5 pb-[34px] backdrop-blur">
        <form onSubmit={submit} className="relative flex h-11 items-center gap-2 overflow-hidden rounded-[12px] bg-white px-3 shadow-[0_1px_6px_rgba(0,0,0,0.12)]">
          <span className="text-[15px] font-semibold">
            A<span className="text-[12px]">A</span>
          </span>
          <Search className="size-4 text-[#8e8e93]" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cari atau masukkan situs web"
            aria-label="Alamat situs atau pencarian"
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#8e8e93]"
          />
          <RotateCcw className="size-4 text-neutral-700" />
          {loading && <span className="absolute bottom-0 left-0 h-[3px] animate-[load-bar_0.9s_ease-out_forwards] bg-[#007aff]" />}
        </form>
        <div className="mt-3 flex items-center justify-between px-2 text-[#007aff]">
          <button type="button" aria-label="Kembali" onClick={() => setPage(null)} disabled={!page} className="disabled:text-[#c4c4c6]">
            <ChevronLeft className="size-7" />
          </button>
          <ChevronRight className="size-7 text-[#c4c4c6]" />
          <Share className="size-6" />
          <BookOpen className="size-6" />
          <Copy className="size-6" />
        </div>
      </div>
    </div>
  )
}
