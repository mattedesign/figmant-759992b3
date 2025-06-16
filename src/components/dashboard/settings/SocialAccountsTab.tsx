
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, Users, Mail } from 'lucide-react';

interface SocialAccountsTabProps {
  onConnectAccount: (provider: string) => void;
  onDisconnectAccount: (provider: string) => void;
}

export const SocialAccountsTab = ({ onConnectAccount, onDisconnectAccount }: SocialAccountsTabProps) => {
  // Mock connected accounts data
  const socialAccounts = [
    {
      provider: 'google',
      name: 'Google',
      connected: true,
      email: 'user@gmail.com',
      icon: Mail
    },
    {
      provider: 'github',
      name: 'GitHub',
      connected: false,
      email: null,
      icon: Users
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Link className="h-5 w-5" />
          <span>Connected Accounts</span>
        </CardTitle>
        <CardDescription>
          Connect your social accounts for easier sign-in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {socialAccounts.map((account) => {
            const IconComponent = account.icon;
            return (
              <div key={account.provider} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{account.name}</span>
                      {account.connected ? (
                        <Badge variant="default">Connected</Badge>
                      ) : (
                        <Badge variant="secondary">Not Connected</Badge>
                      )}
                    </div>
                    {account.connected && account.email && (
                      <div className="text-sm text-muted-foreground">
                        {account.email}
                      </div>
                    )}
                  </div>
                </div>
                {account.connected ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDisconnectAccount(account.provider)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => onConnectAccount(account.provider)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
