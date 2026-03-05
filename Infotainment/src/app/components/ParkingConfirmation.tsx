import 'leaflet/dist/leaflet.css';
import { Info, MapPin, DollarSign, CreditCard, Car } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, useMap } from 'react-leaflet';
import { useWebSocket } from "../hooks/useWebSocket";
import { DurationSelector } from "./DurationSelector";

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

// Haversine distance in feet
function distanceFeet(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 20902231; // Earth radius in feet
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const sin2 = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(sin2));
}

export function ParkingConfirmation() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(LITTLEFIELD);
  const [duration, setDuration] = useState(60);
  const [plateNumber, setPlateNumber] = useState('ABC-1234');
  const RATE_PER_HOUR = 2.50;
  const lastCoords = useRef<{ lat: number; lng: number } | null>(null);

  // Real-time GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos.coords.accuracy > 50) return;
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (lastCoords.current && distanceFeet(lastCoords.current, next) < 3) return;
        lastCoords.current = next;
        setCoords(next);
      },
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Listen for plate number updates from WebSocket
  useEffect(() => {
    const handlePlateUpdate = ((event: CustomEvent) => {
      setPlateNumber(event.detail.plateNumber);
    }) as EventListener;

    window.addEventListener('updatePlate', handlePlateUpdate);
    return () => window.removeEventListener('updatePlate', handlePlateUpdate);
  }, []);

  const handleConfirm = () => {
    // Send START_SESSION event to backend with duration
    sendMessage({ event: 'START_SESSION', duration });
    // Navigation will happen via WebSocket response
  };

  const calculateCost = () => {
    return ((duration / 60) * RATE_PER_HOUR).toFixed(2);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [duration]);

  return (
    <div className="fixed inset-0 z-[9999] h-screen w-screen bg-gray-900 overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
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
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-gray-900/90 pointer-events-none" />

      {/* Modal Dialog */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-white" />
            <h2 className="text-white font-bold text-base uppercase tracking-wide">
              Confirm Parking Details
            </h2>
          </div>

          {/* Content */}
          <div className="p-5">
            <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">
              Start Parking Session?
            </h1>
            <p className="text-gray-600 text-center mb-4 text-sm">
              Review details and select duration
            </p>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900 text-sm">Littlefield Courtyard</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Rate</p>
                  <p className="font-semibold text-gray-900 text-sm">${RATE_PER_HOUR}/hour</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900 text-sm">•••• 4242</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Registered Vehicle</p>
                  <p className="font-semibold text-gray-900 text-sm font-mono tracking-wider">{plateNumber}</p>
                </div>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="mb-5">
              <DurationSelector
                onDurationChange={setDuration}
                selectedDuration={duration}
                ratePerHour={RATE_PER_HOUR}
              />
            </div>

            {/* Total Cost Display */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold text-sm">Total Prepaid Amount:</span>
                <span className="text-xl font-bold text-blue-600">${calculateCost()}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                For {duration} minute{duration !== 1 ? 's' : ''} of parking
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="bg-white border-2 border-gray-400 hover:bg-gray-100 text-gray-800 font-semibold py-4 rounded-lg text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg text-sm shadow-lg"
              >
                Confirm & Pay ${calculateCost()}
              </Button>
            </div>

            <p className="text-center text-gray-400 text-xs mt-3">
              Press SPACE to confirm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}