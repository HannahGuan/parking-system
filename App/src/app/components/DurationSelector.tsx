import { Clock } from "lucide-react";
import { useState } from "react";

interface DurationSelectorProps {
  onDurationChange: (minutes: number) => void;
  selectedDuration?: number;
  ratePerHour?: number;
}

export function DurationSelector({
  onDurationChange,
  selectedDuration = 60,
  ratePerHour = 2.50
}: DurationSelectorProps) {
  const [duration, setDuration] = useState(selectedDuration);

  const presetDurations = [
    { minutes: 15, label: "15m" },
    { minutes: 30, label: "30m" },
    { minutes: 60, label: "1h" },
    { minutes: 90, label: "1.5h" },
    { minutes: 120, label: "2h" },
  ];

  const calculateCost = (minutes: number) => {
    return ((minutes / 60) * ratePerHour).toFixed(2);
  };

  const handlePresetClick = (minutes: number) => {
    setDuration(minutes);
    onDurationChange(minutes);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(120, Math.max(1, parseInt(e.target.value) || 1));
    setDuration(value);
    onDurationChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
          <Clock size={16} className="text-emerald-500" />
        </div>
        <div>
          <p className="text-[11px] text-gray-400 font-medium">Parking Duration</p>
          <p className="text-[15px] font-bold text-gray-900">Select how long</p>
        </div>
      </div>

      {/* Preset Duration Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {presetDurations.map((preset) => (
          <button
            key={preset.minutes}
            onClick={() => handlePresetClick(preset.minutes)}
            className={`
              py-2.5 rounded-xl font-bold text-xs transition-all
              ${duration === preset.minutes
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-emerald-50/60 text-gray-700 border border-gray-200'
              }
            `}
          >
            <div>{preset.label}</div>
            <div className="text-[10px] opacity-80 mt-0.5">${calculateCost(preset.minutes)}</div>
          </button>
        ))}
      </div>

      {/* Custom Duration Input */}
      <div className="bg-emerald-50/60 rounded-2xl p-4">
        <label className="text-[11px] text-gray-400 font-medium mb-2 block">Custom (max 120 min)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="120"
            value={duration}
            onChange={handleCustomChange}
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-900 text-sm focus:border-emerald-500 focus:outline-none bg-white"
          />
          <span className="text-gray-600 font-medium text-sm">min</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Cost: <span className="font-bold text-gray-900">${calculateCost(duration)}</span>
        </p>
      </div>
    </div>
  );
}
