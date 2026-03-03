import { Outlet, useLocation } from "react-router";
import { clsx } from "clsx";
import { Toaster } from "sonner";
import { useWebSocket } from "../hooks/useWebSocket";

export default function Layout() {
  const location = useLocation();
  const statusColor = 'text-black';

  // Initialize WebSocket connection
  useWebSocket();

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8 font-sans overflow-y-auto">
      <div className="w-[393px] h-[852px] shrink-0 bg-gray-900 rounded-[3.5rem] overflow-hidden shadow-2xl relative flex flex-col border-[8px] border-gray-900 ring-1 ring-gray-900/5">
        {/* Status Bar Simulation */}
        <div className={clsx(
          "h-14 bg-transparent absolute top-0 left-0 right-0 z-50 flex items-end justify-between px-8 pb-3 text-sm font-semibold",
          statusColor
        )}>
          <span>9:41</span>
          <div className={clsx("flex gap-1.5 items-center opacity-90", statusColor)}>
            <div className="w-4 h-4 rounded-full border border-current bg-current/20" />
            <div className="w-4 h-4 rounded-full border border-current bg-current/20" />
            <div className="w-6 h-3 rounded-full border border-current bg-current/20 relative">
             <div className="absolute top-0.5 right-0.5 bottom-0.5 w-4 bg-current rounded-full" />
            </div>
          </div>
        </div>
        
        <main className="flex-1 relative overflow-hidden flex flex-col bg-gray-50 rounded-[3rem] mask-image-fill">
          <Outlet />
        </main>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-gray-900/20 rounded-full z-50 pointer-events-none mix-blend-difference invert" />

        {/* Toast Notifications - Inside phone UI */}
        <Toaster position="top-center" />
      </div>
    </div>
  );
}