import { Link } from 'react-router-dom';
import type { Badge } from '../types';
import ConfidenceBadge from './ConfidenceBadge';
import Pill from './Pill';
import { categoryLabels, disciplineIcons, disciplineLabels, formatBadgeName, hasSourceConflict, scopeLabels, subcategoryLabels } from '../lib/utils';

interface Props {
  badge: Badge;
}

export default function BadgeCard({ badge }: Props) {
  const icon = disciplineIcons[badge.discipline] || '📌';
  const disciplineLabel = disciplineLabels[badge.discipline] || badge.discipline;

  return (
    <Link
      to={`/odznaki/${badge.id}`}
      className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-hidden>{icon}</span>
          <div>
            <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight">
              {formatBadgeName(badge.official_name, badge.abbreviation)}
            </h3>
          </div>
        </div>
        <ConfidenceBadge confidence={badge.source_confidence} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Pill label={disciplineLabel} variant="info" />
        <Pill label={categoryLabels[badge.category]} />
        <Pill label={subcategoryLabels[badge.subcategory]} />
        <Pill label={badge.family} />
        <Pill label={scopeLabels[badge.scope]} />
        {badge.status === 'active' ? (
          <Pill label="Aktywna" variant="success" />
        ) : (
          <Pill label="Status niepewny" variant="danger" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
        <div>
          {badge.documentation.official_booklet_required ? (
            <span className="flex items-center gap-1">
              <span className="text-amber-500">📕</span> Wymaga książeczki
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="text-slate-400">📓</span> Książeczka opcjonalna
            </span>
          )}
        </div>
        <div>
          {badge.documentation.self_made_documentation_allowed ? (
            <span className="flex items-center gap-1">
              <span className="text-emerald-500">✏️</span> Własna kronika OK
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="text-slate-400">✏️</span> Tylko oficjalne druki
            </span>
          )}
        </div>
      </div>

      {hasSourceConflict(badge) && (
        <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 rounded-md px-2 py-1 mb-2">
          ⚠️ Źródła gryzą się między sobą
        </div>
      )}

      {badge.review_needed && (
        <div className="flex items-center gap-1 text-xs text-red-700 bg-red-50 rounded-md px-2 py-1 mb-2">
          🔍 Wymaga reweryfikacji
        </div>
      )}

      <div className="text-xs text-slate-400 mt-auto">
        {badge.levels.length} {badge.levels.length === 1 ? 'stopień' : badge.levels.length < 5 ? 'stopnie' : 'stopni'}
        {' · '}
        Sprawdzono {badge.last_verified_at}
      </div>
    </Link>
  );
}
