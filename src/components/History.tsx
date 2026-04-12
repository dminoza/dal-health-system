import { useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search } from 'lucide-react';

// Historical data for Tuberculosis 2024
const tuberculosisData2024 = [
  { barangay: 'Carmen', cases: 135, deaths: 8, recovered: 120, population: 15420 },
  { barangay: 'Puntod', cases: 60, deaths: 3, recovered: 55, population: 8350 },
  { barangay: 'Bulua', cases: 56, deaths: 2, recovered: 52, population: 12800 },
  { barangay: 'Lapasan', cases: 53, deaths: 1, recovered: 50, population: 9200 },
  { barangay: 'Iponan', cases: 52, deaths: 2, recovered: 48, population: 7600 },
  { barangay: 'Brgy 26, 25, 23, 21', cases: 31, deaths: 1, recovered: 29, population: 6500 },
].map((item, index) => ({
  rank: index + 1,
  ...item
}));

const diseases = ['Dengue', 'COVID-19', 'Tuberculosis', 'Pneumonia', 'Diarrhea'];
const years = ['2024', '2023', '2022', '2021', '2020'];

export function History() {
  const [selectedDisease, setSelectedDisease] = useState('Tuberculosis');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [historicalData, setHistoricalData] = useState<any[]>(tuberculosisData2024);
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = () => {
    if (selectedDisease && selectedYear) {
      // For now, only Tuberculosis 2024 has real data
      if (selectedDisease === 'Tuberculosis' && selectedYear === '2024') {
        setHistoricalData(tuberculosisData2024);
      } else {
        // Generate mock data for other combinations
        const mockData = [
          { barangay: 'Carmen', cases: Math.floor(Math.random() * 100) + 20, deaths: Math.floor(Math.random() * 5), recovered: Math.floor(Math.random() * 90) + 10, population: 15420 },
          { barangay: 'Puntod', cases: Math.floor(Math.random() * 80) + 10, deaths: Math.floor(Math.random() * 4), recovered: Math.floor(Math.random() * 70) + 10, population: 8350 },
          { barangay: 'Bulua', cases: Math.floor(Math.random() * 80) + 10, deaths: Math.floor(Math.random() * 4), recovered: Math.floor(Math.random() * 70) + 10, population: 12800 },
          { barangay: 'Lapasan', cases: Math.floor(Math.random() * 80) + 10, deaths: Math.floor(Math.random() * 4), recovered: Math.floor(Math.random() * 70) + 10, population: 9200 },
          { barangay: 'Iponan', cases: Math.floor(Math.random() * 80) + 10, deaths: Math.floor(Math.random() * 4), recovered: Math.floor(Math.random() * 70) + 10, population: 7600 },
          { barangay: 'Brgy 26, 25, 23, 21', cases: Math.floor(Math.random() * 50) + 5, deaths: Math.floor(Math.random() * 3), recovered: Math.floor(Math.random() * 40) + 5, population: 6500 },
        ].sort((a, b) => b.cases - a.cases).map((item, index) => ({
          rank: index + 1,
          ...item
        }));
        setHistoricalData(mockData);
      }
      setHasSearched(true);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Historical Data</h1>
        <p className="text-gray-600">View historical morbidity data by barangay</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="disease-select">Disease</Label>
            <Select value={selectedDisease} onValueChange={setSelectedDisease}>
              <SelectTrigger id="disease-select">
                <SelectValue placeholder="Select disease" />
              </SelectTrigger>
              <SelectContent>
                {diseases.map((disease) => (
                  <SelectItem key={disease} value={disease}>
                    {disease}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="year-select">Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year-select">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Search History
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <h2 className="mb-2">Historical Morbidity Data</h2>
          <p className="text-sm text-gray-600">
            {selectedDisease} cases in {selectedYear} - Ranked from highest to lowest
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Barangay Name</TableHead>
                <TableHead>Total Cases</TableHead>
                <TableHead>Deaths</TableHead>
                <TableHead>Recovered</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Rate per 1000</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historicalData.map((data) => (
                <TableRow key={data.rank}>
                  <TableCell>
                    {data.rank <= 3 ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
                        {data.rank}
                      </span>
                    ) : (
                      data.rank
                    )}
                  </TableCell>
                  <TableCell>{data.barangay}</TableCell>
                  <TableCell>{data.cases}</TableCell>
                  <TableCell>{data.deaths}</TableCell>
                  <TableCell>{data.recovered}</TableCell>
                  <TableCell>{data.population.toLocaleString()}</TableCell>
                  <TableCell>
                    {((data.cases / data.population) * 1000).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
