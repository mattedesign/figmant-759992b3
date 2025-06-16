
export interface AnalysisData {
  id: number;
  title: string;
  status: string;
  type: string;
  progress: number;
  suggestions: number | string;
  documents: number;
}

export interface InsightData {
  id: number;
  name: string;
  role: string;
  change: string;
  period: string;
  total: number;
  running: number;
  complete: number;
}

export interface PromptData {
  title: string;
  subtitle: string;
  date: string;
  status: string;
}

export interface NoteData {
  title: string;
  items: string[];
}
