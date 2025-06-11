
-- Insert Figmant prompt templates into design_use_cases table with proper UUIDs
INSERT INTO public.design_use_cases (name, description, prompt_template, analysis_focus) VALUES 
(
  'Figmant: Master UX Analysis',
  'Comprehensive UX evaluation covering all major design principles and user experience factors',
  'Conduct a comprehensive UX analysis of this design, evaluating: 1) Visual hierarchy and information architecture, 2) User flow and navigation patterns, 3) Accessibility and inclusivity, 4) Brand consistency and visual appeal, 5) Content clarity and messaging effectiveness, 6) Mobile responsiveness and cross-platform compatibility. Provide specific, actionable recommendations for improvement.',
  ARRAY['visual_hierarchy', 'user_flow', 'accessibility', 'brand_consistency', 'content_clarity', 'responsiveness']
),
(
  'Figmant: Competitor Analysis',
  'Compare your design against competitor interfaces and industry best practices',
  'Analyze this design in comparison to industry standards and competitor interfaces. Focus on: 1) Competitive positioning and differentiation, 2) Industry best practices adoption, 3) User experience gaps compared to market leaders, 4) Unique value proposition presentation, 5) Feature parity and innovation opportunities. Include specific competitor references when possible.',
  ARRAY['competitive_analysis', 'market_positioning', 'feature_comparison', 'innovation_opportunities']
),
(
  'Figmant: Visual Hierarchy Analysis',
  'Deep dive into visual hierarchy, typography, and information architecture',
  'Perform a detailed visual hierarchy analysis focusing on: 1) Typography scale and readability, 2) Color usage and contrast ratios, 3) Spacing and layout consistency, 4) Visual weight distribution, 5) Information prioritization and scanning patterns, 6) Call-to-action prominence and placement. Provide specific design system recommendations.',
  ARRAY['typography', 'color_theory', 'layout', 'information_architecture', 'scanning_patterns']
),
(
  'Figmant: Copy & Messaging Analysis',
  'Evaluate content strategy, tone of voice, and messaging effectiveness',
  'Analyze the copy and messaging strategy of this design: 1) Tone of voice and brand personality alignment, 2) Content clarity and scanability, 3) Value proposition communication, 4) Call-to-action effectiveness, 5) Microcopy and UX writing quality, 6) Content hierarchy and information flow. Suggest improvements for better user engagement.',
  ARRAY['content_strategy', 'tone_of_voice', 'value_proposition', 'ux_writing', 'user_engagement']
),
(
  'Figmant: E-commerce Revenue Optimization',
  'Optimize for conversions, sales, and revenue generation in e-commerce contexts',
  'Evaluate this design for e-commerce conversion optimization: 1) Product presentation and merchandising, 2) Checkout flow and friction points, 3) Trust signals and social proof, 4) Pricing strategy presentation, 5) Cart abandonment prevention, 6) Upselling and cross-selling opportunities, 7) Mobile commerce optimization. Focus on revenue impact and conversion rate improvements.',
  ARRAY['conversion_optimization', 'product_presentation', 'checkout_flow', 'trust_signals', 'mobile_commerce']
),
(
  'Figmant: A/B Testing Strategy',
  'Identify testable hypotheses and experiment opportunities for optimization',
  'Develop A/B testing recommendations for this design: 1) Identify high-impact testing opportunities, 2) Formulate specific hypotheses for key elements, 3) Suggest measurable success metrics, 4) Prioritize tests by potential impact and effort, 5) Recommend testing methodologies and sample sizes, 6) Analyze current design for baseline performance indicators. Focus on data-driven optimization opportunities.',
  ARRAY['hypothesis_formation', 'testing_strategy', 'metrics_definition', 'statistical_significance', 'optimization_opportunities']
);
