'use client'

import { useState, useEffect, useCallback } from 'react'
import PassportForm, { PassportFormData } from '@/components/PassportForm'
import GNForm, { GNFormData } from '@/components/GNForm'
import BusinessForm, { BusinessFormData } from '@/components/BusinessForm'
import AvatarViewer from '@/components/AvatarViewer'
import { useSpeech } from '@/hooks/useSpeech'

const emptyPassportForm: PassportFormData = {
  surname: '',
  otherNames: '',
  nationalId: '',
  dateOfBirth: '',
  placeOfBirth: '',
  gender: '',
  address: '',
  district: '',
  phone: '',
  serviceType: '',
}

const emptyGnForm: GNFormData = {
  fullName: '',
  nationalId: '',
  address: '',
  reason: '',
  district: '',
}

const emptyBusinessForm: BusinessFormData = {
  businessName: '',
  ownerName: '',
  nationalId: '',
  businessAddress: '',
  businessType: '',
  district: '',
}

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'si' | 'ta'>('en')
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [passportData, setPassportData] =
    useState<PassportFormData>(emptyPassportForm)
  const [gnData, setGnData] = useState<GNFormData>(emptyGnForm)
  const [businessData, setBusinessData] =
    useState<BusinessFormData>(emptyBusinessForm)

  const labels = {
    en: {
      title: 'RATHNA',
      subtitle: 'Your AI Government Assistant',
      selectService: 'What do you need help with today?',
      passport: '🛂 Passport Application',
      gn: '📄 Grama Niladhari Certificate',
      business: '🏢 Business Registration',
    },
    si: {
      title: 'රත්න',
      subtitle: 'ඔබේ AI රජයේ සේවාව',
      selectService: 'අද ඔබට කුමක් අවශ්‍යද?',
      passport: '🛂 ගමන් බලපත්‍ර අයදුම්පත',
      gn: '📄 ග්‍රාම නිලධාරී සහතිකය',
      business: '🏢 ව්‍යාපාර ලියාපදිංචිය',
    },
    ta: {
      title: 'ரத்னா',
      subtitle: 'உங்கள் AI அரசாங்க உதவியாளர்',
      selectService: 'இன்று உங்களுக்கு என்ன உதவி வேண்டும்?',
      passport: '🛂 கடவுச்சீட்டு விண்ணப்பம்',
      gn: '📄 கிராம அலுவலர் சான்றிதழ்',
      business: '🏢 வணிக பதிவு',
    },
  }

  const t = labels[language]

  const applyFormData = useCallback(
    (data: Record<string, string>) => {
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== ''),
      )

      if (selectedService === 'passport') {
        setPassportData((prev) => ({ ...prev, ...cleanedData }))
      } else if (selectedService === 'gn') {
        setGnData((prev) => ({ ...prev, ...cleanedData }))
      } else if (selectedService === 'business') {
        setBusinessData((prev) => ({ ...prev, ...cleanedData }))
      }
    },
    [selectedService],
  )

  const processTranscript = useCallback(
    async (transcript: string) => {
      if (!selectedService) return

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript,
            service: selectedService,
          }),
        })

        const extractedData = await response.json()
        applyFormData(extractedData)
      } catch (error) {
        console.error('Failed to process transcript:', error)
      }
    },
    [selectedService, applyFormData],
  )

  const { startListening, stopListening } = useSpeech(
    language,
    processTranscript,
  )

  useEffect(() => {
    if (selectedService) {
      startListening()
    } else {
      stopListening()
    }
    return () => stopListening()
  }, [selectedService, startListening, stopListening])

  function handleBack() {
    setSelectedService(null)
    setPassportData(emptyPassportForm)
    setGnData(emptyGnForm)
    setBusinessData(emptyBusinessForm)
  }

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-gray-950 text-white">

      <header className="safe-padding-x flex w-full shrink-0 flex-col items-center gap-3 border-b border-gray-800 px-4 py-4 sm:flex-row sm:justify-between sm:px-6 md:px-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🇱🇰</span>
          <div>
            <h1 className="text-2xl font-bold text-yellow-400">{t.title}</h1>
            <p className="text-xs text-gray-400">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {(['en', 'si', 'ta'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              aria-pressed={language === lang}
              onClick={() => setLanguage(lang)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4 sm:py-2 ${
                language === lang
                  ? 'bg-yellow-400 text-gray-950'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'si' ? 'සිංහල' : 'தமிழ்'}
            </button>
          ))}
        </div>
      </header>

      <main className="safe-padding-bottom flex min-h-0 w-full flex-1 flex-col items-center overflow-x-hidden overflow-y-auto max-md:px-4 md:flex-row md:items-stretch md:overflow-hidden md:px-0">
        <div className="mx-auto flex w-full max-w-lg shrink-0 flex-col items-center gap-3 border-b border-gray-800 p-4 md:mx-0 md:max-w-none md:w-1/2 md:min-h-0 md:shrink md:gap-4 md:border-b-0 md:border-r md:p-6">
          <div
            className={`flex w-full max-w-sm items-center justify-center overscroll-contain px-2 md:min-h-0 md:h-full md:max-w-none md:flex-1 ${
              selectedService
                ? 'max-md:min-h-[min(50vh,420px)]'
                : 'max-md:min-h-0'
            }`}
          >
            <AvatarViewer
              language={language}
              selectedService={selectedService}
              onFormDataReceived={applyFormData}
            />
          </div>
          <div
            className={`mx-auto w-full max-w-sm shrink-0 rounded-xl bg-gray-800 p-4 text-center ${
              selectedService ? '' : 'max-md:hidden'
            }`}
          >
            <p className="text-gray-300 text-sm">
              {selectedService
                ? 'Speak to Rathna to fill your form'
                : t.selectService}
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-lg min-w-0 flex-1 flex-col p-4 max-md:px-0 max-md:pb-6 md:mx-0 md:max-w-none md:w-1/2 md:min-h-0 md:p-8 md:overflow-y-auto">
          {!selectedService ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-md space-y-4">
                <h2 className="text-xl font-semibold text-center mb-8 text-gray-200">
                  {t.selectService}
                </h2>
                {[
                  { id: 'passport', label: t.passport },
                  { id: 'gn', label: t.gn },
                  { id: 'business', label: t.business },
                ].map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
                    className="group w-full rounded-xl border border-gray-700 bg-gray-800 p-5 text-left transition-all hover:border-yellow-400 hover:bg-gray-700"
                  >
                    <span className="text-base leading-snug break-words transition-colors group-hover:text-yellow-400 sm:text-lg">
                      {service.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex w-full min-w-0 flex-col">
              <div className="mb-4 flex min-w-0 items-start gap-2 max-md:sticky max-md:top-0 max-md:z-20 max-md:bg-gray-950 max-md:py-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="shrink-0 pt-0.5 text-sm text-gray-400 hover:text-white"
                >
                  ← Back
                </button>
                <h2 className="min-w-0 flex-1 text-base font-semibold leading-snug text-yellow-400 sm:text-lg">
                  {selectedService === 'passport'
                    ? t.passport
                    : selectedService === 'gn'
                      ? t.gn
                      : t.business}
                </h2>
              </div>

              {selectedService === 'passport' && (
                <PassportForm formData={passportData} />
              )}
              {selectedService === 'gn' && <GNForm formData={gnData} />}
              {selectedService === 'business' && (
                <BusinessForm formData={businessData} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}