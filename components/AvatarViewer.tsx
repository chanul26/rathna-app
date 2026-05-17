'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, type ReactNode } from 'react'

import govmindLogo from './govmind.png'

const logoPulse = {
  scale: [1, 1.05, 1],
  boxShadow: [
    '0 0 0 0 rgba(250, 204, 21, 0.15)',
    '0 0 0 8px rgba(250, 204, 21, 0)',
    '0 0 0 0 rgba(250, 204, 21, 0.15)',
  ],
}

const logoPulseTransition = {
  duration: 2.5,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}

function GovMindLogo({ size = 80 }: { size?: number }) {
  return (
    <motion.div
      className="relative mx-auto mb-4 overflow-hidden rounded-full ring-2 ring-yellow-400/40"
      style={{ width: size, height: size }}
      animate={logoPulse}
      transition={logoPulseTransition}
      aria-hidden
    >
      <Image
        src={govmindLogo}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-cover"
        priority
      />
    </motion.div>
  )
}

interface Props {
  language: 'en' | 'si' | 'ta'
  selectedService: string | null
  conversationKey: number
  onAgentIdChange: (agentId: string | null) => void
}

const languageTitles: Record<Props['language'], string> = {
  en: 'Talk to GovMind',
  si: 'GovMind සමඟ කතා කරන්න',
  ta: 'GovMind உடன் பேசுங்கள்',
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
                'Using default agent — this form may not fill correctly. Check Bey API key can create agents.',
              )
            }
          return
        }

        setSessionError(data.error ?? 'Could not load GovMind')
        onAgentIdChange(null)
      })
      .catch(() => {
        if (!cancelled) {
          setSessionError('Could not connect to GovMind')
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
        <motion.div
          className="px-4 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <GovMindLogo />
          <motion.p
            className="text-sm text-gray-400"
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            GovMind will appear here
          </motion.p>
        </motion.div>
      </AvatarFrame>
    )
  }

  if (loading || !embedUrl) {
    return (
      <AvatarFrame
        label={regionLabel}
        className="flex items-center justify-center border-yellow-400/30 bg-gray-800"
      >
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <GovMindLogo size={64} />
          <motion.p
            className="text-sm text-gray-400"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Loading GovMind…
          </motion.p>
        </motion.div>
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
