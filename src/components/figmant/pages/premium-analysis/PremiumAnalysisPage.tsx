
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingUp, DollarSign, Target, BarChart3, Calculator, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const PremiumAnalysisPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: TrendingUp,
      title: 'Revenue Impact Prediction',
      description: 'AI-powered forecasting of design changes on conversion rates and revenue',
      status: 'Core Feature'
    },
    {
      icon: Calculator,
      title: 'ROI Analysis',
      description: 'Calculate return on investment for design optimizations before implementation',
      status: 'Premium'
    },
    {
      icon: Target,
      title: 'Conversion Optimization',
      description: 'Identify high-impact areas for improving user conversion flows',
      status: 'Premium'
    },
    {
      icon: BarChart3,
      title: 'A/B Testing Recommendations',
      description: 'Statistically valid test suggestions with sample size calculations',
      status: 'Premium'
    }
  ];

  const useCases = [
    {
      title: 'E-commerce Optimization',
      description: 'Predict revenue impact of checkout flow changes',
      impact: '+15-25% conversion',
      timeline: '2-4 weeks'
    },
    {
      title: 'Landing Page Testing',
      description: 'Optimize campaign pages for maximum ROI',
      impact: '+20-40% lead gen',
      timeline: '1-2 weeks'
    },
    {
      title: 'Product Page Analysis',
      description: 'Improve product discovery and purchase rates',
      impact: '+10-20% sales',
      timeline: '3-6 weeks'
    }
  ];

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <div className={`${isMobile ? 'px-4 pt-4 pb-3' : 'px-6 pt-6 pb-3'} bg-transparent flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
              Premium Analysis
            </h1>
            <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
              UC-018: E-commerce Revenue Impact Prediction
            </p>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
            Premium Feature
          </Badge>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <div className={`${isMobile ? 'px-4' : 'px-6'} pb-6`}>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'features', label: 'Features' },
              { id: 'use-cases', label: 'Use Cases' },
              { id: 'pricing', label: 'Pricing' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Hero Section */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-purple-900">Revenue Impact Analysis</CardTitle>
                      <CardDescription className="text-purple-700">
                        Predict and optimize your design's financial performance
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900">+23%</div>
                      <div className="text-sm text-purple-600">Avg Revenue Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900">85%</div>
                      <div className="text-sm text-purple-600">Prediction Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900">2-4x</div>
                      <div className="text-sm text-purple-600">ROI on Changes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Start */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Start Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">1</div>
                      <span>Upload your current design or website screenshots</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">2</div>
                      <span>Define your business goals and target metrics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">3</div>
                      <span>Get AI-powered revenue impact predictions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">4</div>
                      <span>Implement high-ROI recommendations</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Start Revenue Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                      <Badge variant={feature.status === 'Premium' ? 'default' : 'secondary'}>
                        {feature.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Use Cases Tab */}
          {activeTab === 'use-cases' && (
            <div className="space-y-6">
              {useCases.map((useCase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{useCase.title}</CardTitle>
                    <CardDescription>{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-sm font-medium text-green-600">{useCase.impact}</div>
                          <div className="text-xs text-gray-500">Expected Impact</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-blue-600">{useCase.timeline}</div>
                          <div className="text-xs text-gray-500">Timeline</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Analyze Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Revenue Analysis</CardTitle>
                  <CardDescription>Essential revenue impact insights</CardDescription>
                  <div className="text-2xl font-bold">$29 <span className="text-sm font-normal text-gray-500">per analysis</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Basic revenue prediction</li>
                    <li>✓ Conversion rate analysis</li>
                    <li>✓ 3 design recommendations</li>
                    <li>✓ Standard report</li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-900">Premium Revenue Analysis</CardTitle>
                  <CardDescription className="text-purple-700">Comprehensive business impact analysis</CardDescription>
                  <div className="text-2xl font-bold text-purple-900">$99 <span className="text-sm font-normal text-purple-600">per analysis</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li>✓ Advanced AI revenue modeling</li>
                    <li>✓ ROI calculations</li>
                    <li>✓ A/B testing recommendations</li>
                    <li>✓ Competitive analysis</li>
                    <li>✓ Custom business metrics</li>
                    <li>✓ Detailed strategic report</li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
