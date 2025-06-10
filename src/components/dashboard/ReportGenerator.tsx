
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, FileText, Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ReportGenerator = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState('');
  const [reportFormat, setReportFormat] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const availableMetrics = [
    { id: 'user-behavior', label: 'User Behavior Analytics', description: 'Click patterns, scroll depth, session duration' },
    { id: 'conversion-funnel', label: 'Conversion Funnel Analysis', description: 'Step-by-step conversion tracking' },
    { id: 'page-performance', label: 'Page Performance Metrics', description: 'Load times, bounce rates, engagement' },
    { id: 'mobile-desktop', label: 'Mobile vs Desktop Comparison', description: 'Device-specific user behavior' },
    { id: 'traffic-sources', label: 'Traffic Source Analysis', description: 'Organic, paid, social, direct traffic' },
    { id: 'ai-insights', label: 'Claude AI Insights', description: 'AI-generated recommendations and patterns' },
    { id: 'user-journey', label: 'User Journey Mapping', description: 'Complete user flow analysis' },
    { id: 'heatmap-data', label: 'Heatmap & Click Data', description: 'Visual interaction patterns' }
  ];

  const timeRanges = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const reportFormats = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'powerpoint', label: 'PowerPoint Presentation' },
    { value: 'json', label: 'JSON Data Export' }
  ];

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const generateReport = async () => {
    if (selectedMetrics.length === 0) {
      toast({
        title: "No Metrics Selected",
        description: "Please select at least one metric to include in your report.",
        variant: "destructive",
      });
      return;
    }

    if (!timeRange || !reportFormat) {
      toast({
        title: "Missing Configuration",
        description: "Please select both time range and report format.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Report Generated Successfully",
        description: `Your ${reportFormat.toUpperCase()} report has been generated and is ready for download.`,
      });
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const recentReports = [
    {
      name: 'Monthly UX Analysis - November 2024',
      type: 'PDF',
      date: '2024-11-28',
      size: '2.3 MB',
      metrics: ['user-behavior', 'conversion-funnel', 'ai-insights']
    },
    {
      name: 'Q4 Performance Report',
      type: 'Excel',
      date: '2024-11-25',
      size: '1.8 MB',
      metrics: ['page-performance', 'traffic-sources']
    },
    {
      name: 'Mobile vs Desktop Analysis',
      type: 'PowerPoint',
      date: '2024-11-22',
      size: '4.1 MB',
      metrics: ['mobile-desktop', 'user-journey']
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Report</CardTitle>
          <CardDescription>
            Create detailed UX analytics reports with Claude AI insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Select Metrics to Include</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableMetrics.map((metric) => (
                <div key={metric.id} className="flex items-start space-x-2 p-3 border rounded-lg">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={() => handleMetricToggle(metric.id)}
                  />
                  <div className="space-y-1 flex-1">
                    <label 
                      htmlFor={metric.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {metric.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Report Format</label>
              <Select value={reportFormat} onValueChange={setReportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {reportFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateReport} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Download or share previously generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{report.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {report.date} • {report.size} • {report.metrics.length} metrics
                  </div>
                  <div className="flex space-x-1">
                    <Badge variant="outline">{report.type}</Badge>
                    {report.metrics.slice(0, 2).map((metric) => (
                      <Badge key={metric} variant="secondary" className="text-xs">
                        {availableMetrics.find(m => m.id === metric)?.label.split(' ')[0]}
                      </Badge>
                    ))}
                    {report.metrics.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{report.metrics.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
