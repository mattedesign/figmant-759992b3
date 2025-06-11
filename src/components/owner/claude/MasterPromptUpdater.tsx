
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Zap, Target } from 'lucide-react';
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

const ENHANCED_COMPETITOR_PROMPT = `You are an expert market positioning strategist and competitive intelligence analyst. Analyze the provided competitor screenshots and identify market positioning opportunities for the client's business.

**CONTEXT:**
- Client Industry: [INDUSTRY - e.g., "Project Management SaaS"]
- Client's Current Position: [POSITIONING - e.g., "Budget-friendly tool for small teams"]
- Target Audience: [AUDIENCE - e.g., "Small business owners, 10-50 employees"]
- Business Goals: [GOALS - e.g., "Increase trial signups by 25%, move upmarket"]

**COMPETITOR ANALYSIS FRAMEWORK:**

### 1. MARKET POSITIONING MAP
For each competitor, identify:
- **Value Proposition**: How do they position themselves? (Premium/Budget, Simple/Feature-rich, etc.)
- **Target Market**: Who are they clearly targeting?
- **Unique Selling Points**: What makes them different?
- **Pricing Strategy**: Premium, mid-market, or budget positioning?
- **Brand Personality**: Professional, friendly, innovative, trustworthy, etc.

### 2. POSITIONING GAPS ANALYSIS
Identify market opportunities:
- **Underserved Segments**: What customer groups are competitors missing?
- **Feature Gaps**: What needs aren't being addressed?
- **Messaging Gaps**: What emotional or rational appeals are unused?
- **Price Point Gaps**: Are there open pricing tiers?

### 3. DIFFERENTIATION OPPORTUNITIES
Recommend positioning strategies:
- **Blue Ocean Opportunities**: Uncontested market spaces
- **Head-to-Head Advantages**: Where client could compete directly and win
- **Niche Specialization**: Specific segments to dominate
- **Value Innovation**: Combine benefits competitors offer separately

**DELIVERABLE FORMAT:**

### Executive Summary (2-3 sentences)
Brief overview of competitive landscape and #1 positioning recommendation

### Competitor Positioning Matrix
| Competitor | Target Market | Value Prop | Price Tier | Differentiator |
|------------|---------------|------------|------------|----------------|
| [Name] | [Segment] | [Core benefit] | [High/Mid/Low] | [Unique element] |

### Market Positioning Recommendations (Ranked by Impact)

#### 🎯 PRIMARY RECOMMENDATION: [Strategy Name]
- **Positioning Statement**: "[Client] is the only [category] that [unique benefit] for [target audience] who [specific need/pain]"
- **Target Segment**: [Specific audience description]
- **Key Messages**: 
  - Primary: [Main value proposition]
  - Secondary: [Supporting benefits]
  - Proof Points: [Evidence/features that support claims]
- **Competitive Advantage**: Why this positioning wins vs competitors
- **Revenue Impact**: Estimated effect on conversions/pricing power
- **Implementation Difficulty**: Easy/Medium/Hard + timeline

#### 🥈 SECONDARY RECOMMENDATION: [Alternative Strategy]
[Same format as above]

#### 🥉 TERTIARY RECOMMENDATION: [Third Option]
[Same format as above]

### Market Messaging Framework
- **Headline Options**: 3-5 positioning-based headlines
- **Value Proposition Variants**: Different ways to communicate core benefit
- **Competitive Responses**: How to handle competitor comparisons
- **Proof Point Hierarchy**: Most compelling evidence first

### Implementation Roadmap
- **Week 1-2**: Immediate messaging changes
- **Month 1**: Website/marketing material updates  
- **Quarter 1**: Full positioning rollout

**ANALYSIS CRITERIA:**
- Focus on defensible competitive advantages
- Prioritize positions that increase pricing power
- Consider client's current capabilities and resources
- Emphasize scalable positioning strategies
- Include quantitative impact estimates where possible

## Industry-Specific Considerations

**SaaS Positioning Analysis:**
- **Feature Positioning**: All-in-one vs. best-of-breed
- **User Experience**: Technical vs. non-technical users
- **Implementation**: Self-serve vs. white-glove onboarding
- **Pricing Model**: Per-user, per-feature, or flat-rate positioning
- **Integration Strategy**: Standalone vs. ecosystem player

**E-commerce Positioning Analysis:**
- **Price Positioning**: Luxury, premium, value, or budget
- **Product Range**: Specialist vs. generalist
- **Shopping Experience**: Convenience vs. discovery vs. service
- **Trust Signals**: Security, reviews, guarantees, brand heritage
- **Customer Journey**: High-consideration vs. impulse purchase

Please provide specific, actionable recommendations that directly impact business metrics and can be implemented within the client's constraints.`;

