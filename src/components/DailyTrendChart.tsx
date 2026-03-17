'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts'

interface DailyEntry {
  data: string  // "2026-03-01"
  won: number   // acumulado no dia
}

interface DailyTrendChartProps {
  cor: string
  dailyData: DailyEntry[]
  meta: number
}

function buildChartData(dailyData: DailyEntry[], meta: number) {
  // Gerar todos os dias de março
  const daysInMonth = 31
  const totalDays = daysInMonth

  // Montar mapa de won por data (acumulado)
  const wonByDay: Record<string, number> = {}
  for (const entry of dailyData) {
    const day = new Date(entry.data).getUTCDate()
    wonByDay[day] = entry.won
  }

  // Calcular acumulado real e projeção
  const result = []
  let accumulated = 0

  for (let d = 1; d <= daysInMonth; d++) {
    if (wonByDay[d] !== undefined) {
      accumulated += wonByDay[d]
    }

    const projection = Math.round((meta / totalDays) * d)

    result.push({
      dia: d,
      acumulado: accumulated > 0 || d <= new Date().getUTCDate() ? accumulated : undefined,
      projecao: projection,
    })
  }

  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">Dia {label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === 'acumulado' ? 'WON' : 'Ritmo'}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function DailyTrendChart({ cor, dailyData, meta }: DailyTrendChartProps) {
  const chartData = buildChartData(dailyData, meta)

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="dia"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Linha de meta */}
          <ReferenceLine
            y={meta}
            stroke="#4b5563"
            strokeDasharray="4 4"
            label={{ value: `Meta ${meta}`, fill: '#6b7280', fontSize: 10, position: 'insideTopRight' }}
          />

          {/* Linha de ritmo necessário (projeção) */}
          <Line
            type="monotone"
            dataKey="projecao"
            stroke="#6b7280"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            dot={false}
            name="projecao"
          />

          {/* Linha real acumulada */}
          <Line
            type="monotone"
            dataKey="acumulado"
            stroke={cor}
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            name="acumulado"
            activeDot={{ r: 4, fill: cor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
