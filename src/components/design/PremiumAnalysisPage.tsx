
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Target, BarChart3, Users, Sparkles, Lock } from 'lucide-react';

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'available' | 'premium' | 'coming-soon';
  category: string;
}

export const PremiumAnalysisPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const premiumFeatures: PremiumFeature[] = [
    {
      id: 'competitor-analysis',
      title: 'Competitor Analysis',
      description: 'Compare your designs against industry competitors and best practices',
      icon: Target,
      status: 'premium',
      category: 'Analysis'
    },
    {
      id: 'advanced-metrics',
      title: 'Advanced Metrics',
      description: 'Deep dive into conversion probability, engagement scores, and business impact',
      icon: BarChart3,
      status: 'premium',
      category: 'Analytics'
    },
    {
      id: 'user-persona-analysis',
      title: 'User Persona Analysis',
      description: 'Tailored analysis based on specific user personas and demographics',
      icon: Users,
      status: 'premium',
      category: 'Analysis'
    },
    {
      id: 'ai-powered-recommendations',
      title: 'AI-Powered Recommendations',
      description: 'Get specific, actionable recommendations with implementation guides',
      icon: Sparkles,
      status: 'available',
      category: 'AI Features'
    },
    {
      id: 'conversion-optimization',
      title: 'Conversion Rate Optimization',
      description: 'Specialized analysis for e-commerce and conversion-focused designs',
      icon: Zap,
      status: 'premium',
      category: 'Optimization'
    },
    {
      id: 'accessibility-audit',
      title: 'Accessibility Audit',
      description: 'Comprehensive WCAG compliance analysis and improvement suggestions',
      icon: Crown,
      status: 'coming-soon',
      category: 'Accessibility'
    }
  ];

  const categories = Array.from(new Set(premiumFeatures.map(f => f.category)));

  const filteredFeatures = selectedCategory === 'all' 
    ? premiumFeatures 
    : premiumFeatures.filter(f => f.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'premium':
        return <Badge className="bg-amber-100 text-amber-800">Premium</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const getFeatureIcon = (feature: PremiumFeature) => {
    const IconComponent = feature.icon;
    const iconColor = feature.status === 'premium' ? 'text-amber-500' : 
                     feature.status === 'available' ? 'text-green-500' : 'text-gray-400';
    return <IconComponent className={`h-6 w-6 ${iconColor}`} />;
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-8 w-8 text-amber-500" />
            <h1 className="text-3xl font-bold">Premium Analysis</h1>
          </div>
          <p className="text-muted-foreground">
            Advanced AI-powered design analysis with enterprise features
          </p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>
      </div>

      {/* Premium Benefits Overview */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Premium Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">10x</div>
              <div className="text-sm text-muted-foreground">More detailed analysis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">50+</div>
              <div className="text-sm text-muted-foreground">Analysis metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">24/7</div>
              <div className="text-sm text-muted-foreground">Priority support</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          size="sm"
        >
          All Features
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="transition-shadow hover:shadow-md relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getFeatureIcon(feature)}
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(feature.status)}
                      <Badge variant="outline">{feature.category}</Badge>
                    </div>
                  </div>
                </div>
                {feature.status === 'premium' && (
                  <Lock className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <div className="flex gap-2">
                {feature.status === 'available' ? (
                  <Button size="sm">Try Now</Button>
                ) : feature.status === 'premium' ? (
                  <Button size="sm" variant="outline" disabled>
                    Requires Premium
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    Coming Soon
                  </Button>
                )}
                <Button size="sm" variant="ghost">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing CTA */}
      <Card className="border-amber-200">
        <CardContent className="text-center py-8">
          <Crown className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Ready to unlock premium features?</h3>
          <p className="text-muted-foreground mb-4">
            Get access to advanced analysis tools and enterprise features
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              View Pricing Plans
            </Button>
            <Button variant="outline">
              Schedule Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
