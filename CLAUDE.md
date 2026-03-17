# resultados-do-mes

Dashboard de OKRs mensais da Seazone.

## Stack
- Next.js 16 + React 19 + TypeScript + Tailwind + Recharts
- Supabase ewgqbkdriflarmmifrvs (Auth + DB)
- Deploy: Vercel (seazone-socios org)

## Regras
- Trino: CAST(x AS DATE), NUNCA ::date
- Auth: OAuth Google @seazone.com.br only
- NUNCA push direto → main
