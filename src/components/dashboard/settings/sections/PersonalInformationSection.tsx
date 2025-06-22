
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PersonalInformationSectionProps {
  formData: {
    full_name: string;
    email: string;
    phone_number: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => onInputChange('full_name', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={formData.email}
            disabled
            placeholder="Email cannot be changed"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          value={formData.phone_number}
          onChange={(e) => onInputChange('phone_number', e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );
};
