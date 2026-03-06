import { CheckCircle, Clock, MapPin, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

export function SessionReview() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handleDone();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  const handleDone = () => {
    // Notify App to also go back to home
    sendMessage({ event: 'SESSION_COMPLETE' });
    navigate("/");
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
          <div className="bg-emerald-600 px-6 py-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-white" />
            <h2 className="text-white font-semibold text-lg uppercase tracking-wide">
              Session Complete
            </h2>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-14 h-14 text-emerald-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Session Ended
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Your parking session has been completed
            </p>

            {/* Info Text */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-emerald-800">
                Payment processed successfully to •••• 4242
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleDone}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 rounded-lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}