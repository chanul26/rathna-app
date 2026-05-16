import { useState, useEffect, useRef, useCallback } from 'react'

type BrowserSpeechRecognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: { resultIndex: number; results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

export function useSpeech(
  language: 'en' | 'si' | 'ta',
  sessionKey: number,
  onTranscriptComplete: (transcript: string) => void,
) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const isListeningRef = useRef(false)
  const onTranscriptRef = useRef(onTranscriptComplete)

  onTranscriptRef.current = onTranscriptComplete

  useEffect(() => {
    if (typeof window === 'undefined') return

    const win = window as Window & {
      SpeechRecognition?: new () => BrowserSpeechRecognition
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition
    }
    const SpeechRecognition =
      win.SpeechRecognition ?? win.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false

    if (language === 'si') recognition.lang = 'si-LK'
    else if (language === 'ta') recognition.lang = 'ta-LK'
    else recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const current = event.resultIndex
      const transcript = event.results[current]?.[0]?.transcript ?? ''
      if (transcript.trim().length > 0) {
        onTranscriptRef.current(transcript)
      }
    }

    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start()
        } catch {
          // already started
        }
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.onresult = null
      recognition.onend = null
      recognition.stop()
      recognitionRef.current = null
    }
  }, [language, sessionKey])

  const startListening = useCallback(() => {
    isListeningRef.current = true
    setIsListening(true)
    try {
      recognitionRef.current?.start()
    } catch {
      // already started
    }
  }, [])

  const stopListening = useCallback(() => {
    isListeningRef.current = false
    setIsListening(false)
    recognitionRef.current?.stop()
  }, [])

  return { isListening, startListening, stopListening }
}
