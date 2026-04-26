import { useState } from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  onFilterChange?: (disease: string, year: string) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [disease, setDisease] = useState('Tuberculosis');
  const [year, setYear] = useState('2025');

  const years = Array.from({ length: 11 }, (_, i) => (2025 - i).toString());

  const handleSearch = () => {
    onFilterChange?.(disease, year);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-end gap-4">
        {/* Disease Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Disease
          </label>
          <select
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="Tuberculosis">Tuberculosis</option>
            <option value="Dengue">Dengue</option>
            <option value="Malaria">Malaria</option>
            <option value="COVID-19">COVID-19</option>
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex-1">
          <button
            onClick={handleSearch}
            className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search History
          </button>
        </div>
      </div>
    </div>
  );
}
