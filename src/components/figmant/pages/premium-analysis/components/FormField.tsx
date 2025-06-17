import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
interface BaseFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
interface InputFormFieldProps extends BaseFormFieldProps {
  type: 'input';
  inputType?: string;
}
interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: 'textarea';
  minHeight?: string;
}
type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps;
export const FormField: React.FC<FormFieldProps> = props => {
  const {
    id,
    label,
    value,
    onChange,
    placeholder,
    className = ''
  } = props;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  return <div className="">
      <Label htmlFor={id} className="text-base font-medium">
        {label}
      </Label>
      {props.type === 'input' ? <Input id={id} type={props.inputType || 'text'} placeholder={placeholder} value={value} onChange={handleChange} className="mt-2" /> : <Textarea id={id} placeholder={placeholder} value={value} onChange={handleChange} className={`mt-2 ${props.minHeight || 'min-h-[200px]'}`} />}
    </div>;
};