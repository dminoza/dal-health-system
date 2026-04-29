import { useState } from 'react'

export interface PredictionResult {
  barangay: string;
  last_year: number;
  target_year: number;
  steps_ahead: number;
  prediction: number;
  lambda: number;
  coordinates: number[][];
}

export interface PredictionResponse {
  year: number;
  count: number;
  results: PredictionResult[];
}

export function usePrediction() {
  const [data, setData] = useState<PredictionResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchPredictions(year: number) {
    setLoading(true)
    setError(null)
    setData([])

    try {
      const response = await fetch(
        `https://callum231.pythonanywhere.com/forecast_all_year?year=${year}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const json: PredictionResponse = await response.json()
      setData(json.results)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fetchPredictions }
}
