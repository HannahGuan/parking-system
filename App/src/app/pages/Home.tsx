import imgMap from "../../assets/fab023585f95f8494892451e96b24e412f527d7c.png";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Car } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [showSpotFound, setShowSpotFound] = useState(false);

  // Simulate arrival detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpotFound(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleParkClick = () => {
    navigate('/confirm');
  };

  return (
    <div className="relative h-full w-full bg-gray-200 overflow-hidden">
      {/* Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${imgMap})` }}
      >
        {/* User Location Marker - Google Maps Navigation Style */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform translate-y-12">
            {/* Direction Beam */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[30px] border-r-[30px] border-t-[80px] border-l-transparent border-r-transparent border-t-emerald-500/20 blur-sm transform -rotate-12 origin-bottom scale-y-150" />
            
            {/* Dot */}
            <div className="w-6 h-6 bg-emerald-500 rounded-full border-[3px] border-white shadow-lg relative z-10 box-border ring-1 ring-black/5" />
            
            {/* Pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-500/20 rounded-full animate-ping" />
        </div>
      </div>

      {/* Floating UI Elements */}
      <div className="absolute top-14 left-6 z-10 pointer-events-none">
        <div className="bg-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2.5 pointer-events-auto ring-1 ring-black/5">
          <Navigation size={16} className="text-emerald-600 fill-emerald-600 -rotate-45 translate-x-0.5" />
          <span className="font-bold text-gray-900 text-[15px]">Navigating...</span>
        </div>
      </div>

      {/* Spot Found Notification */}
      <AnimatePresence>
        {showSpotFound && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-[0_-5px_30px_rgba(0,0,0,0.15)] z-20 p-6 pb-10"
          >
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                <Car size={28} />
              </div>
              <div>
                <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">Spot Detected</h2>
                <p className="text-gray-500 text-[15px] font-medium mt-0.5">Zone #8492 • $2.50/hr</p>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleParkClick}
                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-[17px] hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
              >
                Yes, Park Here
              </button>
              <button 
                onClick={() => setShowSpotFound(false)}
                className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-[17px] hover:bg-gray-200 active:scale-[0.98] transition-all"
              >
                Not Parking
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}