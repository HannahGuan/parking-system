import { Battery, Gauge } from "lucide-react";
import { Card } from "./ui/card";

export function VehicleStatus() {
  // Simulated vehicle data - in real implementation, this would come from vehicle API
  const gearPosition = "P"; // Park, Reverse, Neutral, Drive
  const batteryLevel = 65; // percentage
  const speed = 0; // mph

  return (
    <Card className="bg-gradient-to-br from-gray-700/30 to-gray-800/40 backdrop-blur-lg border-gray-500/50 border-2 p-4">
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-white uppercase tracking-wide">
          Vehicle
        </h3>
      </div>

      <div className="space-y-3">
        {/* Gear Position */}
        <div className="flex items-center justify-between px-2">
          <span className="text-gray-300 text-sm font-medium">Gear</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/40 rounded-lg flex items-center justify-center border border-blue-400/50">
              <span className="text-white font-bold text-sm">{gearPosition}</span>
            </div>
            <span className="text-gray-200 text-sm">Park</span>
          </div>
        </div>

        {/* Battery Level */}
        <div className="flex items-center justify-between px-2">
          <span className="text-gray-300 text-sm font-medium">Battery</span>
          <div className="flex items-center gap-2">
            <Battery
              className={`w-5 h-5 ${
                batteryLevel > 50 ? 'text-green-400' :
                batteryLevel > 20 ? 'text-yellow-400' :
                'text-red-400'
              }`}
            />
            <span className="text-white font-semibold text-sm">{batteryLevel}%</span>
          </div>
        </div>

        {/* Speed */}
        <div className="flex items-center justify-between px-2">
          <span className="text-gray-300 text-sm font-medium">Speed</span>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold text-sm">{speed} mph</span>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 pt-3 border-t border-gray-600/50">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs font-semibold uppercase tracking-wide">
            Ready
          </span>
        </div>
      </div>
    </Card>
  );
}
