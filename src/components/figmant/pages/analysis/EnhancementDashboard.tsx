
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { EnhancedAnalysisResult, AccessibilityAnalysis, DiversityAnalysis, FormOptimization, SecondaryAnalysis } from '@/types/ai-enhancement';
import { ChevronDown, ChevronRight, Eye, Users, Settings, Brain } from 'lucide-react';

interface EnhancementDashboardProps {
  originalAnalysis: any;
  enhancedResults?: EnhancedAnalysisResult;
  isLoading?: boolean;
}

export const EnhancementDashboard: React.FC<EnhancementDashboardProps> = ({
  originalAnalysis,
  enhancedResults,
  isLoading = false
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getConsensusLevel = (score: number) => {
    if (score >= 90) return { level: 'High', color: 'bg-green-500' };
    if (score >= 70) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-red-500' };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Enhancement Analysis</CardTitle>
            <CardDescription>Processing additional AI insights...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!enhancedResults) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Original Claude Analysis</CardTitle>
            <CardDescription>Your primary AI analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p>{originalAnalysis?.analysis || originalAnalysis?.response || 'No analysis available'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const consensus = getConsensusLevel(enhancedResults.enhancementMetadata.consensusScore);

  return (
    <div className="space-y-6">
      {/* Original Claude Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Primary Claude Analysis
          </CardTitle>
          <CardDescription>Your core AI analysis results (unchanged)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{originalAnalysis?.analysis || originalAnalysis?.response || 'No analysis available'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Enhancement Overview */}
      <Card>
        <CardHeader>
          <CardTitle>AI Enhancement Overview</CardTitle>
          <CardDescription>
            Additional insights from {enhancedResults.enhancementMetadata.servicesUsed.length} AI services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {enhancedResults.enhancementMetadata.servicesUsed.length}
              </div>
              <div className="text-sm text-muted-foreground">AI Services</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {enhancedResults.enhancementMetadata.totalAdditionalCredits}
              </div>
              <div className="text-sm text-muted-foreground">Credits Used</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(enhancedResults.enhancementMetadata.processingTime / 1000).toFixed(1)}s
              </div>
              <div className="text-sm text-muted-foreground">Processing Time</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${consensus.color}`} />
                <span className="text-sm font-medium">{consensus.level}</span>
              </div>
              <div className="text-sm text-muted-foreground">Consensus</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Analysis */}
      {enhancedResults.accessibility_score && (
        <Collapsible>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle>Accessibility Intelligence</CardTitle>
                      <CardDescription>Google Vision API • ADA compliance analysis</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{enhancedResults.accessibility_score.adaComplianceLevel}</Badge>
                    {expandedSections.has('accessibility') ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Contrast Ratio</div>
                    <div className="text-2xl font-bold">{enhancedResults.accessibility_score.contrastRatio}:1</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Accessibility Score</div>
                    <div className="text-2xl font-bold">{enhancedResults.accessibility_score.colorAccessibilityScore}/100</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Font Compliance</div>
                    <div className="text-2xl font-bold">{enhancedResults.accessibility_score.fontSizeCompliance ? '✓' : '✗'}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {enhancedResults.accessibility_score.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Diversity Analysis */}
      {enhancedResults.diversity_analysis && (
        <Collapsible>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <CardTitle>Visual Diversity Analysis</CardTitle>
                      <CardDescription>Amazon Rekognition • Inclusivity assessment</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{enhancedResults.diversity_analysis.inclusivityScore}/100</Badge>
                    {expandedSections.has('diversity') ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Inclusivity Score</div>
                  <Progress value={enhancedResults.diversity_analysis.inclusivityScore} className="h-2" />
                  <div className="text-right text-sm text-muted-foreground mt-1">
                    {enhancedResults.diversity_analysis.inclusivityScore}/100
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Age Representation</div>
                    <div className="space-y-1">
                      {enhancedResults.diversity_analysis.demographicRepresentation.age.map((age, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">{age}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Ethnicity</div>
                    <div className="space-y-1">
                      {enhancedResults.diversity_analysis.demographicRepresentation.ethnicity.map((ethnicity, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">{ethnicity}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Gender</div>
                    <div className="space-y-1">
                      {enhancedResults.diversity_analysis.demographicRepresentation.gender.map((gender, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">{gender}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {enhancedResults.diversity_analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-green-600">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Form Optimization */}
      {enhancedResults.form_optimization && (
        <Collapsible>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-orange-600" />
                    <div>
                      <CardTitle>Form Optimization Intelligence</CardTitle>
                      <CardDescription>Microsoft Form Recognizer • Conversion analysis</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{enhancedResults.form_optimization.conversionPotential}%</Badge>
                    {expandedSections.has('forms') ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Conversion Potential</div>
                    <div className="text-2xl font-bold">{enhancedResults.form_optimization.conversionPotential}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Mobile Usability</div>
                    <div className="text-2xl font-bold">{enhancedResults.form_optimization.mobileUsabilityScore}/100</div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Field Optimizations</h4>
                  <div className="space-y-2">
                    {enhancedResults.form_optimization.fieldOptimizations.map((opt, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-sm">{opt.field}</div>
                          <div className="text-sm text-muted-foreground">{opt.recommendation}</div>
                        </div>
                        <Badge 
                          variant={opt.impact === 'high' ? 'destructive' : opt.impact === 'medium' ? 'default' : 'secondary'}
                        >
                          {opt.impact} impact
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">General Recommendations</h4>
                  <ul className="space-y-1">
                    {enhancedResults.form_optimization.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-orange-600">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Secondary Analysis */}
      {enhancedResults.secondary_analysis && (
        <Collapsible>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <div>
                      <CardTitle>Secondary Business Analysis</CardTitle>
                      <CardDescription>OpenAI Vision • Alternative insights & ROI projections</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Alternative perspective</Badge>
                    {expandedSections.has('secondary') ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Alternative ROI Projections</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-red-50 rounded">
                      <div className="text-sm text-muted-foreground">Conservative</div>
                      <div className="font-medium">{enhancedResults.secondary_analysis.alternativeROIProjections.conservative}</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded">
                      <div className="text-sm text-muted-foreground">Realistic</div>
                      <div className="font-medium">{enhancedResults.secondary_analysis.alternativeROIProjections.realistic}</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <div className="text-sm text-muted-foreground">Optimistic</div>
                      <div className="font-medium">{enhancedResults.secondary_analysis.alternativeROIProjections.optimistic}</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">AI Consensus Analysis</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-green-600 mb-1">✓ Agreements with Claude</div>
                      <ul className="space-y-1">
                        {enhancedResults.secondary_analysis.designRecommendationComparison.agrees.map((item, index) => (
                          <li key={index} className="text-sm text-green-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-orange-600 mb-1">⚠ Different Perspectives</div>
                      <ul className="space-y-1">
                        {enhancedResults.secondary_analysis.designRecommendationComparison.differs.map((item, index) => (
                          <li key={index} className="text-sm text-orange-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-blue-600 mb-1">+ Additional Insights</div>
                      <ul className="space-y-1">
                        {enhancedResults.secondary_analysis.designRecommendationComparison.additional.map((item, index) => (
                          <li key={index} className="text-sm text-blue-700">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
};
