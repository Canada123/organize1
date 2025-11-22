import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OTPVerification } from '../components/OTPVerification';

interface SelfPayStageProps {
  email: string;
  onStageComplete: (data: SelfPayData) => void;
  onProcessPayment: (paymentData: PaymentData) => Promise<boolean>;
}

export interface SelfPayData {
  phoneNumber: string;
  phoneVerified: boolean;
  shippingAddress: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  payment: PaymentData;
  consents: {
    truthfulness: boolean;
    emergency: boolean;
    dataProcessing: boolean;
  };
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export const SelfPayStage: React.FC<SelfPayStageProps> = ({
  email,
  onStageComplete,
  onProcessPayment
}) => {
  const [data, setData] = React.useState<SelfPayData>({
    phoneNumber: '',
    phoneVerified: false,
    shippingAddress: { street: '', postalCode: '', city: '', country: 'Switzerland' },
    payment: { cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' },
    consents: { truthfulness: false, emergency: false, dataProcessing: false }
  });
  
  const [showPayment, setShowPayment] = React.useState(false);
  const [paymentProcessing, setPaymentProcessing] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);

  const canProceedToPayment = data.phoneVerified && 
                              data.shippingAddress.street && 
                              data.shippingAddress.postalCode && 
                              data.shippingAddress.city;

  const canSubmit = paymentSuccess &&
                    data.consents.truthfulness && 
                    data.consents.emergency && 
                    data.consents.dataProcessing;

  const handlePayment = async () => {
    setPaymentProcessing(true);
    const success = await onProcessPayment(data.payment);
    setPaymentSuccess(success);
    setPaymentProcessing(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Self-Pay Checkout</CardTitle>
        <CardDescription>Complete your purchase and provide shipping details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!data.phoneVerified ? (
          <div className="space-y-4">
            <Label>Phone Number (for SMS tracking updates)</Label>
            <Input 
              type="tel"
              placeholder="+41 XX XXX XX XX"
              value={data.phoneNumber}
              onChange={(e) => setData({...data, phoneNumber: e.target.value})}
            />
            <OTPVerification
              phone={data.phoneNumber}
              onVerificationComplete={(verified) => setData({...data, phoneVerified: verified})}
              onResendOTP={() => console.log('Resending OTP to phone')}
            />
          </div>
        ) : !showPayment ? (
          <div className="space-y-4">
            <Label>Shipping Address</Label>
            <Input 
              placeholder="Street Address"
              value={data.shippingAddress.street}
              onChange={(e) => setData({
                ...data, 
                shippingAddress: {...data.shippingAddress, street: e.target.value}
              })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                placeholder="Postal Code"
                value={data.shippingAddress.postalCode}
                onChange={(e) => setData({
                  ...data, 
                  shippingAddress: {...data.shippingAddress, postalCode: e.target.value}
                })}
              />
              <Input 
                placeholder="City"
                value={data.shippingAddress.city}
                onChange={(e) => setData({
                  ...data, 
                  shippingAddress: {...data.shippingAddress, city: e.target.value}
                })}
              />
            </div>
            <Button 
              onClick={() => setShowPayment(true)}
              disabled={!canProceedToPayment}
              className="w-full"
            >
              Proceed to Payment
            </Button>
          </div>
        ) : !paymentSuccess ? (
          <div className="space-y-4">
            <Label>Payment Information</Label>
            <Alert>
              <AlertDescription>
                Total: CHF 499.00 (includes device, analysis, and medical report)
              </AlertDescription>
            </Alert>
            <Input 
              placeholder="Cardholder Name"
              value={data.payment.cardholderName}
              onChange={(e) => setData({
                ...data, 
                payment: {...data.payment, cardholderName: e.target.value}
              })}
            />
            <Input 
              placeholder="Card Number"
              value={data.payment.cardNumber}
              onChange={(e) => setData({
                ...data, 
                payment: {...data.payment, cardNumber: e.target.value}
              })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                placeholder="MM/YY"
                value={data.payment.expiryDate}
                onChange={(e) => setData({
                  ...data, 
                  payment: {...data.payment, expiryDate: e.target.value}
                })}
              />
              <Input 
                placeholder="CVV"
                value={data.payment.cvv}
                onChange={(e) => setData({
                  ...data, 
                  payment: {...data.payment, cvv: e.target.value}
                })}
              />
            </div>
            <Button 
              onClick={handlePayment}
              disabled={paymentProcessing}
              className="w-full"
            >
              {paymentProcessing ? 'Processing...' : 'Process Payment'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="border-green-500">
              <AlertDescription>
                ✓ Payment successful! Please provide your consent to complete the order.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="truthfulness"
                  checked={data.consents.truthfulness}
                  onCheckedChange={(c) => setData({
                    ...data, 
                    consents: {...data.consents, truthfulness: !!c}
                  })}
                />
                <Label htmlFor="truthfulness" className="text-sm">
                  I confirm that the information provided is accurate and complete
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="emergency"
                  checked={data.consents.emergency}
                  onCheckedChange={(c) => setData({
                    ...data, 
                    consents: {...data.consents, emergency: !!c}
                  })}
                />
                <Label htmlFor="emergency" className="text-sm">
                  I understand that Holter monitoring does not replace emergency medical evaluation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="dataProcessing"
                  checked={data.consents.dataProcessing}
                  onCheckedChange={(c) => setData({
                    ...data, 
                    consents: {...data.consents, dataProcessing: !!c}
                  })}
                />
                <Label htmlFor="dataProcessing" className="text-sm">
                  I agree to telemedicine services and the privacy policy
                </Label>
              </div>
            </div>

            <Button 
              onClick={() => onStageComplete(data)}
              disabled={!canSubmit}
              className="w-full"
            >
              Complete Order
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};