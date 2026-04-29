import { HistoryResult } from '../hooks/useHistory';

interface HistoryTableProps {
  data: HistoryResult[];
}

export function HistoryTable({ data }: HistoryTableProps) {
  const sortedData = [...data].sort((a, b) => b.cases - a.cases);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Historical TB Cases</h2>
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
        <h2 className="text-lg font-bold text-gray-900">Historical TB Cases</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Barangay Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total TB Cases
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((barangay, index) => (
              <tr
                key={barangay.barangay}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold
                      ${index === 0 ? 'bg-red-100 text-red-700' :
                        index === 1 ? 'bg-orange-100 text-orange-700' :
                        index === 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'}`}
                    >
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{barangay.barangay}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{barangay.year}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`text-sm font-bold
                    ${index === 0 ? 'text-red-600' :
                      index === 1 ? 'text-orange-600' :
                      index === 2 ? 'text-yellow-600' :
                      'text-gray-900'}`}
                  >
                    {barangay.cases}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
