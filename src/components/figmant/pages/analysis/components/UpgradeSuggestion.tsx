
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Star, TrendingUp, Eye, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UpgradeSuggestionProps {
  className?: string;
}

export const UpgradeSuggestion: React.FC<UpgradeSuggestionProps> = ({ className = '' }) => {
  const { hasActiveSubscription, isOwner } = useAuth();
  const navigate = useNavigate();

  // Don't show if user already has premium access
  if (hasActiveSubscription || isOwner) {
    return null;
  }

  const handleUpgradeClick = () => {
    navigate('/subscription');
  };

  const proFeatures = [
    { icon: Target, text: "Market positioning analysis" },
    { icon: TrendingUp, text: "Conversion optimization recommendations" },
    { icon: Eye, text: "Automated competitor monitoring" },
    { icon: Star, text: "Advanced insights & reports" }
  ];

  return (
    <Card className={`border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg text-blue-900">Unlock Advanced Competitor Insights</CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Pro</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-blue-800 leading-relaxed">
          🚀 Upgrade to Pro for advanced competitor insights including market positioning analysis, 
          conversion optimization recommendations, and automated monitoring.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {proFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-blue-700">
              <feature.icon className="h-3 w-3 text-blue-500" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleUpgradeClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          size="sm"
        >
          <Rocket className="h-4 w-4 mr-2" />
          Upgrade to Pro - $47/month
        </Button>
        
        <p className="text-xs text-blue-600 text-center">
          30-day money-back guarantee • Cancel anytime
        </p>
      </CardContent>
    </Card>
  );
};
