'use client'

import { useState } from 'react'
import PassportForm, { PassportFormData } from '@/components/PassportForm'
import AvatarViewer from '@/components/AvatarViewer'

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

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'si' | 'ta'>('en')
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [passportData, setPassportData] = useState<PassportFormData>(emptyPassportForm)

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

  function handleFormData(data: Record<string, string>) {
    if (selectedService === 'passport') {
      setPassportData(prev => ({ ...prev, ...data }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🇱🇰</span>
          <div>
            <h1 className="text-2xl font-bold text-yellow-400">{t.title}</h1>
            <p className="text-xs text-gray-400">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(['en', 'si', 'ta'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

      {/* Main Content */}
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">

        {/* Left — Avatar */}
        <div className="flex w-full shrink-0 flex-col items-center gap-3 border-b border-gray-800 p-4 md:w-1/2 md:min-h-0 md:shrink md:gap-4 md:border-b-0 md:border-r md:p-6">
          <div className="flex w-full items-center justify-center overscroll-contain px-2 max-md:min-h-[min(72vh,600px)] md:min-h-0 md:h-full md:flex-1">
            <AvatarViewer
              language={language}
              selectedService={selectedService}
              onFormDataReceived={handleFormData}
            />
          </div>
          <div className="w-full max-w-sm shrink-0 bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-300 text-sm">
              {selectedService
                ? 'Speak to Rathna to fill your form'
                : t.selectService}
            </p>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex w-full flex-1 flex-col p-4 md:w-1/2 md:min-h-0 md:p-8 md:overflow-y-auto">
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
                    onClick={() => setSelectedService(service.id)}
                    className="w-full p-5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-yellow-400 rounded-xl text-left transition-all group"
                  >
                    <span className="text-lg group-hover:text-yellow-400 transition-colors">
                      {service.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => {
                    setSelectedService(null)
                    setPassportData(emptyPassportForm)
                  }}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ← Back
                </button>
                <h2 className="text-lg font-semibold text-yellow-400">
                  {selectedService === 'passport' ? t.passport
                    : selectedService === 'gn' ? t.gn
                    : t.business}
                </h2>
              </div>

              {selectedService === 'passport' && (
                <PassportForm formData={passportData} />
              )}
              {selectedService === 'gn' && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <p className="text-gray-400 text-center">GN Form coming next</p>
                </div>
              )}
              {selectedService === 'business' && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <p className="text-gray-400 text-center">Business Form coming next</p>
                </div>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}