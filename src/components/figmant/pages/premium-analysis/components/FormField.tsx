
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BaseFormFieldProps {
  label: string;
  required?: boolean;
  className?: string;
}

interface InputFormFieldProps extends BaseFormFieldProps {
  type: 'input';
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputType?: string;
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: 'textarea';
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

interface CustomFormFieldProps extends BaseFormFieldProps {
  type: 'custom';
  children: React.ReactNode;
}

type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps | CustomFormFieldProps;

export const FormField: React.FC<FormFieldProps> = props => {
  const {
    label,
    required = false,
    className = ''
  } = props;

  if (props.type === 'custom') {
    return (
      <div className={className}>
        <Label className="text-base font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="mt-2">
          {props.children}
        </div>
      </div>
    );
  }

  const {
    id,
    value,
    onChange,
    placeholder
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      <Label htmlFor={id} className="text-base font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {props.type === 'input' ? (
        <Input 
          id={id} 
          type={props.inputType || 'text'} 
          placeholder={placeholder} 
          value={value} 
          onChange={handleChange} 
          className="mt-2 w-full" 
        />
      ) : (
        <Textarea 
          id={id} 
          placeholder={placeholder} 
          value={value} 
          onChange={handleChange} 
          className={`mt-2 w-full ${props.minHeight || 'min-h-[200px]'}`} 
        />
      )}
    </div>
  );
};
