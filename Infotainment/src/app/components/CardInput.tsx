import { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Button } from './ui/button';

interface CardInputProps {
  onCardSave: (card: {
    last4: string;
    brand: string;
    expMonth: string;
    expYear: string;
  }) => void;
}

// Detect card brand from number
function detectCardBrand(number: string): string {
  const digits = number.replace(/\s/g, '');
  if (digits.startsWith('4')) return 'visa';
  if (digits.startsWith('5')) return 'mastercard';
  if (digits.startsWith('3')) return 'amex';
  if (digits.startsWith('6')) return 'discover';
  return 'unknown';
}

// Format card number with spaces
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  const matches = digits.match(/.{1,4}/g);
  return matches ? matches.join(' ') : digits;
}

// Format expiry as MM/YY
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 2) {
    return digits.slice(0, 2) + (digits.length > 2 ? '/' + digits.slice(2, 4) : '');
  }
  return digits;
}

// Validate test cards
function validateTestCard(number: string): { valid: boolean; message?: string } {
  const digits = number.replace(/\s/g, '');

  // Success cards
  if (digits === '4242424242424242') return { valid: true };
  if (digits === '5555555555554444') return { valid: true };

  // Failure cards
  if (digits === '4000000000000002') return { valid: false, message: 'Card declined' };
  if (digits === '4000000000009995') return { valid: false, message: 'Insufficient funds' };

  // For demo, accept any 16-digit number
  if (digits.length === 16) return { valid: true };

  return { valid: false, message: 'Invalid card number' };
}

export function CardInput({ onCardSave }: CardInputProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const cardBrand = detectCardBrand(cardNumber);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
      setError('');
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 4) {
      setExpiry(formatted);
      setError('');
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvc(value);
      setError('');
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 5) {
      setZipCode(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid card number');
      return;
    }

    if (expiry.length !== 5) {
      setError('Please enter expiry date (MM/YY)');
      return;
    }

    if (cvc.length < 3) {
      setError('Please enter CVC');
      return;
    }

    if (zipCode.length !== 5) {
      setError('Please enter 5-digit ZIP code');
      return;
    }

    // Validate test card
    const validation = validateTestCard(cardNumber);
    if (!validation.valid) {
      setError(validation.message || 'Invalid card');
      return;
    }

    // Simulate processing
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const [expMonth, expYear] = expiry.split('/');
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);

    onCardSave({
      last4,
      brand: cardBrand,
      expMonth,
      expYear: '20' + expYear,
    });

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Number */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isProcessing}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {cardBrand === 'visa' && (
              <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">VISA</div>
            )}
            {cardBrand === 'mastercard' && (
              <div className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">MC</div>
            )}
            {cardBrand === 'unknown' && <CreditCard size={22} className="text-gray-400" />}
          </div>
        </div>
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={expiry}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isProcessing}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            CVC
          </label>
          <div className="relative">
            <input
              type="text"
              value={cvc}
              onChange={handleCvcChange}
              placeholder="123"
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessing}
            />
            <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* ZIP Code */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          ZIP Code
        </label>
        <input
          type="text"
          value={zipCode}
          onChange={handleZipCodeChange}
          placeholder="12345"
          className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isProcessing}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Test Cards Info */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-800 mb-2">Test Cards</p>
        <div className="space-y-1 text-xs text-blue-700">
          <p>✓ 4242 4242 4242 4242 (Success)</p>
          <p>✓ 5555 5555 5555 4444 (Success)</p>
          <p>✗ 4000 0000 0000 0002 (Declined)</p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          'Save Card'
        )}
      </Button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Lock size={14} />
        <span>Secured by Stripe-like encryption</span>
      </div>
    </form>
  );
}
