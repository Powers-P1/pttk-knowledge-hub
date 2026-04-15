import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { getBadgeById, getBookletsForBadge, getShops } from '../data/sourceOfTruth';
import ConfidenceBadge from '../components/ConfidenceBadge';
import Pill from '../components/Pill';
import SourceConflictBanner from '../components/SourceConflictBanner';
import {
  disciplineIcons,
  disciplineLabels,
  expandBadgeAbbreviations,
  formatBadgeName,
  liveStatusLabels,
  saleStatusLabels,
  confidenceConfig,
  formatDate,
} from '../lib/utils';
import { downloadCsv, printCurrentPage } from '../lib/export';

export default function BadgeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const badge = getBadgeById(id || '');
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/odznaki/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const exportBadgeCsv = () => {
    if (!badge) return;
    const rows: string[][] = [
      ['Pole', 'Wartość'],
      ['ID', badge.id],
      ['Nazwa', badge.official_name],
      ['Skrót', badge.abbreviation],
      ['Dyscyplina', badge.discipline],
      ['Rodzina', badge.family],
      ['Status', badge.status],
      ['Pewność źródła', badge.source_confidence],
      ['Status live', badge.live_source_status],
      ['Wiek', expandBadgeAbbreviations(badge.age_rule_literal)],
      ['Stopnie', badge.levels.join('; ')],
      ['Dokumentacja wymagana', badge.documentation.required ? 'Tak' : 'Nie'],
      ['Książeczka dostępna', badge.documentation.official_booklet_available ? 'Tak' : 'Nie'],
      ['Książeczka wymagana', badge.documentation.official_booklet_required ? 'Tak' : 'Nie'],
      ['Własna dokumentacja', badge.documentation.self_made_documentation_allowed ? 'Tak' : 'Nie'],
      ['Wersja cyfrowa', badge.documentation.digital_allowed ? 'Tak' : 'Nie'],
      ['Potwierdzenie', badge.confirmation_body.join('; ')],
      ['Weryfikacja', badge.verification_body.join('; ')],
      ['Status sprzedaży', badge.sale_status],
      ['Uwagi źródłowe', badge.source_notes.join('; ')],
      ['Primary sources', badge.primary_sources.join('; ')],
      ['Secondary sources', (badge.secondary_sources ?? []).join('; ')],
      ['Legacy sources', (badge.legacy_or_stale_sources ?? []).join('; ')],
      ['Ostatnia weryfikacja', badge.last_verified_at],
    ];
    downloadCsv(`odznaka-${badge.id}.csv`, rows);
  };

  if (!badge) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-4xl mb-4">😕</p>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Nie znaleziono odznaki</h1>
        <p className="text-slate-500 mb-4">Rekord o ID „{id}" nie istnieje w bazie.</p>
        <Link to="/odznaki" className="text-emerald-600 hover:text-emerald-700 font-medium">
          ← Wróć do katalogu
        </Link>
      </div>
    );
  }

  const booklets = getBookletsForBadge(badge);
  const shops = getShops();
  const icon = disciplineIcons[badge.discipline] || '📌';
  const confConfig = confidenceConfig[badge.source_confidence];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb + copy link */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <nav className="text-sm text-slate-500">
          <Link to="/odznaki" className="hover:text-emerald-600 transition-colors">Odznaki</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{formatBadgeName(badge.official_name, badge.abbreviation)}</span>
        </nav>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={copyLink}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
            title="Kopiuj deep link do odznaki"
            aria-label="Kopiuj link do tej odznaki"
          >
            {copied ? '✓ Skopiowano!' : '🔗 Kopiuj link'}
          </button>
          <button
            onClick={exportBadgeCsv}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
            aria-label="Eksportuj dane odznaki do CSV"
          >
            ⬇️ CSV
          </button>
          <button
            onClick={printCurrentPage}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
            aria-label="Drukuj stronę odznaki do PDF"
          >
            🖨️ PDF
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 mb-6">
        <span className="text-4xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{formatBadgeName(badge.official_name, badge.abbreviation)}</h1>
          <p className="text-slate-500 mt-1">
            {disciplineLabels[badge.discipline] || badge.discipline} · {badge.family}
          </p>
        </div>
        <ConfidenceBadge confidence={badge.source_confidence} size="md" />
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {badge.status === 'active' ? (
          <Pill label="Aktywna" variant="success" />
        ) : (
          <Pill label="Status niepewny" variant="danger" />
        )}
        <Pill label={liveStatusLabels[badge.live_source_status] || badge.live_source_status} variant="info" />
        {badge.documentation.official_booklet_required && <Pill label="Wymaga książeczki" variant="warning" />}
        {badge.documentation.self_made_documentation_allowed && <Pill label="Dopuszcza własną kronikę" variant="success" />}
        {badge.review_needed && <Pill label="Wymaga reweryfikacji" variant="danger" />}
        {badge.source_conflict_note && <Pill label="Konflikt źródeł" variant="warning" />}
      </div>

      {/* Source conflict banner */}
      <SourceConflictBanner badge={badge} />

      {/* Main content grid */}
      <div className="mt-8 space-y-6">

        {/* Dla kogo? */}
        <Section title="Dla kogo?" icon="👤">
          <InfoRow label="Wiek">{expandBadgeAbbreviations(badge.age_rule_literal)}</InfoRow>
          <InfoRow label="Stopnie">
            <div className="flex flex-wrap gap-1.5">
              {badge.levels.map(level => (
                <Pill key={level} label={level} />
              ))}
            </div>
          </InfoRow>
          {badge.current_regulation_effective_from && (
            <InfoRow label="Regulamin obowiązuje od">
              {formatDate(badge.current_regulation_effective_from)}
            </InfoRow>
          )}
        </Section>

        {/* Jak dokumentować? */}
        <Section title="Jak dokumentować?" icon="📝">
          <InfoRow label="Dokumentacja wymagana">
            {badge.documentation.required ? 'Tak' : 'Nie'}
          </InfoRow>
          <InfoRow label="Oficjalna książeczka dostępna">
            {badge.documentation.official_booklet_available ? (
              <span className="text-emerald-600 font-medium">Tak</span>
            ) : (
              <span className="text-slate-500">Nie istnieje</span>
            )}
          </InfoRow>
          <InfoRow label="Oficjalna książeczka wymagana">
            {badge.documentation.official_booklet_required ? (
              <span className="text-amber-600 font-medium">
                Tak
                {badge.documentation.official_booklet_required_scope && (
                  <span className="text-slate-500 font-normal ml-1">
                    — {expandBadgeAbbreviations(badge.documentation.official_booklet_required_scope)}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-emerald-600 font-medium">Nie — to nie jest warunek startu</span>
            )}
          </InfoRow>
          <InfoRow label="Własna dokumentacja">
            {badge.documentation.self_made_documentation_allowed ? (
              <span className="text-emerald-600 font-medium">
                Dopuszczalna
                {badge.documentation.self_made_documentation_allowed_scope && (
                  <span className="text-slate-500 font-normal ml-1">
                    — {expandBadgeAbbreviations(badge.documentation.self_made_documentation_allowed_scope)}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-slate-500">Niedopuszczalna – tylko oficjalne druki</span>
            )}
          </InfoRow>
          {badge.documentation.digital_allowed !== undefined && (
            <InfoRow label="Wersja cyfrowa">
              {badge.documentation.digital_allowed ? (
                <span className="text-emerald-600 font-medium">
                  Tak
                  {badge.documentation.digital_constraints && (
                    <span className="text-slate-500 font-normal ml-1">
                      — {expandBadgeAbbreviations(badge.documentation.digital_constraints)}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-slate-500">
                  Nie potwierdzona
                  {badge.documentation.digital_constraints && (
                    <span className="ml-1">— {expandBadgeAbbreviations(badge.documentation.digital_constraints)}</span>
                  )}
                </span>
              )}
            </InfoRow>
          )}
          {badge.documentation.documentation_mode && (
            <InfoRow label="Tryb dokumentacji">
              {badge.documentation.documentation_mode === 'official_booklet_or_official_printable_template'
                ? 'oficjalna książeczka lub oficjalny szablon do wydruku'
                : badge.documentation.documentation_mode.replace(/_/g, ' ')}
            </InfoRow>
          )}

          {/* Per-level documentation */}
          {badge.documentation.documentation_by_level && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Dokumentacja per stopień</h4>
              <div className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/50">
                      <th className="text-left px-3 py-2 font-medium text-slate-600">Stopień</th>
                      <th className="text-center px-3 py-2 font-medium text-slate-600">Książeczka</th>
                      <th className="text-center px-3 py-2 font-medium text-slate-600">Własna dok.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(badge.documentation.documentation_by_level).map(([level, info]) => (
                      <tr key={level} className="border-b border-slate-100 last:border-0">
                        <td className="px-3 py-2 text-slate-700">{level}</td>
                        <td className="px-3 py-2 text-center">
                          {info.official_booklet_required
                            ? <span className="text-amber-600">Wymagana</span>
                            : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {info.self_made_documentation_allowed
                            ? <span className="text-emerald-600">Tak</span>
                            : <span className="text-slate-400">Nie</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Section>

        {/* Kto potwierdza? */}
        <Section title="Kto potwierdza wycieczkę?" icon="✅">
          <ul className="space-y-1">
            {badge.confirmation_body.map((body, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                {expandBadgeAbbreviations(body)}
              </li>
            ))}
          </ul>
        </Section>

        {/* Kto weryfikuje? */}
        <Section title="Kto weryfikuje odznakę?" icon="🏅">
          <ul className="space-y-1">
            {badge.verification_body.map((body, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-slate-400 mt-0.5">•</span>
                {expandBadgeAbbreviations(body)}
              </li>
            ))}
          </ul>

          {badge.verification_by_level && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Weryfikacja per stopień</h4>
              <div className="bg-slate-50 rounded-lg border border-slate-100 p-3 space-y-2">
                {Object.entries(badge.verification_by_level).map(([level, bodies]) => (
                  <div key={level} className="text-sm">
                    <span className="font-medium text-slate-600">{level}:</span>{' '}
                    <span className="text-slate-700">{bodies.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Książeczki */}
        {booklets.length > 0 && (
          <Section title="Czy trzeba kupić książeczkę?" icon="📕">
            <div className="space-y-3">
              {booklets.map(booklet => (
                <div key={booklet.id} className="bg-slate-50 rounded-lg border border-slate-100 p-4">
                  <h4 className="font-semibold text-sm text-slate-800 mb-2">{booklet.name}</h4>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>
                      Dostępna:{' '}
                      <span className={booklet.official_booklet_available ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                        {booklet.official_booklet_available ? 'Tak' : 'Nie'}
                      </span>
                    </p>
                    <p>
                      Wymagana:{' '}
                      <span className={booklet.official_booklet_required ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}>
                        {booklet.official_booklet_required ? 'Tak' : 'Nie'}
                      </span>
                    </p>
                    <p>
                      Własna dokumentacja:{' '}
                      <span className={booklet.self_made_documentation_allowed ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                        {booklet.self_made_documentation_allowed ? 'Dopuszczalna' : 'Niedopuszczalna'}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-2 italic">{booklet.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Kanał zakupu */}
        <Section title="Kanał zakupu" icon="🛒">
          <InfoRow label="Status sprzedaży">
            {saleStatusLabels[badge.sale_status] || badge.sale_status}
          </InfoRow>
          <div className="mt-3 space-y-2">
            {shops.map(shop => (
              <div key={shop.id} className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{shop.official_name}</h4>
                    <p className="text-xs text-slate-500">{shop.evidence_summary}</p>
                  </div>
                  <ConfidenceBadge confidence={shop.source_confidence} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Pewność źródła */}
        <Section title="Na ile to jest pewne?" icon="🔍">
          <div className={`rounded-lg border p-4 ${confConfig.bg} ${confConfig.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <ConfidenceBadge confidence={badge.source_confidence} size="md" />
              <span className="text-sm font-medium text-slate-700">
                {confConfig.description}
              </span>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <InfoRow label="Status live">
                {liveStatusLabels[badge.live_source_status] || badge.live_source_status}
              </InfoRow>
              <InfoRow label="Ostatnia weryfikacja">
                {formatDate(badge.last_verified_at)}
              </InfoRow>
              {badge.review_needed && (
                <p className="text-red-600 font-medium mt-2">
                  ⚠️ Ten rekord wymaga ręcznej reweryfikacji.
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* Źródła */}
        <Section title="Źródła i konflikty" icon="📚">
          {badge.primary_sources.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                Źródła pierwszego poziomu (tier 1)
              </h4>
              <SourceList sources={badge.primary_sources} tier="primary" />
            </div>
          )}
          {badge.primary_sources.length === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">
                ⚠️ Brak źródła pierwszego poziomu. Ten rekord opiera się wyłącznie na źródłach wtórnych.
              </p>
            </div>
          )}
          {badge.secondary_sources && badge.secondary_sources.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                Źródła wtórne (tier 3)
              </h4>
              <SourceList sources={badge.secondary_sources} tier="secondary" />
            </div>
          )}
          {badge.legacy_or_stale_sources && badge.legacy_or_stale_sources.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                Przestarzałe / archiwalne
              </h4>
              <SourceList sources={badge.legacy_or_stale_sources} tier="legacy" />
            </div>
          )}
          {badge.source_notes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Uwagi redakcyjne</h4>
              <ul className="space-y-1">
                {badge.source_notes.map((note, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5 shrink-0">ℹ️</span>
                    {expandBadgeAbbreviations(note)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

      </div>

      {/* Navigation */}
      <div className="mt-12 pt-6 border-t border-slate-200">
        <Link to="/odznaki" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          ← Wróć do katalogu odznak
        </Link>
      </div>
    </div>
  );
}

// Helper components

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
        <span>{icon}</span> {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-1.5">
      <span className="text-sm font-medium text-slate-500 sm:w-52 shrink-0">{label}</span>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

function SourceList({ sources, tier }: { sources: string[]; tier: 'primary' | 'secondary' | 'legacy' }) {
  const colors = {
    primary: 'border-emerald-200 bg-emerald-50/50',
    secondary: 'border-slate-200 bg-slate-50',
    legacy: 'border-amber-200 bg-amber-50/50',
  };
  const labels = {
    primary: '🟢',
    secondary: '🔵',
    legacy: '🟡',
  };

  return (
    <div className={`rounded-lg border p-3 ${colors[tier]}`}>
      <ul className="space-y-1">
        {sources.map((src, i) => (
          <li key={i} className="text-sm text-slate-600 flex items-start gap-2 break-all">
            <span className="shrink-0">{labels[tier]}</span>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 underline decoration-emerald-300 underline-offset-2"
            >
              {src}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
