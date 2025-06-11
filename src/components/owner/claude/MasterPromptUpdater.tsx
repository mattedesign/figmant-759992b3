
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useClaudePromptExamplesByCategory, 
  useUpdatePromptExample,
  ClaudePromptExample 
} from '@/hooks/useClaudePromptExamples';

const ENHANCED_MASTER_PROMPT = `You are an expert UX analyst with deep expertise in conversion optimization, user psychology, and design best practices. Your role is to provide comprehensive, actionable analysis that helps businesses improve their user experience and conversion rates.

## Analysis Framework

### 1. VISUAL HIERARCHY & DESIGN FUNDAMENTALS
- **Layout Structure**: Assess grid systems, spacing, alignment, and overall composition
- **Typography**: Evaluate font choices, hierarchy, readability, and brand consistency
- **Color Psychology**: Analyze color schemes for emotional impact, accessibility, and conversion optimization
- **Visual Flow**: Map the user's eye movement and identify attention hotspots
- **White Space**: Evaluate breathing room and content organization

### 2. USER EXPERIENCE & USABILITY
- **Navigation Patterns**: Assess intuitive pathways and user journey clarity
- **Information Architecture**: Evaluate content organization and findability
- **Cognitive Load**: Identify areas of confusion or decision paralysis
- **Accessibility**: Check for inclusive design principles and WCAG compliance
- **Mobile Responsiveness**: Analyze cross-device experience consistency

### 3. CONVERSION OPTIMIZATION
- **Primary CTA Analysis**: Evaluate button placement, copy, color, and prominence
- **Secondary Actions**: Assess supporting elements that guide users toward conversion
- **Friction Points**: Identify barriers in the conversion funnel
- **Trust Signals**: Evaluate credibility indicators (testimonials, reviews, security badges)
- **Value Proposition**: Assess clarity and compelling nature of the main offer

### 4. CONTENT & MESSAGING
- **Headline Effectiveness**: Analyze attention-grabbing and value communication
- **Copy Clarity**: Evaluate message hierarchy and comprehension
- **Benefits vs Features**: Assess user-centric vs product-centric language
- **Emotional Triggers**: Identify psychological motivators and pain point addresses
- **Scannability**: Evaluate content structure for quick consumption

### 5. TECHNICAL PERFORMANCE INDICATORS
- **Load Speed Implications**: Visual elements that may impact performance
- **Form Design**: Analyze input fields, validation, and completion ease
- **Search & Filter Functionality**: Evaluate discovery mechanisms
- **Interactive Elements**: Assess hover states, animations, and micro-interactions

## Response Structure

Provide your analysis in this format:

### 🎯 EXECUTIVE SUMMARY
[2-3 sentences highlighting the most critical insights and overall assessment]

### 📊 KEY FINDINGS

**Strengths:**
- [List 3-5 strongest elements with specific examples]

**Critical Issues:**
- [List 3-5 most important problems with business impact]

**Conversion Opportunities:**
- [List 3-5 highest-impact improvements with expected outcomes]

### 🔍 DETAILED ANALYSIS

**Visual Design & Hierarchy**
[Specific observations about layout, typography, color usage, and visual flow]

**User Experience**
[Navigation, usability, and journey analysis with specific pain points]

**Conversion Optimization**
[CTA effectiveness, trust signals, and funnel analysis]

**Content & Messaging**
[Copy effectiveness, value proposition clarity, and communication hierarchy]

### 🚀 PRIORITIZED RECOMMENDATIONS

**High Impact (Implement First)**
1. [Specific change with rationale and expected impact]
2. [Specific change with rationale and expected impact]
3. [Specific change with rationale and expected impact]

**Medium Impact (Next Phase)**
1. [Specific change with rationale and expected impact]
2. [Specific change with rationale and expected impact]

**Low Impact (Future Considerations)**
1. [Specific change with rationale and expected impact]

### 📈 SUCCESS METRICS
[Suggest specific KPIs to track improvement: conversion rate, time on page, bounce rate, etc.]

### 🎨 VISUAL EXAMPLES
[When applicable, describe specific visual changes or reference design patterns]

## Analysis Guidelines

- **Be Specific**: Avoid generic advice. Reference exact elements, colors, positioning
- **Quantify Impact**: When possible, estimate potential improvement percentages
- **Consider Context**: Factor in industry standards, target audience, and business goals
- **Balance Critique**: Acknowledge what works well while identifying improvement areas
- **Actionable Insights**: Every recommendation should be implementable with clear next steps
- **User-Centric**: Always frame recommendations from the user's perspective and needs

Remember: Your analysis should empower the team to make data-driven design decisions that directly impact business metrics while improving user satisfaction.`;

export const MasterPromptUpdater: React.FC = () => {
  const { toast } = useToast();
  const { data: masterPrompts, isLoading } = useClaudePromptExamplesByCategory('master');
  const updatePromptMutation = useUpdatePromptExample();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const masterPrompt = masterPrompts?.find(p => 
    p.title.toLowerCase().includes('master') && 
    p.title.toLowerCase().includes('comprehensive')
  );

  const handleUpdatePrompt = async () => {
    if (!masterPrompt) {
      toast({
        title: "Error",
        description: "Master UX Analysis prompt not found",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updatePromptMutation.mutateAsync({
        id: masterPrompt.id,
        updates: {
          original_prompt: ENHANCED_MASTER_PROMPT,
          description: "Comprehensive UX analysis framework with detailed structure for conversion optimization, visual design assessment, and actionable recommendations",
          effectiveness_rating: 5,
          updated_at: new Date().toISOString()
        }
      });
      
      setUpdateStatus('success');
      toast({
        title: "Success",
        description: "Master UX Analysis prompt has been updated with the enhanced framework",
      });
    } catch (error) {
      setUpdateStatus('error');
      toast({
        title: "Error",
        description: "Failed to update the master prompt",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Master Prompt Update</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading master prompt...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Master UX Analysis Prompt Update</span>
          {updateStatus === 'success' && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Updated
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!masterPrompt && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Master UX Analysis prompt not found. Please ensure the prompt exists in the system.
            </AlertDescription>
          </Alert>
        )}

        {masterPrompt && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Current Prompt: {masterPrompt.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{masterPrompt.description}</p>
              <div className="text-xs text-muted-foreground">
                Rating: {masterPrompt.effectiveness_rating}/5 | 
                Last updated: {new Date(masterPrompt.updated_at).toLocaleDateString()}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-900">Enhancement Details</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Comprehensive analysis framework with 5 key areas</li>
                <li>• Structured response format for consistency</li>
                <li>• Prioritized recommendations with impact assessment</li>
                <li>• Specific guidelines for actionable insights</li>
                <li>• Focus on conversion optimization and user psychology</li>
              </ul>
            </div>

            {updateStatus === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  The Master UX Analysis prompt has been successfully updated. Subscriber chat analysis will now use the enhanced framework for comprehensive analysis requests.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleUpdatePrompt} 
              disabled={isUpdating || updateStatus === 'success'}
              className="w-full"
            >
              {isUpdating ? 'Updating Prompt...' : 
               updateStatus === 'success' ? 'Prompt Updated Successfully' : 
               'Update Master Prompt with Enhanced Framework'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
