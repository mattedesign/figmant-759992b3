
interface ExtractedSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  category: 'Conversion' | 'Usability' | 'Performance' | 'Accessibility';
  priority: number;
}

export class SuggestionExtractor {
  static extractFromClaudeResponse(response: string): ExtractedSuggestion[] {
    const suggestions: ExtractedSuggestion[] = [];
    
    // Pattern 1: Bold action items (e.g., **Improve CTA placement**)
    const boldActions = response.match(/\*\*([^*]+)\*\*[^*\n]*(?:\n[^*\n#-]*)?/g) || [];
    
    // Pattern 2: Numbered recommendations
    const numberedItems = response.match(/\d+\.\s*\*\*?([^*\n]+)\*\*?[^0-9]*/g) || [];
    
    // Pattern 3: Bullet points with recommendations
    const bulletPoints = response.match(/[-•]\s*([^-•\n]*(?:improve|increase|optimize|add|enhance)[^-•\n]*)/gi) || [];
    
    // Process bold actions first (highest priority)
    boldActions.slice(0, 2).forEach((item, index) => {
      const title = item.match(/\*\*([^*]+)\*\*/)?.[1] || '';
      const description = item.replace(/\*\*[^*]+\*\*/, '').trim();
      
      if (title && title.length > 5) {
        suggestions.push({
          id: `suggestion-${Date.now()}-${index}`,
          title: title.substring(0, 50),
          description: description.substring(0, 120) || title,
          impact: this.determineImpact(title + ' ' + description),
          category: this.determineCategory(title + ' ' + description),
          priority: index + 1
        });
      }
    });
    
    // Add one more from numbered or bullet points if space available
    if (suggestions.length < 3) {
      const additionalItems = [...numberedItems, ...bulletPoints];
      additionalItems.slice(0, 3 - suggestions.length).forEach((item, index) => {
        const cleanText = item.replace(/^\d+\.\s*|\*\*|\*|[-•]\s*/g, '').trim();
        if (cleanText.length > 10) {
          suggestions.push({
            id: `suggestion-${Date.now()}-${suggestions.length}`,
            title: cleanText.substring(0, 50),
            description: cleanText.substring(0, 120),
            impact: this.determineImpact(cleanText),
            category: this.determineCategory(cleanText),
            priority: suggestions.length + 1
          });
        }
      });
    }
    
    return suggestions.slice(0, 3);
  }
  
  private static determineImpact(text: string): 'High' | 'Medium' | 'Low' {
    const highImpactKeywords = ['conversion', 'revenue', 'cta', 'button', 'checkout', 'signup'];
    const mediumImpactKeywords = ['usability', 'navigation', 'layout', 'hierarchy'];
    
    const lowerText = text.toLowerCase();
    if (highImpactKeywords.some(keyword => lowerText.includes(keyword))) return 'High';
    if (mediumImpactKeywords.some(keyword => lowerText.includes(keyword))) return 'Medium';
    return 'Low';
  }
  
  private static determineCategory(text: string): 'Conversion' | 'Usability' | 'Performance' | 'Accessibility' {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('conversion') || lowerText.includes('cta') || lowerText.includes('revenue')) return 'Conversion';
    if (lowerText.includes('accessibility') || lowerText.includes('wcag') || lowerText.includes('contrast')) return 'Accessibility';
    if (lowerText.includes('speed') || lowerText.includes('loading') || lowerText.includes('performance')) return 'Performance';
    return 'Usability';
  }
}

export type { ExtractedSuggestion };
