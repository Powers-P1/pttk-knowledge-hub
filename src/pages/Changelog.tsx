import { getChangelog, getMeta } from '../data/sourceOfTruth';
import { formatDate } from '../lib/utils';

const typeLabels: Record<string, { label: string; cls: string }> = {
  data: { label: 'Dane', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  source: { label: 'Źródła', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  ui: { label: 'Interfejs', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  fix: { label: 'Poprawki', cls: 'bg-violet-50 text-violet-700 border-violet-200' },
};

export default function Changelog() {
  const meta = getMeta();
  const entries = getChangelog().slice().sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Historia zmian</h1>
      <p className="text-sm text-slate-500 mb-8">
        Jawny changelog danych i interfejsu. Aktualna wersja: <strong>v{meta.version}</strong>.
      </p>

      <div className="space-y-4">
        {entries.map((entry, idx) => {
          const type = typeLabels[entry.type] ?? typeLabels.data;
          return (
            <article key={`${entry.date}-${entry.title}-${idx}`} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs text-slate-500 font-medium">{formatDate(entry.date)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${type.cls}`}>{type.label}</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">{entry.title}</h2>
              <ul className="space-y-1">
                {entry.details.map((d, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-slate-400">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
