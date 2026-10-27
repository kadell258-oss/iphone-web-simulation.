'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUp, ChevronLeft, ChevronRight, Plus, Search, SquarePen, Video } from 'lucide-react'
import { AUTO_REPLIES, CONVERSATIONS, type Conversation } from '@/lib/phone/data'
import { cn } from '@/lib/utils'

function Avatar({ convo, size = 48 }: { convo: Conversation; size?: number }) {
  return (
    <span
      className={cn('flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b font-semibold text-white', convo.color)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {convo.initials}
    </span>
  )
}

function ConversationList({ conversations, onOpen }: { conversations: Conversation[]; onOpen: (id: string) => void }) {
  return (
    <div className="flex h-full flex-col bg-white pt-[54px]">
      <div className="flex items-center justify-between px-4 py-1.5 text-[17px] text-[#007aff]">
        <span>Edit</span>
        <SquarePen className="size-[22px]" />
      </div>
      <h1 className="px-4 text-[34px] font-bold tracking-tight">Pesan</h1>
      <div className="mx-4 mt-2 mb-2 flex items-center gap-1.5 rounded-[10px] bg-[#7676801f] px-2 py-[7px] text-[17px] text-[#8e8e93]">
        <Search className="size-4" />
        Cari
      </div>
      <ul className="flex-1 overflow-y-auto">
        {conversations.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onOpen(c.id)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-200"
            >
              <Avatar convo={c} />
              <span className="min-w-0 flex-1 border-b border-neutral-200 pb-2.5">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[16px] font-semibold">{c.name}</span>
                  <span className="flex shrink-0 items-center text-[14px] text-[#8e8e93]">
                    {c.time}
                    <ChevronRight className="size-4" />
                  </span>
                </span>
                <span className="line-clamp-2 text-[15px] leading-snug text-[#8e8e93]">
                  {c.messages[c.messages.length - 1]?.text}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Thread({
  convo,
  typing,
  onBack,
  onSend,
}: {
  convo: Conversation
  typing: boolean
  onBack: () => void
  onSend: (text: string) => void
}) {
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [convo.messages.length, typing])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    onSend(draft.trim())
    setDraft('')
  }

  return (
    <div className="flex h-full animate-[slide-in_0.35s_cubic-bezier(.32,.72,0,1)] flex-col bg-white">
      <header className="flex items-start justify-between border-b border-neutral-200 bg-[#f9f9f9]/95 px-2 pt-[54px] pb-2 backdrop-blur">
        <button type="button" onClick={onBack} className="flex items-center text-[17px] text-[#007aff]" aria-label="Kembali ke daftar pesan">
          <ChevronLeft className="size-7" />
        </button>
        <div className="flex flex-col items-center gap-1">
          <Avatar convo={convo} size={44} />
          <span className="flex items-center text-[12px]">
            {convo.name}
            <ChevronRight className="size-3 text-[#8e8e93]" />
          </span>
        </div>
        <Video className="mt-1 mr-2 size-6 text-[#007aff]" />
      </header>

      <div className="flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
        <p className="pb-2 text-center text-[11px] font-medium text-[#8e8e93]">iMessage · Hari ini</p>
        {convo.messages.map((m, i) => {
          const next = convo.messages[i + 1]
          const tail = !next || next.from !== m.from
          return (
            <div key={m.id} className={cn('flex animate-[bubble-in_0.3s_ease-out]', m.from === 'me' ? 'justify-end' : 'justify-start')}>
              <p
                className={cn(
                  'max-w-[75%] rounded-[19px] px-3.5 py-[7px] text-[16px] leading-[21px]',
                  m.from === 'me' ? 'bg-[#0b84fe] text-white' : 'bg-[#e9e9eb] text-black',
                  tail && (m.from === 'me' ? 'rounded-br-[5px]' : 'rounded-bl-[5px]'),
                )}
              >
                {m.text}
              </p>
            </div>
          )
        })}
        {typing && (
          <div className="flex">
            <span className="flex gap-1 rounded-[19px] rounded-bl-[5px] bg-[#e9e9eb] px-4 py-3" aria-label="Sedang mengetik">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 animate-bounce rounded-full bg-[#8e8e93]" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 px-3 pt-2 pb-[40px]">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e9e9eb]">
          <Plus className="size-5 text-[#8e8e93]" />
        </span>
        <div className="flex flex-1 items-center rounded-full border border-neutral-300 py-1 pr-1 pl-3.5">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="iMessage"
            aria-label="Tulis pesan"
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#8e8e93]"
          />
          <button
            type="submit"
            aria-label="Kirim"
            disabled={!draft.trim()}
            className="flex size-7 items-center justify-center rounded-full bg-[#0b84fe] text-white transition-opacity disabled:opacity-40"
          >
            <ArrowUp className="size-4" strokeWidth={3} />
          </button>
        </div>
      </form>
    </div>
  )
}

export function MessagesApp() {
  const [conversations, setConversations] = useState(CONVERSATIONS)
  const [openId, setOpenId] = useState<string | null>(null)
  const [typingId, setTypingId] = useState<string | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const append = (id: string, from: 'me' | 'them', text: string) =>
    setConversations((list) =>
      list.map((c) =>
        c.id === id ? { ...c, time: 'Baru saja', messages: [...c.messages, { id: `${Date.now()}-${from}`, from, text }] } : c,
      ),
    )

  const send = (id: string, text: string) => {
    append(id, 'me', text)
    timers.current.push(setTimeout(() => setTypingId(id), 600))
    timers.current.push(
      setTimeout(() => {
        setTypingId(null)
        append(id, 'them', AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)])
      }, 2000),
    )
  }

  const convo = conversations.find((c) => c.id === openId)

  return (
    <div className="h-full text-black">
      {convo ? (
        <Thread convo={convo} typing={typingId === convo.id} onBack={() => setOpenId(null)} onSend={(t) => send(convo.id, t)} />
      ) : (
        <ConversationList conversations={conversations} onOpen={setOpenId} />
      )}
    </div>
  )
}
