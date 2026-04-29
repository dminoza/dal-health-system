import { useState } from 'react'
import { PredictionFilters } from '../components/PredictionFilters'
import { PredictionMap } from '../components/PredictionMap'
import { PredictionTable } from '../components/PredictionTable'
import { PredictionBarChart } from '../components/PredictionBarChart'
import { usePrediction } from '../../hooks/usePrediction'

export function PredictionPage() {
  const [year, setYear] = useState<number>(2026)
  const { data, loading, error, fetchPredictions } = usePrediction()

  function handleFilter(selectedYear: number) {
    setYear(selectedYear)
    fetchPredictions(selectedYear)
  }

  return (
    <>
      {/* Filter Bar */}
      <PredictionFilters onFilter={handleFilter} />

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-16 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Generating forecast for {year}...
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200 text-red-600 text-sm">
          ⚠️ Error: {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && data.length === 0 && (
        <div className="flex justify-center items-center h-16 bg-white border-b border-gray-200">
          <p className="text-gray-400 text-sm">
            Select a year and click "Generate Forecast" to see predictions.
          </p>
        </div>
      )}

      {/* Map Area */}
      <div className="h-[500px] relative">
        <PredictionMap data={data} year={year} />
      </div>

      {/* Bottom Section - Table and Chart */}
      <div className="h-96 border-t border-gray-200 bg-gray-50 p-6">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left: Table */}
          <PredictionTable data={data} />

          {/* Right: Bar Chart */}
          <PredictionBarChart data={data} />
        </div>
      </div>
    </>
  )
}
