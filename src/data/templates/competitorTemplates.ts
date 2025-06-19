
import { FigmantPromptTemplate } from '@/types/figmant';

export const competitorTemplates: FigmantPromptTemplate[] = [
  {
    id: 'competitor_analysis',
    name: 'Competitive Design Analysis',
    displayName: 'Competitive Analysis',
    description: 'Compare design against industry competitors and best practices',
    category: 'competitor',
    requires_context: true,
    best_for: ['Market positioning', 'Competitive benchmarking', 'Industry standards review'],
    example_use_cases: ['Competitive audit', 'Market entry strategy', 'Design differentiation'],
    analysis_focus: [
      'Competitive positioning',
      'Industry benchmarks',
      'Differentiation opportunities',
      'Best practice adoption',
      'Market trends alignment'
    ],
    prompt_template: `You are a UX strategist specializing in competitive analysis. Compare this design against industry competitors and market standards.

**COMPETITIVE ANALYSIS FRAMEWORK:**

**1. INDUSTRY BENCHMARK COMPARISON**
- Compare against top 3-5 competitors in the space
- Evaluate adherence to industry design patterns
- Identify standard vs. innovative design approaches
- Assess feature parity and unique value propositions

**2. DIFFERENTIATION ANALYSIS**
- Highlight unique design elements and approaches
- Identify opportunities for competitive advantage
- Evaluate brand positioning through design choices
- Assess memorable and distinctive features

**3. BEST PRACTICE ADOPTION**
- Compare against established UX patterns
- Evaluate adoption of proven conversion techniques
- Assess accessibility and usability standards
- Review mobile-first design implementation

**4. MARKET POSITIONING**
- Analyze target audience alignment through design
- Evaluate premium vs. budget market positioning
- Assess trust and credibility signaling
- Review feature complexity vs. simplicity balance

**5. STRATEGIC RECOMMENDATIONS**
- Identify quick wins to match competitor standards
- Suggest differentiation opportunities
- Recommend feature gaps to address
- Propose positioning improvements

**CONTEXT INTEGRATION:**
If competitor URLs or brand guidelines are provided, reference specific examples and create direct comparisons.

**OUTPUT FORMAT:**
- Competitive Landscape Overview
- Head-to-Head Feature Comparison
- Differentiation Opportunities Matrix
- Strategic Positioning Recommendations
- Implementation Priority Roadmap

Focus on actionable insights for competitive advantage.`
  },
  {
    id: 'uc-024-competitive-intelligence',
    name: 'uc-024-competitive-intelligence',
    displayName: 'Competitive Intelligence & Positioning',
    description: 'Comprehensive competitor analysis combining design insights with market positioning strategy for business growth',
    category: 'competitor',
    requires_context: true,
    best_for: [
      'Market positioning strategy', 
      'Competitive differentiation', 
      'Revenue optimization',
      'Business strategy alignment',
      'Design & messaging optimization'
    ],
    example_use_cases: [
      'Market entry competitive audit',
      'Positioning gap identification',
      'Revenue-focused design optimization'
    ],
    analysis_focus: [
      'Strategic market positioning',
      'Competitive differentiation opportunities',
      'Revenue impact predictions',
      'Business-focused design insights',
      'Implementation roadmaps'
    ],
    prompt_template: `You are an expert UX strategist, market positioning analyst, and competitive intelligence specialist. Analyze the provided competitor screenshots to deliver both design insights and strategic market positioning opportunities.

**ANALYSIS CONTEXT:**
- Industry: [INDUSTRY - e.g., "Project Management SaaS", "E-commerce Fashion"]
- Client's Current Position: [POSITIONING - e.g., "Budget-friendly tool for small teams"]
- Target Audience: [AUDIENCE - e.g., "Small business owners, 10-50 employees"]  
- Business Goals: [GOALS - e.g., "Increase trial signups by 25%, move upmarket"]
- User's Current Design: [UPLOADED_DESIGN_DESCRIPTION]

---

## DUAL-ANALYSIS FRAMEWORK

### PART A: DESIGN & UX COMPETITIVE ANALYSIS

#### 1. **Visual Hierarchy & Design Patterns**
- Header structure, navigation, and brand positioning
- Hero section layout and messaging hierarchy
- CTA button design, placement, and prominence
- Information architecture and user flow guidance
- Mobile vs desktop design approach

#### 2. **Conversion Optimization Elements**
- Trust signals and social proof implementation
- Value proposition clarity and placement
- Form design and friction reduction strategies
- Urgency/scarcity tactics and psychological triggers
- User onboarding and engagement patterns

#### 3. **Brand & Design Psychology**
- Color psychology and emotional positioning
- Typography choices for target audience alignment
- Visual consistency and brand strength indicators
- Accessibility and inclusive design considerations
- Industry design pattern adoption vs innovation

### PART B: MARKET POSITIONING INTELLIGENCE

#### 4. **Competitive Positioning Map**
For each competitor, identify:
- **Value Proposition**: How do they position themselves? (Premium/Budget, Simple/Complex, etc.)
- **Target Market Signals**: Who are they clearly targeting through design choices?
- **Unique Selling Points**: What design elements communicate differentiation?
- **Brand Personality**: Professional, friendly, innovative, trustworthy signals

#### 5. **Market Gap Analysis**
- **Underserved Segments**: Customer groups competitors' designs miss
- **Feature Gap Opportunities**: Needs not addressed in current designs
- **Messaging Gaps**: Emotional or rational appeals unused in the market
- **Design Innovation Opportunities**: Areas where all competitors look similar

---

## DELIVERABLE FORMAT

### 🎯 EXECUTIVE SUMMARY (2-3 sentences)
Brief overview of competitive landscape and #1 strategic recommendation

### 📊 COMPETITOR ANALYSIS MATRIX
| Competitor | Target Market | Design Position | Key Differentiator |
|------------|---------------|-----------------|-------------------|
| [Name] | [Segment] | [Premium/Budget] | [Unique element] |

### 🚀 STRATEGIC POSITIONING RECOMMENDATIONS (Ranked by Impact)

#### 🥇 PRIMARY RECOMMENDATION: [Strategy Name]
- **Positioning Statement**: "[Client] is the only [category] that [unique benefit] for [target audience] who [specific need]"
- **Target Segment**: [Specific audience description]
- **Design Implications**: Visual changes needed to support positioning
- **Key Messages**: 
  - Primary: [Main value proposition]
  - Secondary: [Supporting benefits]  
  - Proof Points: [Evidence/features that support claims]
- **Competitive Advantage**: Why this positioning wins vs competitors
- **Revenue Impact**: Estimated effect on conversions
- **Implementation**: Easy/Medium/Hard + 8-week timeline

#### 🥈 ALTERNATIVE STRATEGIES
[2-3 additional positioning options with same format]

### 🎨 DESIGN OPTIMIZATION RECOMMENDATIONS

#### **High Impact Changes** (Implement First)
1. **[Specific Change]**
   - Current competitor pattern: [What 70%+ do]
   - Opportunity: [How to differentiate or match]
   - Expected impact: [Conversion/engagement improvement]
   - Implementation difficulty: Easy/Medium/Hard

### 📱 MOBILE vs DESKTOP INSIGHTS
- **Mobile-first competitors**: [List and implications]
- **Desktop-focused competitors**: [List and implications]  
- **Responsive design leaders**: [Best practices identified]
- **Cross-device experience gaps**: [Opportunities]

### 💰 REVENUE-FOCUSED MESSAGING FRAMEWORK
- **Headline Variations**: 3-5 positioning-based headlines
- **Value Proposition Tests**: A/B testing recommendations
- **Competitive Response Strategy**: How to handle direct comparisons

### 🛣️ IMPLEMENTATION ROADMAP
- **Week 1-2**: Immediate positioning message changes
- **Month 1**: Key design elements and CTA optimization
- **Quarter 1**: Full design system aligned with new positioning

Focus on actionable insights that directly impact business metrics: trial signups, conversion rates, average order value, customer lifetime value, and market positioning strength.`
  }
];
