import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBadges } from '../data/sourceOfTruth';
import BadgeCard from '../components/BadgeCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { categoryLabels, getCategories, getScopes, scopeLabels } from '../lib/utils';
import { type FilterState, type SortKey, defaultFilters, filterBadges, sortBadges } from '../lib/search';

export default function BadgeExplorer() {
  const [searchParams] = useSearchParams();
  const allBadges = getBadges();

  const initialFilters: FilterState = {
    ...defaultFilters,
    search: searchParams.get('q') || '',
    discipline: searchParams.get('discipline') || null,
    category: searchParams.get('category') || null,
    subcategory: searchParams.get('subcategory') || null,
    scope: searchParams.get('scope') || null,
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [showFilters, setShowFilters] = useState(false);
  const categories = getCategories(allBadges);
  const scopes = getScopes(allBadges);

  const results = useMemo(
    () => sortBadges(filterBadges(allBadges, filters), sortKey),
    [allBadges, filters, sortKey]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Katalog odznak PTTK</h1>
        <p className="text-sm text-slate-500">
          {allBadges.length} odznak w bazie · dane kanoniczne z 14.04.2026
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="lg:w-64 shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 mb-4"
          >
            {showFilters ? 'Ukryj filtry' : 'Pokaż filtry'}
          </button>
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <FilterPanel
              badges={allBadges}
              filters={filters}
              onFilterChange={setFilters}
              sortKey={sortKey}
              onSortChange={setSortKey}
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4">
            <SearchBar
              value={filters.search}
              onChange={(search) => setFilters(f => ({ ...f, search }))}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilters(f => ({ ...f, category: null }))}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                filters.category === null
                  ? 'bg-slate-700 text-white border-slate-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              Wszystkie kategorie
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilters(f => ({ ...f, category }))}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  filters.category === category
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilters(f => ({ ...f, scope: null }))}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                filters.scope === null
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}
            >
              Wszystkie zakresy
            </button>
            {scopes.map(scope => (
              <button
                key={scope}
                onClick={() => setFilters(f => ({ ...f, scope }))}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  filters.scope === scope
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {scopeLabels[scope]}
              </button>
            ))}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-slate-500">Nic nie znaleziono. Spróbuj zmienić filtry lub frazę wyszukiwania.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400 mb-3">
                {results.length} {results.length === 1 ? 'wynik' : results.length < 5 ? 'wyniki' : 'wyników'}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {results.map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
