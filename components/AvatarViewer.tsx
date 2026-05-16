'use client'

import { useEffect, useState, type ReactNode } from 'react'

interface Props {
  language: 'en' | 'si' | 'ta'
  selectedService: string | null
  conversationKey: number
  onFormDataReceived: (data: Record<string, string>) => void
}

const languageTitles: Record<Props['language'], string> = {
  en: 'Talk to Rathna',
  si: 'රත්න සමඟ කතා කරන්න',
  ta: 'ரத்னாவுடன் பேசுங்கள்',
}

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
  conversationKey,
  onFormDataReceived,
}: Props) {
  void onFormDataReceived

  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const regionLabel = languageTitles[language]

  useEffect(() => {
    let cancelled = false

    fetch('/api/avatar-session', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { embedUrl?: string } | null) => {
        if (!cancelled && data?.embedUrl) {
          setEmbedUrl(data.embedUrl)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

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

  if (!embedUrl) {
    return (
      <AvatarFrame
        label={regionLabel}
        className="flex items-center justify-center border-yellow-400/30 bg-gray-800"
      >
        <p className="text-sm text-gray-400">Loading Rathna…</p>
      </AvatarFrame>
    )
  }

  return (
    <AvatarFrame label={regionLabel} className="border-yellow-400/50 bg-black">
      <div className="absolute inset-0 overflow-hidden bg-black">
        <iframe
          key={`${conversationKey}-${embedUrl}`}
          src={embedUrl}
          title={regionLabel}
          className="h-full w-full touch-manipulation border-0"
          allow="camera; microphone; fullscreen"
        />
      </div>
    </AvatarFrame>
  )
}
