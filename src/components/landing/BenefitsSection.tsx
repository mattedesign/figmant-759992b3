
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

const benefits = [
  {
    title: 'Save 80% of Analysis Time',
    description: 'What used to take hours of manual review now happens in seconds with AI-powered analysis.',
    metric: '80% faster',
    color: 'figmant-green'
  },
  {
    title: 'Increase Conversion Rates',
    description: 'Data-driven recommendations that help improve user engagement and conversion metrics.',
    metric: '+40% conversions',
    color: 'figmant-blue'
  },
  {
    title: 'Reduce Design Iterations',
    description: 'Get it right the first time with comprehensive feedback before development begins.',
    metric: '50% fewer iterations',
    color: 'figmant-orange'
  },
  {
    title: 'Improve User Satisfaction',
    description: 'Create designs that users love with insights based on proven UX principles.',
    metric: '+60% satisfaction',
    color: 'figmant-purple'
  }
];

export const BenefitsSection = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-figmant-yellow/30">
            Impact
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Measurable Results That
            <br />
            <span className="figmant-text-gradient">Drive Business Growth</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See the real impact of AI-powered design analysis on your business metrics 
            and user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-8 border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full bg-${benefit.color}/10 flex-shrink-0`}>
                    <CheckCircle className={`h-6 w-6 text-${benefit.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">{benefit.title}</h3>
                      <Badge variant="secondary" className={`bg-${benefit.color}/10 text-${benefit.color} border-${benefit.color}/20`}>
                        {benefit.metric}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
