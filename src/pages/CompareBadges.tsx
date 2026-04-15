import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getBadges, getBookletsForBadge } from '../data/sourceOfTruth';
import ConfidenceBadge from '../components/ConfidenceBadge';
import Pill from '../components/Pill';
import {
  disciplineIcons,
  disciplineLabels,
  formatBadgeName,
  liveStatusLabels,
  saleStatusLabels,
  formatDate,
  hasSourceConflict,
} from '../lib/utils';
import { downloadCsv, printCurrentPage } from '../lib/export';
import type { Badge } from '../types';

const MAX_COMPARE = 3;

export default function CompareBadges() {
  const allBadges = getBadges();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selected = useMemo(
    () => selectedIds.map(id => allBadges.find(b => b.id === id)!).filter(Boolean),
    [selectedIds, allBadges]
  );

  const toggle = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < MAX_COMPARE ? [...prev, id] : prev
    );
  };

  const exportComparisonCsv = () => {
    if (selected.length < 2) return;

    const rows: string[][] = [
      ['Pole', ...selected.map(b => `${b.official_name} (${b.abbreviation})`)],
      ['Status', ...selected.map(b => b.status)],
      ['Pewność źródła', ...selected.map(b => b.source_confidence)],
      ['Dyscyplina', ...selected.map(b => b.discipline)],
      ['Rodzina', ...selected.map(b => b.family)],
      ['Wiek', ...selected.map(b => b.age_rule_literal)],
      ['Stopnie', ...selected.map(b => b.levels.join('; '))],
      ['Książeczka wymagana', ...selected.map(b => (b.documentation.official_booklet_required ? 'Tak' : 'Nie'))],
      ['Własna dokumentacja', ...selected.map(b => (b.documentation.self_made_documentation_allowed ? 'Tak' : 'Nie'))],
      ['Wersja cyfrowa', ...selected.map(b => (b.documentation.digital_allowed ? 'Tak' : 'Nie'))],
      ['Kto potwierdza', ...selected.map(b => b.confirmation_body.join('; '))],
      ['Kto weryfikuje', ...selected.map(b => b.verification_body.join('; '))],
      ['Status sprzedaży', ...selected.map(b => b.sale_status)],
      ['Status live', ...selected.map(b => b.live_source_status)],
      ['Konflikt źródeł', ...selected.map(b => (hasSourceConflict(b) ? 'Tak' : 'Nie'))],
      ['Ostatnia weryfikacja', ...selected.map(b => b.last_verified_at)],
    ];

    downloadCsv('porownanie-odznak.csv', rows);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Porównaj odznaki</h1>
      <p className="text-sm text-slate-500 mb-6">
        Wybierz od 2 do {MAX_COMPARE} odznak, aby zobaczyć je obok siebie.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={exportComparisonCsv}
          disabled={selected.length < 2}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Eksportuj porównanie do CSV"
        >
          ⬇️ Eksport CSV
        </button>
        <button
          onClick={printCurrentPage}
          disabled={selected.length < 2}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Drukuj porównanie do PDF"
        >
          🖨️ Drukuj / PDF
        </button>
      </div>

      {/* Badge selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allBadges.map(badge => {
          const isSelected = selectedIds.includes(badge.id);
          return (
            <button
              key={badge.id}
              onClick={() => toggle(badge.id)}
              disabled={!isSelected && selectedIds.length >= MAX_COMPARE}
              aria-label={`Przełącz odznakę ${formatBadgeName(badge.official_name, badge.abbreviation)} do porównania`}
              aria-pressed={isSelected}
              title={formatBadgeName(badge.official_name, badge.abbreviation)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : selectedIds.length >= MAX_COMPARE
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
              }`}
            >
              {disciplineIcons[badge.discipline] || '📌'} {formatBadgeName(badge.official_name, badge.abbreviation)}
            </button>
          );
        })}
      </div>

      {selected.length < 2 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">⚖️</p>
          <p className="text-slate-500">Wybierz co najmniej 2 odznaki z powyższej listy.</p>
        </div>
      ) : (
        <ComparisonTable badges={selected} />
      )}
    </div>
  );
}

function ComparisonTable({ badges }: { badges: Badge[] }) {
  const cols = badges.length;
  const gridClass = cols === 2 ? 'grid-cols-[200px_1fr_1fr]' : 'grid-cols-[200px_1fr_1fr_1fr]';

  return (
    <div className="overflow-x-auto">
      <div className={`grid ${gridClass} gap-px bg-slate-200 rounded-xl overflow-hidden min-w-[600px]`}>
        {/* Header row */}
        <Cell header>&nbsp;</Cell>
        {badges.map(b => (
          <Cell key={b.id} header>
            <Link to={`/odznaki/${b.id}`} className="hover:text-emerald-600 transition-colors">
              <span className="text-xl block mb-1">{disciplineIcons[b.discipline] || '📌'}</span>
              <span className="font-bold text-sm">{formatBadgeName(b.official_name, b.abbreviation)}</span>
            </Link>
          </Cell>
        ))}

        {/* Pewność */}
        <Cell label>Pewność źródła</Cell>
        {badges.map(b => (
          <Cell key={b.id}><ConfidenceBadge confidence={b.source_confidence} /></Cell>
        ))}

        {/* Status */}
        <Cell label>Status</Cell>
        {badges.map(b => (
          <Cell key={b.id}>
            {b.status === 'active'
              ? <Pill label="Aktywna" variant="success" />
              : <Pill label="Status niepewny" variant="danger" />}
          </Cell>
        ))}

        {/* Dyscyplina */}
        <Cell label>Dyscyplina</Cell>
        {badges.map(b => (
          <Cell key={b.id}>{disciplineLabels[b.discipline] || b.discipline}</Cell>
        ))}

        {/* Rodzina */}
        <Cell label>Rodzina</Cell>
        {badges.map(b => <Cell key={b.id}>{b.family}</Cell>)}

        {/* Wiek */}
        <Cell label>Zasady wiekowe</Cell>
        {badges.map(b => <Cell key={b.id}>{b.age_rule_literal}</Cell>)}

        {/* Stopnie */}
        <Cell label>Stopnie</Cell>
        {badges.map(b => (
          <Cell key={b.id}>
            <div className="flex flex-wrap gap-1">
              {b.levels.map(l => <Pill key={l} label={l} />)}
            </div>
          </Cell>
        ))}

        {/* Książeczka wymagana */}
        <Cell label>Książeczka wymagana</Cell>
        {badges.map(b => (
          <Cell key={b.id}>
            {b.documentation.official_booklet_required
              ? <span className="text-amber-600 font-medium">Tak</span>
              : <span className="text-emerald-600 font-medium">Nie</span>}
          </Cell>
        ))}

        {/* Własna dokumentacja */}
        <Cell label>Własna dokumentacja</Cell>
        {badges.map(b => (
          <Cell key={b.id}>
            {b.documentation.self_made_documentation_allowed
              ? <span className="text-emerald-600 font-medium">Dopuszczalna</span>
              : <span className="text-slate-500">Niedopuszczalna</span>}
          </Cell>
        ))}

        {/* Cyfrowa */}
        <Cell label>Wersja cyfrowa</Cell>
        {badges.map(b => (
          <Cell key={b.id}>
            {b.documentation.digital_allowed
              ? <span className="text-emerald-600 font-medium">Tak</span>
              : <span className="text-slate-500">Nie/niepotwierdzona</span>}
          </Cell>
        ))}

        {/* Potwierdzenie */}
        <Cell label>Kto potwierdza</Cell>
        {badges.map(b => (
          <Cell key={b.id}>
            <ul className="text-xs space-y-0.5">
              {b.confirmation_body.map((c, i) => <li key={i}>• {c}</li>)}
            </ul>
          </Cell>
        ))}

        {/* Weryfikacja */}
        <Cell label>Kto weryfikuje</Cell>
        {badges.map(b => (
          <Cell key={b.id}>
            <ul className="text-xs space-y-0.5">
              {b.verification_body.map((v, i) => <li key={i}>• {v}</li>)}
            </ul>
          </Cell>
        ))}

        {/* Kanał zakupu */}
        <Cell label>Status sprzedaży</Cell>
        {badges.map(b => (
          <Cell key={b.id}>
            <span className="text-xs">{saleStatusLabels[b.sale_status] || b.sale_status}</span>
          </Cell>
        ))}

        {/* Książeczki */}
        <Cell label>Książeczki</Cell>
        {badges.map(b => {
          const booklets = getBookletsForBadge(b);
          return (
            <Cell key={b.id}>
              {booklets.length === 0
                ? <span className="text-xs text-slate-400">—</span>
                : booklets.map(bl => <div key={bl.id} className="text-xs">{bl.name}</div>)}
            </Cell>
          );
        })}

        {/* Konflikt źródeł */}
        <Cell label>Konflikt źródeł</Cell>
        {badges.map(b => (
          <Cell key={b.id}>
            {hasSourceConflict(b)
              ? <Pill label="Tak" variant="danger" />
              : <span className="text-xs text-slate-400">Brak</span>}
          </Cell>
        ))}

        {/* Status live */}
        <Cell label>Status live</Cell>
        {badges.map(b => (
          <Cell key={b.id}>
            <span className="text-xs">{liveStatusLabels[b.live_source_status] || b.live_source_status}</span>
          </Cell>
        ))}

        {/* Ostatnia weryfikacja */}
        <Cell label>Ostatnia weryfikacja</Cell>
        {badges.map(b => (
          <Cell key={b.id}>{formatDate(b.last_verified_at)}</Cell>
        ))}
      </div>
    </div>
  );
}

function Cell({ children, header, label }: { children: React.ReactNode; header?: boolean; label?: boolean }) {
  const base = 'p-3 text-sm';
  if (header) return <div className={`${base} bg-slate-50 text-center font-semibold text-slate-800`}>{children}</div>;
  if (label) return <div className={`${base} bg-slate-50 font-medium text-slate-600`}>{children}</div>;
  return <div className={`${base} bg-white text-slate-700`}>{children}</div>;
}
