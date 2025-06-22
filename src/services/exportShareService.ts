
import { ContextualAnalysisResult } from '@/types/contextualAnalysis';
import { StepData } from '@/components/figmant/pages/premium-analysis/types';

export interface ExportOptions {
  format: 'pdf' | 'json' | 'csv' | 'markdown';
  includeAttachments?: boolean;
  includeMetrics?: boolean;
  includeRecommendations?: boolean;
}

export interface ShareOptions {
  type: 'link' | 'email' | 'download';
  recipients?: string[];
  message?: string;
  expiresIn?: '1h' | '24h' | '7d' | '30d' | 'never';
}

export class ExportShareService {
  static async exportAnalysis(
    analysisResult: ContextualAnalysisResult,
    stepData: StepData,
    options: ExportOptions
  ): Promise<{ success: boolean; data?: Blob | string; error?: string }> {
    try {
      switch (options.format) {
        case 'pdf':
          return await this.exportToPDF(analysisResult, stepData, options);
        case 'json':
          return await this.exportToJSON(analysisResult, stepData, options);
        case 'csv':
          return await this.exportToCSV(analysisResult, stepData, options);
        case 'markdown':
          return await this.exportToMarkdown(analysisResult, stepData, options);
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async shareAnalysis(
    analysisResult: ContextualAnalysisResult,
    stepData: StepData,
    options: ShareOptions
  ): Promise<{ success: boolean; shareUrl?: string; error?: string }> {
    try {
      switch (options.type) {
        case 'link':
          return await this.createShareLink(analysisResult, stepData, options);
        case 'email':
          return await this.shareViaEmail(analysisResult, stepData, options);
        case 'download':
          return await this.prepareDownload(analysisResult, stepData, options);
        default:
          throw new Error(`Unsupported share type: ${options.type}`);
      }
    } catch (error) {
      console.error('Share failed:', error);
      return { success: false, error: error.message };
    }
  }

  private static async exportToPDF(
    analysisResult: ContextualAnalysisResult,
    stepData: StepData,
    options: ExportOptions
  ): Promise<{ success: boolean; data?: Blob; error?: string }> {
    // Generate HTML content for PDF
    const htmlContent = this.generatePDFContent(analysisResult, stepData, options);
    
    // For now, we'll use the browser's print functionality
    // In a production environment, you'd want to use a service like Puppeteer or jsPDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();

    return { success: true };
  }

  private static async exportToJSON(
    analysisResult: ContextualAnalysisResult,
    stepData: StepData,
    options: ExportOptions
  ): Promise<{ success: boolean; data?: Blob; error?: string }> {
    const exportData = {
      analysis: analysisResult,
      projectData: {
        name: stepData.projectName,
        goals: stepData.analysisGoals,
        files: stepData.uploadedFiles?.map(f => ({ name: f.name, size: f.size, type: f.type })) || []
      },
      exportOptions: options,
      exportedAt: new Date().toISOString()
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    return { success: true, data: blob };
  }

  private static async exportToCSV(
    analysisResult: ContextualAnalysisResult,
    stepData: StepData,
    options: ExportOptions
  ): Promise<{ success: boolean; data?: Blob; error?: string }> {
    const csvRows = [];
    
    // Headers
    csvRows.push(['ID', 'Title', 'Category', 'Priority', 'Confidence', 'Description', 'Suggested Actions']);
    
    // Recommendations data
    analysisResult.recommendations.forEach(rec => {
      csvRows.push([
        rec.id,
        rec.title,
        rec.category,
        rec.priority,
        rec.confidence.toString(),
        rec.description.replace(/,/g, ';'),
        rec.suggestedActions?.join('; ') || ''
      ]);
    });

    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });

    return { success: true, data: blob };
  }

  private static async exportToMarkdown(
    analysisResult: ContextualAnalysisResult,
    stepData: StepData,
    options: ExportOptions
  ): Promise<{ success: boolean; data?: Blob; error?: string }> {
    let markdown = `# ${stepData.projectName} - Analysis Report\n\n`;
    markdown += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
    
    if (options.includeMetrics) {
      markdown += `## Summary\n\n`;
      markdown += `- **Total Recommendations:** ${analysisResult.metrics.totalRecommendations}\n`;
      markdown += `- **High Priority:** ${analysisResult.metrics.highPriorityCount}\n`;
      markdown += `- **Average Confidence:** ${analysisResult.metrics.averageConfidence}%\n`;
      markdown += `- **Files Analyzed:** ${analysisResult.metrics.attachmentsAnalyzed}\n\n`;
    }

    if (options.includeRecommendations) {
      markdown += `## Recommendations\n\n`;
      analysisResult.recommendations.forEach((rec, index) => {
        markdown += `### ${index + 1}. ${rec.title}\n\n`;
        markdown += `**Priority:** ${rec.priority} | **Category:** ${rec.category} | **Confidence:** ${rec.confidence}%\n\n`;
        markdown += `${rec.description}\n\n`;
        
        if (rec.suggestedActions?.length) {
          markdown += `**Suggested Actions:**\n`;
          rec.suggestedActions.forEach(action => {
            markdown += `- ${action}\n`;
          });
          markdown += `\n`;
        }
      });
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    return { success: true, data: blob };
  }

  private static generatePDFContent(
    analysisResult: ContextualAnalysisResult,
    stepData: StepData,
    options: ExportOptions
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${stepData.projectName} - Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 30px; }
            .metric { display: inline-block; margin: 10px 20px 10px 0; }
            .recommendation { border: 1px solid #e5e5e5; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .priority-high { border-left: 4px solid #ef4444; }
            .priority-medium { border-left: 4px solid #f59e0b; }
            .priority-low { border-left: 4px solid #10b981; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .badge-high { background: #fee2e2; color: #dc2626; }
            .badge-medium { background: #fef3c7; color: #d97706; }
            .badge-low { background: #d1fae5; color: #059669; }
          </style>
        </head>
        <body>
          <h1>${stepData.projectName} - Analysis Report</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          
          <h2>Summary</h2>
          <div class="metric"><strong>Total Recommendations:</strong> ${analysisResult.metrics.totalRecommendations}</div>
          <div class="metric"><strong>High Priority:</strong> ${analysisResult.metrics.highPriorityCount}</div>
          <div class="metric"><strong>Average Confidence:</strong> ${analysisResult.metrics.averageConfidence}%</div>
          <div class="metric"><strong>Files Analyzed:</strong> ${analysisResult.metrics.attachmentsAnalyzed}</div>
          
          <h2>Recommendations</h2>
          ${analysisResult.recommendations.map((rec, index) => `
            <div class="recommendation priority-${rec.priority}">
              <h3>${index + 1}. ${rec.title}</h3>
              <div>
                <span class="badge badge-${rec.priority}">${rec.priority.toUpperCase()}</span>
                <span style="margin-left: 10px;"><strong>Category:</strong> ${rec.category}</span>
                <span style="margin-left: 10px;"><strong>Confidence:</strong> ${rec.confidence}%</span>
              </div>
              <p>${rec.description}</p>
              ${rec.suggestedActions?.length ? `
                <strong>Suggested Actions:</strong>
                <ul>
                  ${rec.suggestedActions.map(action => `<li>${action}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;
  }

  private static async createShareLink(
    analysisResult: ContextualAnalysisResult,
    stepData: StepData,
    options: ShareOptions
  ): Promise<{ success: boolean; shareUrl?: string; error?: string }> {
    // In a real implementation, you'd save the analysis to a public endpoint
    // For now, we'll simulate this
    const shareId = btoa(analysisResult.id + Date.now()).slice(0, 16);
    const shareUrl = `${window.location.origin}/shared/${shareId}`;
    
    return { success: true, shareUrl };
  }

  private static async shareViaEmail(
    analysisResult: ContextualAnalysisResult,
    stepData: StepData,
    options: ShareOptions
  ): Promise<{ success: boolean; shareUrl?: string; error?: string }> {
    const subject = `Analysis Report: ${stepData.projectName}`;
    const body = `I've completed an analysis of ${stepData.projectName} and wanted to share the results with you.\n\n${options.message || ''}`;
    
    const mailtoUrl = `mailto:${options.recipients?.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
    
    return { success: true };
  }

  private static async prepareDownload(
    analysisResult: ContextualAnalysisResult,
    stepData: StepData,
    options: ShareOptions
  ): Promise<{ success: boolean; shareUrl?: string; error?: string }> {
    // Prepare a comprehensive download package
    const exportResult = await this.exportToJSON(analysisResult, stepData, {
      format: 'json',
      includeAttachments: true,
      includeMetrics: true,
      includeRecommendations: true
    });
    
    if (exportResult.success && exportResult.data) {
      const url = URL.createObjectURL(exportResult.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${stepData.projectName}-analysis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    return { success: true };
  }

  static downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
