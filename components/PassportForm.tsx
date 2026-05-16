'use client'

import { motion, AnimatePresence } from 'framer-motion'

export interface PassportFormData {
  surname: string
  otherNames: string
  nationalId: string
  dateOfBirth: string
  placeOfBirth: string
  gender: string
  address: string
  district: string
  phone: string
  serviceType: string
}

interface Props {
  formData: PassportFormData
}

const fields = [
  { key: 'surname', label: 'Surname / අවසන් නම', placeholder: 'e.g. Perera' },
  { key: 'otherNames', label: 'Other Names / අනෙකුත් නම්', placeholder: 'e.g. Kamal' },
  { key: 'nationalId', label: 'NIC Number / ජාතික හැඳුනුම්පත', placeholder: 'e.g. 199512345678' },
  { key: 'dateOfBirth', label: 'Date of Birth / උපන් දිනය', placeholder: 'e.g. 1995-06-15' },
  { key: 'placeOfBirth', label: 'Place of Birth / උපන් ස්ථානය', placeholder: 'e.g. Colombo' },
  { key: 'gender', label: 'Gender / ලිංගය', placeholder: 'Male / Female' },
  { key: 'address', label: 'Permanent Address / ස්ථිර ලිපිනය', placeholder: 'e.g. 123, Main Street, Kandy' },
  { key: 'district', label: 'District / දිස්ත්‍රික්කය', placeholder: 'e.g. Kandy' },
  { key: 'phone', label: 'Phone Number / දුරකථන අංකය', placeholder: 'e.g. 0771234567' },
  { key: 'serviceType', label: 'Service Type / සේවා වර්ගය', placeholder: 'Normal / One Day' },
]

export default function PassportForm({ formData }: Props) {
  return (
    <div className="w-full h-full overflow-y-auto">
      {/* Form Header */}
      <div className="bg-blue-900/40 border border-blue-700/50 rounded-xl p-4 mb-4 text-center">
        <p className="text-xs text-blue-300 font-medium">SRI LANKA DEPARTMENT OF IMMIGRATION & EMIGRATION</p>
        <h3 className="text-white font-bold text-lg mt-1">Passport Application Form</h3>
        <p className="text-xs text-gray-400 mt-1">Speak to Rathna to fill this form automatically</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        {fields.map((field) => {
          const value = formData[field.key as keyof PassportFormData]
          const isFilled = value && value.length > 0

          return (
            <div
              key={field.key}
              className={`rounded-lg border p-3 transition-all duration-500 ${
                isFilled
                  ? 'border-yellow-400/60 bg-yellow-400/5'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <label className="text-xs text-gray-400 block mb-1">
                {field.label}
              </label>

              <div className="min-h-[28px] flex items-center">
                {isFilled ? (
                  <AnimatePresence>
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white font-medium text-sm"
                    >
                      {value}
                    </motion.p>
                  </AnimatePresence>
                ) : (
                  <p className="text-gray-600 text-sm italic">
                    {field.placeholder}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion indicator */}
      {(() => {
        const filledCount = fields.filter(
          f => formData[f.key as keyof PassportFormData]
        ).length
        const percent = Math.round((filledCount / fields.length) * 100)
        return (
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Form completion</span>
              <span>{filledCount}/{fields.length} fields</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-yellow-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )
      })()}
    </div>
  )
}