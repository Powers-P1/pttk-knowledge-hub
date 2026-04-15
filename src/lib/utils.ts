import type { Badge, BadgeCategory, BadgeScope, BadgeSubcategory, SourceConfidence } from '../types';

// Discipline labels in Polish
export const disciplineLabels: Record<string, string> = {
  'piesza': 'Piesza',
  'górska': 'Górska',
  'motorowa': 'Motorowa',
  'kolarska': 'Kolarska',
  'kajakowa': 'Kajakowa',
  'żeglarska': 'Żeglarska',
  'na orientację': 'Na orientację',
  'narciarska': 'Narciarska',
  'kolejowa': 'Kolejowa',
  'fotograficzna': 'Fotograficzna',
  'wielodyscyplinarna': 'Wielodyscyplinarna',
  'przyrodnicza': 'Przyrodnicza',
  'dziecięca wielodyscyplinarna': 'Dziecięca',
  'krajoznawcza': 'Krajoznawcza',
  'krajoznawczo-przyrodnicza': 'Krajoznawczo-przyrodnicza',
};

export const disciplineIcons: Record<string, string> = {
  'piesza': '🥾',
  'górska': '⛰️',
  'motorowa': '🚗',
  'kolarska': '🚴',
  'kajakowa': '🛶',
  'żeglarska': '⛵',
  'na orientację': '🧭',
  'narciarska': '🎿',
  'kolejowa': '🚆',
  'fotograficzna': '📷',
  'wielodyscyplinarna': '🧩',
  'przyrodnicza': '🌿',
  'dziecięca wielodyscyplinarna': '👶',
  'krajoznawcza': '🏛️',
  'krajoznawczo-przyrodnicza': '🌳',
};

export const categoryLabels: Record<BadgeCategory, string> = {
  turystyka_kwalifikowana: 'Turystyka kwalifikowana',
  krajoznawcza: 'Krajoznawcze',
  dziecieca_mlodziezowa: 'Dziecięce i młodzieżowe',
  specjalistyczna: 'Specjalistyczne',
};

export const subcategoryLabels: Record<BadgeSubcategory, string> = {
  piesza: 'Piesza',
  gorska: 'Górska',
  motorowa: 'Motorowa',
  kolarska: 'Kolarska',
  kajakowa: 'Kajakowa',
  zeglarska: 'Żeglarska',
  na_orientacje: 'Na orientację',
  narciarska: 'Narciarska',
  przyrodnicza: 'Przyrodnicza',
  kolejowa: 'Kolejowa',
  fotograficzna: 'Fotograficzna',
  uniwersalna: 'Uniwersalna',
};

export const scopeLabels: Record<BadgeScope, string> = {
  ogolnopolska: 'Ogólnopolskie',
  regionalna: 'Regionalne',
  lokalna: 'Lokalne',
  specjalistyczna_ponadregionalna: 'Specjalistyczne ponadregionalne',
  niepewna: 'Niepewne / do reweryfikacji',
};

export const confidenceConfig: Record<SourceConfidence, { label: string; color: string; bg: string; border: string; description: string }> = {
  high: {
    label: 'Pewne',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    description: 'Źródło oficjalne, żywe, zweryfikowane.',
  },
  medium: {
    label: 'Ostrożnie',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    description: 'Źródło oficjalne, ale mogą być rozbieżności.',
  },
  low_to_medium: {
    label: 'Sporne',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    description: 'Brak stabilnego źródła pierwszego poziomu. Źródła wtórne nie zgadzają się między sobą.',
  },
};

export const liveStatusLabels: Record<string, string> = {
  'official_live': 'Oficjalne źródło live',
  'official_live_with_legacy_conflict': 'Oficjalne live + konflikt ze starszą wersją',
  'official_pdf_live': 'Oficjalny PDF dostępny',
  'official_pdf_live_and_secondary_text_live': 'Oficjalny PDF + tekst wtórny live',
  'secondary_live_conflict_no_stable_primary': 'Tylko źródła wtórne, konflikt statusu',
  'official_shop_live_retail': 'Oficjalny sklep działa',
  'official_shop_live_ambiguous_individual_sale': 'Sklep oficjalny, ale sprzedaż indywidualna niejednoznaczna',
};