export const MasterPromptUpdater: React.FC = () => {
  const { toast } = useToast();
  const { data: masterPrompts, isLoading: masterLoading } = useClaudePromptExamplesByCategory('master');
  const { data: competitorPrompts, isLoading: competitorLoading } = useClaudePromptExamplesByCategory('competitor');
  const updatePromptMutation = useUpdatePromptExample();
  const [isUpdatingMaster, setIsUpdatingMaster] = useState(false);
  const [isUpdatingCompetitor, setIsUpdatingCompetitor] = useState(false);
  const [masterStatus, setMasterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [competitorStatus, setCompetitorStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const masterPrompt = masterPrompts?.find(p => 
    p.title.toLowerCase().includes('master') && 
    p.title.toLowerCase().includes('comprehensive')
  );

  const competitorPrompt = competitorPrompts?.find(p => 
    p.title.toLowerCase().includes('competitor') && 
    p.title.toLowerCase().includes('market')
  );

  const handleUpdateMasterPrompt = async () => {
    if (!masterPrompt) {
      toast({
        title: "Error",
        description: "Master UX Analysis prompt not found",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingMaster(true);
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
      
      setMasterStatus('success');
      toast({
        title: "Success",
        description: "Master UX Analysis prompt has been updated with the enhanced framework",
      });
    } catch (error) {
      setMasterStatus('error');
      toast({
        title: "Error",
        description: "Failed to update the master prompt",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingMaster(false);
    }
  };

  const handleUpdateCompetitorPrompt = async () => {
    if (!competitorPrompt) {
      toast({
        title: "Error",
        description: "Competitor Analysis prompt not found",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingCompetitor(true);
    try {
      await updatePromptMutation.mutateAsync({
        id: competitorPrompt.id,
        updates: {
          original_prompt: ENHANCED_COMPETITOR_PROMPT,
          description: "Comprehensive market positioning analysis framework with competitive intelligence, positioning gaps analysis, and strategic recommendations",
          effectiveness_rating: 5,
          updated_at: new Date().toISOString()
        }
      });
      
      setCompetitorStatus('success');
      toast({
        title: "Success",
        description: "Competitor Analysis prompt has been updated with the enhanced framework",
      });
    } catch (error) {
      setCompetitorStatus('error');
      toast({
        title: "Error",
        description: "Failed to update the competitor prompt",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingCompetitor(false);
    }
  };

  if (masterLoading || competitorLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prompt Enhancement Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading prompts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Master Prompt Update */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Master UX Analysis Prompt Update</span>
            {masterStatus === 'success' && (
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

              {masterStatus === 'success' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    The Master UX Analysis prompt has been successfully updated. Subscriber chat analysis will now use the enhanced framework for comprehensive analysis requests.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleUpdateMasterPrompt} 
                disabled={isUpdatingMaster || masterStatus === 'success'}
                className="w-full"
              >
                {isUpdatingMaster ? 'Updating Prompt...' : 
                 masterStatus === 'success' ? 'Prompt Updated Successfully' : 
                 'Update Master Prompt with Enhanced Framework'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitor Prompt Update */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Competitor Analysis Prompt Update</span>
            {competitorStatus === 'success' && (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Updated
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!competitorPrompt && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Competitor Analysis - Market Positioning prompt not found. Please ensure the prompt exists in the system.
              </AlertDescription>
            </Alert>
          )}

          {competitorPrompt && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Current Prompt: {competitorPrompt.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{competitorPrompt.description}</p>
                <div className="text-xs text-muted-foreground">
                  Rating: {competitorPrompt.effectiveness_rating}/5 | 
                  Last updated: {new Date(competitorPrompt.updated_at).toLocaleDateString()}
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium mb-2 text-green-900">Market Positioning Enhancement Details</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Comprehensive market positioning framework</li>
                  <li>• Competitor positioning matrix with structured analysis</li>
                  <li>• Strategic recommendations ranked by business impact</li>
                  <li>• Industry-specific positioning considerations (SaaS, E-commerce)</li>
                  <li>• Implementation roadmap with actionable timelines</li>
                  <li>• Revenue impact estimates and competitive advantage focus</li>
                </ul>
              </div>

              {competitorStatus === 'success' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    The Competitor Analysis prompt has been successfully updated. Competitive analysis requests will now use the enhanced market positioning framework with strategic recommendations.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleUpdateCompetitorPrompt} 
                disabled={isUpdatingCompetitor || competitorStatus === 'success'}
                className="w-full"
              >
                {isUpdatingCompetitor ? 'Updating Prompt...' : 
                 competitorStatus === 'success' ? 'Prompt Updated Successfully' : 
                 'Update Competitor Prompt with Market Positioning Framework'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
