import { PredictionResult } from '../../hooks/usePrediction'

interface PredictionTableProps {
  data: PredictionResult[]
}

export function PredictionTable({ data }: PredictionTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No prediction data yet.
      </div>
    )
  }

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            <th className="text-left px-3 py-2 font-semibold text-gray-700">Barangay</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-700">Year</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-700">Predicted Cases</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-700">Lambda</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-3 py-2 text-gray-800">{item.barangay}</td>
              <td className="px-3 py-2 text-gray-600">{item.target_year}</td>
              <td className="px-3 py-2 font-semibold text-violet-700">{item.prediction}</td>
              <td className="px-3 py-2 text-gray-500">{item.lambda}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
