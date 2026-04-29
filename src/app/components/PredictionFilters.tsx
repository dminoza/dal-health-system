import { useState } from 'react'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, i) => currentYear + i)

interface PredictionFiltersProps {
  onFilter: (year: number) => void
}

export function PredictionFilters({ onFilter }: PredictionFiltersProps) {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)

  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-200">
      <label className="text-sm font-medium text-gray-700">
        Forecast Year:
      </label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <button
        onClick={() => onFilter(selectedYear)}
        className="bg-violet-600 text-white px-4 py-1.5 rounded text-sm hover:bg-violet-700 transition-colors"
      >
        Generate Forecast
      </button>
    </div>
  )
}
