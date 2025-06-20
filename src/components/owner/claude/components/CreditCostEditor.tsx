
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit2, Check, X, CreditCard } from 'lucide-react';
import { useUpdatePromptExample } from '@/hooks/useClaudePromptExamples';

interface CreditCostEditorProps {
  templateId: string;
  currentCreditCost: number;
  isCompact?: boolean;
}

export const CreditCostEditor: React.FC<CreditCostEditorProps> = ({
  templateId,
  currentCreditCost,
  isCompact = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCost, setEditedCost] = useState(currentCreditCost.toString());
  const updatePromptMutation = useUpdatePromptExample();

  const handleSave = async () => {
    const newCost = parseInt(editedCost);
    if (isNaN(newCost) || newCost <= 0 || newCost > 100) {
      return;
    }

    try {
      await updatePromptMutation.mutateAsync({
        id: templateId,
        updates: { credit_cost: newCost }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update credit cost:', error);
    }
  };

  const handleCancel = () => {
    setEditedCost(currentCreditCost.toString());
    setIsEditing(false);
  };

  if (isCompact) {
    return (
      <div className="flex items-center gap-2">
        <CreditCard className="h-3 w-3 text-muted-foreground" />
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={editedCost}
              onChange={(e) => setEditedCost(e.target.value)}
              className="w-16 h-6 text-xs"
              min="1"
              max="100"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={updatePromptMutation.isPending}
              className="h-6 w-6 p-0"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {currentCreditCost} credits
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-5 w-5 p-0 opacity-50 hover:opacity-100"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`credit-cost-${templateId}`} className="text-sm font-medium">
        Credit Cost per Analysis
      </Label>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            id={`credit-cost-${templateId}`}
            type="number"
            value={editedCost}
            onChange={(e) => setEditedCost(e.target.value)}
            className="w-24"
            min="1"
            max="100"
            placeholder="Credits"
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updatePromptMutation.isPending}
          >
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            {currentCreditCost} credits
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="opacity-60 hover:opacity-100"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Credits deducted when users run this analysis template
      </p>
    </div>
  );
};
