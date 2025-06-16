
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, FileText, Smartphone, Palette, Image, Box, Crown } from 'lucide-react';

export const PremiumAnalysisPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('ui-design');

  const analysisTypes = [
    {
      id: 'web-app',
      title: 'Web app',
      icon: FileText,
      description: 'Comprehensive web application analysis',
      isPremium: true
    },
    {
      id: 'ui-design',
      title: 'UI/UI Design',
      icon: Smartphone,
      description: 'User interface and experience optimization',
      isPremium: true,
      selected: true
    },
    {
      id: 'mobile-app',
      title: 'Mobile app',
      icon: Smartphone,
      description: 'Mobile application design evaluation',
      isPremium: true
    },
    {
      id: 'branding',
      title: 'Branding & logo',
      icon: Palette,
      description: 'Brand identity and logo analysis',
      isPremium: true
    },
    {
      id: 'illustration',
      title: 'Illustration',
      icon: Image,
      description: 'Illustration and graphic design review',
      isPremium: true
    },
    {
      id: '3d-design',
      title: '3D Design',
      icon: Box,
      description: '3D design and modeling assessment',
      isPremium: true
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Premium Analysis</h1>
              <p className="text-gray-600">Advanced analysis with enhanced insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <div className="flex-1">
              <p className="font-medium text-purple-900">Premium Analysis Features</p>
              <p className="text-sm text-purple-700">
                Get 3x more detailed insights, advanced recommendations, and priority processing
              </p>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              3x Credits
            </Badge>
          </div>
        </div>

        {/* Analysis Type Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Analyze this...</h2>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              1 / 7
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedType === type.id
                    ? 'border-purple-300 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-200 hover:shadow-sm'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedType === type.id
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    {type.isPremium && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">What's included in Premium Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Advanced AI Insights',
                description: 'Deeper analysis using advanced AI models'
              },
              {
                title: 'Detailed Recommendations',
                description: 'Specific, actionable improvement suggestions'
              },
              {
                title: 'Competitive Analysis',
                description: 'Compare against industry best practices'
              },
              {
                title: 'Accessibility Audit',
                description: 'Comprehensive accessibility compliance review'
              },
              {
                title: 'Performance Metrics',
                description: 'Detailed performance and optimization insights'
              },
              {
                title: 'Export Options',
                description: 'PDF reports and presentation-ready formats'
              }
            ].map((feature, index) => (
              <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
          >
            Continue with Premium Analysis
            <Crown className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
