import { IPhone } from '@/components/phone/iphone'
import { PhoneProvider } from '@/components/phone/phone-context'
import { SimulatorPanel } from '@/components/phone/simulator-panel'

export default function Page() {
  return (
    <PhoneProvider>
      <main className="relative flex h-dvh w-full flex-col-reverse items-center gap-4 overflow-hidden bg-[#0b0b10] px-6 py-6 lg:flex-row lg:justify-center lg:gap-16 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_65%_45%,rgba(90,70,220,0.22),transparent_70%),radial-gradient(40%_40%_at_20%_80%,rgba(255,120,80,0.10),transparent_70%)]"
        />
        <div className="relative w-full max-w-xl lg:w-auto">
          <SimulatorPanel />
        </div>
        <div className="relative min-h-0 w-full flex-1 lg:h-full lg:max-w-[560px]">
          <IPhone />
        </div>
      </main>
    </PhoneProvider>
  )
}
