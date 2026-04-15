import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getBadges, getMeta } from '../data/sourceOfTruth';
import SearchBar from '../components/SearchBar';
import { disciplineIcons, formatBadgeName } from '../lib/utils';

const categoryCards = [
  { discipline: 'piesza', label: 'Piesze', desc: 'Odznaka Turystyki Pieszej (OTP), Siedmiomilowe Buty', icon: '🥾' },
  { discipline: 'górska', label: 'Górskie', desc: 'Górska Odznaka Turystyczna (GOT)', icon: '⛰️' },
  { discipline: 'krajoznawcza', label: 'Krajoznawcze', desc: 'Odznaka Krajoznawcza PTTK (ROK/OKP)', icon: '🏛️' },
  { discipline: 'przyrodnicza', label: 'Przyrodnicze', desc: 'Tropiciel Przyrody (TPR), Turysta Przyrodnik (TP)', icon: '🌿' },
  { discipline: 'motorowa', label: 'Motorowe', desc: 'Turysta Motorowy (TM), Motorowa Odznaka Turystyczna (MOT)', icon: '🚗' },
  { discipline: 'dziecięca wielodyscyplinarna', label: 'Dziecięce', desc: 'Dziecięca Odznaka Turystyczna (DOT)', icon: '👶' },
];

const chaosItems = [
  {
    title: '„Książeczka istnieje" ≠ „Książeczka jest wymagana"',
    text: 'Wiele odznak ma oficjalną książeczkę w sprzedaży, ale regulamin pozwala prowadzić dokumentację w dowolnej formie. Nie kupuj, zanim nie sprawdzisz.',
  },
  {
    title: 'Potwierdzenie ≠ Weryfikacja',
    text: 'Kto potwierdza Twoją wycieczkę w terenie to nie ta sama osoba, która formalnie przyznaje odznakę. To dwa różne kroki.',
  },
  {
    title: 'Oficjalny sklep ≠ Sprzedaż detaliczna',
    text: 'sklep.pttk.pl mówi, że nie sprzedaje indywidualnie… ale jednocześnie ma koszyk i ceny. Sklep COTG działa normalnie.',
  },
  {
    title: 'Stary PDF ≠ Aktualny regulamin',
    text: 'Oficjalne PDFy żyją latami w sieci. Regulamin Górskiej Odznaki Turystycznej (GOT) z 2023 nadal można pobrać, mimo że obowiązuje wersja od 01.01.2026.',
  },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const badges = getBadges();
  const meta = getMeta();
  const highConfCount = badges.filter(b => b.source_confidence === 'high').length;

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.length >= 2) {
      navigate(`/odznaki?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            System odznak PTTK
            <span className="block text-emerald-600 text-2xl sm:text-3xl lg:text-4xl mt-2">bez bólu głowy</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Jedno miejsce, w którym da się ogarnąć odznaki PTTK bez przekopywania 20 regulaminów
            i 15 stron oddziałów.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar value={search} onChange={handleSearch} />
          </div>
        </div>
      </section>

      {/* Quick categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-2">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Od czego zacząć?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryCards.map(cat => (
            <Link
              key={cat.discipline}
              to={`/odznaki?discipline=${encodeURIComponent(cat.discipline)}`}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all text-center group"
            >
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <h3 className="font-semibold text-sm text-slate-700 group-hover:text-emerald-700">{cat.label}</h3>
              <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended start */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-12">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Polecany start</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {badges
            .filter(b => b.source_confidence === 'high' && ['dot', 'otp', 'got'].includes(b.id))
            .map(badge => (
              <Link
                key={badge.id}
                to={`/odznaki/${badge.id}`}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{disciplineIcons[badge.discipline]}</span>
                  <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700">{formatBadgeName(badge.official_name, badge.abbreviation)}</h3>
                </div>
                <p className="text-sm text-slate-600">{badge.age_rule_literal}</p>
                <div className="text-xs text-emerald-600 mt-3 font-medium">Zobacz szczegóły →</div>
              </Link>
            ))
          }
        </div>
      </section>

      {/* Most common chaos */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-12">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Najczęściej mylone rzeczy</h2>
        <p className="text-sm text-slate-500 mb-4">
          System odznak PTTK ma swoje pułapki. Oto najważniejsze rozróżnienia, które ludzie regularnie mylą.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {chaosItems.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-sm text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data confidence section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 mb-16">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Na ile te dane są pewne?</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{highConfCount}/{badges.length}</div>
              <p className="text-sm text-slate-600 mt-1">rekordów z pewnością „high"</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-700">v{meta.version}</div>
              <p className="text-sm text-slate-600 mt-1">wersja kanonicznego źródła</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-700">{meta.generated_at}</div>
              <p className="text-sm text-slate-600 mt-1">data ostatniego przeglądu</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link to="/zrodla" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              Dowiedz się więcej o jakości źródeł →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
