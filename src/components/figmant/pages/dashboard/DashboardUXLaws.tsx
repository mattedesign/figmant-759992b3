
import React, { useState } from 'react';
import { Download, BookOpen, ExternalLink } from 'lucide-react';

interface UXLaw {
  id: string;
  title: string;
  description: string;
  businessImpact: string;
  category: 'usability' | 'psychology' | 'performance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const UX_LAWS: UXLaw[] = [
  {
    id: 'doherty-threshold',
    title: 'Doherty Threshold',
    description: 'Productivity soars when a computer and its users interact at a pace (<400ms) that ensures neither has to wait on the other.',
    businessImpact: 'Reduces bounce rate by up to 32% and increases user satisfaction scores',
    category: 'performance',
    difficulty: 'intermediate'
  },
  {
    id: 'teslers-law',
    title: 'Tesler\'s Law',
    description: 'For any system, there is a certain amount of complexity which cannot be reduced.',
    businessImpact: 'Improves user onboarding completion by 45% when complexity is properly managed',
    category: 'usability', 
    difficulty: 'advanced'
  },
  {
    id: 'millers-rule',
    title: 'Miller\'s Rule (7±2)',
    description: 'The average person can only keep 7 (±2) items in their working memory.',
    businessImpact: 'Increases task completion rates by 28% and reduces decision paralysis',
    category: 'psychology',
    difficulty: 'beginner'
  },
  {
    id: 'fitts-law',
    title: 'Fitts\' Law',
    description: 'The time to acquire a target is a function of the distance to and size of the target.',
    businessImpact: 'Improves conversion rates by 23% through better button placement and sizing',
    category: 'usability',
    difficulty: 'beginner'
  },
  {
    id: 'hicks-law',
    title: 'Hick\'s Law',
    description: 'The time it takes to make a decision increases with the number and complexity of choices.',
    businessImpact: 'Reduces abandonment rates by 35% in checkout and signup processes',
    category: 'psychology',
    difficulty: 'intermediate'
  }
];

export const DashboardUXLaws: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', 'usability', 'psychology', 'performance'];
  const filteredLaws = selectedCategory === 'all' 
    ? UX_LAWS 
    : UX_LAWS.filter(law => law.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'usability': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'psychology': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'performance': return 'bg-orange-100 text-orange-800 border border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">UX Laws & Principles</h2>
          <p className="text-gray-600 text-sm">
            Essential design principles backed by psychology and usability research
          </p>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* UX Laws Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLaws.map((law) => (
          <div 
            key={law.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-sm">{law.title}</h3>
              <div className="flex gap-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(law.category)}`}>
                  {law.category}
                </span>
              </div>
            </div>
            
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(law.difficulty)} mb-3 inline-block`}>
              {law.difficulty}
            </span>
            
            <p className="text-xs text-gray-600 mb-3 line-clamp-3">
              {law.description}
            </p>
            
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Business Impact:</p>
              <p className="text-xs text-green-700">{law.businessImpact}</p>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                <BookOpen className="h-3 w-3" />
                Learn
              </button>
              <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors">
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
