
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior UX Designer',
    company: 'TechFlow Inc',
    avatar: 'SC',
    content: 'This tool has revolutionized our design process. The AI insights are incredibly accurate and have helped us improve our conversion rates by 40%.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Design Director',
    company: 'Innovation Labs',
    avatar: 'MR',
    content: 'Finally, a tool that understands design context. The recommendations are spot-on and save us countless hours of analysis.',
    rating: 5
  },
  {
    name: 'Emily Thompson',
    role: 'Product Manager',
    company: 'StartupFlow',
    avatar: 'ET',
    content: 'The automated reports feature is a game-changer for stakeholder presentations. Data-driven design decisions have never been easier.',
    rating: 5
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Loved by Designers
            <br />
            <span className="text-primary">Worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what design professionals are saying about our AI-powered 
            UX analytics platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground leading-relaxed pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
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
