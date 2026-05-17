'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { generateBusinessPDF, printBusinessPDF } from '@/lib/generatePDF'

export interface BusinessFormData {
  businessName: string
  ownerName: string
  nationalId: string
  businessAddress: string
  businessType: string
  district: string
}

interface Props {
  formData: BusinessFormData
}

const fields = [
  {
    key: 'businessName',
    label: 'Business Name / ව්‍යාපාර නාමය',
    placeholder: 'e.g. Perera Stores',
  },
  {
    key: 'ownerName',
    label: 'Owner Name / අයිතිකරුගේ නම',
    placeholder: 'e.g. Kasun Perera',
  },
  {
    key: 'nationalId',
    label: 'NIC Number / ජාතික හැඳුනුම්පත',
    placeholder: 'e.g. 200012345678',
  },
  {
    key: 'businessAddress',
    label: 'Business Address / ව්‍යාපාර ලිපිනය',
    placeholder: 'e.g. Colombo',
  },
  {
    key: 'businessType',
    label: 'Business Type / ව්‍යාපාර වර්ගය',
    placeholder: 'e.g. Retail Shop',
  },
  {
    key: 'district',
    label: 'District / දිස්ත්‍රික්කය',
    placeholder: 'e.g. Colombo',
  },
]

export default function BusinessForm({ formData }: Props) {
  const filledCount = fields.filter(
    (f) => (formData[f.key as keyof BusinessFormData]?.length ?? 0) > 0,
  ).length
  const isComplete = filledCount === fields.length
  const percent = Math.round((filledCount / fields.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-w-0 pb-2 md:overflow-visible"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 rounded-xl border border-purple-700/50 bg-purple-900/40 p-4 text-center"
      >
        <p className="text-xs font-medium break-words text-purple-300">
          SRI LANKA BUSINESS REGISTRATION
        </p>
        <h3 className="mt-1 text-lg font-bold text-white">
          Business Registration Form
        </h3>
        <p className="mt-1 text-xs text-gray-400">
          Speak to GovMind to fill this form automatically
        </p>
      </motion.div>

      <motion.div layout className="space-y-3">
        {fields.map((field) => {
          const value = formData[field.key as keyof BusinessFormData]
          const isFilled = value && value.length > 0

          return (
            <motion.div
              key={field.key}
              layout
              className={`rounded-lg border p-3 transition-all duration-500 ${
                isFilled
                  ? 'border-yellow-400/60 bg-yellow-400/5'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <label className="mb-1 block text-xs break-words text-gray-400">
                {field.label}
              </label>

              <motion.div layout className="flex min-h-[28px] items-center">
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
                  <p className="text-sm italic text-gray-600">
                    {field.placeholder}
                  </p>
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg bg-gray-800 p-3">
          <div className="mb-2 flex justify-between text-xs text-gray-400">
            <span>Form completion</span>
            <span>
              {filledCount}/{fields.length} fields
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-700">
            <motion.div
              className="h-2 rounded-full bg-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => printBusinessPDF(formData)}
              className="flex-1 rounded-xl border border-gray-600 bg-gray-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-yellow-400/60 hover:bg-gray-700"
            >
              Print
            </button>
            <button
              type="button"
              onClick={() => generateBusinessPDF(formData)}
              className="flex-1 rounded-xl border border-yellow-400/60 bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-950 transition-colors hover:bg-yellow-300"
            >
              Download PDF
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
