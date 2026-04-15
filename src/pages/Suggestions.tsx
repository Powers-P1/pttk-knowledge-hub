import { useEffect, useMemo, useState } from 'react';
import type { SuggestionDecision, SuggestionKind, SuggestionRecord } from '../types/suggestions';
import { createSuggestion, decideSuggestion, listSuggestions } from '../lib/suggestionsApi';
import { isAdminLoggedIn, loginAdmin, logoutAdmin } from '../lib/adminAuth';

const kindOptions: Array<{ value: SuggestionKind; label: string }> = [
  { value: 'odznaka', label: 'Odznaka' },
  { value: 'ksiazeczka', label: 'Książeczka' },
  { value: 'regulamin', label: 'Regulamin / zasady' },
  { value: 'zrodlo', label: 'Źródło / link' },
  { value: 'inne', label: 'Inne' },
];

const decisionLabels: Record<SuggestionDecision, string> = {
  pending: 'Oczekuje',
  accepted: 'Zaakceptowana',
  rejected: 'Odrzucona',
  modified: 'Zmodyfikowana',
};

const decisionPill: Record<SuggestionDecision, string> = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  modified: 'bg-sky-100 text-sky-700',
};

export default function Suggestions() {
  const [records, setRecords] = useState<SuggestionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kind, setKind] = useState<SuggestionKind>('odznaka');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [contact, setContact] = useState('');
  const [msg, setMsg] = useState('');
  const [adminLogged, setAdminLogged] = useState<boolean>(() => isAdminLoggedIn());
  const [adminPassword, setAdminPassword] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await listSuggestions();
        if (!cancelled) {
          setRecords(data);
        }
      } catch (err) {
        if (!cancelled) {
          setMsg(err instanceof Error ? err.message : 'Nie udało się pobrać propozycji.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter(r => r.decision === 'pending').length;
    return { total, pending };
  }, [records]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) {
      setMsg('Uzupełnij tytuł i opis propozycji.');
      return;
    }

    try {
      await createSuggestion({
        kind,
        title: title.trim(),
        details: details.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
        contact: contact.trim() || undefined,
      });

      setRecords(await listSuggestions());
      setTitle('');
      setDetails('');
      setSourceUrl('');
      setContact('');
      setMsg('Dziękujemy. Propozycja została zapisana i czeka na decyzję admina.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Nie udało się zapisać propozycji.');
    }
  };

  const updateDecision = async (id: string, decision: SuggestionDecision, adminNote: string) => {
    try {
      const next = await decideSuggestion(id, decision, adminNote);
      setRecords(next);
      setAdminMsg('Status propozycji został zaktualizowany.');
    } catch (err) {
      setAdminMsg(err instanceof Error ? err.message : 'Nie udało się zapisać decyzji.');
    }
  };

  const onAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(adminPassword)) {
      setAdminLogged(true);
      setAdminPassword('');
      setAdminMsg('Token admina zapisany. Uprawnienia potwierdzi backend przy zapisie decyzji.');
    } else {
      setAdminMsg('Wpisz hasło admina.');
    }
  };

  const onAdminLogout = () => {
    logoutAdmin();
    setAdminLogged(false);
    setAdminMsg('Wylogowano z panelu admina.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Propozycje użytkowników</h1>
      <p className="text-sm text-slate-500 mb-6">
        Zgłoś nową odznakę, książeczkę lub poprawkę. Każda propozycja trafia do kolejki i może zostać zaakceptowana,
        odrzucona albo wdrożona po modyfikacji.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Formularz propozycji</h2>
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label htmlFor="suggestion-kind" className="block text-xs font-medium text-slate-500 mb-1">Typ propozycji</label>
              <select
                id="suggestion-kind"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                value={kind}
                onChange={e => setKind(e.target.value as SuggestionKind)}
              >
                {kindOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="suggestion-title" className="block text-xs font-medium text-slate-500 mb-1">Tytuł</label>
              <input
                id="suggestion-title"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                placeholder="Np. Dodać odznakę XYZ"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="suggestion-details" className="block text-xs font-medium text-slate-500 mb-1">Opis propozycji</label>
              <textarea
                id="suggestion-details"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 min-h-28"
                placeholder="Opisz co dodać lub poprawić i dlaczego"
                value={details}
                onChange={e => setDetails(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="suggestion-source" className="block text-xs font-medium text-slate-500 mb-1">Link do źródła (opcjonalnie)</label>
              <input
                id="suggestion-source"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                placeholder="https://..."
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="suggestion-contact" className="block text-xs font-medium text-slate-500 mb-1">Kontakt (opcjonalnie)</label>
              <input
                id="suggestion-contact"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                placeholder="e-mail lub nick"
                value={contact}
                onChange={e => setContact(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
            >
              Wyślij propozycję
            </button>

            {msg && <p className="text-xs text-slate-600">{msg}</p>}
            <p className="text-[11px] text-slate-500">
              Uwaga: dane kontaktowe są widoczne wyłącznie dla zalogowanego admina.
            </p>
            <p className="text-[11px] text-slate-500">
              W razie pytań możesz napisać na: <a href="mailto:proste-pttk@outlook.com" className="text-emerald-600 hover:underline">proste-pttk@outlook.com</a>
            </p>
          </form>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-1">Kolejka propozycji</h2>
          <p className="text-xs text-slate-500 mb-4">Łącznie: {stats.total} • Oczekujące: {stats.pending}</p>

          <div className="mb-4 p-3 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-medium text-slate-700">Panel admina</p>
              {adminLogged && (
                <button onClick={onAdminLogout} className="text-xs px-2 py-1 rounded bg-slate-800 text-white hover:bg-slate-900">
                  Wyloguj admina
                </button>
              )}
            </div>

            {!adminLogged ? (
              <form className="flex gap-2" onSubmit={onAdminLogin}>
                <input
                  type="password"
                  className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5"
                  placeholder="Hasło admina"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                />
                <button className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                  Zaloguj
                </button>
              </form>
            ) : (
              <p className="text-xs text-emerald-700">Możesz teraz zmieniać statusy propozycji.</p>
            )}

            {adminMsg && <p className="text-xs text-slate-600 mt-2">{adminMsg}</p>}
          </div>

          {isLoading ? (
            <p className="text-sm text-slate-500">Ładowanie zgłoszeń…</p>
          ) : records.length === 0 ? (
            <p className="text-sm text-slate-500">Brak zgłoszeń. Bądź pierwszy.</p>
          ) : (
            <div className="space-y-3 max-h-[560px] overflow-auto pr-1">
              {records.map(rec => (
                <SuggestionItem key={rec.id} rec={rec} onDecision={updateDecision} canModerate={adminLogged} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SuggestionItem({ rec, onDecision, canModerate }: {
  rec: SuggestionRecord;
  onDecision: (id: string, decision: SuggestionDecision, adminNote: string) => void;
  canModerate: boolean;
}) {
  const [nextDecision, setNextDecision] = useState<SuggestionDecision>(rec.decision);
  const [adminNote, setAdminNote] = useState(rec.adminNote ?? '');

  return (
    <article className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-slate-800">{rec.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${decisionPill[rec.decision]}`}>
          {decisionLabels[rec.decision]}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-2">
        Typ: {rec.kind} • Dodano: {new Date(rec.createdAt).toLocaleString('pl-PL')}
      </p>

      <p className="text-sm text-slate-700 whitespace-pre-wrap">{rec.details}</p>

      {rec.sourceUrl && (
        <p className="text-xs mt-2">
          <a href={rec.sourceUrl} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
            Źródło
          </a>
        </p>
      )}

      {canModerate && rec.contact && <p className="text-xs text-slate-500 mt-1">Kontakt: {rec.contact}</p>}

      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500 mb-2">Decyzja admina</p>
        {!canModerate ? (
          <p className="text-xs text-slate-500">Zaloguj się jako admin, aby zmienić status tej propozycji.</p>
        ) : (
          <div className="grid sm:grid-cols-[1fr_auto] gap-2">
            <input
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5"
              placeholder="Notatka admina (opcjonalnie)"
              value={adminNote}
              onChange={e => setAdminNote(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5"
                value={nextDecision}
                onChange={e => setNextDecision(e.target.value as SuggestionDecision)}
              >
                <option value="pending">Oczekuje</option>
                <option value="accepted">Zaakceptowana</option>
                <option value="rejected">Odrzucona</option>
                <option value="modified">Zmodyfikowana</option>
              </select>
              <button
                onClick={() => onDecision(rec.id, nextDecision, adminNote)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900"
              >
                Zapisz
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
