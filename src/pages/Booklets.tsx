import { Link } from 'react-router-dom';
import { getBooklets, getBadges } from '../data/sourceOfTruth';
import Pill from '../components/Pill';
import { formatBadgeName } from '../lib/utils';

export default function Booklets() {
  const booklets = getBooklets();
  const badges = getBadges();

  function findBadgesByBooklet(usedBy: string[]) {
    return badges.filter(b =>
      usedBy.some(name =>
        b.abbreviation === name ||
        b.official_name === name ||
        b.official_name.includes(name)
      )
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Książeczki PTTK</h1>
      <p className="text-sm text-slate-500 mb-8">
        Nie każda odznaka wymaga oficjalnej książeczki. Nie każda książeczka, która istnieje w sklepie,
        jest warunkiem startu. Poniżej zestawienie wszystkich książeczek z bazy danych.
      </p>

      {/* Key insight banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-amber-800 mb-2">
          ⚠️ Najważniejsza zasada: „istnieje" ≠ „jest wymagana"
        </h2>
        <p className="text-sm text-amber-700">
          To, że oficjalna książeczka jest dostępna w sklepie, nie oznacza, że musisz ją kupić przed
          startem. Sprawdź kolumnę „Wymagana" — wiele odznak akceptuje własną kronikę lub notes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {booklets.map(booklet => {
          const relatedBadges = findBadgesByBooklet(booklet.used_by);

          return (
            <div key={booklet.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3">{booklet.name}</h3>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Dostępna:</span>
                  {booklet.official_booklet_available ? (
                    <Pill label="Tak" variant="success" />
                  ) : (
                    <Pill label="Nie" variant="default" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Wymagana:</span>
                  {booklet.official_booklet_required ? (
                    <Pill label="Tak — obowiązkowa" variant="warning" />
                  ) : (
                    <Pill label="Nie — opcjonalna" variant="success" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Własna dok.:</span>
                  {booklet.self_made_documentation_allowed ? (
                    <Pill label="Dopuszczalna" variant="success" />
                  ) : (
                    <Pill label="Niedopuszczalna" variant="danger" />
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 italic mb-4">{booklet.notes}</p>

              {relatedBadges.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-slate-500">Używana do:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {relatedBadges.map(badge => (
                      <Link
                        key={badge.id}
                        to={`/odznaki/${badge.id}`}
                        className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full hover:bg-emerald-100 transition-colors"
                      >
                        {formatBadgeName(badge.official_name, badge.abbreviation)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {booklet.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-500">Źródło:</span>
                  {booklet.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-emerald-600 hover:text-emerald-700 truncate mt-0.5"
                    >
                      {src}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
