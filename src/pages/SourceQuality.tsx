import { getSourceTiers, getCrossRecordWarnings, getMeta, getBadges } from '../data/sourceOfTruth';
import { confidenceConfig } from '../lib/utils';
import type { SourceConfidence } from '../types';

export default function SourceQuality() {
  const tiers = getSourceTiers();
  const warnings = getCrossRecordWarnings();
  const meta = getMeta();
  const badges = getBadges();

  const confidenceCounts = badges.reduce((acc, b) => {
    acc[b.source_confidence] = (acc[b.source_confidence] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const conflictCount = badges.filter(b => b.source_conflict_note).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Jakość źródeł</h1>
      <p className="text-sm text-slate-500 mb-8">
        Każdy rekord w bazie ma określony poziom pewności. Nie wszystkie dane są tak samo solidne.
        Tutaj wyjaśniamy, jak to działa i czemu nie ukrywamy niepewności.
      </p>

      {/* Philosophy */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3">Filozofia</h2>
        <blockquote className="border-l-4 border-emerald-400 pl-4 text-sm text-slate-600 italic mb-4">
          „{meta.editorial_policy}"
        </blockquote>
        <p className="text-sm text-slate-600">
          Gdy oficjalna strona opisowa kłóci się z regulaminem, wygrywa regulamin.
          Gdy oficjalny dokument jest tymczasowo niedostępny, rekord zostaje, ale z obniżonym
          <code className="bg-slate-100 px-1 rounded text-xs mx-1">source_confidence</code>
          i jawnym statusem.
        </p>
      </section>

      {/* Confidence levels */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Poziomy pewności (source_confidence)</h2>
        <p className="text-sm text-slate-500 mb-4">
          Każdy rekord odznaki ma przypisany poziom pewności oparty na jakości i aktualności źródła.
        </p>
        <div className="space-y-3">
          {(Object.entries(confidenceConfig) as [SourceConfidence, typeof confidenceConfig.high][]).map(([key, config]) => (
            <div key={key} className={`rounded-lg border p-4 ${config.bg} ${config.border}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    key === 'high' ? 'bg-emerald-500' : key === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
                  <code className="text-xs bg-white/60 px-1.5 py-0.5 rounded">{key}</code>
                </div>
                <span className="text-sm font-mono text-slate-500">{confidenceCounts[key] || 0} rekordów</span>
              </div>
              <p className={`text-sm ${config.color}`}>{config.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live source status */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3">Status dostępności (live_source_status)</h2>
        <p className="text-sm text-slate-500 mb-4">
          Niezależnie od poziomu pewności, każdy rekord informuje, czy jego źródło jest dziś dostępne w sieci.
        </p>
        <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
          <dl className="space-y-3 text-sm">
            <StatusDef code="official_live" desc="Oficjalna strona lub regulamin żyje i jest dostępny." />
            <StatusDef code="official_live_with_legacy_conflict" desc="Oficjalne źródło jest live, ale w sieci żyje też starsza wersja, która mówi coś innego." />
            <StatusDef code="official_pdf_live" desc="Oficjalny PDF dostępny, ale nie ma dedykowanej strony HTML." />
            <StatusDef code="official_pdf_live_and_secondary_text_live" desc="Oficjalny PDF live + tekst na stronie wtórnego katalogu." />
            <StatusDef code="secondary_live_conflict_no_stable_primary" desc="Brak stabilnego źródła pierwszego poziomu. Tylko źródła wtórne, które nie zgadzają się między sobą." />
          </dl>
        </div>
      </section>

      {/* Source tiers */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Poziomy źródeł (source tiers)</h2>
        <div className="space-y-4">
          {tiers.map(tier => (
            <div key={tier.tier} className="bg-slate-50 rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  tier.tier === 1 ? 'bg-emerald-500' : tier.tier === 2 ? 'bg-sky-500' : 'bg-slate-400'
                }`}>
                  {tier.tier}
                </span>
                <h3 className="font-semibold text-slate-800">{tier.name.replace(/_/g, ' ')}</h3>
              </div>
              <p className="text-sm text-slate-600 mb-2">{tier.description}</p>
              <p className="text-xs text-slate-500 italic">{tier.policy}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tier.domains.map(domain => (
                  <code key={domain} className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {domain}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conflicts */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3">Konflikty źródeł</h2>
        <p className="text-sm text-slate-500 mb-4">
          {conflictCount} {conflictCount === 1 ? 'rekord ma' : 'rekordów ma'} oznaczony konflikt źródeł.
          Konflikt oznacza, że dwa lub więcej źródeł mówi coś innego o tej samej odznace.
        </p>
        <div className="space-y-3 text-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <span className="font-semibold text-amber-800">scope: official</span>
            <p className="text-amber-700 mt-1">
              Dwa oficjalne źródła (np. nowy regulamin vs stary PDF) nie zgadzają się między sobą.
              Obowiązuje nowszy, ale stary nadal żyje w internecie.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="font-semibold text-red-800">scope: secondary</span>
            <p className="text-red-700 mt-1">
              Źródła wtórne nie zgadzają się co do statusu lub treści. Może wymagać pełnej reweryfikacji.
            </p>
          </div>
        </div>
      </section>

      {/* Cross record warnings */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Znane pułapki systemowe</h2>
        <div className="space-y-3">
          {warnings.map((w, i) => (
            <div key={i} className="bg-slate-50 rounded-lg border border-slate-100 p-4">
              <h3 className="font-semibold text-sm text-slate-700 mb-1">{w.topic.replace(/_/g, ' ')}</h3>
              <p className="text-sm text-slate-600">{w.warning}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatusDef({ code, desc }: { code: string; desc: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
      <dt className="shrink-0">
        <code className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded">{code}</code>
      </dt>
      <dd className="text-slate-600">{desc}</dd>
    </div>
  );
}
