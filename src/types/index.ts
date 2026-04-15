// Canonical types for PTTK badge knowledge hub
// Derived from the Source of Truth document v1.2

export type SourceConfidence = 'high' | 'medium' | 'low_to_medium';

export type LiveSourceStatus =
  | 'official_live'
  | 'official_live_with_legacy_conflict'
  | 'official_pdf_live'
  | 'official_pdf_live_and_secondary_text_live'
  | 'secondary_live_conflict_no_stable_primary'
  | 'official_shop_live_retail'
  | 'official_shop_live_ambiguous_individual_sale';

export type BadgeStatus = 'active' | 'uncertain_secondary_conflict';
export type BadgeScope = 'ogolnopolska' | 'regionalna' | 'lokalna' | 'specjalistyczna_ponadregionalna' | 'niepewna';
export type BadgeCategory = 'turystyka_kwalifikowana' | 'krajoznawcza' | 'dziecieca_mlodziezowa' | 'specjalistyczna';
export type BadgeSubcategory = 'piesza' | 'gorska' | 'motorowa' | 'kolarska' | 'kajakowa' | 'zeglarska' | 'na_orientacje' | 'narciarska' | 'przyrodnicza' | 'kolejowa' | 'fotograficzna' | 'uniwersalna';

export type SourceConflictScope = 'official' | 'secondary';

export interface DocumentationByLevel {
  official_booklet_required: boolean;
  self_made_documentation_allowed: boolean;
  additional_route_chronicle_required?: boolean;
  accepted_examples?: string[];
  notes?: string;
}

export interface Documentation {
  required: boolean;
  documentation_model?: string;
  official_booklet_available: boolean;
  official_booklet_required: boolean;
  official_booklet_required_scope?: string;
  self_made_documentation_allowed: boolean;
  self_made_documentation_allowed_scope?: string;
  digital_allowed: boolean;
  digital_constraints?: string;
  official_printable_template_available?: boolean;
  documentation_mode?: string;
  documentation_by_level?: Record<string, DocumentationByLevel>;
}

export interface Badge {
  id: string;
  official_name: string;
  abbreviation: string;
  discipline: string;
  family: string;
  scope: BadgeScope;
  category: BadgeCategory;
  subcategory: BadgeSubcategory;
  status: BadgeStatus;
  source_confidence: SourceConfidence;
  live_source_status: LiveSourceStatus;
  last_verified_at: string;
  current_regulation_effective_from?: string;
  age_rule_literal: string;
  levels: string[];
  documentation: Documentation;
  confirmation_body: string[];
  verification_body: string[];
  verification_by_level?: Record<string, string[]>;
  sale_status: string;
  source_notes: string[];
  source_conflict_note?: string;
  source_conflict_scope?: SourceConflictScope;
  review_needed?: boolean;
  primary_sources: string[];
  secondary_sources?: string[];
  legacy_or_stale_sources?: string[];
}

export interface Booklet {
  id: string;
  name: string;
  used_by: string[];
  official_booklet_available: boolean;
  official_booklet_required: boolean;
  self_made_documentation_allowed: boolean;
  notes: string;
  sources: string[];
}

export interface Shop {
  id: string;
  official_name: string;
  domain: string;
  source_tier: number;
  official_central_shop: boolean;
  official_retail: boolean;
  individual_sale_status: string;
  live_source_status: string;
  source_confidence: SourceConfidence;
  last_verified_at: string;
  evidence_summary: string;
  sources: string[];
}

export interface SourceTier {
  tier: number;
  name: string;
  description: string;
  domains: string[];
  policy: string;
}

export interface RepoRule {
  rule: string;
  value: boolean;
}

export interface CrossRecordWarning {
  topic: string;
  warning: string;
}

export interface Meta {
  document_type: string;
  version: string;
  generated_at: string;
  timezone: string;
  editorial_policy: string;
  base_documents: string[];
  notes: string[];
  changelog: ChangelogEntry[];
}

export interface ChangelogEntry {
  date: string;
  title: string;
  details: string[];
  type: 'data' | 'source' | 'ui' | 'fix';
}

export interface SourceOfTruth {
  meta: Meta;
  source_tiers: SourceTier[];
  repo_rules: RepoRule[];
  shops: Shop[];
  booklets: Booklet[];
  badges: Badge[];
  cross_record_warnings: CrossRecordWarning[];
}
