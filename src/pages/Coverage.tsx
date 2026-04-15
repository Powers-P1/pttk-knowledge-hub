import { getBadges } from '../data/sourceOfTruth';
import { candidateBadges } from '../data/coverageResearch';
import { categoryLabels, scopeLabels, subcategoryLabels } from '../lib/utils';

export default function Coverage() {
  const badges = getBadges();

  const existingByScope = groupByScope(badges.map(b => ({ name: `${b.official_name} (${b.abbreviation})`, scope: b.scope })));
  const existingByCategory = groupByKey(badges.map(b => ({ name: `${b.official_name} (${b.abbreviation})`, key: b.category })));
  const existingBySubcategory = groupByKey(badges.map(b => ({ name: `${b.official_name} (${b.abbreviation})`, key: b.subcategory })));
  const candidatesReady = candidateBadges.filter(c => c.status === 'ready_for_intake');
  const candidatesNeedsVerification = candidateBadges.filter(c => c.status === 'needs_verification');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Pokrycie bazy odznak</h1>
      <p className="text-sm text-slate-500 mb-6">
        Przegląd: co już mamy, czego brakuje i co można dodać na podstawie oficjalnych stron PTTK.
      </p>

      <section className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="font-semibold text-slate-800 mb-3">Aktualnie w bazie ({badges.length})</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(existingByScope).map(([scope, names]) => (
            <div key={scope} className="rounded-lg border border-slate-100 p-3">
              <h3 className="text-sm font-medium text-slate-700 mb-2">{scopeLabels[scope as keyof typeof scopeLabels]}</h3>
              <ul className="space-y-1">
                {names.map(name => (
                  <li key={name} className="text-sm text-slate-600">• {name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="font-semibold text-slate-800 mb-3">Podział na kategorie i podkategorie</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-100 p-3">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Kategorie</h3>
            <ul className="space-y-1">
              {Object.entries(existingByCategory).map(([key, names]) => (
                <li key={key} className="text-sm text-slate-600">
                  • {categoryLabels[key as keyof typeof categoryLabels]}: {names.length}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-100 p-3">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Podkategorie</h3>
            <ul className="space-y-1">
              {Object.entries(existingBySubcategory).map(([key, names]) => (
                <li key={key} className="text-sm text-slate-600">
                  • {subcategoryLabels[key as keyof typeof subcategoryLabels]}: {names.length}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="font-semibold text-slate-800 mb-3">Kandydaci do szybkiego dodania ({candidatesReady.length})</h2>
        <div className="space-y-3">
          {candidatesReady.map(c => (
            <article key={c.name} className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-3">
              <p className="text-sm font-medium text-slate-800">{c.abbreviation ? `${c.name} (${c.abbreviation})` : c.name}</p>
              <p className="text-xs text-slate-600 mt-1">Zakres: {scopeLabels[c.scope]}</p>
              <p className="text-xs text-slate-600">Źródło: {c.sourceHint}</p>
              <p className="text-xs text-slate-600">{c.notes}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Kandydaci wymagający dodatkowej weryfikacji ({candidatesNeedsVerification.length})</h2>
        <div className="space-y-3">
          {candidatesNeedsVerification.map(c => (
            <article key={c.name} className="rounded-lg border border-amber-100 bg-amber-50/40 p-3">
              <p className="text-sm font-medium text-slate-800">{c.name}</p>
              <p className="text-xs text-slate-600 mt-1">Zakres: {scopeLabels[c.scope]}</p>
              <p className="text-xs text-slate-600">Źródło: {c.sourceHint}</p>
              <p className="text-xs text-slate-600">{c.notes}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function groupByScope(items: Array<{ name: string; scope: string }>) {
  return items.reduce<Record<string, string[]>>((acc, item) => {
    if (!acc[item.scope]) acc[item.scope] = [];
    acc[item.scope].push(item.name);
    return acc;
  }, {});
}

function groupByKey(items: Array<{ name: string; key: string }>) {
  return items.reduce<Record<string, string[]>>((acc, item) => {
    if (!acc[item.key]) acc[item.key] = [];
    acc[item.key].push(item.name);
    return acc;
  }, {});
}
