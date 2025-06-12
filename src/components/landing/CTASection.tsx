
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const CTASection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/10 rounded-3xl p-12 lg:p-16">
            <div className="mb-6">
              <Zap className="h-16 w-16 text-primary mx-auto mb-6" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your
              <br />
              <span className="text-primary">Design Process?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of designers who are already using AI to create 
              better user experiences and drive business results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleGetStarted} className="px-8 py-4 text-lg group">
                Start Free Analysis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Schedule Demo
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Get started in under 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
