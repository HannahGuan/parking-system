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
    { minutes: 15, label: "15 min" },
    { minutes: 30, label: "30 min" },
    { minutes: 60, label: "1 hour" },
    { minutes: 90, label: "1.5 hours" },
    { minutes: 120, label: "2 hours" },
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
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Parking Duration</p>
          <p className="font-semibold text-gray-900">Select how long you'll park</p>
        </div>
      </div>

      {/* Preset Duration Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {presetDurations.map((preset) => (
          <button
            key={preset.minutes}
            onClick={() => handlePresetClick(preset.minutes)}
            className={`
              py-3 px-2 rounded-lg font-semibold text-sm transition-all
              ${duration === preset.minutes
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400'
              }
            `}
          >
            <div>{preset.label}</div>
            <div className="text-xs opacity-80 mt-1">${calculateCost(preset.minutes)}</div>
          </button>
        ))}
      </div>

      {/* Custom Duration Input */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="text-sm text-gray-600 mb-2 block">Custom Duration (max 120 min)</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max="120"
            value={duration}
            onChange={handleCustomChange}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none"
          />
          <span className="text-gray-600 font-medium">minutes</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Estimated cost: <span className="font-bold text-gray-900">${calculateCost(duration)}</span>
        </p>
      </div>
    </div>
  );
}
