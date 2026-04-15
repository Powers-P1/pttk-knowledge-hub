import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useDarkMode from '../hooks/useDarkMode';
import { getMeta } from '../data/sourceOfTruth';
import { formatDate } from '../lib/utils';

const navLinks = [
  { to: '/', label: 'Start' },
  { to: '/odznaki', label: 'Odznaki' },
  { to: '/ksiazeczki', label: 'Książeczki' },
  { to: '/porownaj', label: 'Porównaj' },
  { to: '/pokrycie', label: 'Pokrycie' },
  { to: '/propozycje', label: 'Propozycje' },
  { to: '/zmiany', label: 'Zmiany' },
  { to: '/zrodla', label: 'Jakość źródeł' },
  { to: '/faq', label: 'FAQ' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useDarkMode();
  const meta = getMeta();

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-slate-900 focus:px-3 focus:py-2 focus:rounded-md focus:border focus:border-slate-200"
      >
        Przejdź do treści
      </a>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-800 hover:text-emerald-700 transition-colors">
              <span className="text-2xl">🧭</span>
              <span className="hidden sm:inline">Odznaki PTTK</span>
              <span className="sm:hidden">PTTK</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setDark(!dark)}
                className="ml-2 p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label={dark ? 'Tryb jasny' : 'Tryb ciemny'}
                title={dark ? 'Tryb jasny' : 'Tryb ciemny'}
              >
                {dark ? '☀️' : '🌙'}
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile nav */}
          {menuOpen && (
            <nav id="mobile-nav" className="md:hidden pb-4 border-t border-slate-100 pt-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { setDark(!dark); setMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              >
                {dark ? '☀️ Tryb jasny' : '🌙 Tryb ciemny'}
              </button>
            </nav>
          )}
        </div>
      </header>

      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>
              Dane na podstawie kanonicznego źródła prawdy v{meta.version} z {formatDate(meta.generated_at)}.
            </p>
            <p>
              To nie jest oficjalna strona PTTK. To niezależny przewodnik po systemie odznak.
            </p>
          </div>
          <div className="mt-4 flex justify-center sm:justify-end">
            <a
              href="https://buymeacoffee.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
              aria-label="Wesprzyj projekt - Buy Me a Coffee"
            >
              ☕ Wesprzyj projekt (Buy Me a Coffee)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
