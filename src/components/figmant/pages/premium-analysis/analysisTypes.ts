
import { 
  FileText, 
  Smartphone, 
  Palette, 
  Image, 
  Box
} from 'lucide-react';
import { AnalysisType } from './types';

export const analysisTypes: AnalysisType[] = [
  { id: 'web-app', title: 'Web app', icon: FileText },
  { id: 'ui-design', title: 'UI/UI Design', icon: Smartphone },
  { id: 'mobile-app', title: 'Mobile app', icon: Smartphone },
  { id: 'branding', title: 'Branding & logo', icon: Palette },
  { id: 'illustration', title: 'Illustration', icon: Image },
  { id: '3d-design', title: '3D Design', icon: Box }
];
