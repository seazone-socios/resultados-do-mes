'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import DailyTrendChart from './DailyTrendChart'

interface DailyEntry {
  data: string
  won: number
}

interface OkrSectionProps {
  nome: string
  cor: string
  won: number | null
  meta: number | null
  dailyData: DailyEntry[]
}

export default function OkrSection({ nome, cor, won, meta, dailyData }: OkrSectionProps) {
  const [open, setOpen] = useState(false)

  const pct = meta && meta > 0 ? Math.round(((won ?? 0) / meta) * 100) : 0
  const isLoading = won === null || meta === null

  return (
    <div
      className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
      style={{ borderLeft: `4px solid ${cor}` }}
    >
      {/* Header clicável */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-sm">{nome}</span>
          {!isLoading && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-md"
              style={{ backgroundColor: `${cor}22`, color: cor }}
            >
              {pct}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isLoading && (
            <span className="text-gray-400 text-sm">
              {won} <span className="text-gray-600">/ {meta}</span>
            </span>
          )}
          {open ? (
            <ChevronUp className="text-gray-500 w-4 h-4 flex-shrink-0" />
          ) : (
            <ChevronDown className="text-gray-500 w-4 h-4 flex-shrink-0" />
          )}
        </div>
      </button>

      {/* Conteúdo expansível */}
      {open && (
        <div className="px-5 pb-5 border-t border-gray-800 pt-4">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
              Carregando dados...
            </div>
          ) : (
            <DailyTrendChart
              cor={cor}
              dailyData={dailyData}
              meta={meta ?? 0}
            />
          )}
        </div>
      )}
    </div>
  )
}
