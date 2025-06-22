
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface BillingAddressSectionProps {
  billingAddress: BillingAddress;
  onAddressChange: (field: keyof BillingAddress, value: string) => void;
}

export const BillingAddressSection: React.FC<BillingAddressSectionProps> = ({
  billingAddress,
  onAddressChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Billing Address</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={billingAddress.street}
            onChange={(e) => onAddressChange('street', e.target.value)}
            placeholder="Enter your street address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={billingAddress.city}
              onChange={(e) => onAddressChange('city', e.target.value)}
              placeholder="City"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={billingAddress.state}
              onChange={(e) => onAddressChange('state', e.target.value)}
              placeholder="State"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={billingAddress.zip}
              onChange={(e) => onAddressChange('zip', e.target.value)}
              placeholder="ZIP"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={billingAddress.country}
            onChange={(e) => onAddressChange('country', e.target.value)}
            placeholder="Country"
          />
        </div>
      </div>
    </div>
  );
};
