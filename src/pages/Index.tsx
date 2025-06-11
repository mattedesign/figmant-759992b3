import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, Users, Target, Zap, Shield } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Insights',
      description: 'Claude AI analyzes your UX data to provide intelligent recommendations and identify patterns.',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Monitor user behavior, conversion funnels, and performance metrics in real-time.',
    },
    {
      icon: Users,
      title: 'User Journey Mapping',
      description: 'Visualize complete user journeys and identify optimization opportunities.',
    },
    {
      icon: Target,
      title: 'Conversion Optimization',
      description: 'Track conversion rates and get AI-driven suggestions to improve performance.',
    },
    {
      icon: Zap,
      title: 'Automated Reports',
      description: 'Generate comprehensive UX reports with AI insights automatically.',
    },
    {
      icon: Shield,
      title: 'Privacy Compliant',
      description: 'GDPR-compliant data collection with user privacy protection built-in.',
    },
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo size="md" />
              <h1 className="text-2xl font-bold">UX Analytics AI</h1>
            </div>
            <div className="space-x-2">
              {loading ? (
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
              ) : user ? (
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                  <Button onClick={handleGetStarted}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Powered by Claude AI
          </Badge>
          <h2 className="text-5xl font-bold mb-6">
            AI-Powered UX Analytics Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform your user experience with intelligent analytics. Leverage Claude AI to gain deep insights 
            into user behavior, optimize conversion funnels, and make data-driven UX decisions.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Key Capabilities</CardTitle>
            <CardDescription className="text-lg">
              Everything you need for comprehensive UX analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Analytics & Monitoring</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time user behavior tracking</li>
                  <li>• Conversion funnel analysis</li>
                  <li>• Page performance metrics</li>
                  <li>• Mobile vs desktop comparisons</li>
                  <li>• Traffic source analysis</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">AI-Powered Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Claude AI insights and recommendations</li>
                  <li>• Automated pattern detection</li>
                  <li>• Predictive analytics</li>
                  <li>• Custom report generation</li>
                  <li>• Anomaly detection alerts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="text-sm text-muted-foreground">
                UX Analytics AI - Powered by Claude
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with React, TypeScript & Tailwind CSS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
