'use client'

import { motion, AnimatePresence } from 'framer-motion'

export interface GNFormData {
  fullName: string
  nationalId: string
  address: string
  reason: string
  district: string
}

interface Props {
  formData: GNFormData
}

const fields = [
  {
    key: 'fullName',
    label: 'Full Name / සම්පූර්ණ නම',
    placeholder: 'e.g. Kasun Perera'
  },
  {
    key: 'nationalId',
    label: 'NIC Number / ජාතික හැඳුනුම්පත',
    placeholder: 'e.g. 200012345678'
  },
  {
    key: 'address',
    label: 'Address / ලිපිනය',
    placeholder: 'e.g. Kandy'
  },
  {
    key: 'reason',
    label: 'Reason / අවශ්‍ය හේතුව',
    placeholder: 'e.g. Bank loan'
  },
  {
    key: 'district',
    label: 'District / දිස්ත්‍රික්කය',
    placeholder: 'e.g. Kandy'
  }
]

export default function GNForm({ formData }: Props) {
  return (
    <div className="w-full min-w-0 pb-2 md:overflow-visible">

      {/* Form Header */}
      <div className="mb-4 rounded-xl border border-green-700/50 bg-green-900/40 p-4 text-center">
        <p className="text-xs font-medium break-words text-green-300">
          SRI LANKA GRAMA NILADHARI DIVISION
        </p>

        <h3 className="text-white font-bold text-lg mt-1">
          Grama Niladhari Certificate
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          Speak to Rathna to fill this form automatically
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">

        {fields.map((field) => {

          const value = formData[field.key as keyof GNFormData]

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

              <label className="mb-1 block text-xs break-words text-gray-400">
                {field.label}
              </label>

              <div className="min-h-[28px] flex items-center">

                {isFilled ? (
                  <AnimatePresence>

                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="break-words text-sm font-medium text-white"
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

      {/* Completion Indicator */}
      {(() => {

        const filledCount = fields.filter(
          f => formData[f.key as keyof GNFormData]
        ).length

        const percent = Math.round(
          (filledCount / fields.length) * 100
        )

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