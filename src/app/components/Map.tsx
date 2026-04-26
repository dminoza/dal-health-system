import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cdoBarangayGeoJSON } from '../data/barangayGeoJSON';
import { generateRandomPointInPolygon } from '../utils/pointInPolygon';

export function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [hoveredBarangay, setHoveredBarangay] = useState<{ name: string; cases: number; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Cagayan de Oro City coordinates
    const position: [number, number] = [8.4542, 124.6319];

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView(position, 12);

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

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
        const cases = feature.properties.cases;

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

        layer.on('mousemove', (e) => {
          const containerPoint = map.latLngToContainerPoint(e.latlng);
          setHoveredBarangay({
            name: barangayName,
            cases: cases,
            x: containerPoint.x,
            y: containerPoint.y,
          });
        });
      },
    }).addTo(map);

    // Add heatmap and TB case dots for each barangay
    cdoBarangayGeoJSON.features.forEach((feature) => {
      const polygon = feature.geometry.coordinates[0];
      const cases = feature.properties.cases;

      // Calculate centroid for heatmap center
      const lngs = polygon.map((p) => p[0]);
      const lats = polygon.map((p) => p[1]);
      const centroidLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
      const centroidLat = lats.reduce((a, b) => a + b, 0) / lats.length;

      // Calculate approximate radius based on polygon bounds
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const radius = Math.max(maxLng - minLng, maxLat - minLat) * 0.6;

      // Add heatmap blob
      const heatmapOpacity = Math.min(0.2 + (cases / 600), 0.4);
      L.circle([centroidLat, centroidLng], {
        radius: radius * 60000, // Convert to meters
        fillColor: '#ef4444',
        fillOpacity: heatmapOpacity,
        color: '#ef4444',
        opacity: 0.05,
        weight: 1,
        className: 'heatmap-blob',
      }).addTo(map);

      // Add TB case dots (distributed within polygon)
      for (let i = 0; i < cases; i++) {
        const [lat, lng] = generateRandomPointInPolygon(polygon);

        L.circleMarker([lat, lng], {
          radius: 2.5,
          fillColor: '#22c55e',
          fillOpacity: 0.7,
          color: '#22c55e',
          opacity: 0.9,
          weight: 1,
        }).addTo(map);
      }
    });

    // Fit map to show all barangays
    map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });

    mapInstanceRef.current = map;

    // Cleanup
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
      
      {/* Tooltip */}
      {hoveredBarangay && (
        <div
          className="absolute bg-white rounded-lg shadow-lg px-4 py-3 pointer-events-none z-[1000] border border-gray-200"
          style={{
            left: `${hoveredBarangay.x + 10}px`,
            top: `${hoveredBarangay.y - 60}px`,
          }}
        >
          <p className="font-bold text-gray-900 text-sm">{hoveredBarangay.name}</p>
          <p className="text-xs text-gray-600 mt-1">
            Total TB Cases: <span className="font-bold text-red-600">{hoveredBarangay.cases}</span>
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg px-4 py-3 z-[1000] border border-gray-200">
        <h3 className="font-bold text-sm text-gray-900 mb-3">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-700">Low Risk (&lt; 313)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 bg-red-500 opacity-30 rounded"></div>
            <span className="text-xs text-gray-700">Case Density</span>
          </div>
        </div>
      </div>

      {/* Add CSS for heatmap blur */}
      <style>{`
        .heatmap-blob {
          filter: blur(60px);
        }
      `}</style>
    </div>
  );
}

// Export barangay data for bottom panel
export const barangayData = cdoBarangayGeoJSON.features.map(f => ({
  name: f.properties.name,
  cases: f.properties.cases
}));