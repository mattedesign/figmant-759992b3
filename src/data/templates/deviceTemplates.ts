
import { FigmantPromptTemplate } from '@/types/figmant';

export const deviceTemplates: FigmantPromptTemplate[] = [
  {
    id: 'mobile_desktop_analysis',
    name: 'Mobile vs Desktop Analysis',
    displayName: 'Mobile vs Desktop',
    description: 'Cross-device experience optimization and platform-specific recommendations',
    category: 'cross_device',
    requires_context: false,
    best_for: ['Responsive design', 'Device optimization', 'Cross-platform consistency'],
    example_use_cases: ['Mobile-first design', 'Desktop experience enhancement', 'Cross-device journey optimization'],
    analysis_focus: [
      'Responsive design effectiveness',
      'Touch vs click interactions',
      'Screen size optimization',
      'Performance across devices',
      'User behavior differences'
    ],
    prompt_template: `You are a cross-device UX specialist focusing on mobile and desktop experience optimization. Analyze this design for optimal performance across different platforms and screen sizes.

**CROSS-DEVICE ANALYSIS FRAMEWORK:**

**1. RESPONSIVE DESIGN ASSESSMENT**
- Evaluate breakpoint strategy and implementation
- Assess content reflow and layout adaptation
- Review navigation transformation across devices
- Analyze image and media responsiveness
- Check typography scaling and readability

**2. MOBILE-SPECIFIC OPTIMIZATION**
- Evaluate touch target sizing (minimum 44px)
- Assess thumb zone accessibility and navigation
- Review swipe gestures and mobile interactions
- Analyze mobile form optimization
- Check mobile performance and loading speed

**3. DESKTOP EXPERIENCE ENHANCEMENT**
- Evaluate use of larger screen real estate
- Assess hover states and mouse interactions
- Review multi-column layouts and information density
- Analyze keyboard shortcuts and power user features
- Check desktop-specific functionality utilization

**4. INTERACTION PATTERN ANALYSIS**
- Compare touch vs. click interaction efficiency
- Evaluate gesture support and implementation
- Assess context menu and right-click functionality
- Review scroll behavior across devices
- Analyze input method optimization (keyboard, voice, touch)

**5. PERFORMANCE & TECHNICAL CONSIDERATIONS**
- Compare loading speeds across devices
- Evaluate bandwidth optimization strategies
- Assess progressive web app capabilities
- Review offline functionality and sync
- Check device-specific feature utilization

**6. USER BEHAVIOR & CONTEXT OPTIMIZATION**
- Analyze mobile vs. desktop user journey differences
- Evaluate context-aware content prioritization
- Assess task completion efficiency by device
- Review conversion funnel performance by platform
- Check cross-device handoff and continuity

**OUTPUT FORMAT:**
- Device Experience Scorecard
- Platform-Specific Recommendations
- Responsive Design Optimization Plan
- Performance Comparison Matrix
- Cross-Device User Journey Map
- Technical Implementation Priorities
- A/B Testing Recommendations by Device

Focus on optimizing for device-specific user behaviors while maintaining consistent brand experience.`
  }
];
