import 'leaflet/dist/leaflet.css';
import { Info, Car, Coins, Home, Music, Navigation, ParkingSquare } from "lucide-react";
import { Card } from "./ui/card";
import { VehicleStatus } from "./VehicleStatus";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, useMap } from 'react-leaflet';

const DEFAULT_CENTER: [number, number] = [37.4275, -122.1697];
const DEFAULT_ZOOM = 17;
const LITTLEFIELD = { lat: 37.430169, lng: -122.167604 };
const TEST_SPACE = { lat: 37.4238, lng: -122.1596 };

function MapController({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], DEFAULT_ZOOM, { duration: 1 });
    }
  }, [coords, map]);
  return null;
}

// Haversine distance in feet between two lat/lng points
function distanceFeet(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 20902231; // Earth radius in feet
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const sin2 = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(sin2));
}

export function MainPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const lastCoords = useRef<{ lat: number; lng: number } | null>(null);

  // Real-time GPS tracking (like App)
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos.coords.accuracy > 50) return; // ignore low-accuracy fixes
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (lastCoords.current && distanceFeet(lastCoords.current, next) < 3) return; // ignore sub-noise jitter
        lastCoords.current = next;
        setCoords(next);
      },
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 overflow-hidden">
      {/* Status Bar - Full Width */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-slate-800/80 to-transparent px-8 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-6">
          <span className="text-2xl">70°</span>
          <Info className="w-5 h-5" />
          <span className="text-lg opacity-70">11:06</span>
        </div>
        <div className="flex items-center gap-6">
          <Home className="w-5 h-5" />
          <Car className="w-5 h-5" />
          <span className="text-2xl">70°</span>
        </div>
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="absolute inset-0 pt-16 pb-24 flex">
        {/* Left Sidebar - 25% */}
        <div className="w-1/4 p-6 flex flex-col gap-4 overflow-y-auto">
          {/* Parking Service Card */}
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 backdrop-blur-lg border-blue-400/50 border-2 p-6 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/40 flex items-center justify-center backdrop-blur-sm">
              <ParkingSquare className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                Parking
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Smart detection
              </p>
            </div>
            <div className="px-4 py-1.5 bg-green-500/30 text-green-200 rounded-full text-xs font-semibold border border-green-400/50">
              Available
            </div>
          </Card>

          {/* Tolling Service Card */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/30 backdrop-blur-lg border-purple-400/50 border-2 p-6 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/40 flex items-center justify-center backdrop-blur-sm">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                Tolling
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                Automatic payment
              </p>
            </div>
            <div className="px-4 py-1.5 bg-green-500/30 text-green-200 rounded-full text-xs font-semibold border border-green-400/50">
              Available
            </div>
          </Card>

          {/* Vehicle Status */}
          <VehicleStatus />
        </div>

        {/* Right Map Area - 75% */}
        <div className="w-3/4 relative">
          {/* Map Container */}
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapController coords={coords} />

            {/* Littlefield Parking Zone */}
            <Circle
              center={[LITTLEFIELD.lat, LITTLEFIELD.lng]}
              radius={25 * 0.3048}
              pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2, weight: 2 }}
            />

            {/* Test Space Parking Zone */}
            <Circle
              center={[TEST_SPACE.lat, TEST_SPACE.lng]}
              radius={25 * 0.3048}
              pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2, weight: 2 }}
            />

            {/* User Location Marker */}
            {coords && (
              <CircleMarker
                center={[coords.lat, coords.lng]}
                radius={10}
                pathOptions={{ color: 'white', fillColor: '#10b981', fillOpacity: 1, weight: 3 }}
              />
            )}
          </MapContainer>

          {/* Navigating Label - Floating on Map */}
          <div className="absolute top-6 left-6 z-[1000] pointer-events-none">
            <div className="bg-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2.5 pointer-events-auto ring-1 ring-black/5">
              <Navigation size={16} className="text-emerald-600 fill-emerald-600 -rotate-45 translate-x-0.5" />
              <span className="font-bold text-gray-900 text-[15px]">Navigating...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Full Width */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-900/95 to-transparent px-12 py-6">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center gap-2 opacity-60">
            <Home className="w-8 h-8 text-white" />
            <span className="text-white text-sm">Home</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-60">
            <Music className="w-8 h-8 text-white" />
            <span className="text-white text-sm">Media</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-60">
            <Navigation className="w-8 h-8 text-white" />
            <span className="text-white text-sm">Nav</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-60">
            <Car className="w-8 h-8 text-white" />
            <span className="text-white text-sm">Vehicle</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
                ))}
              </div>
            </div>
            <span className="text-white text-sm font-semibold">Apps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
