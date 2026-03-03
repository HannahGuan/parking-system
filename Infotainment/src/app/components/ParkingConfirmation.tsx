import { Info, MapPin, DollarSign, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

export function ParkingConfirmation() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();

  const handleConfirm = () => {
    // Send START_SESSION event to backend
    sendMessage({ event: 'START_SESSION' });
    // Navigation will happen via WebSocket response
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
  }, [navigate]);

  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
      </div>

      {/* Modal Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="w-full max-w-lg bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 flex items-center gap-3">
            <Info className="w-6 h-6 text-white" />
            <h2 className="text-white font-semibold text-lg uppercase tracking-wide">
              Confirmation
            </h2>
          </div>

          {/* Content */}
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center uppercase tracking-wide">
              Start Parking Session?
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Vehicle in Park Mode - Ready to begin
            </p>

            {/* Details */}
            <div className="space-y-4 mb-8">
              <div className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">Main Street, Zone A</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Rate</p>
                  <p className="font-semibold text-gray-900">$1.5/hour</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className="font-semibold text-gray-900">•••• 4242</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="bg-white border-2 border-gray-400 hover:bg-gray-100 text-gray-800 font-semibold py-6 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-lg"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}