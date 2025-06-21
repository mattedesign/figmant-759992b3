
import { create } from 'zustand';

interface TemplateCreditState {
  currentCreditCost: number;
  selectedTemplateId: string | null;
  setTemplateCreditCost: (templateId: string, creditCost: number) => void;
  resetCreditCost: () => void;
}

export const useTemplateCreditStore = create<TemplateCreditState>((set) => ({
  currentCreditCost: 1,
  selectedTemplateId: null,
  setTemplateCreditCost: (templateId: string, creditCost: number) => 
    set({ currentCreditCost: creditCost, selectedTemplateId: templateId }),
  resetCreditCost: () => 
    set({ currentCreditCost: 1, selectedTemplateId: null }),
}));
