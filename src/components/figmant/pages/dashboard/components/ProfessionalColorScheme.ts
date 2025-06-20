
// Executive-level color scheme for professional dashboard presentation
export const executiveColors = {
  // Primary Navy Palette
  navy: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  
  // Professional Blues
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  
  // Success & Growth
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b'
  },
  
  // Warning & Attention
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  
  // Critical & Risk
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  
  // Premium Purple
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87'
  }
};

// Executive typography scale
export const executiveTypography = {
  heading: {
    h1: 'text-3xl md:text-4xl font-bold tracking-tight text-slate-900',
    h2: 'text-2xl md:text-3xl font-semibold tracking-tight text-slate-900',
    h3: 'text-xl md:text-2xl font-semibold text-slate-900',
    h4: 'text-lg md:text-xl font-medium text-slate-900',
    h5: 'text-base md:text-lg font-medium text-slate-800',
    h6: 'text-sm md:text-base font-medium text-slate-700'
  },
  body: {
    large: 'text-lg text-slate-700 leading-relaxed',
    default: 'text-base text-slate-600 leading-relaxed',
    small: 'text-sm text-slate-600',
    caption: 'text-xs text-slate-500 uppercase tracking-wide'
  },
  metrics: {
    primary: 'text-2xl md:text-3xl font-bold',
    secondary: 'text-xl md:text-2xl font-semibold',
    label: 'text-sm font-medium text-slate-600'
  }
};

// Professional card styles
export const executiveCards = {
  primary: 'bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow',
  elevated: 'bg-white border border-slate-200 rounded-xl shadow-lg',
  gradient: 'bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200 rounded-xl',
  metric: 'bg-white border border-slate-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors'
};

// Executive spacing system
export const executiveSpacing = {
  section: 'space-y-8',
  component: 'space-y-6',
  element: 'space-y-4',
  tight: 'space-y-2',
  padding: {
    page: 'px-4 md:px-6 lg:px-8',
    section: 'p-6 md:p-8',
    component: 'p-4 md:p-6',
    element: 'p-3 md:p-4'
  }
};

// Animation presets for executive presentations
export const executiveAnimations = {
  fadeIn: 'animate-in fade-in duration-500',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-500',
  scaleIn: 'animate-in zoom-in-95 duration-300',
  stagger: 'animate-in fade-in slide-in-from-bottom-2 duration-500'
};

// Professional status indicators
export const executiveStatus = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: 'text-emerald-600'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: 'text-amber-600'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-600'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-600'
  },
  neutral: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-800',
    icon: 'text-slate-600'
  }
};
