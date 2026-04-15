import type { Badge, SourceConfidence } from '../types';
import { getBookletsForBadge } from '../data/sourceOfTruth';

export interface FilterState {
  search: string;
  discipline: string | null;
  family: string | null;
  category: string | null;
  subcategory: string | null;
  scope: string | null;
  status: string | null;
  sourceConfidence: SourceConfidence | null;
  officialBookletRequired: boolean | null;
  selfMadeAllowed: boolean | null;
  reviewNeeded: boolean | null;
  hasSourceConflict: boolean | null;
}

export const defaultFilters: FilterState = {
  search: '',
  discipline: null,
  family: null,
  category: null,
  subcategory: null,
  scope: null,
  status: null,
  sourceConfidence: null,
  officialBookletRequired: null,
  selfMadeAllowed: null,
  reviewNeeded: null,
  hasSourceConflict: null,
};

export type SortKey = 'name' | 'confidence' | 'verified' | 'primary_first';

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[ąà]/g, 'a').replace(/[ćč]/g, 'c').replace(/[ęè]/g, 'e')
    .replace(/[łl]/g, 'l').replace(/[ńñ]/g, 'n').replace(/[óò]/g, 'o')
    .replace(/[śš]/g, 's').replace(/[źżž]/g, 'z');
}

function matchesSearch(badge: Badge, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);

  const documentationFields = [
    badge.documentation.documentation_model,
    badge.documentation.documentation_mode,
    badge.documentation.official_booklet_required_scope,
    badge.documentation.self_made_documentation_allowed_scope,
    badge.documentation.digital_constraints,
  ].filter(Boolean) as string[];

  const perLevelNotes = badge.documentation.documentation_by_level
    ? Object.values(badge.documentation.documentation_by_level)
        .flatMap(level => [
          level.notes,
          ...(level.accepted_examples ?? []),
        ])
        .filter(Boolean) as string[]
    : [];

  const fields = [
    badge.official_name,
    badge.abbreviation,
    badge.discipline,
    badge.family,
    badge.category,
    badge.subcategory,
    badge.scope,
    badge.age_rule_literal,
    badge.status,
    badge.live_source_status,
    badge.sale_status,
    ...badge.levels,
    ...badge.confirmation_body,
    ...badge.verification_body,
    ...(badge.verification_by_level ? Object.values(badge.verification_by_level).flat() : []),
    ...documentationFields,
    ...perLevelNotes,
    ...(badge.source_conflict_note ? [badge.source_conflict_note] : []),
    ...(badge.source_conflict_scope ? [badge.source_conflict_scope] : []),
    ...badge.primary_sources,
    ...(badge.secondary_sources ?? []),
    ...(badge.legacy_or_stale_sources ?? []),
    ...badge.source_notes,
  ];
  // Also search booklet names
  const booklets = getBookletsForBadge(badge);
  for (const b of booklets) {
    fields.push(b.name);
  }
  return fields.some(f => normalize(f).includes(q));
}

export function filterBadges(badges: Badge[], filters: FilterState): Badge[] {
  return badges.filter(badge => {
    if (!matchesSearch(badge, filters.search)) return false;
    if (filters.discipline && badge.discipline !== filters.discipline) return false;
    if (filters.family && badge.family !== filters.family) return false;
    if (filters.category && badge.category !== filters.category) return false;
    if (filters.subcategory && badge.subcategory !== filters.subcategory) return false;
    if (filters.scope && badge.scope !== filters.scope) return false;
    if (filters.status && badge.status !== filters.status) return false;
    if (filters.sourceConfidence && badge.source_confidence !== filters.sourceConfidence) return false;
    if (filters.officialBookletRequired !== null && badge.documentation.official_booklet_required !== filters.officialBookletRequired) return false;
    if (filters.selfMadeAllowed !== null && badge.documentation.self_made_documentation_allowed !== filters.selfMadeAllowed) return false;
    if (filters.reviewNeeded !== null && (badge.review_needed ?? false) !== filters.reviewNeeded) return false;
    if (filters.hasSourceConflict !== null) {
      const hasConflict = !!(badge.source_conflict_note);
      if (hasConflict !== filters.hasSourceConflict) return false;
    }
    return true;
  });
}

const confidenceOrder: Record<string, number> = { high: 3, medium: 2, low_to_medium: 1 };

export function sortBadges(badges: Badge[], sortKey: SortKey): Badge[] {
  const sorted = [...badges];
  switch (sortKey) {
    case 'name':
      return sorted.sort((a, b) => a.official_name.localeCompare(b.official_name, 'pl'));
    case 'confidence':
      return sorted.sort((a, b) => (confidenceOrder[b.source_confidence] ?? 0) - (confidenceOrder[a.source_confidence] ?? 0));
    case 'verified':
      return sorted.sort((a, b) => b.last_verified_at.localeCompare(a.last_verified_at));
    case 'primary_first':
      return sorted.sort((a, b) => {
        const aStable = a.primary_sources.length > 0 ? 1 : 0;
        const bStable = b.primary_sources.length > 0 ? 1 : 0;
        return bStable - aStable;
      });
    default:
      return sorted;
  }
}
