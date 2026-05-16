'use client'

import type { ReactNode } from 'react'

interface Props {
  language: 'en' | 'si' | 'ta'
  selectedService: string | null
  onFormDataReceived: (data: Record<string, string>) => void
}

const AGENT_URL = 'https://bey.chat/f25dd3c0-9cf2-461a-b44a-f7941994b8d4'

/** Portrait 9:16 on mobile; landscape 5:4 on desktop (matches Bey card) */
const frameClassName = [
  'relative isolate overflow-hidden rounded-2xl border-2 [transform:translateZ(0)]',
  'mx-auto w-full max-w-[min(100%,20rem)] aspect-[9/16] max-h-[min(72vh,600px)]',
  'md:mx-0 md:max-h-full md:max-w-none md:w-full md:aspect-[5/4] md:max-h-none',
].join(' ')

function AvatarFrame({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) {
  return (
    <div className="flex w-full items-center justify-center md:h-full">
      <div className={`${frameClassName} ${className}`}>{children}</div>
    </div>
  )
}

export default function AvatarViewer({ selectedService }: Props) {
  if (!selectedService) {
    return (
      <AvatarFrame className="border-yellow-400/30 bg-gray-800 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">👩‍💼</div>
          <p className="text-gray-400 text-sm">Rathna will appear here</p>
        </div>
      </AvatarFrame>
    )
  }

  return (
    <AvatarFrame className="border-yellow-400/50 bg-black">
      <div className="absolute inset-0 overflow-hidden bg-black [transform:translateZ(0)]">
        <iframe
          src={AGENT_URL}
          title="Rathna AI assistant"
          className="absolute inset-0 h-full w-full touch-manipulation border-0 [transform:translateZ(0)]"
          allow="camera; microphone; fullscreen"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-9 bg-gradient-to-t from-gray-950 from-50% to-transparent md:hidden"
          aria-hidden
        />
      </div>
    </AvatarFrame>
  )
}



