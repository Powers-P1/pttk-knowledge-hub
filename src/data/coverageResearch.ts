export interface CandidateBadge {
  name: string;
  abbreviation?: string;
  scope: 'ogolnopolska' | 'regionalna' | 'lokalna' | 'specjalistyczna_ponadregionalna';
  sourceHint: string;
  status: 'ready_for_intake' | 'needs_verification';
  notes: string;
}

export const candidateBadges: CandidateBadge[] = [
  {
    name: 'Odznaki regionalne (np. Miłośnik Jury, Miłośnik Modernizmu)',
    scope: 'regionalna',
    sourceHint: 'pttk.pl/odznaki-krajoznawcze/',
    status: 'needs_verification',
    notes: 'Wymagają osobnej walidacji aktywności i właściwego opiekuna regulaminu.',
  },
  {
    name: 'Odznaki lokalne oddziałowe (np. Turysta Ziemi Stargardzkiej)',
    scope: 'lokalna',
    sourceHint: 'Wzmianki na pttk.pl/odznaki-krajoznawcze/',
    status: 'needs_verification',
    notes: 'Najpierw potrzebna inwentaryzacja po oddziałach i ujednolicenie kryterium aktywności.',
  },
];
