
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORY_OPTIONS } from '@/types/promptTypes';

interface ConfigurationSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({
  formData,
  onChange,
  validationErrors
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configuration</h2>
        <p className="text-muted-foreground">
          Template configuration and performance settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category & Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(value) => onChange('category', value)}
              >
                <SelectTrigger className={validationErrors.category ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.category && (
                <p className="text-sm text-destructive">{validationErrors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_domain">Business Domain</Label>
              <Select
                value={formData.business_domain || ''}
                onValueChange={(value) => onChange('business_domain', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Effectiveness Rating: {formData.effectiveness_rating || 0}</Label>
              <Slider
                value={[formData.effectiveness_rating || 0]}
                onValueChange={(value) => onChange('effectiveness_rating', value[0])}
                max={5}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 (Not tested)</span>
                <span>5 (Excellent)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit_cost">Credit Cost</Label>
              <Input
                id="credit_cost"
                type="number"
                min="1"
                max="10"
                value={formData.credit_cost || 3}
                onChange={(e) => onChange('credit_cost', parseInt(e.target.value) || 3)}
                className={validationErrors.credit_cost ? 'border-destructive' : ''}
              />
              {validationErrors.credit_cost && (
                <p className="text-sm text-destructive">{validationErrors.credit_cost}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Number of credits required to use this template
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
