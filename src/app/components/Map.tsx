import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { generateRandomPointInPolygon } from '../utils/pointInPolygon';
import { HistoryResult } from '../../hooks/useHistory';

interface MapProps {
  data: HistoryResult[];
  year?: string;
}

export function Map({ data, year }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const heatmapRef = useRef<L.Circle[]>([]);

  const [hoveredBarangay, setHoveredBarangay] = useState<{
    name: string;
    cases: number;
    x: number;
    y: number;
  } | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([8.4542, 124.6319], 12);

    mapInstanceRef.current = map;

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update layers when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !data || data.length === 0) return;

    // Clear previous GeoJSON layer
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
      geoJsonLayerRef.current = null;
    }

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Clear previous heatmap blobs
    heatmapRef.current.forEach((h) => h.remove());
    heatmapRef.current = [];

    // Build GeoJSON from Supabase data
    const geojson = {
      type: 'FeatureCollection' as const,
      features: data.map((item) => ({
        type: 'Feature' as const,
        properties: {
          name: item.barangay,
          cases: item.cases,
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [item.coordinates],
        },
      })),
    };

    // Add GeoJSON layer
    const geoJsonLayer = L.geoJSON(geojson, {
      style: {
        fillColor: '#E5E5E5',
        fillOpacity: 0.3,
        color: 'transparent',
        weight: 0,
      },
      onEachFeature: (feature, layer) => {
        const barangayName = feature.properties.name;
        const cases = feature.properties.cases;

        layer.on('mouseover', (e) => {
          const containerPoint = map.latLngToContainerPoint(e.latlng);
          setHoveredBarangay({ name: barangayName, cases, x: containerPoint.x, y: containerPoint.y });
          layer.setStyle({ fillOpacity: 0.5, weight: 0, color: 'transparent' });
        });

        layer.on('mouseout', () => {
          setHoveredBarangay(null);
          layer.setStyle({ fillOpacity: 0.3, weight: 0, color: 'transparent' });
        });

        layer.on('mousemove', (e) => {
          const containerPoint = map.latLngToContainerPoint(e.latlng);
          setHoveredBarangay({ name: barangayName, cases, x: containerPoint.x, y: containerPoint.y });
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;

    // Add heatmap blobs and dots for each barangay
    data.forEach((item) => {
      const polygon = item.coordinates;
      const cases = item.cases;

      // Calculate centroid
      const lngs = polygon.map((p) => p[0]);
      const lats = polygon.map((p) => p[1]);
      const centroidLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
      const centroidLat = lats.reduce((a, b) => a + b, 0) / lats.length;

      // Calculate radius
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const radius = Math.max(maxLng - minLng, maxLat - minLat) * 0.6;

      // Add heatmap blob
      const heatmapOpacity = Math.min(0.2 + cases / 600, 0.4);
      const heatBlob = L.circle([centroidLat, centroidLng], {
        radius: radius * 60000,
        fillColor: '#ef4444',
        fillOpacity: heatmapOpacity,
        color: '#ef4444',
        opacity: 0.05,
        weight: 1,
        className: 'heatmap-blob',
      }).addTo(map);
      heatmapRef.current.push(heatBlob);

      // Add TB case dots
      for (let i = 0; i < cases; i++) {
        const [lat, lng] = generateRandomPointInPolygon(polygon);
        const marker = L.circleMarker([lat, lng], {
          radius: 2.5,
          fillColor: '#22c55e',
          fillOpacity: 0.7,
          color: '#22c55e',
          opacity: 0.9,
          weight: 1,
        }).addTo(map);
        markersRef.current.push(marker);
      }
    });

    // Fit map bounds
    map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });

  }, [data]);

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
            Total TB Cases:{' '}
            <span className="font-bold text-red-600">{hoveredBarangay.cases}</span>
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg px-4 py-3 z-[1000] border border-gray-200">
        <h3 className="font-bold text-sm text-gray-900 mb-3">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-700">TB Cases {year ? `(${year})` : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 bg-red-500 opacity-30 rounded"></div>
            <span className="text-xs text-gray-700">Case Density</span>
          </div>
        </div>
      </div>

      <style>{`
        .heatmap-blob {
          filter: blur(60px);
        }
      `}</style>
    </div>
  );
}
