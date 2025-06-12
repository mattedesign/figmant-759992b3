
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
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
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-5xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            ✨ Powered by Claude AI
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            You're Not{' '}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Dreaming
            </span>
            .
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
            Get AI-powered analysis of your designs with actionable recommendations. 
            Qualitative and quantitative instant insights to help you measure and deliver 
            impact your rationale – with data to prove it.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" onClick={handleGetStarted} className="px-8 py-4 text-lg group">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Social proof */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Trusted by designers at leading companies
            </p>
            <div className="flex items-center space-x-8 opacity-60">
              <div className="text-lg font-semibold">Google</div>
              <div className="text-lg font-semibold">Figma</div>
              <div className="text-lg font-semibold">Adobe</div>
              <div className="text-lg font-semibold">Spotify</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
