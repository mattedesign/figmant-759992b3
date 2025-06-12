
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, BarChart3, Users, Target, FileText, Shield, Brain, TrendingUp, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Claude AI analyzes your designs with human-like intelligence, providing contextual insights and recommendations.',
    badge: 'AI Core',
    color: 'figmant-purple'
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get comprehensive design analysis in seconds, not hours. Upload and receive actionable feedback immediately.',
    badge: 'Speed',
    color: 'figmant-yellow'
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Insights',
    description: 'Transform subjective design opinions into objective, measurable insights backed by UX principles.',
    badge: 'Analytics',
    color: 'figmant-blue'
  },
  {
    icon: Users,
    title: 'User Journey Mapping',
    description: 'Understand how users interact with your designs and identify friction points in their journey.',
    badge: 'UX Research',
    color: 'figmant-cyan'
  },
  {
    icon: Target,
    title: 'Conversion Optimization',
    description: 'Get specific recommendations to improve conversion rates and user engagement metrics.',
    badge: 'Growth',
    color: 'figmant-green'
  },
  {
    icon: TrendingUp,
    title: 'Performance Tracking',
    description: 'Monitor design performance over time with detailed analytics and trend analysis.',
    badge: 'Monitoring',
    color: 'figmant-orange'
  },
  {
    icon: FileText,
    title: 'Automated Reports',
    description: 'Generate professional UX reports instantly, perfect for stakeholder presentations.',
    badge: 'Reporting',
    color: 'figmant-red'
  },
  {
    icon: MessageSquare,
    title: 'Design Feedback',
    description: 'Receive detailed feedback on typography, color, layout, and user experience principles.',
    badge: 'Feedback',
    color: 'figmant-purple'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your designs are secure with enterprise-grade privacy protection and GDPR compliance.',
    badge: 'Security',
    color: 'figmant-cyan'
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-figmant-green/30">
            Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Everything You Need for
            <br />
            <span className="figmant-text-gradient">Design Excellence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive UX analytics powered by AI to help you create designs 
            that convert and delight users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-${feature.color}/10 w-fit group-hover:bg-${feature.color}/20 transition-colors`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
