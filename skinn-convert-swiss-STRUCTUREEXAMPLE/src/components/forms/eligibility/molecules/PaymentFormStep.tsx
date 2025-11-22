import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StepNumber } from '../atoms/StepNumber';
import { CreditCard, Lock, Shield } from 'lucide-react';

interface PaymentFormStepProps {
  payment: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
  onPaymentChange: (field: string, value: string) => void;
  totalAmount: string;
}

export const PaymentFormStep: React.FC<PaymentFormStepProps> = ({
  payment,
  onPaymentChange,
  totalAmount = "CHF 499.00"
}) => {
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19);
  };
  
  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <StepNumber number={3} />
        <h3 className="font-semibold text-[#004C96]">Payment Information</h3>
      </div>
      
      <Alert className="border-blue-200 bg-blue-50">
        <CreditCard className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Total: {totalAmount} (includes device, analysis, and medical report)
        </AlertDescription>
      </Alert>
      
      {/* Security badge */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4 text-green-600" />
        <span>Secure payment processing</span>
        <Lock className="h-4 w-4 text-green-600 ml-2" />
        <span>PCI DSS compliant</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
            id="cardholderName"
            placeholder="John Doe"
            value={payment.cardholderName}
            onChange={(e) => onPaymentChange('cardholderName', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={payment.cardNumber}
              onChange={(e) => onPaymentChange('cardNumber', formatCardNumber(e.target.value))}
              className="mt-1 pl-10"
              maxLength={19}
            />
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={payment.expiryDate}
              onChange={(e) => onPaymentChange('expiryDate', formatExpiryDate(e.target.value))}
              className="mt-1"
              maxLength={5}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              type="password"
              placeholder="123"
              value={payment.cvv}
              onChange={(e) => onPaymentChange('cvv', e.target.value)}
              className="mt-1"
              maxLength={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};