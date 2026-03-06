import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Info, MapPin, DollarSign, Car } from 'lucide-react';
import { DurationSelector } from '../components/DurationSelector';
import { useWebSocket } from '../hooks/useWebSocket';

interface PaymentMethod {
  id: string;
  last4: string;
  brand: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

export default function Confirmation() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();
  const [duration, setDuration] = useState(60);
  const [plateNumber, setPlateNumber] = useState('ABC-1234');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const RATE_PER_HOUR = 2.50;

  const calculateCost = () => {
    return ((duration / 60) * RATE_PER_HOUR).toFixed(2);
  };

  // Request payment methods on mount and when returning to this page
  React.useEffect(() => {
    // Also request when page becomes visible (user returns from payment-methods)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Confirmation visible, requesting payment methods');
        sendMessage({ event: 'GET_PAYMENT_METHODS' });
      }
    };

    const handleFocus = () => {
      console.log('Confirmation focused, requesting payment methods');
      sendMessage({ event: 'GET_PAYMENT_METHODS' });
    };

    // Add listeners first
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Then request payment methods
    console.log('Confirmation mounted, requesting payment methods');
    sendMessage({ event: 'GET_PAYMENT_METHODS' });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [sendMessage]);

  // Listen for plate number updates from WebSocket
  React.useEffect(() => {
    const handlePlateUpdate = ((event: CustomEvent) => {
      setPlateNumber(event.detail.plateNumber);
    }) as EventListener;

    window.addEventListener('updatePlate', handlePlateUpdate);
    return () => window.removeEventListener('updatePlate', handlePlateUpdate);
  }, []);

  // Listen for payment methods updates
  React.useEffect(() => {
    const handlePaymentMethodsUpdate = ((event: CustomEvent) => {
      const methods = event.detail.paymentMethods as PaymentMethod[];
      const defaultMethod = methods.find(pm => pm.isDefault) || methods[0] || null;
      setPaymentMethod(defaultMethod);
    }) as EventListener;

    window.addEventListener('paymentMethodsUpdated', handlePaymentMethodsUpdate);
    return () => window.removeEventListener('paymentMethodsUpdated', handlePaymentMethodsUpdate);
  }, []);

  const handleConfirm = () => {
    // Send START_SESSION event to backend with duration
    sendMessage({ event: 'START_SESSION', duration });
    // Navigation will happen via WebSocket response
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-[#f0f4f2]">
      {/* Green gradient header */}
      <div className="bg-gradient-to-b from-emerald-50 to-[#f0f4f2] pt-14 pb-6 px-6 shrink-0 relative">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full border-2 border-emerald-400 flex items-center justify-center">
            <Info size={11} className="text-emerald-500" />
          </div>
          <span className="text-emerald-600 text-xs font-bold tracking-widest uppercase">Confirmation</span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 px-5 relative z-10 overflow-y-auto pb-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-3xl shadow-lg shadow-black/5 p-6"
        >
          {/* Title */}
          <div className="text-center mb-7">
            <h1 className="text-[20px] font-extrabold text-gray-900 tracking-tight mb-1">START PARKING SESSION?</h1>
            <p className="text-gray-400 text-[13px] font-medium">Vehicle in Park Mode – Ready to begin</p>
          </div>

          {/* Info Cards */}
          <div className="space-y-3 mb-6">
            {/* Location */}
            <div className="bg-emerald-50/60 rounded-2xl px-4 py-3.5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <MapPin size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Location</p>
                <p className="text-[15px] font-bold text-gray-900">Main Street, Zone A</p>
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="bg-emerald-50/60 rounded-2xl px-4 py-3.5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <DollarSign size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Hourly Rate</p>
                <p className="text-[15px] font-bold text-gray-900">$2.50 per hour</p>
              </div>
            </div>

          </div>

          {/* Duration Selector */}
          <div className="mb-5">
            <DurationSelector
              onDurationChange={setDuration}
              selectedDuration={duration}
              ratePerHour={RATE_PER_HOUR}
            />
          </div>

          {/* Total Cost Display */}
          <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl px-4 py-3.5 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-bold text-[14px]">Total Prepaid:</span>
              <span className="text-[22px] font-extrabold text-emerald-600">${calculateCost()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {duration} min of parking
            </p>
          </div>

          {/* Vehicle Information */}
          <div className="bg-emerald-50/60 rounded-2xl px-4 py-3.5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
              <Car size={18} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Registered Vehicle</p>
              <p className="text-[15px] font-bold text-gray-900 font-mono tracking-wider">{plateNumber}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-emerald-50/60 rounded-2xl px-4 py-4">
            <p className="text-[11px] text-gray-400 font-medium mb-2.5">Payment Method</p>
            {paymentMethod ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-7 rounded-md ${
                    paymentMethod.brand === 'visa' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                    paymentMethod.brand === 'mastercard' ? 'bg-gradient-to-br from-red-500 to-orange-500' :
                    'bg-gradient-to-br from-emerald-500 to-teal-600'
                  } shadow-sm`} />
                  <span className="text-[15px] font-bold text-gray-900 tracking-wide">•••• {paymentMethod.last4}</span>
                </div>
                <button
                  onClick={() => navigate('/payment-methods')}
                  className="text-xs text-emerald-600 font-semibold"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/payment-methods')}
                className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm font-semibold text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-all"
              >
                + Add Payment Method
              </button>
            )}
          </div>
        </motion.div>
      </main>

      {/* Bottom Buttons */}
      <footer className="px-5 pb-10 pt-2 shrink-0 flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex-1 bg-white text-gray-700 py-3.5 rounded-2xl font-bold text-[15px] border border-gray-200 hover:bg-gray-50 active:scale-[0.97] transition-all shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="flex-[1.3] bg-emerald-500 text-white py-3.5 rounded-2xl font-bold text-[15px] hover:bg-emerald-600 active:scale-[0.97] transition-all shadow-lg shadow-emerald-500/20"
        >
          Pay ${calculateCost()}
        </button>
      </footer>
    </div>
  );
}
