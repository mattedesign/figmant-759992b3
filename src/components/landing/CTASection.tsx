
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
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-figmant-cyan/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-figmant-purple/20 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/10 rounded-3xl p-12 lg:p-16 border border-figmant-purple/10">
            <div className="mb-6">
              <div className="relative inline-block">
                <Zap className="h-16 w-16 text-figmant-yellow mx-auto mb-6" />
                <div className="absolute inset-0 bg-figmant-yellow/20 rounded-full blur-xl"></div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your
              <br />
              <span className="figmant-text-gradient">Design Process?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of designers who are already using AI to create 
              better user experiences and drive business results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleGetStarted} className="px-8 py-4 text-lg group bg-figmant-purple hover:bg-figmant-purple/90 border-0 shadow-lg shadow-figmant-purple/25">
                Start Free Analysis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-figmant-cyan/30 hover:bg-figmant-cyan/5 hover:border-figmant-cyan/50">
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
