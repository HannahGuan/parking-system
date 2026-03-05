import 'leaflet/dist/leaflet.css';
import { Car, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, useMap } from 'react-leaflet';

const DEFAULT_CENTER: [number, number] = [37.4275, -122.1697];
const DEFAULT_ZOOM = 17;
const LITTLEFIELD = { lat: 37.430169, lng: -122.167604 };

function MapController({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], DEFAULT_ZOOM, { duration: 1 });
    }
  }, [coords, map]);
  return null;
}

export function SpotFoundNotification() {
  const navigate = useNavigate();
  const [coords] = useState<{ lat: number; lng: number }>(LITTLEFIELD);

  const handleParkHere = () => {
    navigate('/parking-confirmation');
  };

  const handleDecline = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handleParkHere();
      } else if (event.code === "Escape") {
        event.preventDefault();
        handleDecline();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-gray-900 overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <MapController coords={coords} />
          <Circle
            center={[coords.lat, coords.lng]}
            radius={25 * 0.3048}
            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2, weight: 2 }}
          />
          {coords && (
            <CircleMarker
              center={[coords.lat, coords.lng]}
              radius={12}
              pathOptions={{ color: 'white', fillColor: '#10b981', fillOpacity: 1, weight: 3 }}
            />
          )}
        </MapContainer>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/90 pointer-events-none" />

      {/* Notification Card at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-600 px-8 py-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl uppercase tracking-wide">
                Parking Spot Detected
              </h2>
              <p className="text-emerald-100 text-sm mt-1">
                Available spot found nearby
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-bold text-gray-900 text-lg">Littlefield Courtyard</p>
                <p className="text-emerald-600 font-semibold text-sm mt-1">$2.50/hour</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleDecline}
                variant="outline"
                className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-7 rounded-xl text-base"
              >
                No Thanks
              </Button>
              <Button
                onClick={handleParkHere}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-7 rounded-xl text-base shadow-lg"
              >
                Yes, Park Here
              </Button>
            </div>

            <p className="text-center text-gray-400 text-xs mt-4">
              Press SPACE to confirm • ESC to decline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
