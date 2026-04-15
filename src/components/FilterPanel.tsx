import type { Badge, SourceConfidence } from '../types';
import type { FilterState, SortKey } from '../lib/search';
import { categoryLabels, getCategories, getDisciplines, getFamilies, getScopes, getSubcategories, scopeLabels, subcategoryLabels } from '../lib/utils';

interface Props {
  badges: Badge[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
}

export default function FilterPanel({ badges, filters, onFilterChange, sortKey, onSortChange }: Props) {
  const disciplines = getDisciplines(badges);
  const families = getFamilies(badges);
  const categories = getCategories(badges);
  const subcategories = getSubcategories(badges);
  const scopes = getScopes(badges);

  const update = (partial: Partial<FilterState>) =>
    onFilterChange({ ...filters, ...partial });

  const activeCount = [
    filters.discipline,
    filters.family,
    filters.category,
    filters.subcategory,
    filters.scope,
    filters.status,
    filters.sourceConfidence,
    filters.officialBookletRequired,
    filters.selfMadeAllowed,
    filters.reviewNeeded,
    filters.hasSourceConflict,
  ].filter(v => v !== null).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-slate-700">
          Filtry
          {activeCount > 0 && (
            <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={() => onFilterChange({
              ...filters,
              discipline: null, family: null, status: null,
              category: null, subcategory: null,
              scope: null,
              sourceConfidence: null, officialBookletRequired: null,
              selfMadeAllowed: null, reviewNeeded: null, hasSourceConflict: null,
            })}
            className="text-xs text-slate-500 hover:text-red-600 transition-colors"
          >
            Wyczyść filtry
          </button>
        )}
      </div>

      <div className="space-y-3">
        <FilterSelect
          label="Dyscyplina"
          value={filters.discipline}
          onChange={(v) => update({ discipline: v })}
          options={disciplines.map(d => ({ value: d, label: d }))}
        />

        <FilterSelect
          label="Rodzina"
          value={filters.family}
          onChange={(v) => update({ family: v })}
          options={families.map(f => ({ value: f, label: f }))}
        />

        <FilterSelect
          label="Kategoria"
          value={filters.category}
          onChange={(v) => update({ category: v })}
          options={categories.map(c => ({ value: c, label: categoryLabels[c] }))}
        />

        <FilterSelect
          label="Podkategoria"
          value={filters.subcategory}
          onChange={(v) => update({ subcategory: v })}
          options={subcategories.map(s => ({ value: s, label: subcategoryLabels[s] }))}
        />

        <FilterSelect
          label="Zakres odznaki"
          value={filters.scope}
          onChange={(v) => update({ scope: v })}
          options={scopes.map(s => ({ value: s, label: scopeLabels[s] }))}
        />

        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(v) => update({ status: v })}
          options={[
            { value: 'active', label: 'Aktywna' },
            { value: 'uncertain_secondary_conflict', label: 'Status niepewny' },
          ]}
        />

        <FilterSelect
          label="Pewność źródła"
          value={filters.sourceConfidence}
          onChange={(v) => update({ sourceConfidence: v as SourceConfidence | null })}
          options={[
            { value: 'high', label: '🟢 Pewne' },
            { value: 'medium', label: '🟡 Ostrożnie' },
            { value: 'low_to_medium', label: '🔴 Sporne' },
          ]}
        />

        <FilterToggle
          label="📕 Wymaga oficjalnej książeczki"
          value={filters.officialBookletRequired}
          onChange={(v) => update({ officialBookletRequired: v })}
        />

        <FilterToggle
          label="✏️ Dopuszcza własną kronikę"
          value={filters.selfMadeAllowed}
          onChange={(v) => update({ selfMadeAllowed: v })}
        />

        <FilterToggle
          label="⚠️ Konflikt źródeł"
          value={filters.hasSourceConflict}
          onChange={(v) => update({ hasSourceConflict: v })}
        />

        <FilterToggle
          label="🔍 Wymaga reweryfikacji"
          value={filters.reviewNeeded}
          onChange={(v) => update({ reviewNeeded: v })}
        />
      </div>

      <hr className="my-4 border-slate-100" />

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Sortowanie</label>
        <select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="name">Alfabetycznie</option>
          <option value="confidence">Pewność źródła ↓</option>
          <option value="verified">Data weryfikacji ↓</option>
          <option value="primary_first">Stabilne źródło pierwsze</option>
        </select>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="">Wszystkie</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function FilterToggle({ label, value, onChange }: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean | null) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          if (value === null) onChange(true);
          else if (value === true) onChange(false);
          else onChange(null);
        }}
        className={`w-5 h-5 rounded border flex items-center justify-center text-xs transition-colors ${
          value === true
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : value === false
            ? 'bg-red-100 border-red-300 text-red-600'
            : 'bg-white border-slate-300 text-transparent'
        }`}
        aria-label={label}
      >
        {value === true ? '✓' : value === false ? '✗' : ''}
      </button>
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  );
}
