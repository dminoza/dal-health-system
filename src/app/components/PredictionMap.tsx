import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cdoBarangayGeoJSON } from '../data/barangayGeoJSON';

// Predicted barangay data for 2026 (simulated with ~10-15% increase)
export const predictionData = [
  { name: 'Iponan', cases: 328 },
  { name: 'Bulua', cases: 282 },
  { name: 'Carmen', cases: 215 },
  { name: 'NHA Kauswagan', cases: 180 },
  { name: 'Kauswagan', cases: 233 },
  { name: 'Barangay 26', cases: 154 },
  { name: 'Barangay 25', cases: 147 },
  { name: 'Barangay 23', cases: 167 },
  { name: 'Barangay 22', cases: 191 },
  { name: 'Barangay 21', cases: 217 },
  { name: 'Lapasan', cases: 317 },
  { name: 'Macabalan', cases: 270 },
  { name: 'Puntod', cases: 228 },
  { name: 'Gusa', cases: 244 },
  { name: 'Cugman', cases: 292 },
];

export function PredictionMap() {
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
        const barangayInfo = predictionData.find((b) => b.name === barangayName);
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

        // Add predicted TB case dots if barangay has data
        if (barangayInfo && layer instanceof L.Polygon) {
          const polygon = layer as L.Polygon;

          // Add predicted TB case dots (distributed within polygon) - using purple for predictions
          for (let i = 0; i < cases; i++) {
            const [lat, lng] = generateRandomPointInPolygon(polygon);

            L.circleMarker([lat, lng], {
              radius: 2.5,
              fillColor: '#8b5cf6',
              fillOpacity: 0.7,
              color: '#8b5cf6',
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
            Predicted Cases: <span className="font-bold text-gray-900">{hoveredBarangay.cases}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg px-4 py-3 z-[1000] border border-gray-200">
        <h3 className="font-bold text-sm text-gray-900 mb-3">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500"></div>
            <span className="text-xs text-gray-700">Predicted TB Cases (2026)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 bg-violet-500 opacity-30 rounded"></div>
            <span className="text-xs text-gray-700">Case Density</span>
          </div>
        </div>
      </div>
    </div>
  );
}