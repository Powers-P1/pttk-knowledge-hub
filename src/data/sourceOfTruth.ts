import type { SourceOfTruth, Badge, Booklet } from '../types';

export const sourceOfTruth: SourceOfTruth = {
  meta: {
    document_type: "canonical-source-of-truth",
    version: "1.4",
    generated_at: "2026-04-15",
    timezone: "Europe/Warsaw",
    editorial_policy: "Gdy oficjalna strona opisowa kłóci się z regulaminem, wygrywa regulamin.",
    base_documents: [
      "deep-research-report.md",
      "Research Systemu Odznak PTTK.md"
    ],
    notes: [
      "Ten plik zawiera wyłącznie twierdzenia sprawdzone w bieżącym przeglądzie źródeł lub jawnie oznaczone jako częściowo potwierdzone.",
      "Oficjalne źródła mogą się różnić między wersjami, dlatego nadal dostępne starsze dokumenty są modelowane oddzielnie od aktualnie obowiązujących źródeł pierwszego poziomu.",
      "ZPN pozostaje w modelu danych jako rekord sporny, ponieważ bieżący przegląd nie potwierdził stabilnej strony pierwszego poziomu, a źródła wtórne nie zgadzają się co do statusu aktywności."
    ],
    changelog: [
      {
        date: "2026-04-14",
        title: "Uruchomienie wersji 1.2",
        type: "data",
        details: [
          "Utrwalono kanoniczny model źródeł z podziałem na tier 1/2/3.",
          "Wdrożono jawne flagi source_confidence, live_source_status i source_conflict_scope.",
          "Dodano pełny zestaw rekordów: OTP, GOT, TM, MOT, TPR, TP, DOT, ROK/OKP, ZPN."
        ]
      },
      {
        date: "2026-04-14",
        title: "Rozszerzenia interfejsu i narzędzi",
        type: "ui",
        details: [
          "Dodano porównanie odznak side-by-side (do 3 rekordów).",
          "Dodano kopiowanie deep-linka do widoku odznaki.",
          "Uruchomiono tryb ciemny, lazy loading, scroll-to-top i panel debug (feature flag)."
        ]
      },
      {
        date: "2026-04-14",
        title: "Weryfikacja źródeł i porządkowanie konfliktów",
        type: "source",
        details: [
          "Health-check potwierdził dostępność 29/29 aktywnych URL-i źródłowych.",
          "GOT utrzymano ze statusem konfliktu oficjalnych wersji i źródłami legacy.",
          "Dodano rekord MOK jako stub do reweryfikacji (brak stabilnego tier 1)."
        ]
      },
      {
        date: "2026-04-15",
        title: "Kategorie, podkategorie i rozszerzenie katalogu",
        type: "data",
        details: [
          "Wprowadzono jawne pola category i subcategory dla wszystkich rekordów odznak.",
          "Dodano pierwszą paczkę nowych odznak: KOT, TOK, ŻOT, OInO, GON.",
          "Rozszerzono UI o filtrowanie po kategorii, podkategorii i zakresie odznaki."
        ]
      },
      {
        date: "2026-04-15",
        title: "Pełna ekstrakcja kandydatów ready_for_intake",
        type: "data",
        details: [
          "Dodano pełne rekordy: Turysta Senior (TS), Turysta Junior/Turystka Juniorka (TJ), DON, NOM, KIEŁBIK, OFK, Kolejowa Odznaka Turystyczna (KOTR), Szlakiem Pomników Historii (SPH).",
          "Uzupełniono wiek, stopnie, dokumentację, potwierdzanie i ścieżki weryfikacji na podstawie oficjalnych regulaminów PDF.",
          "Zamknięto listę kandydatów do szybkiego dodania w backlogu coverageResearch."
        ]
      }
    ]
  },
  source_tiers: [
    {
      tier: 1,
      name: "canonical_primary",
      description: "Oficjalne regulaminy i oficjalne strony tematyczne.",
      domains: ["kartoteki.pttk.pl", "pttk.pl", "kkraj.pttk.pl", "ktg.pttk.pl", "ktmzg.pttk.pl"],
      policy: "Nadrzędne wobec niższych poziomów w kwestii zasad wiekowych, statusu regulaminowego i wymogów formalnych."
    },
    {
      tier: 2,
      name: "official_distribution",
      description: "Oficjalne kanały sprzedaży i dystrybucji.",
      domains: ["sklepcotg.pttk.pl", "sklep.pttk.pl"],
      policy: "Wiarygodne w kwestii dostępności i UX zakupów, nie wiarygodne w interpretacji regulaminu."
    },
    {
      tier: 3,
      name: "secondary_or_archival",
      description: "Kopie lustrzane, strony archiwalne i kuratorowane katalogi wtórne.",
      domains: ["msw-pttk.org.pl", "odznaki.org"],
      policy: "Używać wyłącznie jako rezerwę, archiwum lub pomoc w ekstrakcji tekstu, gdy tier 1 jest niedostępny lub trudny do parsowania."
    }
  ],
  repo_rules: [
    { rule: "show_source_confidence", value: true },
    { rule: "show_live_source_status", value: true },
    { rule: "show_last_verified_at", value: true },
    { rule: "split_confirmation_and_verification", value: true },
    { rule: "split_booklet_available_and_required", value: true },
    { rule: "split_shop_officiality_and_individual_sale_status", value: true },
    { rule: "surface_source_conflicts", value: true },
    { rule: "allow_legacy_or_stale_sources", value: true }
  ],
  shops: [
    {
      id: "cotg_shop",
      official_name: "Sklep COTG PTTK",
      domain: "sklepcotg.pttk.pl",
      source_tier: 2,
      official_central_shop: false,
      official_retail: true,
      individual_sale_status: "supported",
      live_source_status: "official_shop_live_retail",
      source_confidence: "high",
      last_verified_at: "2026-04-14",
      evidence_summary: "Działający sklep online z cenami i przyciskami 'Do koszyka' dla książeczek OTP, GOT i Tropiciel/Turysta Przyrodnik.",
      sources: ["https://sklepcotg.pttk.pl/"]
    },
    {
      id: "pttk_central_shop",
      official_name: "sklep.pttk.pl",
      domain: "sklep.pttk.pl",
      source_tier: 2,
      official_central_shop: true,
      official_retail: true,
      individual_sale_status: "ambiguous_banner_oddzialy_only_but_catalog_and_cart_visible",
      live_source_status: "official_shop_live_ambiguous_individual_sale",
      source_confidence: "high",
      last_verified_at: "2026-04-14",
      evidence_summary: "Banner na stronie głównej informuje o braku sprzedaży indywidualnej, ale podstrony produktowe i kategorie pokazują ceny, stany magazynowe i przyciski koszyka.",
      sources: [
        "https://sklep.pttk.pl/",
        "https://sklep.pttk.pl/index.php?id_category=19&controller=category",
        "https://sklep.pttk.pl/index.php?id_product=26&rewrite=odznaka-got-popularna&controller=product"
      ]
    }
  ],
  booklets: [
    {
      id: "otp_booklet",
      name: "Książeczka Wycieczek Pieszych PTTK",
      used_by: ["OTP"],
      official_booklet_available: true,
      official_booklet_required: true,
      self_made_documentation_allowed: false,
      notes: "Ścieżka papierowa jest oficjalna; istnieje osobna oficjalna ścieżka przez aplikację mobilną OTP, bez trybu hybrydowego w ramach jednego stopnia.",
      sources: ["https://sklepcotg.pttk.pl/pl/p/Ksiazeczka-Turystyki-Pieszej-PTTK/260"]
    },
    {
      id: "got_booklet",
      name: "Książeczka GOT PTTK",
      used_by: ["GOT"],
      official_booklet_available: true,
      official_booklet_required: true,
      self_made_documentation_allowed: false,
      notes: "Wymagana oficjalna ścieżka dokumentacji GOT.",
      sources: ["https://sklepcotg.pttk.pl/pl/p/Ksiazeczka-GOT-PTTK/93"]
    },
    {
      id: "tropiciel_turysta_przyrodnik_booklet",
      name: "Książeczka Tropiciel Przyrody i Turysta Przyrodnik PTTK",
      used_by: ["Tropiciel Przyrody", "Turysta Przyrodnik"],
      official_booklet_available: true,
      official_booklet_required: false,
      self_made_documentation_allowed: true,
      notes: "Przydatna standardowa książeczka, ale Tropiciel wyraźnie dopuszcza książeczkę w dowolnej formie, a Turysta Przyrodnik pozwala na własne notatki, zeszyty i kroniki PDF.",
      sources: ["https://sklepcotg.pttk.pl/pl/p/Ksiazeczka-Tropiciel-Przyrody-i-Turysta-Przyrodnik-PTTK/215"]
    },
    {
      id: "dot_booklet",
      name: "Książeczka Dziecięcej Odznaki Turystycznej PTTK",
      used_by: ["DOT"],
      official_booklet_available: true,
      official_booklet_required: false,
      self_made_documentation_allowed: true,
      notes: "Produkt istnieje w sklepie, ale regulamin DOT dopuszcza dokumentację w dowolnej formie.",
      sources: ["https://sklep.pttk.pl/index.php?id_category=19&controller=category"]
    },
    {
      id: "junior_diary",
      name: "Dzienniczek odznaki Turystka Juniorka / Turysta Junior",
      used_by: ["Turysta Junior / Turystka Juniorka", "TJ"],
      official_booklet_available: true,
      official_booklet_required: true,
      self_made_documentation_allowed: false,
      notes: "Regulamin wymaga prowadzenia i potwierdzania tras w dzienniczku odznaki.",
      sources: [
        "https://pttk.pl/odznaki-dla-najmlodszych/",
        "http://tarnow.pttk.pl/oddzial/odznaki/otr/k_t_j.pdf"
      ]
    },
    {
      id: "narciarz_booklet",
      name: "Książeczka Narciarza PTTK",
      used_by: ["DON", "NOM"],
      official_booklet_available: true,
      official_booklet_required: true,
      self_made_documentation_allowed: false,
      notes: "DON i NOM są wpisywane do Książeczki Narciarza i weryfikowane zgodnie z regulaminem odznak narciarskich.",
      sources: [
        "https://pttk.pl/odznaki-dla-najmlodszych/",
        "https://pttk.pl/wp-content/uploads/2024/01/o_DON_NOM_reg.pdf"
      ]
    },
    {
      id: "tok_booklet",
      name: "Książeczka Turystycznej Odznaki Kajakowej (TOK)",
      used_by: ["TOK", "KIEŁBIK"],
      official_booklet_available: true,
      official_booklet_required: true,
      self_made_documentation_allowed: false,
      notes: "KIEŁBIK jest przyznawany na podstawie przedłożonej i zweryfikowanej Książeczki TOK.",
      sources: [
        "https://pttk.pl/wp-content/uploads/2023/12/Regulamin_Turystycznej_Odznaki_Kajakowej_PTTK.pdf",
        "https://pttk.pl/wp-content/uploads/2024/01/Regulamin-Dziecicej-Odznaki-Kajakowej-PTTK-KIEBIK.pdf"
      ]
    },
    {
      id: "ofk_journal",
      name: "Dzienniczek Odznaki Fotografii Krajoznawczej",
      used_by: ["OFK"],
      official_booklet_available: true,
      official_booklet_required: false,
      self_made_documentation_allowed: true,
      notes: "Podstawą jest dzienniczek OFK; jeśli niedostępny, zapisy można prowadzić w notesie lub zeszycie A5 zgodnie z układem regulaminu.",
      sources: [
        "https://pttk.pl/wp-content/uploads/2023/12/regulamin_fotograficznej-odznaki-1.pdf",
        "https://kfk.pttk.pl/?page_id=163"
      ]
    }
  ],
  badges: [
    {
      id: "otp",
      official_name: "Odznaka Turystyki Pieszej",
      abbreviation: "OTP",
      discipline: "piesza",
      family: "turystyka kwalifikowana",
      scope: "ogolnopolska",
      category: "turystyka_kwalifikowana",
      subcategory: "piesza",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_live",
      last_verified_at: "2026-04-14",
      age_rule_literal: "od 6 lat; Siedmiomilowe Buty dla dzieci do 10 lat włącznie, liczone do końca roku kalendarzowego",
      levels: ["Siedmiomilowe Buty", "popularna", "mała", "duża", "Za Wytrwałość", "Dla Najwytrwalszych"],
      documentation: {
        required: true,
        documentation_model: "mixed",
        official_booklet_available: true,
        official_booklet_required: true,
        official_booklet_required_scope: "wszystkie standardowe ścieżki OTP; duża OTP wymaga dodatkowo kroniki tras",
        self_made_documentation_allowed: true,
        self_made_documentation_allowed_scope: "tylko dodatkowa kronika tras wymagana przez dużą OTP",
        digital_allowed: true,
        digital_constraints: "oficjalna aplikacja mobilna dozwolona; brak trybu hybrydowego papier+aplikacja w ramach jednego stopnia",
        documentation_by_level: {
          "Siedmiomilowe Buty": { official_booklet_required: true, self_made_documentation_allowed: false },
          "popularna": { official_booklet_required: true, self_made_documentation_allowed: false },
          "mała": { official_booklet_required: true, self_made_documentation_allowed: false },
          "duża": {
            official_booklet_required: true,
            additional_route_chronicle_required: true,
            self_made_documentation_allowed: true,
            accepted_examples: ["opis", "kronika", "fotokronika", "audio", "wideo", "prezentacja multimedialna"],
            notes: "Duża OTP wymaga osobnej dokumentacji tras oprócz książeczki."
          },
          "Za Wytrwałość": { official_booklet_required: true, self_made_documentation_allowed: false },
          "Dla Najwytrwalszych": { official_booklet_required: true, self_made_documentation_allowed: false }
        }
      },
      confirmation_body: ["Przodownik Turystyki Pieszej PTTK", "pieczątki, bilety, zdjęcia, wydruki GPS i szczegółowe opisy tras jako akceptowane dowody"],
      verification_body: ["TRW OTP dla Siedmiomilowych Butów, popularnej i małej", "GRW OTP dla dużej i Za Wytrwałość", "wyznaczony klub w porozumieniu z KTP dla Dla Najwytrwalszych"],
      verification_by_level: {
        "Siedmiomilowe Buty": ["TRW OTP"],
        "popularna": ["TRW OTP"],
        "mała": ["TRW OTP"],
        "duża": ["GRW OTP"],
        "Za Wytrwałość": ["GRW OTP"],
        "Dla Najwytrwalszych": ["wyznaczony klub w porozumieniu z KTP"]
      },
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Aktualna oficjalna strona przeglądowa jest przydatna, ale uproszczenia wiekowe na stronach przeglądowych nie mogą nadpisywać regulaminu.",
        "Cyfrowa OTP powinna być modelowana jako oddzielny tryb dokumentacji, nie jako luźny dodatek.",
        "OTP nie da się modelować jako jednolity nośnik dokumentacji, bo duża OTP wymaga dodatkowej kroniki tras ponad książeczką."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-turystyczne/",
        "https://pttk.pl/wp-content/uploads/2024/01/Regulamin_OTP.pdf",
        "https://pttk.pl/wp-content/uploads/2024/01/o_OTP_7milowe_buty_PTTK_reg.pdf"
      ]
    },
    {
      id: "got",
      official_name: "Górska Odznaka Turystyczna",
      abbreviation: "GOT",
      discipline: "górska",
      family: "turystyka kwalifikowana",
      scope: "ogolnopolska",
      category: "turystyka_kwalifikowana",
      subcategory: "gorska",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_live_with_legacy_conflict",
      last_verified_at: "2026-04-14",
      current_regulation_effective_from: "2026-01-01",
      age_rule_literal: "GOT PTTK można zdobywać po rozpoczęciu 5. roku życia; GOT PTTK \"W góry\" od rozpoczęcia 5. do ukończenia 10. roku życia; GOT PTTK popularną po ukończeniu 7. roku życia.",
      levels: ["W góry", "popularna", "mała", "duża", "Za wytrwałość"],
      source_conflict_note: "Wiążący regulamin KTG obowiązujący od 01.01.2026 koliduje ze starszymi oficjalnymi materiałami GOT, które nadal są publicznie dostępne, w tym starszy PDF opublikowany pod pttk.pl/wp-content/uploads.",
      source_conflict_scope: "official",
      review_needed: false,
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: true,
        self_made_documentation_allowed: false,
        digital_allowed: false,
        digital_constraints: "brak potwierdzonego oficjalnego odpowiednika wyłącznie cyfrowego w bieżącym przeglądzie"
      },
      confirmation_body: ["Przodownicy Turystyki Górskiej PTTK"],
      verification_body: ["TRW GOT dla W góry, popularnej, małej i większości norm", "CRW GOT w Krakowie dla dużych stopni i końcowych norm za wytrwałość"],
      sale_status: "verified_booklet_is_purchase_authorization",
      source_notes: [
        "Strona regulaminu KTG obowiązująca od 01.01.2026 jest kanonicznym źródłem pierwszego poziomu.",
        "Ogólna strona przeglądowa na pttk.pl jest opisowa i zawiera uproszczone wskazówki wiekowe; szczegóły regulaminowe należą do dedykowanego regulaminu GOT.",
        "Strona pttk.pl/odznaki-turystyczne/ nadal linkuje do starego PDF regulaminu GOT (z 2023/12) i podaje nieaktualne progi wiekowe — umieszczona jako legacy.",
        "COTG pozostaje najbezpieczniejszym domyślnym kanałem dystrybucji materiałów GOT."
      ],
      primary_sources: [
        "https://ktg.pttk.pl/g%C3%B3rska-odznaka-turystyczna/regulamin-got-pttk",
        "https://pttk.pl/odznaki-dla-najmlodszych/"
      ],
      legacy_or_stale_sources: [
        "https://pttk.pl/wp-content/uploads/2023/12/Regulamin-GOT.pdf",
        "https://pttk.pl/odznaki-turystyczne/"
      ]
    },
    {
      id: "tm",
      official_name: "Turysta Motorowy",
      abbreviation: "TM",
      discipline: "motorowa",
      family: "odznaki turystyki motorowej",
      scope: "ogolnopolska",
      category: "turystyka_kwalifikowana",
      subcategory: "motorowa",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_live",
      last_verified_at: "2026-04-14",
      age_rule_literal: "dla dzieci i młodzieży od 7 do 16 lat",
      levels: ["brązowy", "srebrny", "złoty"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        official_printable_template_available: true,
        documentation_mode: "official_booklet_or_official_printable_template",
        self_made_documentation_allowed: false,
        digital_allowed: false,
        digital_constraints: "brak potwierdzonego trybu cyfrowego w bieżącym przeglądzie"
      },
      confirmation_body: ["pieczątki", "bilety", "zdjęcia", "podpisy kwalifikowanej kadry"],
      verification_body: ["terenowe zespoły weryfikacyjne turystyki motorowej"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Ten rekord musi pozostać oddzielny od MOT.",
        "Nie używać starszego sformułowania 10-16 jako kanonicznego.",
        "Dokumentację należy interpretować jako oficjalną książeczkę lub oficjalny szablon do wydruku, nie jako dowolny samodzielnie zrobiony notes."
      ],
      primary_sources: [
        "https://pttk.pl/turystyka-motorowa/",
        "https://ktmzg.pttk.pl/index.php/odznaki-turystyki-motorowej",
        "https://ktmzg.pttk.pl/index.php/do-pobrania/category/71-regulamin-odznak-turystyki-motorowej-pttk?download=204:regulamin-mot-tm",
        "https://ktmzg.pttk.pl/index.php/do-pobrania/category/79-ksiazeczki-wycieczkowe",
        "https://ktmzg.pttk.pl/index.php/do-pobrania/category/79-ksiazeczki-wycieczkowe?download=235:uproszczona-forma-ksiazeczki-wycieczkowej-turysty-motorowego"
      ]
    },
    {
      id: "mot",
      official_name: "Motorowa Odznaka Turystyczna",
      abbreviation: "MOT",
      discipline: "motorowa",
      family: "odznaki turystyki motorowej",
      scope: "ogolnopolska",
      category: "turystyka_kwalifikowana",
      subcategory: "motorowa",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_live",
      last_verified_at: "2026-04-14",
      age_rule_literal: "dla osób, które ukończyły 16 lat",
      levels: ["popularna", "mała brązowa", "mała srebrna", "mała złota", "duża brązowa", "duża srebrna", "duża złota", "złota za wytrwałość"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        official_printable_template_available: true,
        documentation_mode: "official_booklet_or_official_printable_template",
        self_made_documentation_allowed: false,
        digital_allowed: false,
        digital_constraints: "brak potwierdzonego trybu cyfrowego w bieżącym przeglądzie"
      },
      confirmation_body: ["pieczątki", "bilety", "zdjęcia", "podpisy kwalifikowanej kadry", "potwierdzenie organizatora imprezy kwalifikującej"],
      verification_body: ["terenowe zespoły weryfikacyjne turystyki motorowej", "ścieżka centralna dla wyższych stopni według regulaminu KTM ZG PTTK"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Ten rekord musi pozostać oddzielny od TM i od MOK.",
        "Komunikat o zmianach z 2025 r. dotyczy regulaminu i załączników; nie zmienia podstawowego podziału TM vs MOT.",
        "Dokumentację należy interpretować jako oficjalną książeczkę lub oficjalny szablon do wydruku, nie jako dowolny samodzielnie zrobiony notes."
      ],
      primary_sources: [
        "https://pttk.pl/turystyka-motorowa/",
        "https://ktmzg.pttk.pl/index.php/odznaki-turystyki-motorowej",
        "https://ktmzg.pttk.pl/index.php/do-pobrania/category/71-regulamin-odznak-turystyki-motorowej-pttk?download=204:regulamin-mot-tm",
        "https://ktmzg.pttk.pl/index.php/do-pobrania/category/79-ksiazeczki-wycieczkowe",
        "https://ktmzg.pttk.pl/index.php/do-pobrania/category/79-ksiazeczki-wycieczkowe?download=235:uproszczona-forma-ksiazeczki-wycieczkowej-turysty-motorowego"
      ],
      legacy_or_stale_sources: [
        "https://pttk.pl/wp-content/uploads/2023/12/regulamin_mot_zatwierdzony_5_07_2016.pdf"
      ]
    },
    {
      id: "tropiciel_przyrody",
      official_name: "Tropiciel Przyrody",
      abbreviation: "TPR",
      discipline: "przyrodnicza",
      family: "dziecięce i przyrodnicze",
      scope: "specjalistyczna_ponadregionalna",
      category: "specjalistyczna",
      subcategory: "przyrodnicza",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live_and_secondary_text_live",
      last_verified_at: "2026-04-14",
      age_rule_literal: "dla dzieci od 5 roku życia; jeden stopień w ciągu kolejnych 12 miesięcy",
      levels: ["brązowy", "srebrny", "złoty"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: false,
        digital_constraints: "brak potwierdzonego osobnego trybu cyfrowego w bieżącym przeglądzie"
      },
      confirmation_body: ["kadra programowa PTTK", "pełnoletni uczestnicy towarzyszący dziecku", "edukatorzy przyrodniczy", "nauczyciele"],
      verification_body: ["Oddziałowe Referaty Odznaki Turysta Przyrodnik"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Oficjalna książeczka istnieje w sprzedaży, ale regulamin wyraźnie dopuszcza książeczkę wycieczkową w dowolnej formie.",
        "Ten rekord nigdy nie powinien być modelowany jako wymagający książeczki z logo."
      ],
      primary_sources: ["https://kartoteki.pttk.pl/ks3/dok/k20_upzg088_z01_20250404.pdf"],
      secondary_sources: [
        "http://www.msw-pttk.org.pl/odznaki/reg_odznak/reg_opttktp.html",
        "https://odznaki.org/odznaka/tropiciel-przyrody/"
      ]
    },
    {
      id: "turysta_przyrodnik",
      official_name: "Turysta Przyrodnik",
      abbreviation: "TP",
      discipline: "przyrodnicza",
      family: "przyrodnicze",
      scope: "specjalistyczna_ponadregionalna",
      category: "specjalistyczna",
      subcategory: "przyrodnicza",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live_and_secondary_text_live",
      last_verified_at: "2026-04-14",
      age_rule_literal: "od 8 roku życia dla odznaki popularnej i małej; od 14 roku życia dla odznaki dużej",
      levels: ["popularna", "mała brązowa", "mała srebrna", "mała złota", "duża brązowa", "duża srebrna", "duża złota", "honorowa"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: true,
        digital_constraints: "kroniki elektroniczne dozwolone tylko jako pliki PDF"
      },
      confirmation_body: ["oryginalne pieczątki lub wklejone oryginalne pieczątki", "podpis kadry PTTK z imieniem, funkcją i uprawnieniami", "zdjęcia z nazwą obiektu, datą i miejscem w opisie"],
      verification_body: ["Oddziałowe Referaty Weryfikacyjne dla popularnej i wszystkich małych", "Referat Weryfikacyjny Komisji Ochrony Przyrody ZG PTTK dla wszystkich dużych po wcześniejszej weryfikacji oddziałowej"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Dokumentacja jest obowiązkowa, ale oficjalna książeczka nie jest jedynym akceptowanym nośnikiem.",
        "Ten rekord powinien wyraźnie pokazywać ograniczenie PDF dla kronik elektronicznych, bo to realne ograniczenie regulaminowe."
      ],
      primary_sources: ["https://kartoteki.pttk.pl/ks3/dok/k20_upzg087_z01_20250404.pdf"],
      secondary_sources: ["https://odznaki.org/odznaka/turysta-przyrodnik/"]
    },
    {
      id: "dot",
      official_name: "Dziecięca Odznaka Turystyczna",
      abbreviation: "DOT",
      discipline: "dziecięca wielodyscyplinarna",
      family: "dziecięce",
      scope: "ogolnopolska",
      category: "dziecieca_mlodziezowa",
      subcategory: "uniwersalna",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_live",
      last_verified_at: "2026-04-14",
      age_rule_literal: "dla dzieci do ukończenia 10 roku życia, pod opieką pełnoletnich",
      levels: ["jednostopniowa"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: false,
        digital_constraints: "brak potwierdzonego osobnego trybu cyfrowego w bieżącym przeglądzie"
      },
      confirmation_body: ["pełnoletni opiekun"],
      verification_body: ["oddziały PTTK w całym kraju"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Oficjalna książeczka istnieje w kategorii sklepu centralnego, ale DOT musi pozostać modelowany jako dokumentacja w dowolnej formie.",
        "Nie tworzyć UX, który blokuje użytkownika do momentu kupna książeczki."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-dla-najmlodszych/",
        "https://pttk.pl/wp-content/uploads/2024/01/REGULAMIN-Dziecicej-Odnzaki-Turystycznej.pdf"
      ],
      secondary_sources: ["https://sklep.pttk.pl/index.php?id_category=19&controller=category"]
    },
    {
      id: "odznaka_krajoznawcza_pttk",
      official_name: "Odznaka Krajoznawcza PTTK",
      abbreviation: "ROK/OKP",
      discipline: "krajoznawcza",
      family: "krajoznawcze",
      scope: "regionalna",
      category: "krajoznawcza",
      subcategory: "uniwersalna",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-14",
      age_rule_literal: "od 7 roku życia",
      levels: ["ROK", "OKP"],
      documentation: {
        required: true,
        official_booklet_available: false,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: true,
        digital_constraints: "kronika w dowolnej formie; bieżący przegląd sprawdził zarówno oficjalny PDF z kartoteki, jak i oficjalną stronę regulaminu KKraj"
      },
      confirmation_body: ["pieczątki", "bilety", "zdjęcia", "własne opisy", "podpisy kadry, instruktora lub nauczyciela"],
      verification_body: ["oddziałowe zespoły weryfikacyjne dla ROK", "centralny zespół weryfikacyjny komisji krajoznawczej dla OKP"],
      sale_status: "diploma_or_legitymacja_authorizes_purchase_and_wearing",
      source_notes: [
        "Oficjalny PDF z kartoteki i oficjalna strona regulaminu KKraj są dostępne w bieżącym przeglądzie.",
        "Ten rekord należy traktować jako w pełni oparty na źródłach pierwszego poziomu, a nie jako sam podsumowanie."
      ],
      primary_sources: [
        "https://kartoteki.pttk.pl/ks3/dok/k17_u027_z01_20130515.pdf",
        "https://kkraj.pttk.pl/index.php/regulamin-odznaki-krajoznawczej-polski-2/",
        "https://pttk.pl/odznaki-krajoznawcze/"
      ]
    },
    {
      id: "kot",
      official_name: "Kolarska Odznaka Turystyczna",
      abbreviation: "KOT",
      discipline: "kolarska",
      family: "turystyka kwalifikowana",
      scope: "ogolnopolska",
      category: "turystyka_kwalifikowana",
      subcategory: "kolarska",
      status: "active",
      source_confidence: "medium",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "próg wiekowy do potwierdzenia w kolejnym przeglądzie literalnym regulaminu",
      levels: ["wg regulaminu KOT"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: false,
        digital_constraints: "szczegółowy model dokumentacji wymaga ekstrakcji z regulaminu PDF"
      },
      confirmation_body: ["zgodnie z regulaminem KOT"],
      verification_body: ["zgodnie z regulaminem KOT"],
      sale_status: "physical_badge_after_verification",
      review_needed: true,
      source_notes: [
        "Odznaka znajduje się na oficjalnej liście odznak turystyki kwalifikowanej PTTK.",
        "Rekord dodany jako aktywny z medium confidence do czasu pełnej ekstrakcji tekstu regulaminu PDF."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-turystyczne/",
        "https://pttk.pl/wp-content/uploads/2023/12/Kolarska_Odznaka_Turystyczna.pdf"
      ]
    },
    {
      id: "tok",
      official_name: "Turystyczna Odznaka Kajakowa",
      abbreviation: "TOK",
      discipline: "kajakowa",
      family: "turystyka kwalifikowana",
      scope: "ogolnopolska",
      category: "turystyka_kwalifikowana",
      subcategory: "kajakowa",
      status: "active",
      source_confidence: "medium",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "próg wiekowy do potwierdzenia w kolejnym przeglądzie literalnym regulaminu",
      levels: ["wg regulaminu TOK"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: false,
        digital_constraints: "szczegółowy model dokumentacji wymaga ekstrakcji z regulaminu PDF"
      },
      confirmation_body: ["zgodnie z regulaminem TOK"],
      verification_body: ["zgodnie z regulaminem TOK"],
      sale_status: "physical_badge_after_verification",
      review_needed: true,
      source_notes: [
        "Odznaka znajduje się na oficjalnej liście odznak turystyki kwalifikowanej PTTK.",
        "Rekord dodany jako aktywny z medium confidence do czasu pełnej ekstrakcji tekstu regulaminu PDF."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-turystyczne/",
        "https://pttk.pl/wp-content/uploads/2023/12/Regulamin_Turystycznej_Odznaki_Kajakowej_PTTK.pdf"
      ]
    },
    {
      id: "zot",
      official_name: "Żeglarska Odznaka Turystyczna",
      abbreviation: "ŻOT",
      discipline: "żeglarska",
      family: "turystyka kwalifikowana",
      scope: "ogolnopolska",
      category: "turystyka_kwalifikowana",
      subcategory: "zeglarska",
      status: "active",
      source_confidence: "medium",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "na stronie opisowej widnieje próg 12 lat; wymaga potwierdzenia literalnego z regulaminu",
      levels: ["wg regulaminu ŻOT"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: false,
        digital_constraints: "szczegółowy model dokumentacji wymaga ekstrakcji z regulaminu PDF"
      },
      confirmation_body: ["zgodnie z regulaminem ŻOT"],
      verification_body: ["zgodnie z regulaminem ŻOT"],
      sale_status: "physical_badge_after_verification",
      review_needed: true,
      source_notes: [
        "Odznaka znajduje się na oficjalnej liście odznak turystyki kwalifikowanej PTTK.",
        "Rekord dodany jako aktywny z medium confidence do czasu pełnej ekstrakcji tekstu regulaminu PDF."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-turystyczne/",
        "https://pttk.pl/wp-content/uploads/2023/12/REGULAMIN_ZOT_ze_wzorem_odznak_.pdf"
      ]
    },
    {
      id: "oino",
      official_name: "Odznaka Imprez na Orientację",
      abbreviation: "OInO",
      discipline: "na orientację",
      family: "turystyka kwalifikowana",
      scope: "ogolnopolska",
      category: "turystyka_kwalifikowana",
      subcategory: "na_orientacje",
      status: "active",
      source_confidence: "medium",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "na stronie opisowej: brak ograniczeń; wymaga potwierdzenia literalnego z regulaminu",
      levels: ["wg regulaminu OInO"],
      documentation: {
        required: true,
        official_booklet_available: false,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: false,
        digital_constraints: "szczegółowy model dokumentacji wymaga ekstrakcji z regulaminu PDF"
      },
      confirmation_body: ["zgodnie z regulaminem OInO"],
      verification_body: ["zgodnie z regulaminem OInO"],
      sale_status: "physical_badge_after_verification",
      review_needed: true,
      source_notes: [
        "Odznaka znajduje się na oficjalnej liście odznak turystyki kwalifikowanej PTTK.",
        "Rekord dodany jako aktywny z medium confidence do czasu pełnej ekstrakcji tekstu regulaminu PDF."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-turystyczne/",
        "https://pttk.pl/wp-content/uploads/2023/12/regulamin_odznaki_imprez_na_orientacje.pdf"
      ]
    },
    {
      id: "gon",
      official_name: "Górskie Odznaki Narciarskie",
      abbreviation: "GON",
      discipline: "narciarska",
      family: "turystyka kwalifikowana",
      scope: "ogolnopolska",
      category: "turystyka_kwalifikowana",
      subcategory: "narciarska",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "GON popularna i małe mają normy wiekowe 10-16 lat oraz 17-60 lat (z osobną normą także dla 60+); jeden stopień na sezon z wyjątkiem popularnej i brązowej.",
      levels: ["popularna", "mała brązowa", "mała srebrna", "mała złota", "duża srebrna", "duża złota", "Za Wytrwałość", "Wysokogórska Odznaka Narciarska"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: false,
        digital_constraints: "ewidencję prowadzi się na protokołach narciarskich; przy wpisach bez potwierdzeń terenowych wymagana wstępna weryfikacja przez Przodownika Turystyki Narciarskiej PTTK"
      },
      confirmation_body: ["potwierdzenia terenowe z trasy (np. schroniska, urzędy, instytucje, organizatorzy imprez)", "Przodownik Turystyki Narciarskiej PTTK dla tras bez potwierdzeń terenowych"],
      verification_body: ["Terenowe Referaty Weryfikacyjne dla DON, NOM oraz małych stopni GON/NON", "Centralny Referat Weryfikacyjny Odznak Narciarskich w Krakowie dla stopni dużych, Za Wytrwałość i WON"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Ekstrakcja oparta na oficjalnym regulaminie narciarskim obejmującym DON, NOM, GON, NON, Za Wytrwałość i WON.",
        "GON i NON korzystają z tej samej bazy zasad weryfikacji, z odrębną punktacją/limitami tras i kilometrów."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-turystyczne/",
        "https://pttk.pl/wp-content/uploads/2023/12/Regulamin_on.pdf"
      ]
    },
    {
      id: "turysta_senior",
      official_name: "Turysta Senior",
      abbreviation: "TS",
      discipline: "wielodyscyplinarna",
      family: "krajoznawczo-turystyczne ogólnopolskie",
      scope: "ogolnopolska",
      category: "specjalistyczna",
      subcategory: "uniwersalna",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "dla osób powyżej 50 roku życia",
      levels: ["stopień I (liść brzozy)", "stopień II (liść miłorzębu)", "stopień III (liść dębu)"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: true,
        digital_constraints: "książeczka wycieczek może mieć formę dowolną (np. notes, zeszyt) zgodną z wymaganym zakresem danych"
      },
      confirmation_body: ["pieczątki instytucji na trasie", "bilety wstępu", "zdjęcia odwiedzanych obiektów", "potwierdzenie członka kadry PTTK, przewodnika lub pilota"],
      verification_body: ["wszystkie Oddziały PTTK", "lub oddziałowe komisje/referaty weryfikacyjne delegowane przez zarządy oddziałów"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Odznaka jest trzystopniowa i wymaga 12, 24 oraz 36 wycieczek jednodniowych odpowiednio dla kolejnych stopni.",
        "Wycieczki wielodniowe mogą być rozliczane jako oddzielne wycieczki dzienne."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-turystyczne/",
        "https://pttk.pl/wp-content/uploads/2023/12/regulamin_odznaka_turysta_senior.pdf"
      ]
    },
    {
      id: "turysta_junior",
      official_name: "Turysta Junior / Turystka Juniorka",
      abbreviation: "TJ",
      discipline: "wielodyscyplinarna",
      family: "dziecięce",
      scope: "ogolnopolska",
      category: "dziecieca_mlodziezowa",
      subcategory: "uniwersalna",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "dla turystów do ukończenia 12 roku życia",
      levels: ["jednostopniowa"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: true,
        self_made_documentation_allowed: false,
        digital_allowed: false,
        digital_constraints: "wymagany dzienniczek z wpisem trasy i potwierdzeniami"
      },
      confirmation_body: ["organizator wycieczki", "opiekun odpowiedzialny za bezpieczeństwo", "jeden z rodziców"],
      verification_body: ["Zarząd Oddziału PTTK Ziemi Tarnowskiej (adres weryfikatu wskazany w regulaminie)"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Warunek: 6 wędrówek w 12 kolejnych miesiącach; ponowne przejście tej samej trasy nie jest zaliczane.",
        "Wycieczki zdobyte dla TJ/TJuniorka zaliczają się do odznaki Turystyczna Rodzinka."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-dla-najmlodszych/",
        "https://pttk.pl/wp-content/uploads/2024/01/o_Turysta_Junior_Juniorka_PTTK_reg.pdf"
      ]
    },
    {
      id: "don",
      official_name: "Dziecięca Odznaka Narciarska",
      abbreviation: "DON",
      discipline: "narciarska",
      family: "dziecięce",
      scope: "ogolnopolska",
      category: "dziecieca_mlodziezowa",
      subcategory: "narciarska",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "dla dzieci w wieku 5-10 lat",
      levels: ["I (jedna śnieżynka)", "II (dwie śnieżynki)", "III (trzy śnieżynki)"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: true,
        self_made_documentation_allowed: false,
        digital_allowed: false,
        digital_constraints: "wpis zdobycia do Książeczki Narciarza"
      },
      confirmation_body: ["udział w imprezie narciarskiej organizowanej przez jednostkę PTTK lub członka kadry narciarskiej PTTK"],
      verification_body: ["Terenowe Referaty Weryfikacyjne"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "DON można zdobyć trzykrotnie, ale tylko raz w jednym sezonie.",
        "Regulamin DON/NOM jest częścią wspólnego regulaminu odznak narciarskich PTTK."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-dla-najmlodszych/",
        "https://pttk.pl/wp-content/uploads/2024/01/o_DON_NOM_reg.pdf"
      ]
    },
    {
      id: "nom",
      official_name: "Narciarska Odznaka Młodzieżowa",
      abbreviation: "NOM",
      discipline: "narciarska",
      family: "dziecięce i młodzieżowe",
      scope: "ogolnopolska",
      category: "dziecieca_mlodziezowa",
      subcategory: "narciarska",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "wiek 10-14 lat: min. 3h lub 10 km na wycieczkę; wiek 15-19 lat: min. 5h lub 15 km; dwie wycieczki w jednym sezonie",
      levels: ["jednostopniowa"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: true,
        self_made_documentation_allowed: false,
        digital_allowed: false,
        digital_constraints: "potwierdzony wpis w Książeczce Narciarza / protokołach narciarskich"
      },
      confirmation_body: ["potwierdzenia z wycieczek narciarskich zgodnie z regulaminem odznak narciarskich"],
      verification_body: ["Terenowe Referaty Weryfikacyjne"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "NOM jest oddzielona od DON i obejmuje młodzieżowe normy czasu/dystansu.",
        "Wspólna ścieżka administracyjna z odznakami narciarskimi PTTK."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-dla-najmlodszych/",
        "https://pttk.pl/wp-content/uploads/2024/01/o_DON_NOM_reg.pdf"
      ]
    },
    {
      id: "kielbik",
      official_name: "Dziecięca Odznaka Kajakowa PTTK KIEŁBIK",
      abbreviation: "KIEŁBIK",
      discipline: "kajakowa",
      family: "dziecięce",
      scope: "ogolnopolska",
      category: "dziecieca_mlodziezowa",
      subcategory: "kajakowa",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "do ukończenia 9 roku życia, pod opieką dorosłych",
      levels: ["brązowy", "srebrny", "złoty"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: true,
        self_made_documentation_allowed: false,
        digital_allowed: false,
        digital_constraints: "podstawą przyznania jest zweryfikowana Książeczka TOK"
      },
      confirmation_body: ["wpis i potwierdzenie każdego spływu w książeczce TOK", "Przodownik Turystyki Kajakowej PTTK lub Instruktor Turystyki PZKaj nadający odznakę"],
      verification_body: ["Terenowe Referaty Weryfikacyjne (za pośrednictwem Komisji Turystyki Kajakowej ZG PTTK)"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Wymagane łączne dni spływów: 2 (brąz), 7 (srebrny), 14 (złoty).",
        "W ciągu roku można zdobyć jeden stopień KIEŁBIKA."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-dla-najmlodszych/",
        "https://pttk.pl/wp-content/uploads/2024/01/Regulamin-Dziecicej-Odznaki-Kajakowej-PTTK-KIEBIK.pdf"
      ]
    },
    {
      id: "ofk",
      official_name: "Odznaka Fotografii Krajoznawczej",
      abbreviation: "OFK",
      discipline: "fotograficzna",
      family: "krajoznawcze specjalistyczne",
      scope: "specjalistyczna_ponadregionalna",
      category: "specjalistyczna",
      subcategory: "fotograficzna",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "brak ograniczeń wiekowych; o przyznanie może ubiegać się każdy spełniający warunki regulaminu",
      levels: ["popularna", "brązowa", "srebrna", "złota", "duża", "honorowa"],
      documentation: {
        required: true,
        official_booklet_available: true,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: true,
        digital_constraints: "podstawą jest Dzienniczek OFK; dopuszczalny notes/zeszyt A5 przy zachowaniu układu i potwierdzeń regulaminowych"
      },
      confirmation_body: ["potwierdzenia wpisów przez Instruktora Fotografii PTTK na podstawie dowodów wiarygodności"],
      verification_body: ["Instruktorzy Fotografii Krajoznawczej dla stopni popularnego i brązowego", "Zespoły Instruktorów FK dla stopnia srebrnego", "Główny Referat Weryfikacyjny dla stopnia złotego i dużego", "Komisja Fotografii Krajoznawczej ZG PTTK dla stopnia honorowego"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "OFK opiera się na punktowym systemie aktywności fotograficznej, krajoznawczej i organizacyjnej.",
        "Kolejność stopni jest obowiązkowa, a nadwyżki punktów mogą przechodzić na wyższy stopień zgodnie z tabelą punktacji."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-krajoznawcze/",
        "https://pttk.pl/wp-content/uploads/2023/12/regulamin_fotograficznej-odznaki-1.pdf",
        "https://kfk.pttk.pl/?page_id=163"
      ]
    },
    {
      id: "kolejowa_odznaka_turystyczna",
      official_name: "Kolejowa Odznaka Turystyczna",
      abbreviation: "KOTR",
      discipline: "kolejowa",
      family: "krajoznawcze specjalistyczne",
      scope: "specjalistyczna_ponadregionalna",
      category: "specjalistyczna",
      subcategory: "kolejowa",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "brak osobnego ograniczenia wieku wskazanego w regulaminie",
      levels: ["brązowa", "srebrna", "złota"],
      documentation: {
        required: true,
        official_booklet_available: false,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: true,
        digital_constraints: "dokumentację prowadzi się samodzielnie w dowolnej formie, z wymaganymi potwierdzeniami terenowymi"
      },
      confirmation_body: ["pieczątki, datowniki, bilety, fotografie", "podpis przodownika turystyki kwalifikowanej PTTK, instruktora krajoznawstwa PTTK, przewodnika lub organizatora imprezy"],
      verification_body: ["Komisja Weryfikacyjna Kolejowej Odznaki Turystycznej przy Zarządzie Oddziału PTTK Pracowników Kolejowych w Poznaniu"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Regulamin zakłada zdobywanie jednego stopnia w roku i kolejność stopni.",
        "Podstawowe wymagania stopni wynikają z tabeli obiektów i aktywności kolejowych."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-krajoznawcze/",
        "https://pttk.pl/wp-content/uploads/2023/12/Kolejowa_Odznaka_Turystyczna_PTTK.pdf"
      ]
    },
    {
      id: "szlakiem_pomnikow_historii",
      official_name: "Ogólnopolska Odznaka Krajoznawcza „Szlakiem Pomników Historii w Polsce”",
      abbreviation: "SPH",
      discipline: "krajoznawcza",
      family: "krajoznawcze ogólnopolskie",
      scope: "ogolnopolska",
      category: "krajoznawcza",
      subcategory: "uniwersalna",
      status: "active",
      source_confidence: "high",
      live_source_status: "official_pdf_live",
      last_verified_at: "2026-04-15",
      age_rule_literal: "brak ograniczeń wieku",
      levels: ["brązowa", "srebrna", "złota"],
      documentation: {
        required: true,
        official_booklet_available: false,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: true,
        digital_constraints: "kronika może być elektroniczna, zapisana na trwałym nośniku"
      },
      confirmation_body: ["w kronice: potwierdzenie zwiedzania np. zdjęcie na tle obiektu, pieczątka, bilet, podpis członka kadry programowej PTTK"],
      verification_body: ["komisje weryfikacyjne Oddziałów PTTK na terenie całego kraju"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Wymagania obiektów: 10 (brąz), 20 (srebro), 30 (złoto) z listy Pomników Historii.",
        "Odznaka może być nadana honorowo przez Zarządy Oddziałów PTTK z pominięciem warunków regulaminu."
      ],
      primary_sources: [
        "https://pttk.pl/odznaki-krajoznawcze/",
        "https://pttk.pl/wp-content/uploads/2023/12/Regulamin_Ogolnopolskiej_Odznaki_Krajoznawczej_Szlakiem_Pomnikow_Historii_w_Polsce.pdf"
      ]
    },
    {
      id: "zpn",
      official_name: "Odznaka Turystyczno-Krajoznawcza PTTK \"Znam Parki Narodowe\"",
      abbreviation: "OTK ZPN",
      discipline: "krajoznawczo-przyrodnicza",
      family: "regionalne lub ponadregionalne specjalistyczne",
      scope: "niepewna",
      category: "specjalistyczna",
      subcategory: "przyrodnicza",
      status: "uncertain_secondary_conflict",
      source_confidence: "low_to_medium",
      live_source_status: "secondary_live_conflict_no_stable_primary",
      last_verified_at: "2026-04-14",
      age_rule_literal: "od 7 roku życia; osoby niepełnoletnie pod opieką dorosłych",
      levels: ["popularna", "brązowa", "srebrna", "złota"],
      documentation: {
        required: true,
        official_booklet_available: false,
        official_booklet_required: false,
        self_made_documentation_allowed: true,
        digital_allowed: true,
        digital_constraints: "kronika elektroniczna dozwolona; publiczny tekst wtórny z 2022 r. wspomina szerokie nośniki cyfrowe oraz przesyłanie mailem lub linkiem"
      },
      source_conflict_note: "Aktualne źródła wtórne nie zgadzają się co do statusu aktywności. Jedna ścieżka wtórna prezentuje tekst regulaminu z 2022 r., a inna oznacza odznakę jako nieaktywną.",
      source_conflict_scope: "secondary",
      review_needed: true,
      confirmation_body: ["kadra programowa PTTK", "instruktorzy harcerscy, nauczyciele i przewodnicy wycieczek", "pieczątki i bilety", "opis, szkic, rysunek lub zdjęcie w razie potrzeby"],
      verification_body: ["Komisja Weryfikacyjna OTK ZPN / Oddział Wolski PTTK"],
      sale_status: "verified_chronicle_authorizes_purchase_and_wearing",
      source_notes: [
        "Bieżący przegląd potwierdził stabilny tekst wtórny regulaminu z 2022 r. i powiązanie z Oddziałem Wolskim PTTK.",
        "Osobne źródło wtórne oznacza tę odznakę jako nieaktywną.",
        "Nie stwierdzać nowelizacji z 2025 r. jako faktu, dopóki nie zostanie znalezione i ponownie sprawdzone oficjalne źródło pierwszego poziomu.",
        "Zachować ten rekord w repozytorium, ale wyraźnie uwidocznić sporny status i potrzebę ręcznej reweryfikacji w UI."
      ],
      primary_sources: [],
      secondary_sources: [
        "http://www.msw-pttk.org.pl/odznaki/reg_odznak/reg_otkzpn_2022.html",
        "https://odznaki.org/odznaka/znam-parki-narodowe/"
      ]
    },
    {
      id: "mok",
      official_name: "Motorowa Odznaka Krajoznawcza",
      abbreviation: "MOK",
      discipline: "motorowa",
      family: "odznaki turystyki motorowej",
      scope: "niepewna",
      category: "specjalistyczna",
      subcategory: "motorowa",
      status: "uncertain_secondary_conflict",
      source_confidence: "low_to_medium",
      live_source_status: "secondary_live_conflict_no_stable_primary",
      last_verified_at: "2026-04-14",
      age_rule_literal: "wymaga weryfikacji — bieżący przegląd nie potwierdził odrębnego regulaminu MOK",
      levels: ["wymaga weryfikacji"],
      source_conflict_note: "Cross_record_warning wymienia MOK jako odrębną nazwę kanoniczną obok TM i MOT, ale bieżący przegląd nie znalazł odrębnego regulaminu ani stabilnej strony tier 1 dla MOK. Regulamin KTM ZG PTTK pokrywa wyłącznie TM i MOT. Na msw-pttk.org.pl skrót MOK oznacza 'Mazowiecką Odznakę Krajoznawczą' (odznaka regionalna krajoznawcza), a odznaki.org zwraca 404 dla 'motorowa-odznaka-krajoznawcza'.",
      source_conflict_scope: "secondary",
      review_needed: true,
      documentation: {
        required: true,
        official_booklet_available: false,
        official_booklet_required: false,
        self_made_documentation_allowed: false,
        digital_allowed: false,
        digital_constraints: "wymaga weryfikacji"
      },
      confirmation_body: ["wymaga weryfikacji"],
      verification_body: ["wymaga weryfikacji"],
      sale_status: "physical_badge_after_verification",
      source_notes: [
        "Cross_record_warning wymaga, by TM, MOT i MOK były oddzielnymi rekordami i facetami wyszukiwania.",
        "Bieżący przegląd nie znalazł odrębnego regulaminu MOK w żadnym źródle tier 1 ani tier 2.",
        "Regulamin KTM ZG PTTK (regulamin-mot-tm) pokrywa wyłącznie Turystę Motorowego i Motorową Odznakę Turystyczną.",
        "Stub do reweryfikacji: jeśli MOK istnieje jako odrębna odznaka, wymaga dodania regulaminu i uzupełnienia pól."
      ],
      primary_sources: [],
      secondary_sources: []
    }
  ],
  cross_record_warnings: [
    { topic: "konflikty_wersji_oficjalnych", warning: "Oficjalne źródła mogą się różnić między wersjami; aktualnie obowiązujące źródło i nadal dostępne starsze dokumenty oficjalne muszą być modelowane oddzielnie i normalizowane przez jeden schemat konfliktu źródeł." },
    { topic: "strony_opisowe_vs_regulaminy", warning: "Ogólne strony opisowe na pttk.pl mogą zawierać uproszczone lub nieaktualne wskazówki wiekowe. Nigdy nie używać ich samodzielnie do kanonicznych pól wiekowych." },
    { topic: "tm_mot_mok", warning: "TM, MOT i MOK muszą pozostać oddzielnymi nazwami kanonicznymi i oddzielnymi facetami wyszukiwania." },
    { topic: "logika_książeczek", warning: "Dostępność oficjalnej książeczki nie oznacza automatycznie, że jest ona wymagana." },
    { topic: "logika_sklepu", warning: "Oficjalny sklep nie oznacza automatycznie prostej sprzedaży detalicznej indywidualnej." },
    { topic: "konflikty_statusów_wtórnych", warning: "Gdy brak stabilnego źródła pierwszego poziomu, a źródła wtórne się nie zgadzają, status powinien pozostać niepewny zamiast active_partially_confirmed, a konflikt powinien być wyrażony przez source_conflict_note plus source_conflict_scope." }
  ]
};

// Helper accessors
export function getBadges() { return sourceOfTruth.badges; }
export function getBadgeById(id: string) { return sourceOfTruth.badges.find(b => b.id === id); }
export function getBooklets() { return sourceOfTruth.booklets; }
export function getShops() { return sourceOfTruth.shops; }
export function getSourceTiers() { return sourceOfTruth.source_tiers; }
export function getMeta() { return sourceOfTruth.meta; }
export function getChangelog() { return sourceOfTruth.meta.changelog; }
export function getCrossRecordWarnings() { return sourceOfTruth.cross_record_warnings; }

export function getBookletsForBadge(badge: Badge): Booklet[] {
  return sourceOfTruth.booklets.filter(b =>
    b.used_by.some(name =>
      badge.abbreviation === name ||
      badge.official_name === name ||
      badge.official_name.includes(name)
    )
  );
}
