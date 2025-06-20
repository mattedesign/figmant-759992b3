
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Building2, Globe, Users, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Brain } from 'lucide-react';

interface BusinessCaseBuilderProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  className?: string;
}

export const BusinessCaseBuilder: React.FC<BusinessCaseBuilderProps> = ({
  realData,
  className
}) => {
  const [industry, setIndustry] = useState('ecommerce');
  const [companySize, setCompanySize] = useState('medium');
  const [geography, setGeography] = useState('north_america');
  const [complianceLevel, setComplianceLevel] = useState('standard');
  const [customRevenue, setCustomRevenue] = useState('');

  const businessContext = useMemo(() => {
    const industryMultipliers = {
      ecommerce: { roi: 1.3, conversion: 1.5, urgency: 'high' },
      saas: { roi: 1.2, conversion: 1.3, urgency: 'high' },
      finance: { roi: 1.4, conversion: 1.2, urgency: 'critical' },
      healthcare: { roi: 1.1, conversion: 1.1, urgency: 'medium' },
      education: { roi: 0.9, conversion: 1.0, urgency: 'medium' },
      nonprofit: { roi: 0.8, conversion: 1.0, urgency: 'low' }
    };

    const sizeMultipliers = {
      startup: { budget: 0.7, timeline: 0.8, complexity: 0.6 },
      small: { budget: 0.8, timeline: 0.9, complexity: 0.7 },
      medium: { budget: 1.0, timeline: 1.0, complexity: 1.0 },
      large: { budget: 1.3, timeline: 1.2, complexity: 1.3 },
      enterprise: { budget: 1.6, timeline: 1.4, complexity: 1.6 }
    };

    const geoMultipliers = {
      north_america: { compliance: 1.0, market: 1.2, competition: 1.3 },
      europe: { compliance: 1.4, market: 1.0, competition: 1.1 },
      asia_pacific: { compliance: 0.8, market: 1.1, competition: 1.4 },
      latin_america: { compliance: 0.9, market: 0.9, competition: 1.0 },
      africa: { compliance: 0.7, market: 0.8, competition: 0.8 }
    };

    const complianceImpact = {
      minimal: { cost: 0.05, timeline: 0.1, market_expansion: 0.05 },
      standard: { cost: 0.12, timeline: 0.15, market_expansion: 0.15 },
      full_ada: { cost: 0.25, timeline: 0.3, market_expansion: 0.26 },
      enterprise: { cost: 0.35, timeline: 0.4, market_expansion: 0.30 }
    };

    const industryData = industryMultipliers[industry as keyof typeof industryMultipliers];
    const sizeData = sizeMultipliers[companySize as keyof typeof sizeMultipliers];
    const geoData = geoMultipliers[geography as keyof typeof geoMultipliers];
    const complianceData = complianceImpact[complianceLevel as keyof typeof complianceImpact];

    // Calculate contextual ROI
    const baseROI = (realData?.designAnalysis?.length || 10) * 25000;
    const contextualROI = baseROI * industryData.roi * sizeData.budget * geoData.market;
    
    return {
      industry: industryData,
      size: sizeData,
      geography: geoData,
      compliance: complianceData,
      projectedROI: contextualROI,
      implementationCost: contextualROI * 0.15 * sizeData.complexity,
      timelineMonths: Math.ceil((6 * sizeData.timeline * complianceData.timeline)),
      marketExpansion: complianceData.market_expansion * 100,
      competitiveAdvantage: geoData.competition
    };
  }, [industry, companySize, geography, complianceLevel, realData]);

  const industries = [
    { value: 'ecommerce', label: 'E-commerce & Retail', icon: '🛒' },
    { value: 'saas', label: 'SaaS & Technology', icon: '💻' },
    { value: 'finance', label: 'Financial Services', icon: '🏦' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'nonprofit', label: 'Non-profit', icon: '🤝' }
  ];

  const companySizes = [
    { value: 'startup', label: 'Startup (1-10 employees)' },
    { value: 'small', label: 'Small Business (11-50 employees)' },
    { value: 'medium', label: 'Medium Business (51-250 employees)' },
    { value: 'large', label: 'Large Company (251-1000 employees)' },
    { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
  ];

  const geographies = [
    { value: 'north_america', label: 'North America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia_pacific', label: 'Asia Pacific' },
    { value: 'latin_america', label: 'Latin America' },
    { value: 'africa', label: 'Africa' }
  ];

  const complianceLevels = [
    { value: 'minimal', label: 'Minimal Compliance', description: 'Basic web standards' },
    { value: 'standard', label: 'Standard Compliance', description: 'Industry best practices' },
    { value: 'full_ada', label: 'Full ADA/WCAG 2.1 AA', description: 'Complete accessibility compliance' },
    { value: 'enterprise', label: 'Enterprise Security', description: 'Advanced security & compliance' }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-purple-600" />
            Strategic Business Case Builder
          </CardTitle>
          <Badge className="bg-purple-100 text-purple-800">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered Context
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="context" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="context">Business Context</TabsTrigger>
            <TabsTrigger value="projections">ROI Projections</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Impact</TabsTrigger>
            <TabsTrigger value="summary">Executive Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="context" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Industry Sector</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(ind => (
                        <SelectItem key={ind.value} value={ind.value}>
                          <div className="flex items-center gap-2">
                            <span>{ind.icon}</span>
                            {ind.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Company Size</Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map(size => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Primary Market</Label>
                  <Select value={geography} onValueChange={setGeography}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {geographies.map(geo => (
                        <SelectItem key={geo.value} value={geo.value}>
                          {geo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Compliance Requirements</Label>
                  <Select value={complianceLevel} onValueChange={setComplianceLevel}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {complianceLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-sm text-gray-500">{level.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Annual Revenue (Optional)</Label>
                  <Input
                    placeholder="e.g. $5,000,000"
                    value={customRevenue}
                    onChange={(e) => setCustomRevenue(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For more precise ROI calculations
                  </p>
                </div>
              </div>
            </div>

            {/* Context Summary */}
            <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
              <h3 className="font-medium text-gray-900 mb-3">Business Context Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Industry ROI Factor</div>
                  <div className="font-bold text-purple-600">{businessContext.industry.roi}x</div>
                </div>
                <div>
                  <div className="text-gray-600">Complexity Multiplier</div>
                  <div className="font-bold text-blue-600">{businessContext.size.complexity}x</div>
                </div>
                <div>
                  <div className="text-gray-600">Market Opportunity</div>
                  <div className="font-bold text-green-600">{businessContext.geography.market}x</div>
                </div>
                <div>
                  <div className="text-gray-600">Compliance Impact</div>
                  <div className="font-bold text-orange-600">+{(businessContext.marketExpansion).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    ${businessContext.projectedROI.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Projected Annual ROI</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Contextually adjusted for your industry
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    ${businessContext.implementationCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Implementation Investment</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Including compliance requirements
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    +{businessContext.marketExpansion.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Market Expansion</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Through accessibility improvements
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ROI Breakdown */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">ROI Calculation Methodology</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Analysis Value</span>
                  <span className="font-medium">${((realData?.designAnalysis?.length || 10) * 25000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Industry Multiplier ({industry})</span>
                  <span className="font-medium text-purple-600">×{businessContext.industry.roi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Scale Factor ({companySize})</span>
                  <span className="font-medium text-blue-600">×{businessContext.size.budget}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Conditions ({geography})</span>
                  <span className="font-medium text-green-600">×{businessContext.geography.market}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-bold">
                  <span>Total Projected ROI</span>
                  <span className="text-green-600">${businessContext.projectedROI.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compliance Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Compliance Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Market Expansion</span>
                    <Badge className="bg-green-100 text-green-800">
                      +{businessContext.marketExpansion.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Legal Risk Reduction</span>
                    <Badge className="bg-blue-100 text-blue-800">High</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Brand Reputation</span>
                    <Badge className="bg-purple-100 text-purple-800">Enhanced</Badge>
                  </div>
                  {complianceLevel === 'full_ada' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Disability Community Access</span>
                      <Badge className="bg-orange-100 text-orange-800">26% Population</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Risk Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Implementation Complexity</span>
                      <span className="font-medium">{businessContext.size.complexity > 1 ? 'High' : 'Medium'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, businessContext.size.complexity * 60)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Timeline Risk</span>
                      <span className="font-medium">{businessContext.timelineMonths > 8 ? 'High' : 'Low'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (businessContext.timelineMonths / 12) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 mt-3">
                    Estimated implementation: {businessContext.timelineMonths} months
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Geographic Considerations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Geographic & Regulatory Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Market Conditions</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Competition Level: {businessContext.competitiveAdvantage > 1.2 ? 'High' : 'Moderate'}</li>
                      <li>• Market Maturity: {geography === 'north_america' ? 'Mature' : 'Developing'}</li>
                      <li>• Growth Opportunity: {businessContext.geography.market > 1 ? 'High' : 'Moderate'}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Regulatory Environment</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Compliance Complexity: {businessContext.compliance.cost > 0.2 ? 'High' : 'Standard'}</li>
                      <li>• Timeline Impact: +{(businessContext.compliance.timeline * 100).toFixed(0)}%</li>
                      <li>• Market Access: +{(businessContext.compliance.market_expansion * 100).toFixed(0)}% population</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">Strategic Business Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI-Powered Design Optimization Initiative
                  </h3>
                  <p className="text-gray-600">
                    {industries.find(i => i.value === industry)?.label} • {companySize.charAt(0).toUpperCase() + companySize.slice(1)} Company • {geographies.find(g => g.value === geography)?.label}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-b">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ${businessContext.projectedROI.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Annual ROI</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {businessContext.timelineMonths}
                    </div>
                    <div className="text-sm text-gray-600">Months to Value</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      +{businessContext.marketExpansion.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Market Expansion</div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700">
                    This strategic initiative leverages AI-powered design analysis to deliver measurable business outcomes 
                    specifically calibrated for the {industries.find(i => i.value === industry)?.label.toLowerCase()} sector. 
                    With a projected ROI of ${businessContext.projectedROI.toLocaleString()} and implementation timeline of {businessContext.timelineMonths} months, 
                    this investment addresses both immediate conversion optimization needs and long-term competitive positioning.
                  </p>
                  
                  <p className="text-gray-700">
                    The {complianceLevels.find(c => c.value === complianceLevel)?.label} approach ensures regulatory compliance 
                    while expanding market reach by {businessContext.marketExpansion.toFixed(0)}%, particularly valuable in the {geographies.find(g => g.value === geography)?.label} market context.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <Badge className="mr-2">
                      <Brain className="h-3 w-3 mr-1" />
                      Claude AI Analysis
                    </Badge>
                    Generated: {new Date().toLocaleDateString()}
                  </div>
                  <Button>
                    <Briefcase className="h-4 w-4 mr-2" />
                    Export Business Case
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
