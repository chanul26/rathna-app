'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  generateNICRenewalPDF,
  printNICRenewalPDF,
} from '@/lib/generatePDF'

export interface NICRenewalFormData {
  fullName: string
  nationalId: string
  dateOfBirth: string
  address: string
  phone: string
  reasonForRenewal: string
  district: string
}

interface Props {
  formData: NICRenewalFormData
}

const fields = [
  {
    key: 'fullName',
    label: 'Full Name / සම්පූර්ණ නම',
    placeholder: 'e.g. Kasun Perera',
  },
  {
    key: 'nationalId',
    label: 'NIC Number / ජාතික හැඳුනුම්පත',
    placeholder: 'e.g. 200112345678',
  },
  {
    key: 'dateOfBirth',
    label: 'Date of Birth / උපන් දිනය',
    placeholder: 'e.g. 2001-05-12',
  },
  {
    key: 'address',
    label: 'Address / ලිපිනය',
    placeholder: 'e.g. Colombo',
  },
  {
    key: 'phone',
    label: 'Phone Number / දුරකථන අංකය',
    placeholder: 'e.g. 0771234567',
  },
  {
    key: 'reasonForRenewal',
    label: 'Reason for Renewal / අලුත් කිරීමේ හේතුව',
    placeholder: 'e.g. Lost NIC',
  },
  {
    key: 'district',
    label: 'District / දිස්ත්‍රික්කය',
    placeholder: 'e.g. Colombo',
  },
]

export default function NICRenewalForm({ formData }: Props) {

  const filledCount = fields.filter(
    (f) =>
      (formData[f.key as keyof NICRenewalFormData]?.length ?? 0) > 0,
  ).length

  const isComplete = filledCount === fields.length

  const percent = Math.round((filledCount / fields.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-w-0 pb-2 md:overflow-visible"
    >

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 rounded-xl border border-orange-700/50 bg-orange-900/40 p-4 text-center"
      >

        <p className="text-xs font-medium break-words text-orange-300">
          SRI LANKA REGISTRATION OF PERSONS DEPARTMENT
        </p>

        <h3 className="mt-1 text-lg font-bold text-white">
          National Identity Card Renewal
        </h3>

        <p className="mt-1 text-xs text-gray-400">
          Speak to Rathna to fill this form automatically
        </p>

      </motion.div>

      {/* Fields */}
      <motion.div layout className="space-y-3">

        {fields.map((field) => {

          const value =
            formData[field.key as keyof NICRenewalFormData]

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

              <motion.div
                layout
                className="flex min-h-[28px] items-center"
              >

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

      {/* Completion */}
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
              onClick={() =>
                printNICRenewalPDF(formData)
              }
              className="flex-1 rounded-xl border border-gray-600 bg-gray-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-yellow-400/60 hover:bg-gray-700"
            >
              Print
            </button>

            <button
              type="button"
              onClick={() =>
                generateNICRenewalPDF(formData)
              }
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