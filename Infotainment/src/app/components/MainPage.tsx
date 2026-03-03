import { Info, Car, Coins, Home, Music, Navigation } from "lucide-react";
import { Card } from "./ui/card";
import { ParkingSquare } from "lucide-react";

export function MainPage() {

  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 overflow-hidden">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-slate-800/80 to-transparent px-8 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-6">
          <span className="text-2xl">70°</span>
          <Info className="w-5 h-5" />
          <span className="text-lg opacity-70">11:06</span>
        </div>
        <div className="flex items-center gap-6">
          <Home className="w-5 h-5" />
          <Car className="w-5 h-5" />
          <span className="text-2xl">70°</span>
        </div>
      </div>

      {/* Main Content - Centered Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Services Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Parking Service */}
            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 backdrop-blur-lg border-blue-400/50 border-2 p-8 flex flex-col items-center justify-center gap-6 hover:scale-105 transition-transform">
              <div className="w-24 h-24 rounded-full bg-blue-500/40 flex items-center justify-center backdrop-blur-sm">
                <ParkingSquare className="w-12 h-12 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2 text-white uppercase tracking-wide">
                  Parking
                </h2>
                <p className="text-blue-100 text-lg">
                  Smart parking detection
                </p>
              </div>
              <div className="mt-2 px-5 py-2 bg-green-500/30 text-green-200 rounded-full text-sm font-semibold border border-green-400/50">
                Available
              </div>
            </Card>

            {/* Tolling Service */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/30 backdrop-blur-lg border-purple-400/50 border-2 p-8 flex flex-col items-center justify-center gap-6 hover:scale-105 transition-transform cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-purple-500/40 flex items-center justify-center backdrop-blur-sm">
                <Coins className="w-12 h-12 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2 text-white uppercase tracking-wide">
                  Tolling
                </h2>
                <p className="text-purple-100 text-lg">
                  Automatic toll payment
                </p>
              </div>
              <div className="mt-2 px-5 py-2 bg-green-500/30 text-green-200 rounded-full text-sm font-semibold border border-green-400/50">
                Available
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/95 to-transparent px-12 py-6">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center gap-2 opacity-60">
            <Home className="w-8 h-8 text-white" />
            <span className="text-white text-sm">Home</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-60">
            <Music className="w-8 h-8 text-white" />
            <span className="text-white text-sm">Media</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-60">
            <Navigation className="w-8 h-8 text-white" />
            <span className="text-white text-sm">Nav</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-60">
            <Car className="w-8 h-8 text-white" />
            <span className="text-white text-sm">Vehicle</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
                ))}
              </div>
            </div>
            <span className="text-white text-sm font-semibold">Apps</span>
          </div>
        </div>
      </div>
    </div>
  );
}