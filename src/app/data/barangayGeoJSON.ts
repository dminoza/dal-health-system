// Simplified GeoJSON data for Cagayan de Oro City barangays
// Note: These are approximate polygons for visualization purposes

export interface BarangayFeature {
  type: 'Feature';
  properties: {
    name: string;
    cases: number;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface BarangayGeoJSON {
  type: 'FeatureCollection';
  features: BarangayFeature[];
}

export const cdoBarangayGeoJSON: BarangayGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Iponan', cases: 298 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6000, 8.5100],
          [124.6200, 8.5100],
          [124.6200, 8.5300],
          [124.6000, 8.5300],
          [124.6000, 8.5100]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Bulua', cases: 256 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6400, 8.4700],
          [124.6600, 8.4700],
          [124.6600, 8.4900],
          [124.6400, 8.4900],
          [124.6400, 8.4700]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Carmen', cases: 195 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6000, 8.4500],
          [124.6200, 8.4500],
          [124.6200, 8.4700],
          [124.6000, 8.4700],
          [124.6000, 8.4500]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'NHA Kauswagan', cases: 163 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6300, 8.4300],
          [124.6500, 8.4300],
          [124.6500, 8.4500],
          [124.6300, 8.4500],
          [124.6300, 8.4300]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Kauswagan', cases: 212 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6350, 8.4350],
          [124.6550, 8.4350],
          [124.6550, 8.4550],
          [124.6350, 8.4550],
          [124.6350, 8.4350]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Barangay 26', cases: 140 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6370, 8.4670],
          [124.6470, 8.4670],
          [124.6470, 8.4770],
          [124.6370, 8.4770],
          [124.6370, 8.4670]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Barangay 25', cases: 134 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6390, 8.4700],
          [124.6490, 8.4700],
          [124.6490, 8.4800],
          [124.6390, 8.4800],
          [124.6390, 8.4700]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Barangay 23', cases: 152 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6330, 8.4730],
          [124.6430, 8.4730],
          [124.6430, 8.4830],
          [124.6330, 8.4830],
          [124.6330, 8.4730]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Barangay 22', cases: 174 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6300, 8.4710],
          [124.6400, 8.4710],
          [124.6400, 8.4810],
          [124.6300, 8.4810],
          [124.6300, 8.4710]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Barangay 21', cases: 197 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6270, 8.4750],
          [124.6370, 8.4750],
          [124.6370, 8.4850],
          [124.6270, 8.4850],
          [124.6270, 8.4750]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Lapasan', cases: 288 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6100, 8.4250],
          [124.6300, 8.4250],
          [124.6300, 8.4450],
          [124.6100, 8.4450],
          [124.6100, 8.4250]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Macabalan', cases: 245 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6500, 8.4800],
          [124.6700, 8.4800],
          [124.6700, 8.5000],
          [124.6500, 8.5000],
          [124.6500, 8.4800]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Puntod', cases: 207 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6600, 8.4400],
          [124.6800, 8.4400],
          [124.6800, 8.4600],
          [124.6600, 8.4600],
          [124.6600, 8.4400]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Gusa', cases: 222 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6300, 8.4900],
          [124.6500, 8.4900],
          [124.6500, 8.5100],
          [124.6300, 8.5100],
          [124.6300, 8.4900]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Cugman', cases: 265 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [124.6100, 8.5000],
          [124.6300, 8.5000],
          [124.6300, 8.5200],
          [124.6100, 8.5200],
          [124.6100, 8.5000]
        ]]
      }
    }
  ]
};