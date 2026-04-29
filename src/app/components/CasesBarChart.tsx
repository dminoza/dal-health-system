import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HistoryResult } from '../hooks/useHistory';

interface CasesBarChartProps {
  data: HistoryResult[];
}

export function CasesBarChart({ data }: CasesBarChartProps) {
  const sortedData = [...data]
    .sort((a, b) => b.cases - a.cases)
    .map((item) => ({
      name: item.barangay,
      cases: item.cases,
      year: item.year,
    }));

  const maxCases = Math.max(...sortedData.map((d) => d.cases));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">TB Cases Distribution</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          No data available. Select a year and search.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">TB Cases Distribution</h2>
        {sortedData.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">Year: {sortedData[0].year}</p>
        )}
      </div>

      <div className="flex-1 p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={{
                value: 'TB Cases',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#374151' },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#111827', fontWeight: 600 }}
              formatter={(value) => [`${value} cases`, 'TB Cases']}
            />
            <Bar dataKey="cases" radius={[8, 8, 0, 0]} name="TB Cases">
              {sortedData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.cases === maxCases
                      ? '#ef4444'
                      : entry.cases >= maxCases * 0.75
                      ? '#f97316'
                      : entry.cases >= maxCases * 0.5
                      ? '#3b82f6'
                      : '#60a5fa'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
