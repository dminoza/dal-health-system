// Utility to generate random points within a polygon using ray casting algorithm

export function isPointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

export function generateRandomPointInPolygon(polygon: number[][]): [number, number] {
  // Get bounding box
  const lngs = polygon.map((p) => p[0]);
  const lats = polygon.map((p) => p[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  // Try to generate a point within the polygon
  let attempts = 0;
  while (attempts < 100) {
    const lng = minLng + Math.random() * (maxLng - minLng);
    const lat = minLat + Math.random() * (maxLat - minLat);

    if (isPointInPolygon([lng, lat], polygon)) {
      return [lat, lng]; // Return as [lat, lng] for Leaflet
    }
    attempts++;
  }

  // Fallback to centroid if no point found
  const centroidLng = (minLng + maxLng) / 2;
  const centroidLat = (minLat + maxLat) / 2;
  return [centroidLat, centroidLng];
}
