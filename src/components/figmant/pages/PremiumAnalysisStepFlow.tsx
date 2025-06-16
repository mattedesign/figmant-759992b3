
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Smartphone, 
  Palette, 
  Image, 
  Box, 
  Globe,
  ChevronLeft,
  Plus,
  X,
  Upload,
  Link,
  Check
} from 'lucide-react';

interface StepData {
  selectedType: string;
  projectName: string;
  analysisGoals: string;
  desiredOutcome: string;
  improvementMetric: string;
  deadline: string;
  date: string;
  stakeholders: Array<{
    name: string;
    title: string;
  }>;
  referenceLinks: string[];
  customPrompt: string;
}

export const PremiumAnalysisStepFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({
    selectedType: '',
    projectName: '',
    analysisGoals: '',
    desiredOutcome: 'Improve Conversions',
    improvementMetric: '5,000',
    deadline: '',
    date: '',
    stakeholders: [],
    referenceLinks: [''],
    customPrompt: ''
  });

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const analysisTypes = [
    { id: 'web-app', title: 'Web app', icon: FileText },
    { id: 'ui-design', title: 'UI/UI Design', icon: Smartphone },
    { id: 'mobile-app', title: 'Mobile app', icon: Smartphone },
    { id: 'branding', title: 'Branding & logo', icon: Palette },
    { id: 'illustration', title: 'Illustration', icon: Image },
    { id: '3d-design', title: '3D Design', icon: Box }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStakeholderAdd = () => {
    setStepData({
      ...stepData,
      stakeholders: [...stepData.stakeholders, { name: '', title: '' }]
    });
  };

  const handleStakeholderRemove = (index: number) => {
    const newStakeholders = stepData.stakeholders.filter((_, i) => i !== index);
    setStepData({ ...stepData, stakeholders: newStakeholders });
  };

  const handleStakeholderChange = (index: number, field: 'name' | 'title', value: string) => {
    const newStakeholders = [...stepData.stakeholders];
    newStakeholders[index][field] = value;
    setStepData({ ...stepData, stakeholders: newStakeholders });
  };

  const handleReferenceLinkAdd = () => {
    setStepData({
      ...stepData,
      referenceLinks: [...stepData.referenceLinks, '']
    });
  };

  const handleReferenceLinkChange = (index: number, value: string) => {
    const newLinks = [...stepData.referenceLinks];
    newLinks[index] = value;
    setStepData({ ...stepData, referenceLinks: newLinks });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Analyze this...</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {currentStep} / {totalSteps}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    stepData.selectedType === type.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
                  }`}
                  onClick={() => setStepData({ ...stepData, selectedType: type.id })}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                      stepData.selectedType === type.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <type.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">{type.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">What's the name of your project?</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {currentStep} / {totalSteps}
              </Badge>
            </div>

            <div className="max-w-md mx-auto">
              <Label htmlFor="projectName" className="text-base font-medium">
                Project name
              </Label>
              <Input
                id="projectName"
                placeholder="e.g. Anything you like"
                value={stepData.projectName}
                onChange={(e) => setStepData({ ...stepData, projectName: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Any specific feedback you would like?</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {currentStep} / {totalSteps}
              </Badge>
            </div>

            <div className="max-w-2xl mx-auto">
              <Label htmlFor="analysisGoals" className="text-base font-medium">
                Analysis Goals & Context
              </Label>
              <Textarea
                id="analysisGoals"
                placeholder="e.g. Create a user-friendly mobile app to help people track their daily water intake"
                value={stepData.analysisGoals}
                onChange={(e) => setStepData({ ...stepData, analysisGoals: e.target.value })}
                className="mt-2 min-h-[200px]"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Give us the deets... Please</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {currentStep} / {totalSteps}
              </Badge>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="desiredOutcome" className="text-base font-medium">
                    Desired Outcome
                  </Label>
                  <Input
                    id="desiredOutcome"
                    value={stepData.desiredOutcome}
                    onChange={(e) => setStepData({ ...stepData, desiredOutcome: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="improvementMetric" className="text-base font-medium">
                    Improvement Metric
                  </Label>
                  <Input
                    id="improvementMetric"
                    placeholder="$ 5,000"
                    value={stepData.improvementMetric}
                    onChange={(e) => setStepData({ ...stepData, improvementMetric: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deadline" className="text-base font-medium">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    placeholder="e.g Landing page design"
                    value={stepData.deadline}
                    onChange={(e) => setStepData({ ...stepData, deadline: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-base font-medium">
                    Date
                  </Label>
                  <Input
                    id="date"
                    placeholder="$ 0"
                    value={stepData.date}
                    onChange={(e) => setStepData({ ...stepData, date: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium">Stakeholders</Label>
                  <Label className="text-base font-medium">Title & Role</Label>
                </div>
                
                {stepData.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4">
                    <Input
                      placeholder="e.g Landing page design"
                      value={stakeholder.name}
                      onChange={(e) => handleStakeholderChange(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="$ 0"
                      value={stakeholder.title}
                      onChange={(e) => handleStakeholderChange(index, 'title', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStakeholderRemove(index)}
                      className="px-2"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}

                <Button 
                  variant="outline" 
                  onClick={handleStakeholderAdd}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Stakeholder
                </Button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Upload or share some links</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {currentStep} / {totalSteps}
              </Badge>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop images, or <span className="text-blue-600 font-medium cursor-pointer">Browse</span></p>
              </div>

              {/* Reference Links Section */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Reference link</Label>
                {stepData.referenceLinks.map((link, index) => (
                  <div key={index} className="space-y-2">
                    <Input
                      placeholder="Enter your URL"
                      value={link}
                      onChange={(e) => handleReferenceLinkChange(index, e.target.value)}
                    />
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={handleReferenceLinkAdd}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add link
                </Button>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Prompts us...</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {currentStep} / {totalSteps}
              </Badge>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <Label htmlFor="customPrompt" className="text-base font-medium">
                  Add Your Custom Prompt
                </Label>
                <Textarea
                  id="customPrompt"
                  placeholder="e.g. Create a user-friendly mobile app to help people track their daily water intake"
                  value={stepData.customPrompt}
                  onChange={(e) => setStepData({ ...stepData, customPrompt: e.target.value })}
                  className="mt-2 min-h-[200px]"
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Another
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Use Template
                </Button>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Your analysis is processing</h2>
              
              <div className="flex justify-center mb-8">
                <div className="bg-white rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 font-medium">Generating</span>
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <Card className="p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">My analysis</div>
                      <div className="text-sm text-gray-600">Dashboard Design</div>
                      <div className="text-xs text-gray-500">Comprehensive UX Analysis</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">Premium</div>
                      <div className="text-sm text-gray-600">Web app</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Step {currentStep}</h2>
            <p className="text-gray-600">More content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {currentStep < 7 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentStep === totalSteps}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
