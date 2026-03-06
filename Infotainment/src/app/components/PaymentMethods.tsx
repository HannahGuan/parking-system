import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, Plus, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import { CardInput } from './CardInput';
import { useWebSocket } from '../hooks/useWebSocket';
import { Button } from './ui/button';

interface PaymentMethod {
  id: string;
  last4: string;
  brand: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

export function PaymentMethods() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load payment methods from backend
  useEffect(() => {
    // Request payment methods from backend
    sendMessage({ event: 'GET_PAYMENT_METHODS' });

    // Listen for payment methods response
    const handlePaymentMethods = ((event: CustomEvent) => {
      if (event.detail?.paymentMethods) {
        setPaymentMethods(event.detail.paymentMethods);
      }
      setIsLoading(false);
    }) as EventListener;

    // Also request when page becomes visible (sync with other client)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        sendMessage({ event: 'GET_PAYMENT_METHODS' });
      }
    };

    const handleFocus = () => {
      sendMessage({ event: 'GET_PAYMENT_METHODS' });
    };

    window.addEventListener('paymentMethodsUpdated', handlePaymentMethods);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);

    return () => {
      window.removeEventListener('paymentMethodsUpdated', handlePaymentMethods);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleCardSave = (card: { last4: string; brand: string; expMonth: string; expYear: string }) => {
    const newCard: PaymentMethod = {
      id: `pm_${Date.now()}`,
      ...card,
      isDefault: paymentMethods.length === 0,
    };

    // Send to backend
    sendMessage({
      event: 'ADD_PAYMENT_METHOD',
      paymentMethod: newCard,
    });

    setPaymentMethods([...paymentMethods, newCard]);

    // Navigate back to previous page (likely parking-confirmation)
    navigate(-1);
  };

  const handleRemoveCard = (id: string) => {
    const updatedMethods = paymentMethods.filter(pm => pm.id !== id);

    // If removed card was default and there are other cards, make first one default
    if (updatedMethods.length > 0) {
      const removedCard = paymentMethods.find(pm => pm.id === id);
      if (removedCard?.isDefault) {
        updatedMethods[0].isDefault = true;
      }
    }

    sendMessage({
      event: 'REMOVE_PAYMENT_METHOD',
      paymentMethodId: id,
    });

    setPaymentMethods(updatedMethods);
  };

  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    }));

    sendMessage({
      event: 'SET_DEFAULT_PAYMENT_METHOD',
      paymentMethodId: id,
    });

    setPaymentMethods(updatedMethods);
  };

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'visa': return 'from-blue-500 to-blue-600';
      case 'mastercard': return 'from-red-500 to-orange-500';
      case 'amex': return 'from-blue-600 to-cyan-600';
      case 'discover': return 'from-orange-500 to-amber-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getBrandName = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  if (showAddCard) {
    return (
      <div className="h-screen w-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 shrink-0">
          <button
            onClick={() => setShowAddCard(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-base font-semibold">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add Payment Method</h1>
        </header>

        {/* Card Input Form */}
        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <CardInput onCardSave={handleCardSave} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-base font-semibold">Home</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
        <p className="text-base text-gray-500 mt-2">Manage your saved cards</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Saved Cards */}
            {paymentMethods.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                {/* Card Visual */}
                <div className={`bg-gradient-to-br ${getBrandColor(card.brand)} p-6 relative`}>
                  <div className="flex justify-between items-start mb-10">
                    <div className="text-white text-sm font-semibold bg-white/20 px-3 py-1.5 rounded">
                      {getBrandName(card.brand)}
                    </div>
                    {card.isDefault && (
                      <div className="flex items-center gap-1.5 text-white text-sm font-semibold bg-white/20 px-3 py-1.5 rounded">
                        <CheckCircle size={14} />
                        Default
                      </div>
                    )}
                  </div>
                  <div className="text-white text-2xl font-mono tracking-wider mb-4">
                    •••• •••• •••• {card.last4}
                  </div>
                  <div className="flex justify-between text-white/90 text-sm">
                    <span>Expires {card.expMonth}/{card.expYear.slice(-2)}</span>
                    <CreditCard size={18} />
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 flex gap-3 bg-gray-50">
                  {!card.isDefault && (
                    <Button
                      onClick={() => handleSetDefault(card.id)}
                      variant="outline"
                      className="flex-1 bg-white border-2 border-blue-200 text-blue-600 font-semibold hover:bg-blue-50"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    onClick={() => handleRemoveCard(card.id)}
                    variant="outline"
                    className="flex items-center justify-center gap-2 bg-white border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 px-6"
                  >
                    <Trash2 size={16} />
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {/* Add Card Button */}
            <button
              onClick={() => setShowAddCard(true)}
              className="w-full bg-white border-3 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center gap-4 hover:border-blue-500 hover:bg-blue-50/30 transition-all"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus size={32} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Add New Card</p>
                <p className="text-sm text-gray-500 mt-1">Visa, Mastercard, Amex</p>
              </div>
            </button>

            {/* Empty State */}
            {paymentMethods.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard size={36} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Cards Added</h3>
                <p className="text-base text-gray-500">Add a payment method to start parking</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
