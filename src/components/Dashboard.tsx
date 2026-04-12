import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import cdoMap from "figma:asset/03504dd33eea500ea5bfadb32eb20eeed319db58.png";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getAllBarangaysWithRecords } from './api';
import { Barangay } from '../types';


export function Dashboard() {
  const [barangayData, setBarangayData] = useState<Barangay[]>([]);
  const [hoveredBarangay, setHoveredBarangay] = useState<string | null>(null);

  // 🔥 Fetch Firebase data
  useEffect(() => {
    const fetchData = async () => {
      const barangaySnap = await getDocs(collection(db, "barangays"));

      const result = await Promise.all(
        barangaySnap.docs.map(async (docSnap) => {
          const barangayId = docSnap.id;

          const data = docSnap.data();

          const recordsSnap = await getDocs(
            collection(db, "barangays", barangayId, "records")
          );

          const records: RecordItem[] = recordsSnap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<RecordItem, "id">),
          }));

          return {
            id: barangayId,
            name: data.name,
            coordinates: data.coordinates,
            records,
          };
        })
      );
      setBarangayData(result); 
    };

    fetchData();
  }, []);
  
  const getLatestValue = (b: any) => {
    if (!b.records || b.records.length === 0) return 0;

    // sort by year descending and get latest
    const latest = [...b.records].sort((a, b) => b.year - a.year)[0];

    return latest?.value || 0;
  };

  // 📊 Calculations
  const totalCases = barangayData.reduce(
    (sum, b) => sum + getLatestValue(b),
    0
  );

  const highRiskAreas = barangayData.filter((b) => b.cases > 100).length;
  const mediumRiskAreas = barangayData.filter(
    (b) => getLatestValue(b) <= 100 && getLatestValue(b) > 50
  ).length;

  const sortedBarangays = [...barangayData].sort(
    (a, b) => (getLatestValue(b) || 0) - (getLatestValue(b) || 0)
  );

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">
          Health Morbidity Dashboard
        </h1>
        <p className="text-gray-600">
          Current health situation in Cagayan de Oro City
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-gray-600 mb-2">Total Cases</p>
          <p className="text-blue-600">{totalCases}</p>
        </Card>

        <Card className="p-6">
          <p className="text-gray-600 mb-2">High Risk Areas</p>
          <p className="text-red-600">{highRiskAreas}</p>
        </Card>

        <Card className="p-6">
          <p className="text-gray-600 mb-2">Medium Risk Areas</p>
          <p className="text-amber-600">{mediumRiskAreas}</p>
        </Card>

        <Card className="p-6">
          <p className="text-gray-600 mb-2">Total Barangays</p>
          <p className="text-gray-900">{barangayData.length}</p>
        </Card>
      </div>

      {/* MAP SECTION */}
      <Card className="p-6 mb-8">
        <div className="mb-4">
          <h2 className="mb-2">Cagayan de Oro City Map</h2>
          <p className="text-sm text-gray-600">
            Health morbidity distribution by barangay
          </p>
        </div>

        <div className="relative bg-gray-50 rounded-lg p-4 overflow-hidden">
          <img
            src={cdoMap}
            alt="CDO Map"
            className="w-full h-auto rounded-lg shadow-sm"
          />

          {/* MAP MARKERS (x,y system) */}
          {barangayData.map((b) => (
            <div
              key={b.id}
              className="absolute text-xs bg-white px-2 py-1 rounded shadow cursor-pointer"
              style={{
                left: b.coordinates?.x,
                top: b.coordinates?.y,
              }}
              onMouseEnter={() => setHoveredBarangay(b.id)}
              onMouseLeave={() => setHoveredBarangay(null)}
            >
              {b.name}
            </div>
          ))}
        </div>
      </Card>

      {/* TOP BARANGAYS */}
      <Card className="p-6">
        <div className="mb-4">
          <h2>Top Barangays by Cases</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedBarangays.map((barangay, index) => {
            const risk =
              barangay.cases > 100
                ? "high"
                : barangay.cases > 50
                ? "medium"
                : "low";

            return (
              <div
                key={barangay.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredBarangay(barangay.id)}
                onMouseLeave={() => setHoveredBarangay(null)}
              >
                <div>
                  <p>{barangay.name}</p>
                  <p className="text-sm text-gray-600">
                    {barangay.cases} cases
                  </p>
                </div>

                <Badge
                  className={
                    risk === "high"
                      ? "bg-red-500"
                      : risk === "medium"
                      ? "bg-amber-500"
                      : "bg-green-500"
                  }
                >
                  {risk}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
