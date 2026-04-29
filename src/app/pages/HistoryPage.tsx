import { useState } from 'react'
import { FilterBar } from '../components/FilterBar'
import { Map } from '../components/Map'
import { HistoryTable } from '../components/HistoryTable'
import { CasesBarChart } from '../components/CasesBarChart'
import { useHistory } from '../../hooks/useHistory'

export function HistoryPage() {
  const [year, setYear] = useState('2025')
  const { data, loading, error, fetchHistory } = useHistory()

  function handleFilterChange(disease: string, selectedYear: string) {
    setYear(selectedYear)
    fetchHistory(selectedYear)
  }

  return (
    <>
      {/* Filter Bar */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-16 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading history for {year}...
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
            Select a year and click "Search History" to see data.
          </p>
        </div>
      )}

      {/* Map Area */}
      <div className="h-[500px] relative">
        <Map data={data} year={year} />
      </div>

      {/* Bottom Section - Table and Chart */}
      <div className="h-96 border-t border-gray-200 bg-gray-50 p-6">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left: Table */}
          <HistoryTable data={data} />

          {/* Right: Bar Chart */}
          <CasesBarChart data={data} />
        </div>
      </div>
    </>
  )
}
