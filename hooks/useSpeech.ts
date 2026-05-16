import { useState, useEffect, useRef } from 'react';

export function useSpeech(
  language: 'en' | 'si' | 'ta', 
  onTranscriptComplete: (transcript: string) => void
) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Fallback for different browsers
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    
    // Map our app languages to browser speech codes
    if (language === 'si') recognition.lang = 'si-LK';
    else if (language === 'ta') recognition.lang = 'ta-LK';
    else recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      if (transcript.trim().length > 0) {
        onTranscriptComplete(transcript);
      }
    };

    recognition.onend = () => {
      // If we are still supposed to be listening, automatically restart
      if (isListening) {
        try { recognition.start(); } catch(e) {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isListening, language, onTranscriptComplete]);

  const startListening = () => {
    setIsListening(true);
    try { recognitionRef.current?.start(); } catch (e) {}
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  return { isListening, startListening, stopListening };
}