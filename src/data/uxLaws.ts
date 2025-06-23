
export interface UXLaw {
  id: string;
  title: string;
  description: string;
  principle: string;
  example: string;
  businessImpact: string;
  imageUrl?: string;
  category: 'usability' | 'psychology' | 'performance' | 'accessibility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  readingTime?: number;
}

export const UX_LAWS: UXLaw[] = [
  {
    id: 'doherty-threshold',
    title: 'Doherty Threshold',
    description: 'Productivity soars when a computer and its users interact at a pace (<400ms) that ensures neither has to wait on the other.',
    principle: 'Keep response times under 400ms to maintain user flow and prevent cognitive breaks.',
    example: 'Loading states, instant feedback on button clicks, seamless page transitions',
    businessImpact: 'Reduces bounce rate by up to 32% and increases user satisfaction scores',
    category: 'performance',
    difficulty: 'intermediate',
    imageUrl: '/images/ux-laws/doherty-threshold.jpg',
    tags: ['performance', 'user-experience', 'response-time'],
    readingTime: 3
  },
  {
    id: 'teslers-law',
    title: 'Tesler\'s Law (Law of Conservation of Complexity)',
    description: 'For any system, there is a certain amount of complexity which cannot be reduced.',
    principle: 'Complexity can be shifted but not eliminated - choose where to place it wisely.',
    example: 'Simple user interface with powerful backend processing, or advanced settings hidden in menus',
    businessImpact: 'Improves user onboarding completion by 45% when complexity is properly managed',
    category: 'usability',
    difficulty: 'advanced',
    imageUrl: '/images/ux-laws/teslers-law.jpg',
    tags: ['complexity', 'user-interface', 'design-strategy'],
    readingTime: 4
  },
  {
    id: 'millers-rule',
    title: 'Miller\'s Rule (7±2)',
    description: 'The average person can only keep 7 (±2) items in their working memory.',
    principle: 'Limit choices and information chunks to 5-9 items to prevent cognitive overload.',
    example: 'Navigation menus with 5-7 items, product category pages, form sections',
    businessImpact: 'Increases task completion rates by 28% and reduces decision paralysis',
    category: 'psychology',
    difficulty: 'beginner',
    tags: ['cognition', 'memory', 'information-architecture'],
    readingTime: 2
  },
  {
    id: 'fitts-law',
    title: 'Fitts\' Law',
    description: 'The time to acquire a target is a function of the distance to and size of the target.',
    principle: 'Make important interactive elements larger and place them closer to where users expect them.',
    example: 'Large CTA buttons, corner-placed important actions, touch-friendly mobile targets',
    businessImpact: 'Improves conversion rates by 23% through better button placement and sizing',
    category: 'usability',
    difficulty: 'beginner',
    tags: ['interaction-design', 'target-size', 'accessibility'],
    readingTime: 3
  },
  {
    id: 'hicks-law',
    title: 'Hick\'s Law',
    description: 'The time it takes to make a decision increases with the number and complexity of choices.',
    principle: 'Reduce choices to speed up decision-making and reduce cognitive load.',
    example: 'Progressive disclosure, simplified pricing pages, guided onboarding flows',
    businessImpact: 'Reduces abandonment rates by 35% in checkout and signup processes',
    category: 'psychology',
    difficulty: 'intermediate',
    tags: ['decision-making', 'choice-architecture', 'cognitive-load'],
    readingTime: 3
  },
  {
    id: 'jakobs-law',
    title: 'Jakob\'s Law',
    description: 'Users spend most of their time on other sites, so they prefer your site to work the same way as all the other sites they already know.',
    principle: 'Follow established design patterns and conventions to reduce learning curve.',
    example: 'Standard navigation patterns, familiar form layouts, conventional icon usage',
    businessImpact: 'Reduces user training time by 40% and improves task success rates',
    category: 'usability',
    difficulty: 'beginner',
    tags: ['design-patterns', 'user-expectations', 'conventions'],
    readingTime: 2
  },
  {
    id: 'aesthetic-usability-effect',
    title: 'Aesthetic-Usability Effect',
    description: 'Users often perceive aesthetically pleasing designs as designs that are more usable.',
    principle: 'Invest in visual design to create positive first impressions and perceived usability.',
    example: 'Clean layouts, consistent typography, thoughtful color schemes, quality imagery',
    businessImpact: 'Increases user trust by 42% and improves perceived product quality',
    category: 'psychology',
    difficulty: 'intermediate',
    tags: ['visual-design', 'perception', 'trust'],
    readingTime: 3
  },
  {
    id: 'zeigarnik-effect',
    title: 'Zeigarnik Effect',
    description: 'People remember uncompleted or interrupted tasks better than completed tasks.',
    principle: 'Use progress indicators and incomplete states to maintain user engagement.',
    example: 'Profile completion progress, multi-step forms, achievement systems',
    businessImpact: 'Increases user return rates by 27% and profile completion by 38%',
    category: 'psychology',
    difficulty: 'advanced',
    tags: ['engagement', 'motivation', 'progress'],
    readingTime: 4
  }
];

// Helper functions for filtering and categorizing UX Laws
export const getUXLawsByCategory = (category: UXLaw['category']) => {
  return UX_LAWS.filter(law => law.category === category);
};

export const getUXLawsByDifficulty = (difficulty: UXLaw['difficulty']) => {
  return UX_LAWS.filter(law => law.difficulty === difficulty);
};

export const searchUXLaws = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return UX_LAWS.filter(law => 
    law.title.toLowerCase().includes(lowercaseQuery) ||
    law.description.toLowerCase().includes(lowercaseQuery) ||
    law.principle.toLowerCase().includes(lowercaseQuery) ||
    law.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
