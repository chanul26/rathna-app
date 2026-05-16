'use client'

interface Props {
  language: 'en' | 'si' | 'ta'
  selectedService: string | null
  onFormDataReceived: (data: Record<string, string>) => void
}

const AGENT_URL = 'https://bey.chat/f25dd3c0-9cf2-461a-b44a-f7941994b8d4'

export default function AvatarViewer({ selectedService }: Props) {
  if (!selectedService) {
    return (
      <div className="w-80 h-80 rounded-2xl bg-gray-800 border-2 border-yellow-400/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👩‍💼</div>
          <p className="text-gray-400 text-sm">Rathna will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 h-80 rounded-2xl overflow-hidden border-2 border-yellow-400/50">
      <iframe
        src={AGENT_URL}
        width="100%"
        height="100%"
        allow="camera; microphone; fullscreen"
        style={{ border: 'none' }}
      />
    </div>
  )
}