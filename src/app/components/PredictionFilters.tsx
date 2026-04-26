import { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface PredictionFiltersProps {
  onFilterChange?: (disease: string, year: string) => void;
}

export function PredictionFilters({ onFilterChange }: PredictionFiltersProps) {
  const [disease, setDisease] = useState('Tuberculosis');
  const [year, setYear] = useState('2026');

  const handleGenerate = () => {
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

        {/* Prediction Year Input */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prediction Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 2026) {
                setYear(e.target.value);
              }
            }}
            min="2026"
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Generate Button */}
        <div className="flex-1">
          <button
            onClick={handleGenerate}
            className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Generate Prediction
          </button>
        </div>
      </div>
    </div>
  );
}
