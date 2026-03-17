'use client'

interface OkrCardProps {
  nome: string
  cor: string
  won: number | null
  meta: number | null
}

export default function OkrCard({ nome, cor, won, meta }: OkrCardProps) {
  const isLoading = won === null || meta === null
  const pct = meta && meta > 0 ? Math.round(((won ?? 0) / meta) * 100) : 0
  const barWidth = Math.min(pct, 100)

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800" style={{ borderTop: `4px solid ${cor}` }}>
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-gray-700 rounded w-3/4" />
          <div className="h-8 bg-gray-700 rounded w-1/2" />
          <div className="h-2 bg-gray-800 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-gray-900 rounded-xl p-5 border border-gray-800"
      style={{ borderTop: `4px solid ${cor}` }}
    >
      <p className="text-gray-400 text-xs font-medium truncate mb-3" title={nome}>
        {nome}
      </p>

      <div className="flex items-end justify-between mb-3">
        <span className="text-2xl font-bold text-white">
          {won} <span className="text-gray-500 text-base font-normal">/ {meta}</span>
        </span>
        <span
          className="text-sm font-bold px-2 py-0.5 rounded-md"
          style={{ backgroundColor: `${cor}22`, color: cor }}
        >
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${barWidth}%`, backgroundColor: cor }}
        />
      </div>
    </div>
  )
}
