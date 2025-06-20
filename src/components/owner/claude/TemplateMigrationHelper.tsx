
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreatePromptExample } from '@/hooks/useClaudePromptExamples';
import { useAuth } from '@/contexts/AuthContext';
import { Database, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

// Sample templates that should be migrated to database
const SAMPLE_TEMPLATES = [
  {
    title: 'Master UX Analysis',
    display_name: 'Master UX Analysis',
    description: 'Comprehensive UX analysis covering all major design aspects',
    category: 'master' as const,
    original_prompt: 'Analyze this design for overall UX quality, user flow, visual hierarchy, and conversion optimization opportunities.',
    claude_response: 'I will provide a comprehensive UX analysis covering usability, accessibility, visual design, and conversion optimization.',
    effectiveness_rating: 9,
    is_template: true,
    is_active: true
  },
  {
    title: 'Competitor Analysis',
    display_name: 'Competitor Analysis',
    description: 'Compare design against industry competitors',
    category: 'competitor' as const,
    original_prompt: 'Compare this design against industry best practices and competitor patterns.',
    claude_response: 'I will analyze how this design compares to competitors and industry standards.',
    effectiveness_rating: 8,
    is_template: true,
    is_active: true
  },
  {
    title: 'E-commerce Conversion Optimization',
    display_name: 'E-commerce Conversion Optimization',
    description: 'Optimize e-commerce designs for better conversion rates',
    category: 'ecommerce_revenue' as const,
    original_prompt: 'Analyze this e-commerce design for conversion optimization opportunities.',
    claude_response: 'I will provide specific recommendations to improve conversion rates.',
    effectiveness_rating: 9,
    is_template: true,
    is_active: true
  }
];

export const TemplateMigrationHelper: React.FC = () => {
  const { isOwner } = useAuth();
  const createTemplateMutation = useCreatePromptExample();
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [migratedCount, setMigratedCount] = useState(0);

  if (!isOwner) {
    return null;
  }

  const handleMigration = async () => {
    setMigrationStatus('migrating');
    setMigratedCount(0);

    try {
      for (const template of SAMPLE_TEMPLATES) {
        await createTemplateMutation.mutateAsync(template);
        setMigratedCount(prev => prev + 1);
      }
      setMigrationStatus('success');
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationStatus('error');
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Template Migration Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This tool helps migrate sample templates to the database. All prompt templates now come from the database instead of hardcoded files.
          </AlertDescription>
        </Alert>

        {migrationStatus === 'idle' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Click below to add {SAMPLE_TEMPLATES.length} sample templates to the database.
            </p>
            <Button 
              onClick={handleMigration}
              disabled={createTemplateMutation.isPending}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Migrate Sample Templates
            </Button>
          </div>
        )}

        {migrationStatus === 'migrating' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Migrating templates... ({migratedCount}/{SAMPLE_TEMPLATES.length})
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(migratedCount / SAMPLE_TEMPLATES.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {migrationStatus === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully migrated {SAMPLE_TEMPLATES.length} templates to the database!
            </AlertDescription>
          </Alert>
        )}

        {migrationStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Migration failed. Please check the logs and try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
