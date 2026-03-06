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

interface PaymentMethod {
  id: string;
  last4: string;
  brand: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

export function ParkingConfirmation() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(LITTLEFIELD);
  const [duration, setDuration] = useState(60);
  const [plateNumber, setPlateNumber] = useState('ABC-1234');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
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

  // Request payment methods on mount and when returning to this page
  useEffect(() => {
    sendMessage({ event: 'GET_PAYMENT_METHODS' });

    // Also request when page becomes visible (user returns from payment-methods)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        sendMessage({ event: 'GET_PAYMENT_METHODS' });
      }
    };

    const handleFocus = () => {
      sendMessage({ event: 'GET_PAYMENT_METHODS' });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Listen for plate number updates from WebSocket
  useEffect(() => {
    const handlePlateUpdate = ((event: CustomEvent) => {
      setPlateNumber(event.detail.plateNumber);
    }) as EventListener;

    window.addEventListener('updatePlate', handlePlateUpdate);
    return () => window.removeEventListener('updatePlate', handlePlateUpdate);
  }, []);

  // Listen for payment methods updates
  useEffect(() => {
    const handlePaymentMethodsUpdate = ((event: CustomEvent) => {
      const methods = event.detail.paymentMethods as PaymentMethod[];
      const defaultMethod = methods.find(pm => pm.isDefault) || methods[0] || null;
      setPaymentMethod(defaultMethod);
    }) as EventListener;

    window.addEventListener('paymentMethodsUpdated', handlePaymentMethodsUpdate);
    return () => window.removeEventListener('paymentMethodsUpdated', handlePaymentMethodsUpdate);
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
      <div className="absolute inset-0 z-20 flex items-center justify-center p-3">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-blue-600 px-4 py-2 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-white" />
            <h2 className="text-white font-bold text-sm uppercase tracking-wide">
              Confirm Parking
            </h2>
          </div>

          {/* Content */}
          <div className="p-4">
            <h1 className="text-lg font-bold text-gray-900 mb-0.5 text-center">
              Start Parking Session?
            </h1>
            <p className="text-gray-600 text-center mb-3 text-xs">
              Review details and select duration
            </p>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-50 rounded-md p-2 flex items-center gap-2 shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900 text-xs truncate">Littlefield Courtyard</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-md p-2 flex items-center gap-2 shadow-sm">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-600">Rate</p>
                  <p className="font-semibold text-gray-900 text-xs">${RATE_PER_HOUR}/hour</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/payment-methods')}
                className="bg-gray-50 rounded-md p-2 flex items-center gap-2 shadow-sm hover:bg-gray-100 transition-colors w-full text-left"
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                  paymentMethod
                    ? paymentMethod.brand === 'visa'
                      ? 'bg-blue-100'
                      : paymentMethod.brand === 'mastercard'
                      ? 'bg-red-100'
                      : 'bg-orange-100'
                    : 'bg-orange-100'
                }`}>
                  <CreditCard className={`w-4 h-4 ${
                    paymentMethod
                      ? paymentMethod.brand === 'visa'
                        ? 'text-blue-600'
                        : paymentMethod.brand === 'mastercard'
                        ? 'text-red-600'
                        : 'text-orange-600'
                      : 'text-orange-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-600">Payment</p>
                  <p className="font-semibold text-gray-900 text-xs truncate">
                    {paymentMethod ? `•••• ${paymentMethod.last4}` : '+ Add Card'}
                  </p>
                </div>
              </button>

              <div className="bg-gray-50 rounded-md p-2 flex items-center gap-2 shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-600">Vehicle</p>
                  <p className="font-semibold text-gray-900 text-xs font-mono tracking-wider truncate">{plateNumber}</p>
                </div>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="mb-3">
              <DurationSelector
                onDurationChange={setDuration}
                selectedDuration={duration}
                ratePerHour={RATE_PER_HOUR}
              />
            </div>

            {/* Total Cost Display */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-md p-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold text-xs">Total Prepaid:</span>
                <span className="text-lg font-bold text-blue-600">${calculateCost()}</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-0.5">
                For {duration} minute{duration !== 1 ? 's' : ''} of parking
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="bg-white border-2 border-gray-400 hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-md text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md text-xs shadow-lg"
              >
                Confirm & Pay ${calculateCost()}
              </Button>
            </div>

            <p className="text-center text-gray-400 text-[10px] mt-2">
              Press SPACE to confirm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}