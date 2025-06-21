
import { DesignAnalysisTab } from './DesignAnalysisTab';
import { AllAnalysisTab } from './AllAnalysisTab';
import { InsightsTab } from './InsightsTab';
import { PromptsTab } from './PromptsTab';
import { PremiumAnalysisTab } from './PremiumAnalysisTab';
import { IntegrationsTab } from './IntegrationsTab';
import { BatchAnalysisTab } from './BatchAnalysisTab';
import { AnalysisHistoryTab } from './AnalysisHistoryTab';
import { LegacyDesignTab } from './LegacyDesignTab';
import { UserManagementTab } from './UserManagementTab';
import { SubscriptionPlansTab } from './SubscriptionPlansTab';
import { ClaudeSettingsTab } from './ClaudeSettingsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { PromptManagerTab } from './PromptManagerTab';

export const tabMapping: Record<string, React.ComponentType> = {
  design: DesignAnalysisTab,
  'all-analysis': AllAnalysisTab,
  insights: InsightsTab,
  prompts: PromptsTab,
  'premium-analysis': PremiumAnalysisTab,
  integrations: IntegrationsTab,
  batch: BatchAnalysisTab,
  history: AnalysisHistoryTab,
  legacy: LegacyDesignTab,
  users: UserManagementTab,
  plans: SubscriptionPlansTab,
  claude: ClaudeSettingsTab,
  settings: AdminSettingsTab,
  'prompt-manager': PromptManagerTab,
};
