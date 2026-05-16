'use client'

import type { ReactNode } from 'react'

interface Props {
  language: 'en' | 'si' | 'ta'
  selectedService: string | null
  onFormDataReceived: (data: Record<string, string>) => void
}

const AGENT_URL = 'https://bey.chat/f25dd3c0-9cf2-461a-b44a-f7941994b8d4'

const languageTitles: Record<Props['language'], string> = {
  en: 'Talk to Rathna',
  si: 'රත්න සමඟ කතා කරන්න',
  ta: 'ரத்னாவுடன் பேசுங்கள்',
}

/** Portrait 9:16 on mobile; landscape 5:4 on desktop (matches Bey card) */
const frameClassName = [
  'relative isolate overflow-hidden rounded-2xl border-2 [transform:translateZ(0)]',
  'mx-auto w-full max-w-[min(100%,20rem)] aspect-[9/16] max-h-[min(72vh,600px)]',
  'md:mx-0 md:max-h-full md:max-w-none md:w-full md:aspect-[5/4] md:max-h-none',
].join(' ')

function AvatarFrame({
  children,
  className,
  label,
}: {
  children: ReactNode
  className: string
  label: string
}) {
  return (
    <div
      className="flex w-full items-center justify-center md:h-full"
      role="region"
      aria-label={label}
    >
      <div className={`${frameClassName} ${className}`}>{children}</div>
    </div>
  )
}

export default function AvatarViewer({
  language,
  selectedService,
  onFormDataReceived,
}: Props) {
  // Reserved for Bey postMessage / webhook integration
  void onFormDataReceived

  const regionLabel = languageTitles[language]

  if (!selectedService) {
    return (
      <AvatarFrame
        label={regionLabel}
        className="flex items-center justify-center border-yellow-400/30 bg-gray-800"
      >
        <div className="px-4 text-center">
          <div className="mb-4 text-6xl" aria-hidden>
            👩‍💼
          </div>
          <p className="text-sm text-gray-400">Rathna will appear here</p>
        </div>
      </AvatarFrame>
    )
  }

  return (
    <AvatarFrame label={regionLabel} className="border-yellow-400/50 bg-black">
      <div className="absolute inset-0 overflow-hidden bg-black [transform:translateZ(0)]">
        <iframe
          src={AGENT_URL}
          title={regionLabel}
          className="absolute inset-0 h-full w-full touch-manipulation border-0 [transform:translateZ(0)]"
          allow="camera; microphone; fullscreen"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-gray-950 from-55% to-transparent md:hidden"
          aria-hidden
        />
      </div>
    </AvatarFrame>
  )
}
