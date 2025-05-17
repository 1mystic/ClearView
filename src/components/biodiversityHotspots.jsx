// src/data/biodiversityHotspots.js

// NOTE: These are VERY simplified and approximate polygons for demonstration.
// You would need accurate GeoJSON data for a real application.
// GeoJSON coordinates are [longitude, latitude]
// The 'reportCount' property will be dynamically added by the MapView component.
export const biodiversityHotspotsData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'The Himalayas',
        description: 'A major mountain range forming a biodiversity hotspot. Home to rare species and critical water sources. Pollution here affects downstream communities and ecosystems.',
        priority: 'high'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [ // Outer ring
            [73.0, 35.0], [75.0, 36.0], [80.0, 33.0], [85.0, 30.0],
            [90.0, 28.0], [95.0, 29.0], [97.0, 28.0], [95.0, 26.0],
            [88.0, 25.0], [80.0, 27.0], [73.0, 35.0] // Closed polygon
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Western Ghats',
        description: 'A mountain range along the western side of India. Critical for monsoon patterns and home to unique species. Industrial pollution and deforestation are major threats.',
        priority: 'high'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.0, 21.0], [74.0, 20.0], [75.0, 15.0], [76.5, 12.0],
            [77.5, 8.5],  [77.0, 8.0],  [74.5, 13.0], [73.0, 21.0] // Closed polygon
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Indo-Burma Region (Indian Part)',
        description: 'Easternmost part of India, rich in biodiversity. Faces threats from mining, deforestation, and industrial pollution. Critical for regional water resources.',
        priority: 'medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [92.0, 28.0], [97.5, 28.5], [97.0, 22.0], [92.5, 22.0],
            [92.0, 24.0], [92.0, 28.0] // Closed polygon
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Sundaland (Andaman & Nicobar Islands)',
        description: 'Island group in the Bay of Bengal. Unique marine and terrestrial ecosystems. Vulnerable to plastic pollution, oil spills, and climate change impacts.',
        priority: 'high'
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          // Andaman Islands (simplified group)
          [[
            [92.5, 13.5], [93.0, 13.7], [93.2, 11.5], [92.8, 10.5], 
            [92.3, 11.0], [92.5, 13.5] // Closed polygon
          ]],
          // Nicobar Islands (simplified group)
          [[
            [93.5, 9.5], [94.0, 9.3], [94.2, 7.0], [93.8, 6.8], 
            [93.3, 7.5], [93.5, 9.5] // Closed polygon
          ]]
        ]
      }
    }
  ]
};
