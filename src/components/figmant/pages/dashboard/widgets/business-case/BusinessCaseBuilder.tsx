
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Briefcase, 
  Calculator, 
  Clock, 
  DollarSign, 
  FileText,
  Download,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { calculateROI } from '../revenue-tracker/roiEngine';

interface BusinessCaseTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  complexity: 'Low' | 'Medium' | 'High';
  avgROI: number;
  timelineWeeks: number;
  riskFactors: string[];
}

interface CostBenefitAnalysis {
  implementationCosts: {
    development: number;
    design: number;
    testing: number;
    projectManagement: number;
    total: number;
  };
  projectedBenefits: {
    monthlyRevenue: number;
    annualRevenue: number;
    costSavings: number;
    productivityGains: number;
    total: number;
  };
  paybackPeriod: number;
  roi: number;
  netPresentValue: number;
}

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
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    objective: '',
    timeline: '',
    budget: '',
    team: '',
    stakeholders: ''
  });
  const [customParams, setCustomParams] = useState({
    currentConversion: 2.5,
    monthlyTraffic: 10000,
    averageOrderValue: 150,
    developmentRate: 120,
    designRate: 100
  });

  // Business case templates based on real analysis patterns
  const templates = useMemo<BusinessCaseTemplate[]>(() => {
    const designAnalyses = realData?.designAnalysis || [];
    
    // Generate templates based on real data patterns
    if (designAnalyses.length > 0) {
      const analysisTypes = [...new Set(designAnalyses.map(a => a.analysis_type || 'general'))];
      
      return analysisTypes.map((type, index) => {
        const typeAnalyses = designAnalyses.filter(a => (a.analysis_type || 'general') === type);
        const avgConfidence = typeAnalyses.reduce((sum, a) => sum + (a.confidence_score || 85), 0) / typeAnalyses.length;
        const complexity = avgConfidence > 80 ? 'Low' : avgConfidence > 60 ? 'Medium' : 'High';
        
        return {
          id: `template-${index}`,
          name: `${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Optimization`,
          description: `Business case template based on ${typeAnalyses.length} real ${type} analyses`,
          industry: 'Technology',
          complexity,
          avgROI: Math.round(avgConfidence * 2.5), // Estimate ROI based on confidence
          timelineWeeks: complexity === 'Low' ? 6 : complexity === 'Medium' ? 12 : 18,
          riskFactors: generateRiskFactors(complexity, avgConfidence)
        };
      });
    }

    // Fallback templates
    return [
      {
        id: 'ecommerce-conversion',
        name: 'E-commerce Conversion Optimization',
        description: 'Comprehensive checkout and product page optimization',
        industry: 'E-commerce',
        complexity: 'Medium',
        avgROI: 187,
        timelineWeeks: 12,
        riskFactors: ['User behavior changes', 'Technical integration complexity', 'Seasonal variations']
      },
      {
        id: 'saas-onboarding',
        name: 'SaaS User Onboarding Enhancement',
        description: 'Streamline user activation and reduce time-to-value',
        industry: 'SaaS',
        complexity: 'Low',
        avgROI: 142,
        timelineWeeks: 8,
        riskFactors: ['User adoption resistance', 'Feature complexity', 'Integration requirements']
      },
      {
        id: 'mobile-first',
        name: 'Mobile-First Responsive Design',
        description: 'Complete mobile experience optimization',
        industry: 'General',
        complexity: 'High',
        avgROI: 223,
        timelineWeeks: 16,
        riskFactors: ['Cross-device compatibility', 'Performance optimization', 'Multi-platform testing']
      }
    ];
  }, [realData]);

  // Calculate cost-benefit analysis
  const costBenefitAnalysis = useMemo<CostBenefitAnalysis>(() => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) {
      return {
        implementationCosts: { development: 0, design: 0, testing: 0, projectManagement: 0, total: 0 },
        projectedBenefits: { monthlyRevenue: 0, annualRevenue: 0, costSavings: 0, productivityGains: 0, total: 0 },
        paybackPeriod: 0,
        roi: 0,
        netPresentValue: 0
      };
    }

    // Calculate implementation costs based on complexity and timeline
    const complexityMultiplier = template.complexity === 'Low' ? 0.8 : template.complexity === 'Medium' ? 1.0 : 1.3;
    const developmentHours = template.timelineWeeks * 30 * complexityMultiplier;
    const designHours = template.timelineWeeks * 20 * complexityMultiplier;
    
    const developmentCost = developmentHours * customParams.developmentRate;
    const designCost = designHours * customParams.designRate;
    const testingCost = (developmentCost + designCost) * 0.2;
    const pmCost = (developmentCost + designCost + testingCost) * 0.15;
    const totalCosts = developmentCost + designCost + testingCost + pmCost;

    // Calculate projected benefits based on conversion improvements
    const currentRevenue = customParams.monthlyTraffic * (customParams.currentConversion / 100) * customParams.averageOrderValue;
    const improvementRate = template.avgROI / 100;
    const newRevenue = currentRevenue * (1 + improvementRate);
    const monthlyBenefit = newRevenue - currentRevenue;
    const annualBenefit = monthlyBenefit * 12;

    // Additional benefits
    const costSavings = totalCosts * 0.1; // Operational efficiency gains
    const productivityGains = totalCosts * 0.05; // Team productivity improvements
    const totalBenefits = annualBenefit + costSavings + productivityGains;

    const paybackPeriod = totalCosts / monthlyBenefit;
    const roi = ((totalBenefits - totalCosts) / totalCosts) * 100;
    const netPresentValue = totalBenefits - totalCosts; // Simplified NPV

    return {
      implementationCosts: {
        development: developmentCost,
        design: designCost,
        testing: testingCost,
        projectManagement: pmCost,
        total: totalCosts
      },
      projectedBenefits: {
        monthlyRevenue: monthlyBenefit,
        annualRevenue: annualBenefit,
        costSavings,
        productivityGains,
        total: totalBenefits
      },
      paybackPeriod,
      roi,
      netPresentValue
    };
  }, [selectedTemplate, customParams, templates]);

  const handleExportBusinessCase = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    const businessCase = {
      template,
      projectDetails,
      costBenefitAnalysis,
      timestamp: new Date().toISOString(),
      realDataSource: realData ? 'Live Claude Analysis Data' : 'Demo Data'
    };

    const blob = new Blob([JSON.stringify(businessCase, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-case-${projectDetails.name || 'ux-optimization'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-purple-600" />
            Business Case Builder
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-purple-100 text-purple-800">
              Template Library
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportBusinessCase}
              disabled={!selectedTemplate}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Case
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="template" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="template">Template Selection</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="benefits">Benefits & ROI</TabsTrigger>
            <TabsTrigger value="summary">Executive Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-6">
            {/* Template Library */}
            <div className="space-y-4">
              <h3 className="font-semibold">Choose a Business Case Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(template => (
                  <div 
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant={template.complexity === 'Low' ? 'secondary' : template.complexity === 'Medium' ? 'default' : 'destructive'}>
                        {template.complexity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>ROI: {template.avgROI}%</div>
                      <div>Timeline: {template.timelineWeeks} weeks</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Details */}
            {selectedTemplate && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={projectDetails.name}
                      onChange={(e) => setProjectDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="UX Optimization Initiative"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input
                      id="timeline"
                      value={projectDetails.timeline}
                      onChange={(e) => setProjectDetails(prev => ({ ...prev, timeline: e.target.value }))}
                      placeholder="Q2 2024"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="objective">Business Objective</Label>
                    <Textarea
                      id="objective"
                      value={projectDetails.objective}
                      onChange={(e) => setProjectDetails(prev => ({ ...prev, objective: e.target.value }))}
                      placeholder="Improve user experience and increase conversion rates..."
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            {/* Cost Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Cost Parameters</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="dev-rate">Development Rate ($/hour)</Label>
                    <Input
                      id="dev-rate"
                      type="number"
                      value={customParams.developmentRate}
                      onChange={(e) => setCustomParams(prev => ({ ...prev, developmentRate: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="design-rate">Design Rate ($/hour)</Label>
                    <Input
                      id="design-rate"
                      type="number"
                      value={customParams.designRate}
                      onChange={(e) => setCustomParams(prev => ({ ...prev, designRate: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Business Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="conversion">Current Conversion Rate (%)</Label>
                    <Input
                      id="conversion"
                      type="number"
                      step="0.1"
                      value={customParams.currentConversion}
                      onChange={(e) => setCustomParams(prev => ({ ...prev, currentConversion: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="traffic">Monthly Traffic</Label>
                    <Input
                      id="traffic"
                      type="number"
                      value={customParams.monthlyTraffic}
                      onChange={(e) => setCustomParams(prev => ({ ...prev, monthlyTraffic: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="aov">Average Order Value ($)</Label>
                    <Input
                      id="aov"
                      type="number"
                      value={customParams.averageOrderValue}
                      onChange={(e) => setCustomParams(prev => ({ ...prev, averageOrderValue: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            {selectedTemplate && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-red-600" />
                  Implementation Cost Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      ${costBenefitAnalysis.implementationCosts.development.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Development</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      ${costBenefitAnalysis.implementationCosts.design.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Design</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      ${costBenefitAnalysis.implementationCosts.testing.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Testing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      ${costBenefitAnalysis.implementationCosts.projectManagement.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Project Mgmt</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-red-300 text-center">
                  <div className="text-2xl font-bold text-red-700">
                    Total: ${costBenefitAnalysis.implementationCosts.total.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6">
            {/* Benefits Analysis */}
            {selectedTemplate && (
              <>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Projected Benefits
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        ${costBenefitAnalysis.projectedBenefits.monthlyRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Monthly Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        ${costBenefitAnalysis.projectedBenefits.annualRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Annual Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        ${costBenefitAnalysis.projectedBenefits.costSavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Cost Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        ${costBenefitAnalysis.projectedBenefits.productivityGains.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Productivity</div>
                    </div>
                  </div>
                </div>

                {/* ROI Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {costBenefitAnalysis.paybackPeriod.toFixed(1)} months
                    </div>
                    <div className="text-sm text-gray-600">Payback Period</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {costBenefitAnalysis.roi.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">ROI</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${costBenefitAnalysis.netPresentValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Net Present Value</div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            {selectedTemplate && (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Executive Business Case Summary</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Investment Overview</h3>
                      <ul className="text-sm space-y-1">
                        <li>Total Investment: ${costBenefitAnalysis.implementationCosts.total.toLocaleString()}</li>
                        <li>Timeline: {templates.find(t => t.id === selectedTemplate)?.timelineWeeks} weeks</li>
                        <li>Payback Period: {costBenefitAnalysis.paybackPeriod.toFixed(1)} months</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Expected Returns</h3>
                      <ul className="text-sm space-y-1">
                        <li>Annual Revenue Impact: ${costBenefitAnalysis.projectedBenefits.annualRevenue.toLocaleString()}</li>
                        <li>ROI: {costBenefitAnalysis.roi.toFixed(0)}%</li>
                        <li>Net Present Value: ${costBenefitAnalysis.netPresentValue.toLocaleString()}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Risk Factors & Mitigation
                  </h3>
                  <ul className="text-sm space-y-1">
                    {templates.find(t => t.id === selectedTemplate)?.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-600">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Success Metrics */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Success Metrics
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>• Conversion rate improvement of {((costBenefitAnalysis.projectedBenefits.monthlyRevenue / (customParams.monthlyTraffic * (customParams.currentConversion / 100) * customParams.averageOrderValue)) * 100 - 100).toFixed(1)}%</li>
                    <li>• Monthly revenue increase of ${costBenefitAnalysis.projectedBenefits.monthlyRevenue.toLocaleString()}</li>
                    <li>• Project completion within {templates.find(t => t.id === selectedTemplate)?.timelineWeeks} weeks</li>
                    <li>• User satisfaction score improvement (target: +15%)</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Utility function to generate risk factors based on complexity
const generateRiskFactors = (complexity: 'Low' | 'Medium' | 'High', confidence: number): string[] => {
  const baseRisks = [
    'User adoption challenges',
    'Technical implementation complexity',
    'Cross-browser compatibility issues'
  ];

  switch (complexity) {
    case 'High':
      return [
        ...baseRisks,
        'Extended development timeline',
        'Integration with existing systems',
        'Performance optimization requirements'
      ];
    case 'Medium':
      return [
        ...baseRisks,
        'Moderate testing requirements',
        'User training needs'
      ];
    default:
      return [
        'Minimal technical risks',
        'Standard implementation timeline',
        'Low user adoption barriers'
      ];
  }
};
