import { FilterBar } from '../components/FilterBar';
import { Map, barangayData } from '../components/Map';
import { HistoryTable } from '../components/HistoryTable';
import { CasesBarChart } from '../components/CasesBarChart';

export function HistoryPage() {
  return (
    <>
      {/* Filter Bar */}
      <FilterBar />
      
      {/* Map Area */}
      <div className="h-[500px] relative">
        <Map />
      </div>
      
      {/* Bottom Section - Table and Chart */}
      <div className="h-96 border-t border-gray-200 bg-gray-50 p-6">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left: Table */}
          <HistoryTable data={barangayData} />
          
          {/* Right: Bar Chart */}
          <CasesBarChart data={barangayData} />
        </div>
      </div>
    </>
  );
}