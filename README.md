# Odznaki PTTK — Knowledge Hub

Publiczny interfejs do kanonicznego Source of Truth systemu odznak PTTK.
Strona informacyjna pomagająca zrozumieć system odznak, książeczek, regulaminów, weryfikacji i kanałów zakupu.

## Jak uruchomić

```bash
npm install
npm run dev
```

Otwórz `http://localhost:5173` w przeglądarce.

### Moduł propozycji (Vercel all-in-one)

Frontend komunikuje się z backendem po tych samych ścieżkach domeny:

- `GET/POST /api/suggestions`
- `PATCH/DELETE /api/moderate`

Backend działa jako Vercel Serverless Functions w folderze `api/`.
Trwałość danych zapewnia Vercel KV (klucze dostępu wstrzykiwane przez Vercel).

Autoryzacja admina:

- frontend zbiera hasło z formularza
- frontend wysyła je jako `Authorization: Bearer <haslo>`
- backend porównuje wyłącznie z `SUGGESTIONS_ADMIN_PASSWORD`

Nie używaj `VITE_` dla haseł ani sekretów.

### Checklist publikacji na Vercel

1. W Vercel Storage utwórz KV i podepnij do projektu.
2. W Vercel Environment Variables ustaw `SUGGESTIONS_ADMIN_PASSWORD`.
3. Zrób push na GitHub i import projektu w Vercel.
4. Vercel automatycznie zbuduje frontend i wystawi `api/*`.

### Build produkcyjny

```bash
npm run build
npm run preview
```

## Gdzie są dane

Wszystkie dane pochodzą z jednego źródła prawdy:

- **Plik danych**: `src/data/sourceOfTruth.ts`
- **Typy**: `src/types/index.ts`

Dane są ładowane jako moduł TypeScript — zero backendu, zero runtime fetch'ów.
Wersja danych: **v1.2** z 14.04.2026.

## Jak dodać nową odznakę

1. Otwórz `src/data/sourceOfTruth.ts`
2. Dodaj nowy obiekt do tablicy `badges` zgodnie z interfejsem `Badge` z `src/types/index.ts`
3. Wypełnij wszystkie wymagane pola (minimum: `id`, `official_name`, `abbreviation`, `discipline`, `family`, `status`, `source_confidence`, `live_source_status`, `last_verified_at`, `age_rule_literal`, `levels`, `documentation`, `confirmation_body`, `verification_body`, `sale_status`, `source_notes`, `primary_sources`)
4. Odznaka automatycznie pojawi się w katalogu, wyszukiwarce i filtrach

## Jak dodać nową książeczkę

1. Otwórz `src/data/sourceOfTruth.ts`
2. Dodaj nowy obiekt do tablicy `booklets` zgodnie z interfejsem `Booklet`
3. W polu `used_by` podaj skrót lub nazwę odznaki, z którą książeczka jest powiązana
4. Książeczka pojawi się automatycznie na stronie `/ksiazeczki` i w widoku szczegółów odznaki

## Jak oznaczać rekordy konfliktowe

Dodaj do rekordu odznaki pola:
- `source_conflict_note` — opis konfliktu po angielsku
- `source_conflict_scope` — `"official"` (konflikt wersji oficjalnych) lub `"secondary"` (konflikt źródeł wtórnych)
- `review_needed: true` — jeśli rekord wymaga ręcznej reweryfikacji

## Jak działa source_confidence

| Wartość | Znaczenie | Kolor |
|---------|-----------|-------|
| `high` | Źródło oficjalne, żywe, zweryfikowane | 🟢 zielony |
| `medium` | Źródło oficjalne, ale mogą być rozbieżności | 🟡 bursztynowy |
| `low_to_medium` | Brak stabilnego źródła 1. poziomu, źródła wtórne nie zgadzają się | 🔴 czerwono-bursztynowy |

## Jak działa live_source_status

| Wartość | Znaczenie |
|---------|-----------|
| `official_live` | Oficjalna strona lub regulamin żyje i jest dostępny |
| `official_live_with_legacy_conflict` | Oficjalne źródło jest live, ale starsza wersja też żyje |
| `official_pdf_live` | Oficjalny PDF dostępny |
| `official_pdf_live_and_secondary_text_live` | Oficjalny PDF + tekst na stronie wtórnej |
| `secondary_live_conflict_no_stable_primary` | Tylko źródła wtórne, które się nie zgadzają |

## Struktura projektu

```
src/
├── data/
│   └── sourceOfTruth.ts       # Kanoniczne dane (jedyne źródło prawdy)
├── types/
│   └── index.ts                # Interfejsy TypeScript
├── lib/
│   ├── utils.ts                # Etykiety, formatowanie, helpery
│   └── search.ts               # Logika filtrowania i sortowania
├── components/
│   ├── Layout.tsx               # Header + footer + nawigacja
│   ├── SearchBar.tsx            # Pole wyszukiwania
│   ├── FilterPanel.tsx          # Panel filtrów boczny
│   ├── BadgeCard.tsx            # Karta odznaki w katalogu
│   ├── ConfidenceBadge.tsx      # Badge poziomu pewności
│   ├── Pill.tsx                 # Etykieta / pill
│   └── SourceConflictBanner.tsx # Banner konfliktu źródeł
├── pages/
│   ├── Home.tsx                 # Strona główna / landing
│   ├── BadgeExplorer.tsx        # Katalog odznak z filtrami
│   ├── BadgeDetailPage.tsx      # Szczegóły odznaki
│   ├── Booklets.tsx             # Książeczki
│   ├── SourceQuality.tsx        # Jakość źródeł
│   └── FAQ.tsx                  # FAQ / pułapki systemu
├── App.tsx                      # Routing
├── main.tsx                     # Entry point
└── index.css                    # Tailwind + theme
```

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7 (hash routing — działa na static hosting)

## Licencja

To nie jest oficjalna strona PTTK. To niezależny przewodnik oparty na publicznie dostępnych źródłach.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
