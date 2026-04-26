import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cdoBarangayGeoJSON } from '../data/barangayGeoJSON';

// Barangay data with TB cases
export const barangayData = [
  { name: 'Iponan', cases: 298 },
  { name: 'Bulua', cases: 256 },
  { name: 'Carmen', cases: 195 },
  { name: 'NHA Kauswagan', cases: 163 },
  { name: 'Kauswagan', cases: 212 },
  { name: 'Barangay 26', cases: 140 },
  { name: 'Barangay 25', cases: 134 },
  { name: 'Barangay 23', cases: 152 },
  { name: 'Barangay 22', cases: 174 },
  { name: 'Barangay 21', cases: 197 },
  { name: 'Lapasan', cases: 288 },
  { name: 'Macabalan', cases: 245 },
  { name: 'Puntod', cases: 207 },
  { name: 'Gusa', cases: 222 },
  { name: 'Cugman', cases: 265 },
];

// Get risk color based on cases
function getRiskColor(cases: number): string {
  if (cases >= 625) return '#ef4444'; // Red - High Risk
  if (cases >= 313) return '#eab308'; // Yellow - Medium Risk
  return '#22c55e'; // Green - Low Risk
}

export function DashboardMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [hoveredBarangay, setHoveredBarangay] = useState<{
    name: string;
    cases: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([8.4542, 124.6319], 12);

    mapInstanceRef.current = map;

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Helper function to generate random point within polygon
    const generateRandomPointInPolygon = (polygon: L.Polygon): [number, number] => {
      const bounds = polygon.getBounds();
      let point: [number, number];
      let attempts = 0;
      const maxAttempts = 100;

      do {
        const lat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
        const lng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
        point = [lat, lng];
        attempts++;

        const latLng = L.latLng(point[0], point[1]);
        if (polygon.getBounds().contains(latLng)) {
          const polyCoords = (polygon.getLatLngs()[0] as L.LatLng[]).map(ll => [ll.lat, ll.lng]);
          if (isPointInPolygon(point, polyCoords)) {
            break;
          }
        }
      } while (attempts < maxAttempts);

      return point;
    };

    const isPointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point;
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }

      return inside;
    };

    // Add barangay GeoJSON layers
    const geoJsonLayer = L.geoJSON(cdoBarangayGeoJSON, {
      style: {
        fillColor: '#E5E5E5',
        fillOpacity: 0.3,
        color: 'transparent',
        weight: 0,
      },
      onEachFeature: (feature, layer) => {
        const barangayName = feature.properties.name;
        const barangayInfo = barangayData.find((b) => b.name === barangayName);
        const cases = barangayInfo?.cases || 0;

        // Hover effects
        layer.on('mouseover', (e) => {
          const containerPoint = map.latLngToContainerPoint(e.latlng);
          setHoveredBarangay({
            name: barangayName,
            cases: cases,
            x: containerPoint.x,
            y: containerPoint.y,
          });

          // Highlight on hover
          layer.setStyle({
            fillOpacity: 0.5,
            weight: 0,
            color: 'transparent',
          });
        });

        layer.on('mouseout', () => {
          setHoveredBarangay(null);
          // Reset style
          layer.setStyle({
            fillOpacity: 0.3,
            weight: 0,
            color: 'transparent',
          });
        });

        // Add TB case dots if barangay has data
        if (barangayInfo && layer instanceof L.Polygon) {
          const polygon = layer as L.Polygon;
          const riskColor = getRiskColor(cases);

          // Add TB case dots (distributed within polygon)
          for (let i = 0; i < cases; i++) {
            const [lat, lng] = generateRandomPointInPolygon(polygon);

            L.circleMarker([lat, lng], {
              radius: 2.5,
              fillColor: riskColor,
              fillOpacity: 0.7,
              color: riskColor,
              opacity: 0.9,
              weight: 1,
            }).addTo(map);
          }
        }
      },
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative size-full">
      <div ref={mapRef} className="size-full" />

      {/* Hover Tooltip */}
      {hoveredBarangay && (
        <div
          className="absolute bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200 pointer-events-none z-[1000]"
          style={{
            left: `${hoveredBarangay.x + 10}px`,
            top: `${hoveredBarangay.y - 10}px`,
          }}
        >
          <div className="font-bold text-gray-900">{hoveredBarangay.name}</div>
          <div className="text-sm text-gray-600">
            TB Cases: <span className="font-bold text-gray-900">{hoveredBarangay.cases}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg px-4 py-3 z-[1000] border border-gray-200">
        <h3 className="font-bold text-sm text-gray-900 mb-3">Risk Level</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-700">Low Risk (&lt; 313)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-700">Medium Risk (313-624)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-700">High Risk (≥ 625)</span>
          </div>
        </div>
      </div>
    </div>
  );
}