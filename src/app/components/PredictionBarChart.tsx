import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { PredictionResult } from '../../hooks/usePrediction'

interface PredictionBarChartProps {
  data: PredictionResult[]
}

export function PredictionBarChart({ data }: PredictionBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No prediction data yet.
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item.barangay,
    cases: item.prediction,
  }))

  const maxCases = Math.max(...chartData.map((d) => d.cases))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: '#6b7280' }}
          angle={-45}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
        <Tooltip
          formatter={(value) => [`${value} cases`, 'Predicted']}
          labelStyle={{ fontWeight: 'bold' }}
        />
        <Bar dataKey="cases" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.cases === maxCases ? '#7c3aed' : '#8b5cf6'}
              fillOpacity={0.7 + (entry.cases / maxCases) * 0.3}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
