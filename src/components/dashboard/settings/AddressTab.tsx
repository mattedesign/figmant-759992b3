
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface AddressTabProps {
  onUpdateAddress: (data: any) => void;
  address?: any;
}

export const AddressTab = ({ onUpdateAddress, address }: AddressTabProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onUpdateAddress({
      street_address: formData.get('street_address'),
      city: formData.get('city'),
      state: formData.get('state'),
      postal_code: formData.get('postal_code'),
      country: formData.get('country'),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Address Information</span>
        </CardTitle>
        <CardDescription>
          Update your billing and shipping address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street_address">Street Address</Label>
            <Input
              id="street_address"
              name="street_address"
              defaultValue={address?.street_address || ''}
              placeholder="123 Main Street"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                defaultValue={address?.city || ''}
                placeholder="New York"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                name="state"
                defaultValue={address?.state || ''}
                placeholder="NY"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                name="postal_code"
                defaultValue={address?.postal_code || ''}
                placeholder="10001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                defaultValue={address?.country || 'United States'}
                placeholder="United States"
              />
            </div>
          </div>

          <Button type="submit">
            Update Address
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
