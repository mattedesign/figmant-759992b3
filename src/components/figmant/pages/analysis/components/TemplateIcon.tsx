
import React from 'react';
import { Sparkles, Target, BarChart3, Users, ShoppingCart, FlaskConical } from 'lucide-react';

interface TemplateIconProps {
  category: string;
  className?: string;
}

export const getTemplateIcon = (category: string) => {
  const cat = category?.toLowerCase() || '';
  
  if (cat.includes('master') || cat.includes('comprehensive')) {
    return Sparkles;
  } else if (cat.includes('competitor') || cat.includes('competitive')) {
    return Target;
  } else if (cat.includes('visual') || cat.includes('hierarchy')) {
    return BarChart3;
  } else if (cat.includes('copy') || cat.includes('messaging') || cat.includes('content')) {
    return Users;
  } else if (cat.includes('ecommerce') || cat.includes('revenue') || cat.includes('conversion')) {
    return ShoppingCart;
  } else if (cat.includes('ab') || cat.includes('test') || cat.includes('experiment')) {
    return FlaskConical;
  } else {
    return Sparkles;
  }
};

export const TemplateIcon: React.FC<TemplateIconProps> = ({ category, className = "h-4 w-4" }) => {
  const IconComponent = getTemplateIcon(category);
  return <IconComponent className={className} />;
};
