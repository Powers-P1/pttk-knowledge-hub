import { Link } from 'react-router-dom';
import { getBadges, getShops } from '../data/sourceOfTruth';

const faqSections = [
  {
    id: 'booklet-myth',
    title: '„Oficjalna książeczka istnieje" vs „oficjalna książeczka jest obowiązkowa"',
    icon: '📕',
    content: `To najczęstszy błąd. Wiele odznak ma oficjalną książeczkę w sprzedaży — np. Dziecięca Odznaka Turystyczna (DOT), Tropiciel Przyrody (TPR), Turysta Przyrodnik (TP). Ale regulamin tych odznak nie wymaga kupna tej konkretnej książeczki. Dopuszczają własną kronikę, notes, a nawet dokumentację elektroniczną.

  Z drugiej strony — Odznaka Turystyki Pieszej (OTP) i Górska Odznaka Turystyczna (GOT) wymagają oficjalnej książeczki. Tu nie wystarczy zeszyt.

Zawsze sprawdzaj pole „official_booklet_required", a nie „official_booklet_available". To dwa zupełnie różne pytania.`,
  },
  {
    id: 'confirmation-vs-verification',
    title: 'Potwierdzenie wycieczki vs weryfikacja odznaki',
    icon: '✅',
    content: `System PTTK rozdziela dwa procesy:

**Potwierdzenie (confirmation)** — ktoś potwierdza, że byłeś na szlaku / widziałeś obiekt. Może to być przodownik turystyki, pieczątka, bilet, zdjęcie GPS, a w przypadku dziecięcych odznak — opiekun.

**Weryfikacja (verification)** — formalne sprawdzenie całej dokumentacji i przyznanie odznaki. Robią to zespoły referatów weryfikacyjnych (TRW, GRW, CRW) na poziomie oddziałowym lub centralnym.

To nie ta sama osoba i nie ten sam moment. Potwierdzenie zbierasz na bieżąco w terenie. Weryfikacja następuje po złożeniu kompletnej dokumentacji.`,
  },
  {
    id: 'active-vs-disputed',
    title: 'Odznaka aktywna vs rekord sporny',
    icon: '🔍',
    content: `Większość odznak w bazie ma status „active" i pewność „high". Ich źródła żyją na oficjalnych stronach. Można im ufać.

Ale Odznaka Turystyczno-Krajoznawcza „Znam Parki Narodowe” (OTK ZPN) to inny przypadek: nie ma stabilnego źródła pierwszego poziomu, a źródła wtórne kłócą się co do tego, czy odznaka jest nadal aktywna. Dlatego rekord ma status „uncertain_secondary_conflict" i pewność „low_to_medium".

Nie wyrzucamy go z bazy — bo to też informacja. Ale sygnalizujemy, że ten rekord żyje, ale wymaga ostrożności.`,
  },
  {
    id: 'shop-chaos',
    title: 'Oficjalny sklep vs realna sprzedaż detaliczna',
    icon: '🛒',
    content: `PTTK ma dwa główne kanały sprzedaży online:

**Sklep COTG (sklepcotg.pttk.pl)** — działa normalnie. Widać ceny, przycisk „Do koszyka", da się kupić książeczki. Sposób na detaliczną sprzedaż materiałów turystycznych.

**sklep.pttk.pl** — oficjalny sklep centralny, ale… na stronie głównej widnieje banner, że nie prowadzi sprzedaży indywidualnej. Jednocześnie podstrony produktowe mają ceny, stany magazynowe i mechanikę koszyka. Sytuacja jest niejednoznaczna.

Nasza baza modeluje oba sklepy oddzielnie z jawnym statusem sprzedaży indywidualnej.`,
  },
  {
    id: 'old-pdf',
    title: 'Aktualny regulamin vs nadal żyjący stary PDF',
    icon: '📄',
    content: `To klasyk. Oficjalny PDF regulaminu GOT z 2023 roku nadal można pobrać ze strony pttk.pl. Tymczasem obowiązuje nowy regulamin KTG z 1 stycznia 2026.

Stary PDF ma inne zasady wiekowe niż nowy regulamin. Jeśli trafisz na niego pierwszy, możesz wyciągnąć błędne wnioski.

W bazie danych starsze dokumenty trafiają do pola „legacy_or_stale_sources", a nie do „primary_sources". Różnica jest istotna i widoczna w UI każdego rekordu.`,
  },
  {
    id: 'tm-vs-mot',
    title: 'Turysta Motorowy (TM) vs Motorowa Odznaka Turystyczna (MOT) — to nie jest ta sama odznaka',
    icon: '🚗',
    content: `W turystyce motorowej PTTK istnieją dwie oddzielne odznaki:

**Turysta Motorowy (TM)** — dla dzieci i młodzieży od 7 do 16 lat. Trzy stopnie: brązowy, srebrny, złoty.

**Motorowa Odznaka Turystyczna (MOT)** — dla osób 16+. Osiem stopni: od popularnej po złotą za wytrwałość.

To dwa oddzielne rekordy z oddzielnymi regulaminami. Nie wolno ich łączyć w jeden wpis.`,
  },
  {
    id: 'descriptive-vs-regulation',
    title: 'Strona opisowa PTTK vs regulamin',
    icon: '⚖️',
    content: `Ogólne strony opisowe na pttk.pl (np. „odznaki turystyczne", „odznaki dla najm\u0142odszych") są przydatne jako wprowadzenie, ale mogą zawierać uproszczone lub nieaktualne informacje o wieku czy wymaganiach.

Regulamin — dostępny jako PDF lub na podstronie komisji — jest zawsze nadrzędny. Gdy strona opisowa mówi jedno, a regulamin drugie, wygrywa regulamin.

Baza danych zawsze wskazuje, które źródło jest regulaminem, a które stroną opisową.`,
  },
];

export default function FAQ() {
  const badges = getBadges();
  const shops = getShops();
  const disputedBadges = badges.filter(b => b.status !== 'active');
  const conflictBadges = badges.filter(b => b.source_conflict_note);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">FAQ — Chaos PTTK wyjaśniony</h1>
      <p className="text-sm text-slate-500 mb-8">
        System odznak PTTK ma sens, ale ma też swoje pułapki. Poniżej najczęściej mylone rzeczy —
        wyjaśnione na podstawie kanonicznego źródła danych.
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Stat value={badges.length.toString()} label="odznak w bazie" />
        <Stat value={disputedBadges.length.toString()} label="rekordów spornych" />
        <Stat value={conflictBadges.length.toString()} label="konflikty źródeł" />
        <Stat value={shops.length.toString()} label="kanały zakupu" />
      </div>

      {/* FAQ entries */}
      <div className="space-y-6">
        {faqSections.map(section => (
          <section
            key={section.id}
            id={section.id}
            className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6"
          >
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span>{section.icon}</span>
              {section.title}
            </h2>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed whitespace-pre-line">
              {section.content.split('\n\n').map((paragraph, i) => (
                <p key={i} dangerouslySetInnerHTML={{
                  __html: paragraph
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>')
                    .replace(/„(.*?)"/g, '<em class="text-slate-700">„$1"</em>')
                }} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <p className="text-sm text-emerald-800 mb-3">
          Chcesz zobaczyć dane? Przejrzyj katalog odznak lub sprawdź jakość źródeł.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/odznaki"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            🧭 Katalog odznak
          </Link>
          <Link
            to="/zrodla"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 border border-emerald-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors"
          >
            🔍 Jakość źródeł
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
      <div className="text-2xl font-bold text-slate-700">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}
