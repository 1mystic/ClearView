import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { getAllReports } from '../utils/services';
import { useToast } from '../components/ui/use-toast';
import { Card, CardContent } from '../components/ui/card';
import 'leaflet/dist/leaflet.css';
import { biodiversityHotspotsData } from '../components/biodiversityHotspots';
import * as turf from '@turf/turf';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

const MAP_CENTER = [20.5937, 78.9629];
const INITIAL_ZOOM = 5;
const POLLUTION_THRESHOLD = 1;  // threshold for color change
const HOT_HOTSPOT_COLOR = '#A50026';
const HOT_HOTSPOT_OPACITY = 0.7;

// Create custom icons
const createCustomIcon = (color) => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const pendingIcon = createCustomIcon('yellow');
const approvedIcon = createCustomIcon('red');
const resolvedIcon = createCustomIcon('green');

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processedHotspots, setProcessedHotspots] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadReports = async () => {
      try {
        const fetchedReports = await getAllReports();
        setReports(fetchedReports);

        // Process biodiversity hotspots data
        const processed = biodiversityHotspotsData.features.map(hotspot => {
          try {
            let hotspotPolygon;
            if (hotspot.geometry.type === 'MultiPolygon') {
              // For MultiPolygon, create a union of all polygons
              hotspotPolygon = turf.union(...hotspot.geometry.coordinates.map(coords => 
                turf.polygon(coords)
              ));
            } else {
              // For single Polygon
              hotspotPolygon = turf.polygon(hotspot.geometry.coordinates);
            }

            const reportsInHotspot = fetchedReports.filter(report => {
              try {
                const point = turf.point([report.longitude, report.latitude]);
                return turf.booleanPointInPolygon(point, hotspotPolygon);
              } catch (err) {
                console.warn(`Error processing report point for hotspot ${hotspot.properties.name}:`, err);
                return false;
              }
            });

            return {
              ...hotspot,
              properties: {
                ...hotspot.properties,
                reportCount: reportsInHotspot.length,
                pendingCount: reportsInHotspot.filter(r => r.status === 'pending').length,
                approvedCount: reportsInHotspot.filter(r => r.status === 'approved').length,
                resolvedCount: reportsInHotspot.filter(r => r.status === 'resolved').length
              }
            };
          } catch (err) {
            console.warn(`Error processing hotspot ${hotspot.properties.name}:`, err);
            return {
              ...hotspot,
              properties: {
                ...hotspot.properties,
                reportCount: 0,
                pendingCount: 0,
                approvedCount: 0,
                resolvedCount: 0
              }
            };
          }
        });

        setProcessedHotspots(processed);
        toast({
          title: "Map Loaded",
          description: `Displaying ${fetchedReports.length} pollution reports and biodiversity hotspots.`,
        });
      } catch (error) {
        console.error("Error loading reports:", error);
        setError("Failed to load reports");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load reports. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [toast]);

  const getHotspotColor = (feature) => {
    // If report count exceeds threshold, return hot spot color
    if (feature.properties.reportCount > POLLUTION_THRESHOLD) {
      return HOT_HOTSPOT_COLOR;
    }
    // Otherwise return default colors for each region
    switch (feature.properties.name) {
      case 'The Himalayas':
        return '#008000';
      case 'Western Ghats':
        return '#FFFF00';
      case 'Indo-Burma Region (Indian Part)':
        return '#FF0000';
      case 'Sundaland (Andaman & Nicobar Islands)':
        return '#C71585';
      default:
        return '#90EE90';
    }
  };

  const hotspotStyle = (feature) => ({
    fillColor: getHotspotColor(feature),
    weight: 2,
    opacity: 1,
    color: 'red',
    dashArray: '3',
    fillOpacity: feature.properties.reportCount > POLLUTION_THRESHOLD ? HOT_HOTSPOT_OPACITY : 0.5,
  });

  const onEachHotspotFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      let popupContent = `<h4 style="font-weight: bold; margin-bottom: 5px;">${feature.properties.name}</h4>`;
      if (feature.properties.description) {
        popupContent += `<p style="font-size: 0.9em;">${feature.properties.description}</p>`;
      }
      if (typeof feature.properties.reportCount === 'number') {
        popupContent += `<p style="font-size: 0.9em; margin-top: 5px;">Pollution Reports: <strong>${feature.properties.reportCount}</strong></p>`;
        popupContent += `<p style="font-size: 0.9em;">Pending: ${feature.properties.pendingCount}</p>`;
        popupContent += `<p style="font-size: 0.9em;">Approved: ${feature.properties.approvedCount}</p>`;
        popupContent += `<p style="font-size: 0.9em;">Resolved: ${feature.properties.resolvedCount}</p>`;
      }
      layer.bindPopup(popupContent);

      layer.bindTooltip(`${feature.properties.name} (Reports: ${feature.properties.reportCount || 0})`, {
        permanent: false,
        direction: 'auto'
      });
    }
  };

  const hotspotLegendColors = [
    '#008000',
    '#FFFF00',
    '#FF0000',
    '#C71585',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow py-6 px-6 md:px-12 bg-gradient-to-br from-[#101c1a] via-[#1a2e2b] to-[#0e1a17] dark relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 dark:bg-black/30 backdrop-blur-2xl z-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in animate-delay-100">
          <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Pollution Map</h1>
          
          <Card className="mb-8 overflow-hidden glass saas-shadow bg-white/5 border-white/10 animate-slide-up animate-delay-200">
            <CardContent className="p-0">
              <MapContainer
                center={MAP_CENTER}
                zoom={INITIAL_ZOOM}
                style={{ height: '70vh', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {reports.map((report) => {
                  const markerIcon = report.status === 'resolved' ? resolvedIcon :
                                   report.status === 'approved' ? approvedIcon :
                                   pendingIcon;

                  return (
                    <Marker
                      key={report.id}
                      position={[report.latitude, report.longitude]}
                      icon={markerIcon}
                    >
                      <Popup>
                        <div className="popup-content">
                          <h3 className="font-bold">{report.type}</h3>
                          <p className="text-sm">{report.description}</p>
                          <p className="text-xs mt-2">Status: {report.status}</p>
                          <p className="text-xs">Reported by: {report.user_id}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                <GeoJSON
                  data={processedHotspots}
                  style={hotspotStyle}
                  onEachFeature={onEachHotspotFeature}
                />
              </MapContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="col-span-full mb-2">
              <h2 className="text-xl font-bold text-gray-200 mb-2">
                Biodiversity Hotspots
                <span className="text-sm font-normal text-gray-400 ml-2">
                  (Regions turn <span style={{color: HOT_HOTSPOT_COLOR, fontWeight: 'bold'}}>dark red</span> if pollution reports ≥ {POLLUTION_THRESHOLD})
                </span>
              </h2>
            </div>
            
            {biodiversityHotspotsData.features.map((feature, idx) => (
              <div key={feature.properties.name} className="modern-glass-card animate-slide-up" style={{animationDelay: `${300 + idx * 100}ms`}}>
                <div className="modern-card-content">
                  <div className="modern-card-header">
                    <span className="modern-card-dot" style={{backgroundColor: hotspotLegendColors[idx % hotspotLegendColors.length] || '#CCCCCC'}} />
                    <h3 className="modern-card-title">{feature.properties.name}</h3>
                  </div>
                  <p className="modern-card-desc">{feature.properties.description}</p>
                </div>
              </div>
            ))}

            <div className="col-span-full mt-6 mb-2">
              <h2 className="text-xl font-bold text-gray-200 mb-2">Pollution Types</h2>
            </div>
            
            <div className="modern-glass-card animate-slide-up animate-delay-700">
              <div className="modern-card-content">
                <h3 className="modern-card-title mb-2">Air Pollution</h3>
                <p className="modern-card-desc">Includes reports of smoke, factory emissions, and other air quality concerns.</p>
              </div>
            </div>
            
            <div className="modern-glass-card animate-slide-up animate-delay-800">
              <div className="modern-card-content">
                <h3 className="modern-card-title mb-2">Water Pollution</h3>
                <p className="modern-card-desc">Includes reports of contaminated water bodies, industrial discharge, and sewage issues.</p>
              </div>
            </div>
            
            <div className="modern-glass-card animate-slide-up animate-delay-900">
              <div className="modern-card-content">
                <h3 className="modern-card-title mb-2">Waste Dumping</h3>
                <p className="modern-card-desc">Includes reports of illegal waste disposal, garbage accumulation, and plastic pollution.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <Footer />
      

      <style>{`
        .animate-delay-100 { animation-delay: 100ms; }
        .animate-delay-200 { animation-delay: 200ms; }
        .animate-delay-300 { animation-delay: 300ms; }
        .animate-delay-400 { animation-delay: 400ms; }
        .animate-delay-500 { animation-delay: 500ms; }
        .animate-delay-700 { animation-delay: 700ms; }
        .animate-delay-800 { animation-delay: 800ms; }
        .animate-delay-900 { animation-delay: 900ms; }
        .marker-pin {
          width: 20px;
          height: 20px;
          border-radius: 50% 50% 50% 0;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -21px 0 0 -10px;
        }
        .leaflet-popup-content h4 {
          margin-top: 0;
          margin-bottom: 5px;
          color: #333;
        }
        .leaflet-popup-content p {
          margin: 0;
          color: #555;
        }
        .modern-glass-card {
          background: rgba(36, 41, 54, 0.85);
          border-radius: 1.5rem;
          box-shadow: 0 8px 40px 0 rgba(0,0,0,0.25), 0 0 0 2px rgba(107,142,35,0.08);
          border: 2.5px solid rgba(107,142,35,0.18);
          backdrop-filter: blur(10px) saturate(1.3);
          color: #f3f6fa;
          transition: box-shadow 0.4s, border 0.4s, transform 0.4s, background 0.4s;
          position: relative;
          overflow: hidden;
          margin-bottom: 1.5rem;
          padding: 2rem 1.5rem;
          cursor: pointer;
        }
        .modern-glass-card:hover {
          box-shadow: 0 16px 48px 0 #6B8E23, 0 0 0 4px #6B8E23;
          border: 2.5px solid #6B8E23;
          background: rgba(36, 41, 54, 0.97);
          transform: translateY(-8px) scale(1.03);
        }
        .modern-card-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .modern-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          margin-top: 0.5rem;
        }
        .modern-card-dot {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          margin-right: 0.75rem;
          box-shadow: 0 0 8px 2px #6B8E23;
          border: 2px solid #fff2;
        }
        .modern-card-title {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 12px #6B8E23;
          margin-bottom: 0.25rem;
        }
        .modern-card-desc {
          color: #e6e6e6;
          font-size: 1.05rem;
          font-weight: 500;
          line-height: 1.6;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default MapView;
