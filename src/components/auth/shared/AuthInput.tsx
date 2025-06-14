
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onClearError?: () => void;
  error?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onClearError,
  error,
  disabled = false,
  icon: Icon,
  rightIcon,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (error && onClearError) {
      onClearError();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`modern-input ${Icon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'border-destructive' : ''} ${className}`}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
