export interface Track {
  title: string
  artist: string
  duration: number
  hue: number
}

export const TRACKS: Track[] = [
  { title: 'Senja di Ibu Kota', artist: 'Nada Pagi', duration: 214, hue: 0 },
  { title: 'Ombak Biru', artist: 'Laut Selatan', duration: 187, hue: 120 },
  { title: 'Neon Malam', artist: 'Kota Tua', duration: 243, hue: 230 },
]

export interface ChatMessage {
  id: string
  from: 'me' | 'them'
  text: string
}

export interface Conversation {
  id: string
  name: string
  initials: string
  color: string
  time: string
  messages: ChatMessage[]
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'rani',
    name: 'Rani',
    initials: 'R',
    color: 'from-pink-400 to-rose-500',
    time: '09.12',
    messages: [
      { id: 'r1', from: 'them', text: 'Pagi! Udah sampai kantor?' },
      { id: 'r2', from: 'me', text: 'Baru aja nih, macet parah di Sudirman' },
      { id: 'r3', from: 'them', text: 'Hahaha klasik. Nanti sore jadi ngopi kan?' },
      { id: 'r4', from: 'me', text: 'Jadi dong, jam 5 di kafe biasa ya' },
      { id: 'r5', from: 'them', text: 'Oke siap! Jangan telat lagi ya' },
    ],
  },
  {
    id: 'budi',
    name: 'Budi Santoso',
    initials: 'BS',
    color: 'from-sky-400 to-blue-600',
    time: 'Kemarin',
    messages: [
      { id: 'b1', from: 'them', text: 'Bro, file presentasinya udah aku kirim ke email' },
      { id: 'b2', from: 'me', text: 'Mantap, makasih banyak!' },
      { id: 'b3', from: 'them', text: 'Sama-sama. Cek slide 12 ya, ada revisi angka' },
    ],
  },
  {
    id: 'ibu',
    name: 'Ibu',
    initials: 'I',
    color: 'from-amber-400 to-orange-500',
    time: 'Senin',
    messages: [
      { id: 'i1', from: 'them', text: 'Nak, minggu depan pulang ke rumah?' },
      { id: 'i2', from: 'me', text: 'Insya Allah bu, hari Sabtu' },
      { id: 'i3', from: 'them', text: 'Ibu masakin rendang ya' },
    ],
  },
  {
    id: 'tim',
    name: 'Tim Desain',
    initials: 'TD',
    color: 'from-violet-400 to-purple-600',
    time: 'Minggu',
    messages: [
      { id: 't1', from: 'them', text: 'Mockup versi 3 sudah di Figma' },
      { id: 't2', from: 'them', text: 'Mohon feedback sebelum Rabu' },
    ],
  },
]

export const AUTO_REPLIES = [
  'Wah, seru banget!',
  'Oke, nanti aku kabari lagi ya',
  'Hahaha bisa aja kamu',
  'Siap, noted!',
  'Serius? Ceritain dong',
  'Mantap, setuju!',
]

export const LIBRARY_PHOTOS = [
  { src: '/images/photo-beach.png', alt: 'Pantai tropis saat matahari terbenam' },
  { src: '/images/photo-mountain.png', alt: 'Gunung berkabut saat matahari terbit' },
  { src: '/images/photo-city.png', alt: 'Gedung pencakar langit di malam hari' },
  { src: '/images/camera-scene.png', alt: 'Secangkir latte di meja kafe' },
]

export const PHOTO_FILTERS = [
  '',
  'saturate(1.3)',
  'hue-rotate(-20deg)',
  'grayscale(1)',
  'sepia(0.4)',
  'contrast(1.2) brightness(0.95)',
]
