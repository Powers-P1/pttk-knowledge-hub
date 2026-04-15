import type { Badge } from '../types';

interface Props {
  badge: Badge;
}

export default function SourceConflictBanner({ badge }: Props) {
  if (!badge.source_conflict_note) return null;

  const isOfficial = badge.source_conflict_scope === 'official';

  return (
    <div className={`rounded-lg border p-4 ${
      isOfficial
        ? 'bg-amber-50 border-amber-200'
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">{isOfficial ? '⚠️' : '🔴'}</span>
        <div>
          <h4 className={`font-semibold text-sm ${isOfficial ? 'text-amber-800' : 'text-red-800'}`}>
            {isOfficial ? 'Konflikt między wersjami oficjalnymi' : 'Konflikt źródeł wtórnych'}
          </h4>
          <p className={`text-sm mt-1 ${isOfficial ? 'text-amber-700' : 'text-red-700'}`}>
            {badge.source_conflict_note}
          </p>
        </div>
      </div>
    </div>
  );
}
