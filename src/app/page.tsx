'use client'

import { useEffect, useState } from 'react'
import OkrCard from '@/components/OkrCard'
import OkrSection from '@/components/OkrSection'

const OKR_CONFIG = [
  { key: 'szi', nome: 'Acelerar Vendas SZI', cor: '#3B82F6' },
  { key: 'szs', nome: 'Crescimento Imóveis Ativos SZS', cor: '#10B981' },
  { key: 'expansao', nome: 'Expansão 3.0', cor: '#8B5CF6' },
  { key: 'marketplace', nome: 'Marketplace 3.0', cor: '#F59E0B' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiData = any

export default function Dashboard() {
  const [data, setData] = useState<ApiData>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/okr?month=2026-03')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  async function handleSync() {
    setSyncing(true)
    try {
      await fetch('/api/okr/sync', { method: 'POST' })
      setLastSync(new Date().toLocaleTimeString('pt-BR'))
      await loadData()
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function getWonTotal(okrKey: string): number {
    if (!data?.funil) return 0
    return data.funil
      .filter((r: ApiData) => r.okr_key === okrKey)
      .reduce((sum: number, r: ApiData) => sum + (r.won || 0), 0)
  }

  function getMeta(okrKey: string): number {
    if (!data?.targets) return 0
    return data.targets.find((t: ApiData) => t.okr_key === okrKey)?.meta_won || 0
  }

  function getDailyData(okrKey: string) {
    if (!data?.funil) return []
    return data.funil
      .filter((r: ApiData) => r.okr_key === okrKey)
      .map((r: ApiData) => ({ data: r.data, won: r.won }))
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Resultados do Mês</h1>
          <p className="text-gray-400 text-sm mt-0.5">Março 2026 · Seazone</p>
        </div>
        <div className="flex items-center gap-4">
          {lastSync && (
            <span className="text-gray-500 text-sm">Atualizado {lastSync}</span>
          )}
          <button
            onClick={handleSync}
            disabled={syncing || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {syncing ? 'Sincronizando...' : 'Sincronizar'}
          </button>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Erro */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl px-5 py-4 text-red-300 text-sm">
            Erro ao carregar dados: {error}
          </div>
        )}

        {/* Cards resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {OKR_CONFIG.map((okr) => (
            <OkrCard
              key={okr.key}
              nome={okr.nome}
              cor={okr.cor}
              won={loading ? null : getWonTotal(okr.key)}
              meta={loading ? null : getMeta(okr.key)}
            />
          ))}
        </div>

        {/* Seções por OKR */}
        <div className="space-y-4">
          {OKR_CONFIG.map((okr) => (
            <OkrSection
              key={okr.key}
              nome={okr.nome}
              cor={okr.cor}
              won={loading ? null : getWonTotal(okr.key)}
              meta={loading ? null : getMeta(okr.key)}
              dailyData={loading ? [] : getDailyData(okr.key)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
