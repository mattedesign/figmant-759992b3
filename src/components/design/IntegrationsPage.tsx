
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plug, ExternalLink, Settings, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'available' | 'coming-soon';
  logoUrl?: string;
  isEnabled?: boolean;
  features: string[];
}

export const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'figma',
      name: 'Figma',
      description: 'Import designs directly from Figma for seamless analysis',
      category: 'Design Tools',
      status: 'available',
      isEnabled: false,
      features: ['Direct import', 'Auto-sync', 'Version tracking']
    },
    {
      id: 'sketch',
      name: 'Sketch',
      description: 'Connect your Sketch files for comprehensive design analysis',
      category: 'Design Tools',
      status: 'coming-soon',
      isEnabled: false,
      features: ['File import', 'Cloud sync', 'Symbol analysis']
    },
    {
      id: 'adobe-xd',
      name: 'Adobe XD',
      description: 'Analyze Adobe XD prototypes and design systems',
      category: 'Design Tools',
      status: 'coming-soon',
      isEnabled: false,
      features: ['Prototype analysis', 'Component library', 'Sharing links']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get analysis notifications and reports in your Slack channels',
      category: 'Communication',
      status: 'available',
      isEnabled: true,
      features: ['Real-time notifications', 'Report sharing', 'Team collaboration']
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Enhance analysis with real user behavior data',
      category: 'Analytics',
      status: 'connected',
      isEnabled: true,
      features: ['User behavior data', 'Conversion tracking', 'A/B test insights']
    },
    {
      id: 'hotjar',
      name: 'Hotjar',
      description: 'Combine heatmap data with AI design analysis',
      category: 'Analytics',
      status: 'available',
      isEnabled: false,
      features: ['Heatmap integration', 'User recordings', 'Survey data']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows with 5000+ apps',
      category: 'Automation',
      status: 'available',
      isEnabled: false,
      features: ['Workflow automation', '5000+ app connections', 'Custom triggers']
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Export analysis reports to your Notion workspace',
      category: 'Productivity',
      status: 'coming-soon',
      isEnabled: false,
      features: ['Report export', 'Template creation', 'Team workspaces']
    }
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, isEnabled: !integration.isEnabled }
          : integration
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'available':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'coming-soon':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'available':
        return <Badge className="bg-blue-100 text-blue-800">Available</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const categories = Array.from(new Set(integrations.map(i => i.category)));

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Plug className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Integrations</h1>
          </div>
          <p className="text-muted-foreground">
            Connect your favorite tools to enhance your design analysis workflow
          </p>
        </div>
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Browse All Integrations
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {categories.map(category => {
            const categoryIntegrations = integrations.filter(i => i.category === category);
            
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {categoryIntegrations.map((integration) => (
                    <Card key={integration.id} className="transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <Plug className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusIcon(integration.status)}
                                {getStatusBadge(integration.status)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {integration.status !== 'coming-soon' && (
                              <Switch
                                checked={integration.isEnabled}
                                onCheckedChange={() => toggleIntegration(integration.id)}
                              />
                            )}
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">{integration.description}</p>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {integration.features.map(feature => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="connected">
          <div className="grid md:grid-cols-2 gap-4">
            {integrations.filter(i => i.status === 'connected').map((integration) => (
              <Card key={integration.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Plug className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(integration.status)}
                          {getStatusBadge(integration.status)}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{integration.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available">
          <div className="grid md:grid-cols-2 gap-4">
            {integrations.filter(i => i.status === 'available').map((integration) => (
              <Card key={integration.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Plug className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(integration.status)}
                          {getStatusBadge(integration.status)}
                        </div>
                      </div>
                    </div>
                    <Button size="sm">
                      Connect
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{integration.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Custom Integration CTA */}
      <Card className="border-dashed">
        <CardContent className="text-center py-8">
          <Plug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Need a Custom Integration?</h3>
          <p className="text-muted-foreground mb-4">
            Contact our team to discuss custom integrations for your specific workflow
          </p>
          <Button variant="outline">
            Request Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