export const saleStatusLabels: Record<string, string> = {
  'physical_badge_after_verification': 'Odznaka fizyczna po weryfikacji',
  'verified_booklet_is_purchase_authorization': 'Zweryfikowana książeczka = upoważnienie do zakupu',
  'diploma_or_legitymacja_authorizes_purchase_and_wearing': 'Dyplom / legitymacja upoważnia do zakupu i noszenia',
  'verified_chronicle_authorizes_purchase_and_wearing': 'Zweryfikowana kronika upoważnia do zakupu i noszenia',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ąà]/g, 'a').replace(/[ćč]/g, 'c').replace(/[ęè]/g, 'e')
    .replace(/[łl]/g, 'l').replace(/[ńñ]/g, 'n').replace(/[óò]/g, 'o')
    .replace(/[śš]/g, 's').replace(/[źżž]/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function hasSourceConflict(badge: Badge): boolean {
  return !!(badge.source_conflict_note || badge.source_conflict_scope);
}

export function getDisciplines(badges: Badge[]): string[] {
  return [...new Set(badges.map(b => b.discipline))].sort();
}

export function getFamilies(badges: Badge[]): string[] {
  return [...new Set(badges.map(b => b.family))].sort();
}

export function getScopes(badges: Badge[]): BadgeScope[] {
  return [...new Set(badges.map(b => b.scope))].sort();
}

export function getCategories(badges: Badge[]): BadgeCategory[] {
  return [...new Set(badges.map(b => b.category))].sort();
}

export function getSubcategories(badges: Badge[]): BadgeSubcategory[] {
  return [...new Set(badges.map(b => b.subcategory))].sort();
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}

export function formatBadgeName(officialName: string, abbreviation: string): string {
  return `${officialName} (${abbreviation})`;
}

export function expandBadgeAbbreviations(text: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/\bOTP\b/g, 'Odznaka Turystyki Pieszej (OTP)'],
    [/\bGOT\b/g, 'Górska Odznaka Turystyczna (GOT)'],
    [/\bTM\b/g, 'Turysta Motorowy (TM)'],
    [/\bMOT\b/g, 'Motorowa Odznaka Turystyczna (MOT)'],
    [/\bMOK\b/g, 'Motorowa Odznaka Krajoznawcza (MOK)'],
    [/\bKOT\b/g, 'Kolarska Odznaka Turystyczna (KOT)'],
    [/\bKOTR\b/g, 'Kolejowa Odznaka Turystyczna (KOTR)'],
    [/\bTOK\b/g, 'Turystyczna Odznaka Kajakowa (TOK)'],
    [/\bŻOT\b/g, 'Żeglarska Odznaka Turystyczna (ŻOT)'],
    [/\bOInO\b/g, 'Odznaka Imprez na Orientację (OInO)'],
    [/\bGON\b/g, 'Górskie Odznaki Narciarskie (GON)'],
    [/\bDON\b/g, 'Dziecięca Odznaka Narciarska (DON)'],
    [/\bNOM\b/g, 'Narciarska Odznaka Młodzieżowa (NOM)'],
    [/\bKIEŁBIK\b/g, 'Dziecięca Odznaka Kajakowa PTTK KIEŁBIK (KIEŁBIK)'],
    [/\bOFK\b/g, 'Odznaka Fotografii Krajoznawczej (OFK)'],
    [/\bSPH\b/g, 'Ogólnopolska Odznaka Krajoznawcza „Szlakiem Pomników Historii w Polsce” (SPH)'],
    [/\bTS\b/g, 'Turysta Senior (TS)'],
    [/\bTJ\b/g, 'Turysta Junior / Turystka Juniorka (TJ)'],
    [/\bDOT\b/g, 'Dziecięca Odznaka Turystyczna (DOT)'],
    [/\bTPR\b/g, 'Tropiciel Przyrody (TPR)'],
    [/\bTP\b/g, 'Turysta Przyrodnik (TP)'],
    [/\bROK\/OKP\b/g, 'Odznaka Krajoznawcza PTTK (ROK/OKP)'],
    [/\bOTK ZPN\b/g, 'Odznaka Turystyczno-Krajoznawcza „Znam Parki Narodowe” (OTK ZPN)'],
    [/\bZPN\b/g, 'Odznaka Turystyczno-Krajoznawcza „Znam Parki Narodowe” (ZPN)'],
  ];

  return replacements.reduce((acc, [regex, replacement]) => acc.replace(regex, replacement), text);
}
