import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepNumber } from '../atoms/StepNumber';

interface ShippingAddressStepProps {
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  onAddressChange: (field: string, value: string) => void;
}

export const ShippingAddressStep: React.FC<ShippingAddressStepProps> = ({
  address,
  onAddressChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <StepNumber number={2} />
        <h3 className="font-semibold text-[#004C96]">Shipping Address</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => onAddressChange('street', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) => onAddressChange('postalCode', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="City"
              value={address.city}
              onChange={(e) => onAddressChange('city', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={address.country}
            disabled
            className="mt-1 bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
};