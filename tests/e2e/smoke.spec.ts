import { test, expect } from '@playwright/test';

test('strona główna renderuje nagłówek', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.getByRole('heading', { name: /system odznak pttk/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Odznaki$/i })).toBeVisible();
});

test('katalog odznak działa i pokazuje wyniki', async ({ page }) => {
  await page.goto('/#/odznaki');
  await expect(page.getByRole('heading', { name: /katalog odznak pttk/i })).toBeVisible();
  await expect(page.getByText(/wynik/i).first()).toBeVisible();
});

test('szczegóły odznaki GOT renderują konflikty', async ({ page }) => {
  await page.goto('/#/odznaki/got');
  await expect(page.getByRole('heading', { name: /górska odznaka turystyczna/i })).toBeVisible();
  await expect(page.getByText(/konflikt/i).first()).toBeVisible();
});

test('porównanie odznak pozwala wybrać dwie odznaki', async ({ page }) => {
  await page.goto('/#/porownaj');
  await page.getByRole('button', { name: /otp/i }).click();
  await page.getByRole('button', { name: /got/i }).click();
  await expect(page.getByText(/zasady wiekowe/i)).toBeVisible();
});

test('propozycje: użytkownik dodaje zgłoszenie i admin zmienia status', async ({ page }) => {
  await page.goto('/#/propozycje');

  await expect(page.getByRole('heading', { name: /propozycje użytkowników/i })).toBeVisible();

  await page.getByLabel('Typ propozycji').selectOption('odznaka');
  await page.getByLabel('Tytuł').fill('Testowa odznaka e2e');
  await page.getByLabel('Opis propozycji').fill('Dodajcie proszę odznakę testową wraz z regulaminem.');
  await page.getByLabel('Link do źródła (opcjonalnie)').fill('https://example.com/regulamin-test');
  await page.getByLabel('Kontakt (opcjonalnie)').fill('tester@example.com');
  await page.getByRole('button', { name: /wyślij propozycję/i }).click();

  await expect(page.getByText(/propozycja została zapisana/i)).toBeVisible();
  await expect(page.getByText(/Testowa odznaka e2e/i)).toBeVisible();
  await expect(page.getByText(/Oczekuje/i).first()).toBeVisible();

  await page.getByPlaceholder('Hasło admina').fill('pttk-admin');
  await page.getByRole('button', { name: /zaloguj/i }).click();
  await expect(page.getByText(/token admina zapisany/i)).toBeVisible();

  const decisionSelect = page.locator('article').filter({ hasText: 'Testowa odznaka e2e' }).getByRole('combobox');
  await decisionSelect.selectOption('modified');
  const noteInput = page.locator('article').filter({ hasText: 'Testowa odznaka e2e' }).getByPlaceholder('Notatka admina (opcjonalnie)');
  await noteInput.fill('Doprecyzowano nazwę odznaki przed publikacją.');
  await page.locator('article').filter({ hasText: 'Testowa odznaka e2e' }).getByRole('button', { name: 'Zapisz' }).click();

  await expect(
    page
      .locator('article')
      .filter({ hasText: 'Testowa odznaka e2e' })
      .locator('span.bg-sky-100.text-sky-700')
      .first()
  ).toBeVisible();
});
