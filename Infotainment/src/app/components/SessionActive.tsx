import { Info, Clock, MapPin, X } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

export function SessionActive() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();

  const handleEndSession = () => {
    // Send END_SESSION event to backend
    sendMessage({ event: 'END_SESSION' });
    navigate("/end-session");
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handleEndSession();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3),transparent_50%)]" />
      </div>

      {/* Modal Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-white" />
              <h2 className="text-white font-semibold text-lg uppercase tracking-wide">
                Active Session
              </h2>
            </div>
            <div className="px-4 py-1 bg-green-500/30 text-green-100 rounded-full flex items-center gap-2 border border-green-400/50">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Active</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Time Remaining - Large Display */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 mb-6 text-center">
              <p className="text-gray-600 text-sm mb-3 uppercase tracking-wide">Time Remaining</p>
              <div className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                01:15
              </div>
              <p className="text-gray-600 mb-6">
                Session expires at 4:30 PM
              </p>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <Progress value={50} className="h-3 bg-white" />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>2:30 PM</span>
                  <span>4:30 PM</span>
                </div>
              </div>
            </div>

            {/* Session Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">Main Street</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Elapsed</p>
                    <p className="font-semibold text-gray-900">
                      1h 15m
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Elapsed</p>
                    <p className="font-semibold text-gray-900">
                      1h 15m
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <X className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Payment</p>
                    <p className="font-semibold text-gray-900">•••• 4242</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="bg-white border-2 border-gray-400 hover:bg-gray-100 text-gray-800 font-semibold py-6 rounded-lg"
              >
                Back to Home
              </Button>
              <Button 
                onClick={handleEndSession}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-6 rounded-lg flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                End Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}