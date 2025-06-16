
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Mail } from 'lucide-react';

interface ContactTabProps {
  user: any;
  onUpdateContact: (data: any) => void;
}

export const ContactTab = ({ user, onUpdateContact }: ContactTabProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onUpdateContact({
      phone_number: formData.get('phone_number'),
      emergency_contact_name: formData.get('emergency_contact_name'),
      emergency_contact_phone: formData.get('emergency_contact_phone'),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Phone className="h-5 w-5" />
          <span>Contact Information</span>
        </CardTitle>
        <CardDescription>
          Manage your contact details and emergency contacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Email Address</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                defaultValue={user?.phone_number || ''}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Emergency Contact</h4>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  defaultValue={user?.emergency_contact_name || ''}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  type="tel"
                  defaultValue={user?.emergency_contact_phone || ''}
                  placeholder="+1 (555) 987-6543"
                />
              </div>
            </div>

            <Button type="submit">
              Update Contact Information
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
