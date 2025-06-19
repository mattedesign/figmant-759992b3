
import { 
  FileText, 
  Smartphone, 
  Palette, 
  Image, 
  Box
} from 'lucide-react';
import { AnalysisType } from './types';

export const analysisTypes: AnalysisType[] = [
  { 
    id: 'web-app', 
    title: 'Web app', 
    icon: FileText,
    description: 'Analyze web applications for usability, performance, and user experience optimization',
    features: ['User flow analysis', 'Conversion optimization', 'Performance insights']
  },
  { 
    id: 'ui-design', 
    title: 'UI/UX Design', 
    icon: Smartphone,
    description: 'Comprehensive analysis of user interface and user experience design patterns',
    features: ['Visual hierarchy assessment', 'User interaction patterns', 'Design consistency review']
  },
  { 
    id: 'mobile-app', 
    title: 'Mobile app', 
    icon: Smartphone,
    description: 'Mobile application analysis focused on touch interactions and responsive design',
    features: ['Touch-friendly design', 'Mobile performance', 'Cross-device compatibility']
  },
  { 
    id: 'branding', 
    title: 'Branding & logo', 
    icon: Palette,
    description: 'Brand identity and logo design analysis for market positioning and recognition',
    features: ['Brand consistency', 'Visual impact assessment', 'Market differentiation']
  },
  { 
    id: 'illustration', 
    title: 'Illustration', 
    icon: Image,
    description: 'Creative illustration analysis for artistic quality and communication effectiveness',
    features: ['Artistic composition', 'Message clarity', 'Visual storytelling']
  },
  { 
    id: '3d-design', 
    title: '3D Design', 
    icon: Box,
    description: '3D design and modeling analysis for depth, realism, and technical execution',
    features: ['3D modeling quality', 'Lighting and materials', 'Technical accuracy']
  }
];
