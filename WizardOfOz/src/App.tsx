import { useState } from 'react';
import { Play, Wifi, WifiOff, LogOut, LogIn, Clock, MapPin, Car } from 'lucide-react';
import { useWebSocket } from './useWebSocket';

function App() {
  const { sendMessage, isConnected, appCoords } = useWebSocket();
  const [triggerEnabled, setTriggerEnabled] = useState(true);
  const [triggerFeet, setTriggerFeet] = useState(10);
  const [plateNumber, setPlateNumber] = useState('ABC-1234');

  const sendTriggerConfig = (enabled: boolean, feet: number) => {
    sendMessage({ event: 'CONFIGURE_SPOT_TRIGGER', enabled, feet });
  };

  const handleStartSimulation = () => {
    // Send START_SESSION event to backend (same as Infotainment does)
    sendMessage({ event: 'START_SESSION' });
  };

  const handleUserLeavesCar = () => {
    sendMessage({ event: 'USER_LEAVES_CAR' });
  };

  const handleUserReturnsCar = () => {
    sendMessage({ event: 'USER_RETURNS_CAR' });
  };

  const handlePaymentReminder = () => {
    sendMessage({ event: 'PAYMENT_REMINDER' });
  };

  const handleSpotFound = () => {
    sendMessage({ event: 'SPOT_FOUND' });
  };

  const handleSetPlate = () => {
    sendMessage({ event: 'SET_PLATE_NUMBER', plateNumber });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Connection Status */}
      <div className="absolute top-4 right-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          isConnected
            ? 'bg-green-500/20 text-green-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-3">
              Wizard of Oz Control Panel
            </h1>
            <p className="text-purple-300 text-lg">
              Parking Simulation Controller
            </p>
            <p className="text-purple-400 font-mono text-sm mt-2">
              {appCoords
                ? `App GPS: (${appCoords.lat.toFixed(6)}, ${appCoords.lng.toFixed(6)})`
                : 'App GPS: waiting for location…'}
            </p>
          </div>

          {/* Control Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="space-y-6">
              {/* Info Section */}
              <div className="bg-purple-500/20 rounded-lg p-6 border border-purple-400/30">
                <h2 className="text-white font-semibold text-lg mb-2">
                  Simulation Control
                </h2>
                <p className="text-purple-200 text-sm">
                  Click the button below to trigger the parking simulation.
                  This will send a START_SESSION event to all connected clients
                  (Infotainment and App).
                </p>
              </div>

              {/* GPS Trigger Settings */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4">
                <h3 className="text-white font-semibold text-base">GPS Auto-Trigger</h3>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Distance trigger</span>
                  <button
                    onClick={() => {
                      const next = !triggerEnabled;
                      setTriggerEnabled(next);
                      sendTriggerConfig(next, triggerFeet);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${triggerEnabled ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-gray-300'}`}
                  >
                    {triggerEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-purple-200 text-sm">Distance (feet)</span>
                  <input
                    type="number"
                    min={1}
                    value={triggerFeet}
                    onChange={(e) => {
                      const next = Math.max(1, Number(e.target.value));
                      setTriggerFeet(next);
                      sendTriggerConfig(triggerEnabled, next);
                    }}
                    className="w-20 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              {/* Plate Number Setting */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4">
                <h3 className="text-white font-semibold text-base flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehicle Plate Number
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    placeholder="ABC-1234"
                    className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 text-base font-mono uppercase focus:outline-none focus:ring-2 focus:ring-purple-400"
                    maxLength={10}
                  />
                  <button
                    onClick={handleSetPlate}
                    disabled={!isConnected}
                    className={`
                      px-6 py-2.5 rounded-lg font-semibold text-sm
                      transition-all duration-200
                      ${isConnected
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Set Plate
                  </button>
                </div>
                <p className="text-purple-300 text-xs">
                  Current plate: <span className="font-mono font-bold">{plateNumber}</span>
                </p>
              </div>

              {/* Spot Found Button */}
              <button
                onClick={handleSpotFound}
                disabled={!isConnected}
                className={`
                  w-full py-6 rounded-xl font-bold text-lg
                  flex items-center justify-center gap-3
                  transition-all duration-200 transform
                  ${isConnected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <MapPin className="w-6 h-6" />
                Spot Found
              </button>

              {/* Action Buttons */}
              <button
                onClick={handleStartSimulation}
                disabled={!isConnected}
                className={`
                  w-full py-6 rounded-xl font-bold text-lg
                  flex items-center justify-center gap-3
                  transition-all duration-200 transform
                  ${isConnected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <Play className="w-6 h-6" />
                Start Parking Simulation
              </button>

              {/* User Leaves Car Button */}
              <button
                onClick={handleUserLeavesCar}
                disabled={!isConnected}
                className={`
                  w-full py-6 rounded-xl font-bold text-lg
                  flex items-center justify-center gap-3
                  transition-all duration-200 transform
                  ${isConnected
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <LogOut className="w-6 h-6" />
                User Leaves Car
              </button>

              {/* User Returns Car Button */}
              <button
                onClick={handleUserReturnsCar}
                disabled={!isConnected}
                className={`
                  w-full py-6 rounded-xl font-bold text-lg
                  flex items-center justify-center gap-3
                  transition-all duration-200 transform
                  ${isConnected
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <LogIn className="w-6 h-6" />
                User Returns to Car
              </button>

              {/* 15 Minutes Have Passed Button */}
              <button
                onClick={handlePaymentReminder}
                disabled={!isConnected}
                className={`
                  w-full py-6 rounded-xl font-bold text-lg
                  flex items-center justify-center gap-3
                  transition-all duration-200 transform
                  ${isConnected
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <Clock className="w-6 h-6" />
                15 Minutes Have Passed
              </button>

              {/* Status Info */}
              <div className="text-center">
                <p className="text-sm text-purple-300">
                  {isConnected
                    ? 'Ready to start simulation'
                    : 'Waiting for WebSocket connection...'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-purple-400">
              For research use only - Controls parking notification flow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
