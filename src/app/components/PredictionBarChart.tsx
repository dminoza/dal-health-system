import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarangayData {
  name: string;
  cases: number;
}

interface PredictionBarChartProps {
  data: BarangayData[];
}

export function PredictionBarChart({ data }: PredictionBarChartProps) {
  const sortedData = [...data].sort((a, b) => b.cases - a.cases);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Predicted TB Cases Distribution</h2>
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
              label={{ value: 'Predicted Cases', angle: -90, position: 'insideLeft', style: { fill: '#374151' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#111827', fontWeight: 600 }}
            />
            <Bar
              dataKey="cases"
              fill="#8b5cf6"
              radius={[8, 8, 0, 0]}
              name="Predicted Cases"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
