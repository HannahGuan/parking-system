import { Info, Clock, MapPin, X, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { clsx } from "clsx";

const INITIAL_MINUTES = 30;
const EXTEND_MINUTES = 30;
const RATE_PER_HOUR = 2.50;

export function SessionActive() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();
  const [totalSeconds, setTotalSeconds] = useState(INITIAL_MINUTES * 60);
  const [elapsed, setElapsed] = useState(0);
  const [extensions, setExtensions] = useState(0);
  const [initialDuration, setInitialDuration] = useState(INITIAL_MINUTES);

  // Listen for session duration from WebSocket
  useEffect(() => {
    const handleSessionActive = ((event: CustomEvent) => {
      if (event.detail?.duration) {
        const minutes = event.detail.duration;
        setInitialDuration(minutes);
        setTotalSeconds(minutes * 60);
        setElapsed(0);
        setExtensions(0);
        console.log('Session started with duration:', minutes, 'minutes');
      }
    }) as EventListener;

    window.addEventListener('sessionActive', handleSessionActive);
    return () => window.removeEventListener('sessionActive', handleSessionActive);
  }, []);

  // Listen for time extension from other clients
  useEffect(() => {
    const handleTimeExtended = ((event: CustomEvent) => {
      if (event.detail?.extensionMinutes) {
        const minutes = event.detail.extensionMinutes;
        setTotalSeconds(prev => prev + minutes * 60);
        setExtensions(prev => prev + 1);
        console.log('Time extended from another client:', minutes, 'minutes');
      }
    }) as EventListener;

    window.addEventListener('timeExtended', handleTimeExtended);
    return () => window.removeEventListener('timeExtended', handleTimeExtended);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatElapsed = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMins}m`;
    }
    return `${mins}m`;
  };

  const totalParkedMinutes = initialDuration + extensions * EXTEND_MINUTES;
  const progressRatio = totalSeconds / (totalParkedMinutes * 60);
  const progressPercent = Math.max(0, Math.min(100, progressRatio * 100));

  const handleExtend = () => {
    setTotalSeconds(prev => prev + EXTEND_MINUTES * 60);
    setExtensions(prev => prev + 1);
    // Notify other clients about time extension
    sendMessage({ event: 'EXTEND_TIME', extensionMinutes: EXTEND_MINUTES });
  };

  const handleEndSession = () => {
    sendMessage({ event: 'END_SESSION' });
    navigate("/end-session");
  };

  const isLowTime = totalSeconds <= 300 && totalSeconds > 0;
  const isExpired = totalSeconds <= 0;
  const cumulativeCost = ((elapsed / 3600) * RATE_PER_HOUR).toFixed(2);

  // Calculate session end time
  const endTime = new Date(Date.now() + totalSeconds * 1000);
  const endTimeStr = endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handleEndSession();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

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
          <div className={clsx(
            "px-6 py-4 flex items-center justify-between transition-colors duration-300",
            isExpired ? "bg-gradient-to-r from-red-600 to-orange-600" :
            isLowTime ? "bg-gradient-to-r from-orange-600 to-yellow-600" :
            "bg-gradient-to-r from-emerald-600 to-teal-600"
          )}>
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-white" />
              <h2 className="text-white font-semibold text-lg uppercase tracking-wide">
                {isExpired ? "Session Expired" : "Active Session"}
              </h2>
            </div>
            <div className={clsx(
              "px-4 py-1 rounded-full flex items-center gap-2 border",
              isExpired ? "bg-red-500/30 text-red-100 border-red-400/50" :
              "bg-emerald-500/30 text-emerald-100 border-emerald-400/50"
            )}>
              <div className={clsx(
                "w-2 h-2 rounded-full",
                isExpired ? "bg-red-300" : "bg-emerald-300 animate-pulse"
              )}></div>
              <span className="text-sm font-semibold">
                {isExpired ? "Expired" : "Active"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Time Remaining - Large Display */}
            <div className={clsx(
              "rounded-2xl p-8 mb-6 text-center transition-colors duration-300",
              isExpired ? "bg-gradient-to-br from-red-100 to-orange-100" :
              isLowTime ? "bg-gradient-to-br from-orange-100 to-yellow-100" :
              "bg-gradient-to-br from-emerald-100 to-teal-100"
            )}>
              <p className="text-gray-600 text-sm mb-3 uppercase tracking-wide">Time Remaining</p>
              <div className={clsx(
                "text-7xl font-bold mb-4 bg-clip-text text-transparent transition-all duration-300",
                isExpired ? "bg-gradient-to-r from-red-600 to-orange-600" :
                isLowTime ? "bg-gradient-to-r from-orange-600 to-yellow-600" :
                "bg-gradient-to-r from-emerald-600 to-teal-600"
              )}>
                {formatCountdown(totalSeconds)}
              </div>
              <p className="text-gray-600 mb-6">
                {isExpired ? "Session has ended" : `Session expires at ${endTimeStr}`}
              </p>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <Progress
                  value={progressPercent}
                  className={clsx(
                    "h-3 bg-white transition-colors duration-300",
                    isExpired && "opacity-50"
                  )}
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>Start</span>
                  <span>{formatElapsed(elapsed)} elapsed</span>
                  <span>{endTimeStr}</span>
                </div>
              </div>
            </div>

            {/* Session Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">Littlefield Courtyard</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Elapsed</p>
                    <p className="font-semibold text-gray-900">{formatElapsed(elapsed)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Current Cost</p>
                    <p className="font-semibold text-gray-900">${cumulativeCost}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Paid Time</p>
                    <p className="font-semibold text-gray-900">{totalParkedMinutes} min</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Extend Time Button (if not expired) */}
            {!isExpired && (
              <div className="mb-4">
                <Button
                  onClick={handleExtend}
                  variant="outline"
                  className="w-full bg-emerald-50 border-2 border-emerald-200 hover:bg-emerald-100 text-emerald-700 font-semibold py-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  Extend by {EXTEND_MINUTES} Minutes (+${(EXTEND_MINUTES / 60 * RATE_PER_HOUR).toFixed(2)})
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/')}
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

            <p className="text-center text-gray-500 text-xs mt-4">
              Press SPACE to end session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
