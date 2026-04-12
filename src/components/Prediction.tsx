import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { TrendingUp } from 'lucide-react';


export function Prediction() {
  const [disease, setDisease] = useState('Tuberculosis');
  const [year, setYear] = useState('2025');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(true);
  
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await fetch("https://callum231.pythonanywhere.com/forecast_all_next_year");

        const data = await res.json();

        setPredictions(data.results)
      } catch(err) { 
        console.log(err)
      } 
    }

    fetchPrediction();
  }, [])


  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Disease Prediction</h1>
        <p className="text-gray-600">Predict disease cases per barangay</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="disease">Disease</Label>
            <Input
              id="disease"
              placeholder="e.g., Dengue, COVID-19, Tuberculosis"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              placeholder="e.g., 2025"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Prediction
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <h2 className="mb-2">Prediction Results</h2>
          <p className="text-sm text-gray-600">
            Predicted {disease} cases for {year} - Ranked from highest to lowest
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Barangay</TableHead>
                <TableHead>Predicted Cases</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions?.map((prediction) => (
                <TableRow key={prediction.lambda}>
                  <TableCell>
                  </TableCell>
                  <TableCell>{prediction.barangay}</TableCell>
                  <TableCell>{prediction.prediction.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
