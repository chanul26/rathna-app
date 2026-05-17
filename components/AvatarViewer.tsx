'use client'

import { useEffect, useState, type ReactNode } from 'react'

interface Props {
  language: 'en' | 'si' | 'ta'
  selectedService: string | null
  conversationKey: number
  onAgentIdChange: (agentId: string | null) => void
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
  onAgentIdChange,
}: Props) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const regionLabel = languageTitles[language]

  useEffect(() => {
    if (!selectedService) {
      setEmbedUrl(null)
      setSessionError(null)
      onAgentIdChange(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setSessionError(null)
    setEmbedUrl(null)
    onAgentIdChange(null)

    const params = new URLSearchParams({
      service: selectedService,
      language,
    })

    fetch(`/api/avatar-session?${params}`, { cache: 'no-store' })
      .then(async (res) => {
        const data = (await res.json()) as {
          embedUrl?: string
          agentId?: string
          error?: string
          useBaseAgent?: boolean
        }
        if (cancelled) return

        if (res.ok && data.embedUrl && data.agentId) {
            setEmbedUrl(data.embedUrl)
            onAgentIdChange(data.agentId)
            if (data.useBaseAgent && selectedService !== 'passport') {
              setSessionError(
                'Using default agent — GN/Business prompts may not apply. Check API key permissions.',
              )
            }
          return
        }

        setSessionError(data.error ?? 'Could not load Rathna')
        onAgentIdChange(null)
      })
      .catch(() => {
        if (!cancelled) {
          setSessionError('Could not connect to Rathna')
          onAgentIdChange(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedService, language, conversationKey, onAgentIdChange])

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

  if (loading || !embedUrl) {
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
    <div className="flex w-full flex-col items-center gap-2">
      {sessionError && (
        <p className="max-w-sm px-2 text-center text-xs text-amber-400/90">
          {sessionError}
        </p>
      )}
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
    </div>
  )
}
