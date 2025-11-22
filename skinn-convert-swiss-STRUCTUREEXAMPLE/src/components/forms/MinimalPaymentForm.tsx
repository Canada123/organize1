import React, { useState } from 'react';
import { MinimalCard, MinimalCardContent, MinimalCardHeader, MinimalCardTitle } from '@/components/ui/minimal-card';
import { MinimalButton } from '@/components/ui/minimal-button';
import { CreditCard, Lock, Info } from 'lucide-react';

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  saveCard: boolean;
}

interface MinimalPaymentFormProps {
  amount: number;
  currency?: string;
  onSubmit: (data: PaymentFormData) => void;
  isProcessing?: boolean;
  className?: string;
}

export const MinimalPaymentForm: React.FC<MinimalPaymentFormProps> = ({
  amount,
  currency = 'CHF',
  onSubmit,
  isProcessing = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormData, string>>>({});
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | null>(null);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  // Detect card type
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5')) return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    return null;
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 16) {
      const formatted = formatCardNumber(cleaned);
      setFormData({ ...formData, cardNumber: formatted });
      setCardType(detectCardType(cleaned));
      if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleExpiryChange = (field: 'expiryMonth' | 'expiryYear', value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if ((field === 'expiryMonth' && cleaned.length <= 2) || 
        (field === 'expiryYear' && cleaned.length <= 2)) {
      setFormData({ ...formData, [field]: cleaned });
      if (errors[field]) setErrors({ ...errors, [field]: '' });
    }
  };

  const handleCVVChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      setFormData({ ...formData, cvv: cleaned });
      if (errors.cvv) setErrors({ ...errors, cvv: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {};

    // Card number validation
    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length < 15) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Card holder validation
    if (formData.cardHolder.length < 3) {
      newErrors.cardHolder = 'Cardholder name is required';
    }

    // Expiry validation
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const expMonth = parseInt(formData.expiryMonth);
    const expYear = parseInt(formData.expiryYear);

    if (!expMonth || expMonth < 1 || expMonth > 12) {
      newErrors.expiryMonth = 'Invalid month';
    }

    if (!expYear || expYear < currentYear || 
        (expYear === currentYear && expMonth < currentMonth)) {
      newErrors.expiryYear = 'Card expired';
    }

    // CVV validation
    if (formData.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={className}>
      <MinimalCard variant="default">
        <MinimalCardHeader>
          <MinimalCardTitle className="text-xl text-[#0D0D0D]">
            Payment Information
          </MinimalCardTitle>
          <p className="text-sm text-[#475259] mt-1">
            Complete your payment securely
          </p>
        </MinimalCardHeader>

        <MinimalCardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Display */}
            <div className="p-4 bg-[#EEE8E1] rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-[#475259]">Amount to pay:</span>
                <span className="text-2xl font-semibold text-[#004C96]">
                  {currency} {amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] mb-1.5">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  className={`
                    w-full pl-12 pr-4 py-3 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#004C96]/20
                    ${errors.cardNumber 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#475259]/20 focus:border-[#004C96]'}
                  `}
                  disabled={isProcessing}
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#475259]" />
                {cardType && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-[#004C96]">
                    {cardType.toUpperCase()}
                  </span>
                )}
              </div>
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D] mb-1.5">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.cardHolder}
                onChange={(e) => {
                  setFormData({ ...formData, cardHolder: e.target.value });
                  if (errors.cardHolder) setErrors({ ...errors, cardHolder: '' });
                }}
                className={`
                  w-full px-4 py-3 border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#004C96]/20
                  ${errors.cardHolder 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[#475259]/20 focus:border-[#004C96]'}
                `}
                disabled={isProcessing}
              />
              {errors.cardHolder && (
                <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
              )}
            </div>

            {/* Expiry and CVV Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-[#0D0D0D] mb-1.5">
                  Expiry Date
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM"
                    maxLength={2}
                    value={formData.expiryMonth}
                    onChange={(e) => handleExpiryChange('expiryMonth', e.target.value)}
                    className={`
                      w-full px-3 py-3 border rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#004C96]/20
                      ${errors.expiryMonth 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-[#475259]/20 focus:border-[#004C96]'}
                    `}
                    disabled={isProcessing}
                  />
                  <span className="flex items-center text-[#475259]">/</span>
                  <input
                    type="text"
                    placeholder="YY"
                    maxLength={2}
                    value={formData.expiryYear}
                    onChange={(e) => handleExpiryChange('expiryYear', e.target.value)}
                    className={`
                      w-full px-3 py-3 border rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#004C96]/20
                      ${errors.expiryYear 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-[#475259]/20 focus:border-[#004C96]'}
                    `}
                    disabled={isProcessing}
                  />
                </div>
                {(errors.expiryMonth || errors.expiryYear) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.expiryMonth || errors.expiryYear}
                  </p>
                )}
              </div>

              {/* CVV */}
              <div>
                <label className="block text-sm font-medium text-[#0D0D0D] mb-1.5">
                  CVV
                  <button
                    type="button"
                    className="ml-1 text-[#004C96] hover:text-[#5298F2]"
                    title="3-4 digit security code on your card"
                  >
                    <Info className="w-3 h-3 inline" />
                  </button>
                </label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={(e) => handleCVVChange(e.target.value)}
                  className={`
                    w-full px-4 py-3 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#004C96]/20
                    ${errors.cvv 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#475259]/20 focus:border-[#004C96]'}
                  `}
                  disabled={isProcessing}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            {/* Save Card Option */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="saveCard"
                checked={formData.saveCard}
                onChange={(e) => setFormData({ ...formData, saveCard: e.target.checked })}
                className="w-4 h-4 text-[#004C96] border-[#475259]/20 rounded focus:ring-[#004C96]/20"
                disabled={isProcessing}
              />
              <label htmlFor="saveCard" className="text-sm text-[#475259]">
                Save card for future payments
              </label>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-2 p-3 bg-[#004C96]/5 rounded-lg">
              <Lock className="w-4 h-4 text-[#004C96] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-[#475259]">
                <p className="font-medium text-[#0D0D0D] mb-1">Secure Payment</p>
                <p>Your payment information is encrypted and processed securely through our PCI-compliant payment provider.</p>
              </div>
            </div>

            {/* Submit Button */}
            <MinimalButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Pay {currency} {amount.toFixed(2)}
                </span>
              )}
            </MinimalButton>

            {/* Accepted Cards */}
            <div className="text-center pt-4">
              <p className="text-xs text-[#475259] mb-2">We accept</p>
              <div className="flex justify-center gap-3">
                <span className="text-xs font-medium text-[#004C96]">Visa</span>
                <span className="text-xs font-medium text-[#004C96]">Mastercard</span>
                <span className="text-xs font-medium text-[#004C96]">Amex</span>
              </div>
            </div>
          </form>
        </MinimalCardContent>
      </MinimalCard>
    </div>
  );
};

export default MinimalPaymentForm;