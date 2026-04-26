import { PredictionFilters } from '../components/PredictionFilters';
import { PredictionMap, predictionData } from '../components/PredictionMap';
import { PredictionTable } from '../components/PredictionTable';
import { PredictionBarChart } from '../components/PredictionBarChart';

export function PredictionPage() {
  return (
    <>
      {/* Filter Bar */}
      <PredictionFilters />
      
      {/* Map Area */}
      <div className="h-[500px] relative">
        <PredictionMap />
      </div>
      
      {/* Bottom Section - Table and Chart */}
      <div className="h-96 border-t border-gray-200 bg-gray-50 p-6">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left: Table */}
          <PredictionTable data={predictionData} />
          
          {/* Right: Bar Chart */}
          <PredictionBarChart data={predictionData} />
        </div>
      </div>
    </>
  );
}