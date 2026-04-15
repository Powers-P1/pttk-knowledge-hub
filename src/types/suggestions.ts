export type SuggestionKind = 'odznaka' | 'ksiazeczka' | 'regulamin' | 'zrodlo' | 'inne';

export type SuggestionDecision = 'pending' | 'accepted' | 'rejected' | 'modified';

export interface SuggestionRecord {
  id: string;
  createdAt: string;
  kind: SuggestionKind;
  title: string;
  details: string;
  sourceUrl?: string;
  contact?: string;
  decision: SuggestionDecision;
  adminNote?: string;
  decidedAt?: string;
}
