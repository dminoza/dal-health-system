import { useState } from 'react'
import { supabase } from '../utils/supabase'

export interface HistoryResult {
  barangay: string
  year: number
  cases: number
  coordinates: number[][]
}

export function useHistory() {
  const [data, setData] = useState<HistoryResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchHistory(year: string) {
    setLoading(true)
    setError(null)
    setData([])

    try {
      const { data: cases, error: err } = await supabase
        .from('cases')
        .select(`
          year,
          count,
          barangays (
            name,
            coordinates
          )
        `)
        .eq('year', parseInt(year))
        .order('count', { ascending: false })

      if (err) throw new Error(err.message)

      const results: HistoryResult[] = cases.map((row: any) => ({
        barangay: row.barangays.name,
        year: row.year,
        cases: row.count,
        coordinates: row.barangays.coordinates,
      }))

      setData(results)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fetchHistory }
}
