import { CheckCircle, Info, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function SessionStarted() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        navigate("/session-active");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  const handleViewSession = () => {
    navigate("/session-active");
  };

  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.3),transparent_50%)]" />
      </div>

      {/* Modal Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="w-full max-w-lg bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-white" />
            <h2 className="text-white font-semibold text-lg uppercase tracking-wide">
              Success
            </h2>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-14 h-14 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Session Started!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Your parking session is now active
            </p>

            {/* Session Details */}
            <div className="space-y-4 mb-8">
              <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Location</span>
                </div>
                <span className="font-semibold text-gray-900">Main Street, Zone A</span>
              </div>

              <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Started at</span>
                </div>
                <span className="font-semibold text-gray-900">2:30 PM</span>
              </div>
            </div>

            {/* Info Text */}
            <p className="text-sm text-gray-500 mb-6">
              Payment will be processed automatically when you leave
            </p>

            {/* Action Button */}
            <Button 
              onClick={handleViewSession}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 rounded-lg"
            >
              View Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}