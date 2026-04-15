import { z } from 'zod';
import { sourceOfTruth } from '../src/data/sourceOfTruth';

const ChangelogEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(3),
  details: z.array(z.string().min(3)).min(1),
  type: z.enum(['data', 'source', 'ui', 'fix']),
});

const DocumentationSchema = z.object({
  required: z.boolean(),
  documentation_model: z.string().optional(),
  official_booklet_available: z.boolean(),
  official_booklet_required: z.boolean(),
  official_booklet_required_scope: z.string().optional(),
  self_made_documentation_allowed: z.boolean(),
  self_made_documentation_allowed_scope: z.string().optional(),
  digital_allowed: z.boolean(),
  digital_constraints: z.string().optional(),
  official_printable_template_available: z.boolean().optional(),
  documentation_mode: z.string().optional(),
  documentation_by_level: z.record(z.string(), z.any()).optional(),
});

const BadgeSchema = z.object({
  id: z.string().min(2),
  official_name: z.string().min(3),
  abbreviation: z.string().min(2),
  discipline: z.string().min(2),
  family: z.string().min(2),
  category: z.enum(['turystyka_kwalifikowana', 'krajoznawcza', 'dziecieca_mlodziezowa', 'specjalistyczna']),
  subcategory: z.enum(['piesza', 'gorska', 'motorowa', 'kolarska', 'kajakowa', 'zeglarska', 'na_orientacje', 'narciarska', 'przyrodnicza', 'kolejowa', 'fotograficzna', 'uniwersalna']),
  status: z.enum(['active', 'uncertain_secondary_conflict']),
  source_confidence: z.enum(['high', 'medium', 'low_to_medium']),
  live_source_status: z.string().min(3),
  last_verified_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  current_regulation_effective_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  age_rule_literal: z.string().min(3),
  levels: z.array(z.string().min(1)).min(1),
  documentation: DocumentationSchema,
  confirmation_body: z.array(z.string().min(1)).min(1),
  verification_body: z.array(z.string().min(1)).min(1),
  verification_by_level: z.record(z.string(), z.array(z.string())).optional(),
  sale_status: z.string().min(3),
  source_notes: z.array(z.string().min(3)).min(1),
  source_conflict_note: z.string().optional(),
  source_conflict_scope: z.enum(['official', 'secondary']).optional(),
  review_needed: z.boolean().optional(),
  primary_sources: z.array(z.string().url()),
  secondary_sources: z.array(z.string().url()).optional(),
  legacy_or_stale_sources: z.array(z.string().url()).optional(),
});

const SourceOfTruthSchema = z.object({
  meta: z.object({
    document_type: z.string().min(3),
    version: z.string().min(1),
    generated_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timezone: z.string().min(3),
    editorial_policy: z.string().min(3),
    base_documents: z.array(z.string()).min(1),
    notes: z.array(z.string()).min(1),
    changelog: z.array(ChangelogEntrySchema).min(1),
  }),
  source_tiers: z.array(z.object({
    tier: z.number().int().min(1).max(3),
    name: z.string().min(3),
    description: z.string().min(3),
    domains: z.array(z.string().min(3)).min(1),
    policy: z.string().min(3),
  })).min(1),
  repo_rules: z.array(z.object({
    rule: z.string().min(3),
    value: z.boolean(),
  })).min(1),
  shops: z.array(z.object({
    id: z.string().min(2),
    official_name: z.string().min(2),
    domain: z.string().min(3),
    source_tier: z.number().int().min(1).max(3),
    official_central_shop: z.boolean(),
    official_retail: z.boolean(),
    individual_sale_status: z.string().min(2),
    live_source_status: z.string().min(2),
    source_confidence: z.enum(['high', 'medium', 'low_to_medium']),
    last_verified_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    evidence_summary: z.string().min(3),
    sources: z.array(z.string().url()).min(1),
  })).min(1),
  booklets: z.array(z.object({
    id: z.string().min(2),
    name: z.string().min(2),
    used_by: z.array(z.string().min(1)).min(1),
    official_booklet_available: z.boolean(),
    official_booklet_required: z.boolean(),
    self_made_documentation_allowed: z.boolean(),
    notes: z.string().min(3),
    sources: z.array(z.string().url()).min(1),
  })).min(1),
  badges: z.array(BadgeSchema).min(1),
  cross_record_warnings: z.array(z.object({
    topic: z.string().min(3),
    warning: z.string().min(3),
  })).min(1),
});

const parsed = SourceOfTruthSchema.safeParse(sourceOfTruth);

if (!parsed.success) {
  console.error('❌ Walidacja sourceOfTruth nie powiodła się.');
  console.error(parsed.error.format());
  process.exit(1);
}

const ids = parsed.data.badges.map(b => b.id);
const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
if (duplicateIds.length > 0) {
  console.error('❌ Duplikaty ID odznak:', duplicateIds.join(', '));
  process.exit(1);
}

console.log(`✅ Walidacja OK: ${parsed.data.badges.length} odznak, wersja ${parsed.data.meta.version}.`);
