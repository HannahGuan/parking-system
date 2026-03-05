import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Car } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import { useWebSocket } from '../hooks/useWebSocket';

const DEFAULT_CENTER: [number, number] = [37.4275, -122.1697];
const DEFAULT_ZOOM = 17;

function MapController({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], DEFAULT_ZOOM, { duration: 1 });
    }
  }, [coords, map]);
  return null;
}

export default function Home() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket(() => setShowSpotFound(true));
  const [showSpotFound, setShowSpotFound] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const lastSentAt = useRef<number>(0);
  const initialCoords = useRef<{ lat: number; lng: number } | null>(null);

  // Haversine distance in feet between two lat/lng points
  function distanceFeet(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
    const R = 20902231; // Earth radius in feet
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const sin2 = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(sin2));
  }

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!initialCoords.current) {
          initialCoords.current = next;
        }
        setCoords(next);
      },
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Stream coords to WoZ via WebSocket, throttled to once every 2s
  useEffect(() => {
    if (!coords) return;
    const now = Date.now();
    if (now - lastSentAt.current < 2000) return;
    lastSentAt.current = now;
    sendMessage({ event: 'GPS_COORDS', lat: coords.lat, lng: coords.lng });
  }, [coords, sendMessage]);

  // Show spot found after user has moved 10 feet from starting position
  useEffect(() => {
    if (showSpotFound || !coords || !initialCoords.current) return;
    if (distanceFeet(initialCoords.current, coords) >= 10) {
      setShowSpotFound(true);
    }
  }, [coords, showSpotFound]);

  const handleParkClick = () => {
    navigate('/confirm');
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Real Map */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <MapController coords={coords} />
        {coords && (
          <CircleMarker
            center={[coords.lat, coords.lng]}
            radius={10}
            pathOptions={{ color: 'white', fillColor: '#10b981', fillOpacity: 1, weight: 3 }}
          />
        )}
      </MapContainer>

{/* Floating UI Elements */}
      <div className="absolute top-14 left-6 z-[1000] pointer-events-none">
        <div className="bg-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2.5 pointer-events-auto ring-1 ring-black/5">
          <Navigation size={16} className="text-emerald-600 fill-emerald-600 -rotate-45 translate-x-0.5" />
          <span className="font-bold text-gray-900 text-[15px]">Navigating...</span>
        </div>
      </div>

      {/* Spot Found Notification */}
      <AnimatePresence>
        {showSpotFound && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-[0_-5px_30px_rgba(0,0,0,0.15)] z-[1000] p-6 pb-10"
          >
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                <Car size={28} />
              </div>
              <div>
                <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">Spot Detected</h2>
                <p className="text-gray-500 text-[15px] font-medium mt-0.5">Zone #8492 • $2.50/hr</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleParkClick}
                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-[17px] hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
              >
                Yes, Park Here
              </button>
              <button
                onClick={() => setShowSpotFound(false)}
                className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-[17px] hover:bg-gray-200 active:scale-[0.98] transition-all"
              >
                Not Parking
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
