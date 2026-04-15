import { useState } from 'react';
import { sourceOfTruth } from '../data/sourceOfTruth';

const FLAG_KEY = 'pttk-debug';

export function isDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(FLAG_KEY) === 'true' ||
    new URLSearchParams(window.location.hash.split('?')[1] || '').get('debug') === '1';
}

export function toggleDebug() {
  const current = localStorage.getItem(FLAG_KEY) === 'true';
  localStorage.setItem(FLAG_KEY, String(!current));
  window.location.reload();
}

export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'raw' | 'meta' | 'rules' | 'stats'>('meta');

  if (!isDebugEnabled()) return null;

  const data = sourceOfTruth;
  const badges = data.badges;

  const stats = {
    total: badges.length,
    active: badges.filter(b => b.status === 'active').length,
    disputed: badges.filter(b => b.status !== 'active').length,
    high: badges.filter(b => b.source_confidence === 'high').length,
    medium: badges.filter(b => b.source_confidence === 'medium').length,
    low: badges.filter(b => b.source_confidence === 'low_to_medium').length,
    conflicts: badges.filter(b => b.source_conflict_note).length,
    reviewNeeded: badges.filter(b => b.review_needed).length,
    withPrimary: badges.filter(b => b.primary_sources.length > 0).length,
    withSecondary: badges.filter(b => b.secondary_sources && b.secondary_sources.length > 0).length,
    withLegacy: badges.filter(b => b.legacy_or_stale_sources && b.legacy_or_stale_sources.length > 0).length,
    booklets: data.booklets.length,
    shops: data.shops.length,
    warnings: data.cross_record_warnings.length,
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg hover:bg-slate-800 transition-colors"
        >
          🐛 Debug
        </button>
      )}

      {open && (
        <div className="bg-slate-900 text-slate-100 rounded-xl shadow-2xl w-96 max-h-[70vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <span className="text-sm font-bold font-mono">🐛 Inspektor danych</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleDebug()}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Wyłącz debug
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700 text-xs">
            {(['meta', 'stats', 'rules', 'raw'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 px-3 py-2 transition-colors ${
                  tab === t ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'meta' ? 'Meta' : t === 'stats' ? 'Statystyki' : t === 'rules' ? 'Reguły' : 'Surowe dane'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 text-xs font-mono">
            {tab === 'meta' && (
              <div className="space-y-2">
                <Row label="Typ" value={data.meta.document_type} />
                <Row label="Wersja" value={data.meta.version} />
                <Row label="Wygenerowano" value={data.meta.generated_at} />
                <Row label="Strefa" value={data.meta.timezone} />
                <Row label="Polityka" value={data.meta.editorial_policy} />
                <div className="mt-3">
                  <span className="text-slate-400">Notatki:</span>
                  <ul className="mt-1 space-y-1">
                    {data.meta.notes.map((n, i) => (
                      <li key={i} className="text-slate-300 pl-2 border-l border-slate-700">{n}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === 'stats' && (
              <div className="space-y-1.5">
                <Row label="Odznaki ogółem" value={stats.total} />
                <Row label="Aktywne" value={stats.active} />
                <Row label="Sporne" value={stats.disputed} />
                <hr className="border-slate-700 my-2" />
                <Row label="Pewność: high" value={stats.high} />
                <Row label="Pewność: medium" value={stats.medium} />
                <Row label="Pewność: low_to_medium" value={stats.low} />
                <hr className="border-slate-700 my-2" />
                <Row label="Konflikty źródeł" value={stats.conflicts} />
                <Row label="Wymaga reweryfikacji" value={stats.reviewNeeded} />
                <Row label="Ze źródłami tier 1" value={stats.withPrimary} />
                <Row label="Ze źródłami wtórnymi" value={stats.withSecondary} />
                <Row label="Ze starymi źródłami" value={stats.withLegacy} />
                <hr className="border-slate-700 my-2" />
                <Row label="Książeczki" value={stats.booklets} />
                <Row label="Sklepy" value={stats.shops} />
                <Row label="Ostrzeżenia systemowe" value={stats.warnings} />
              </div>
            )}

            {tab === 'rules' && (
              <div className="space-y-1.5">
                {data.repo_rules.map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-300">{r.rule}</span>
                    <span className={r.value ? 'text-emerald-400' : 'text-red-400'}>
                      {r.value ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
                <hr className="border-slate-700 my-2" />
                <h4 className="text-slate-400 mt-2">Poziomy źródeł:</h4>
                {data.source_tiers.map(t => (
                  <div key={t.tier} className="mt-1">
                    <span className="text-emerald-400">Tier {t.tier}</span>
                    <span className="text-slate-400 ml-2">{t.name}</span>
                    <div className="text-slate-500 pl-4">{t.domains.join(', ')}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'raw' && (
              <pre className="whitespace-pre-wrap text-[10px] leading-relaxed text-slate-300 max-h-[50vh] overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 font-semibold">{value}</span>
    </div>
  );
}
