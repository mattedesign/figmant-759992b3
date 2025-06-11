
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignUseCases } from '@/hooks/useDesignUseCases';

interface UseCaseSelectorProps {
  selectedUseCase: string;
  setSelectedUseCase: (value: string) => void;
}

export const UseCaseSelector = ({
  selectedUseCase,
  setSelectedUseCase
}: UseCaseSelectorProps) => {
  const { data: useCases = [], isLoading: loadingUseCases } = useDesignUseCases();

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Analysis Type</Label>
      <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
        <SelectTrigger>
          <SelectValue placeholder="Select analysis type" />
        </SelectTrigger>
        <SelectContent>
          {useCases.map((useCase) => (
            <SelectItem key={useCase.id} value={useCase.id}>
              <div>
                <div className="font-medium">{useCase.name}</div>
                <div className="text-xs text-muted-foreground">{useCase.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
