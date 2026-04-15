#!/usr/bin/env node
/**
 * CLI Import Tool – Odznaki PTTK Knowledge Hub
 *
 * Importuje nowe rekordy odznak z plików JSON lub Markdown do sourceOfTruth.ts.
 *
 * Użycie:
 *   node scripts/import-badge.mjs <plik.json|plik.md> [--dry-run] [--validate-only]
 *
 * Format JSON:
 *   Obiekt zgodny z interfejsem Badge z types/index.ts
 *
 * Format Markdown:
 *   Nagłówki ## mapowane na pola:
 *     ## id: otp
 *     ## official_name: Odznaka Turystyki Pieszej
 *     ## abbreviation: OTP
 *     ## discipline: piesza
 *     ## family: turystyka kwalifikowana
 *     ## status: active
 *     ## source_confidence: high
 *     ## age_rule_literal: od 6 lat
 *     ## levels: popularna, mała, duża
 *     ## primary_sources:
 *       - https://...
 *     ## source_notes:
 *       - Notatka 1
 *       - Notatka 2
 *
 * Przykład:
 *   node scripts/import-badge.mjs nowa-odznaka.json --dry-run
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, extname } from 'path';

// --- Required fields for Badge ---
const REQUIRED_FIELDS = [
  'id', 'official_name', 'abbreviation', 'discipline', 'family',
  'status', 'source_confidence', 'live_source_status', 'last_verified_at',
  'age_rule_literal', 'levels', 'documentation', 'confirmation_body',
  'verification_body', 'sale_status', 'source_notes', 'primary_sources'
];

const VALID_CONFIDENCE = ['high', 'medium', 'low_to_medium'];
const VALID_STATUS = ['active', 'uncertain_secondary_conflict'];

// --- Parse args ---
const args = process.argv.slice(2);
const flags = args.filter(a => a.startsWith('--'));
const files = args.filter(a => !a.startsWith('--'));
const dryRun = flags.includes('--dry-run');
const validateOnly = flags.includes('--validate-only');

if (files.length === 0) {
  console.error('Użycie: node scripts/import-badge.mjs <plik.json|plik.md> [--dry-run] [--validate-only]');
  process.exit(1);
}

const inputPath = resolve(files[0]);
if (!existsSync(inputPath)) {
  console.error(`Plik nie istnieje: ${inputPath}`);
  process.exit(1);
}

const ext = extname(inputPath).toLowerCase();
const raw = readFileSync(inputPath, 'utf-8');

let badge;

if (ext === '.json') {
  try {
    badge = JSON.parse(raw);
  } catch (e) {
    console.error(`Błąd parsowania JSON: ${e.message}`);
    process.exit(1);
  }
} else if (ext === '.md' || ext === '.markdown') {
  badge = parseMarkdown(raw);
} else {
  console.error(`Nieobsługiwany format pliku: ${ext}. Użyj .json lub .md`);
  process.exit(1);
}

// --- Validate ---
const errors = validate(badge);
if (errors.length > 0) {
  console.error('❌ Błędy walidacji:');
  errors.forEach(e => console.error(`  • ${e}`));
  process.exit(1);
}

console.log(`✅ Walidacja OK: ${badge.id} (${badge.official_name})`);

if (validateOnly) {
  console.log('Tryb --validate-only: nie zapisuję.');
  process.exit(0);
}

if (dryRun) {
  console.log('Tryb --dry-run: wynik importu (nie zapisuję):');
  console.log(JSON.stringify(badge, null, 2));
  process.exit(0);
}

// --- Insert into sourceOfTruth.ts ---
const sourceFile = resolve(import.meta.dirname, '..', 'src', 'data', 'sourceOfTruth.ts');
if (!existsSync(sourceFile)) {
  console.error(`Nie znaleziono pliku źródłowego: ${sourceFile}`);
  process.exit(1);
}

let source = readFileSync(sourceFile, 'utf-8');

// Check for duplicate
if (source.includes(`id: "${badge.id}"`)) {
  console.error(`❌ Rekord o ID "${badge.id}" już istnieje w sourceOfTruth.ts`);
  process.exit(1);
}

// Find the closing of badges array and insert before it
const insertMarker = '  ],\n  cross_record_warnings:';
if (!source.includes(insertMarker)) {
  console.error('❌ Nie znaleziono markera do wstawienia w sourceOfTruth.ts');
  process.exit(1);
}

const badgeTs = formatBadgeAsTs(badge);
source = source.replace(insertMarker, `    ,${badgeTs}\n  ],\n  cross_record_warnings:`);

writeFileSync(sourceFile, source, 'utf-8');
console.log(`✅ Rekord "${badge.id}" dodany do sourceOfTruth.ts`);

// --- Helpers ---

function validate(obj) {
  const errs = [];
  if (!obj || typeof obj !== 'object') {
    return ['Dane nie są obiektem'];
  }
  for (const field of REQUIRED_FIELDS) {
    if (obj[field] === undefined || obj[field] === null) {
      errs.push(`Brak wymaganego pola: ${field}`);
    }
  }
  if (obj.source_confidence && !VALID_CONFIDENCE.includes(obj.source_confidence)) {
    errs.push(`Nieprawidłowa wartość source_confidence: ${obj.source_confidence}`);
  }
  if (obj.status && !VALID_STATUS.includes(obj.status)) {
    errs.push(`Nieprawidłowa wartość status: ${obj.status}`);
  }
  if (obj.levels && !Array.isArray(obj.levels)) {
    errs.push('Pole levels musi być tablicą');
  }
  if (obj.primary_sources && !Array.isArray(obj.primary_sources)) {
    errs.push('Pole primary_sources musi być tablicą');
  }
  if (obj.id && !/^[a-z0-9_]+$/.test(obj.id)) {
    errs.push('Pole id może zawierać tylko małe litery, cyfry i podkreślenia');
  }
  return errs;
}

function parseMarkdown(md) {
  const result = {
    levels: [],
    source_notes: [],
    primary_sources: [],
    secondary_sources: [],
    confirmation_body: [],
    verification_body: [],
    documentation: {
      required: true,
      official_booklet_available: false,
      official_booklet_required: false,
      self_made_documentation_allowed: false,
      digital_allowed: false,
    },
  };

  let currentField = null;
  const lines = md.split('\n');

  for (const line of lines) {
    const headerMatch = line.match(/^##\s+(\w+):\s*(.*)$/);
    if (headerMatch) {
      const [, key, value] = headerMatch;
      currentField = key;
      if (value.trim()) {
        setField(result, key, value.trim());
      }
      continue;
    }

    const listMatch = line.match(/^\s*[-*]\s+(.+)$/);
    if (listMatch && currentField) {
      const val = listMatch[1].trim();
      appendToArray(result, currentField, val);
      continue;
    }
  }

  return result;
}

function setField(obj, key, value) {
  if (key === 'levels' || key === 'source_notes' || key === 'primary_sources' ||
      key === 'secondary_sources' || key === 'confirmation_body' || key === 'verification_body') {
    obj[key] = value.split(',').map(s => s.trim()).filter(Boolean);
  } else if (key === 'official_booklet_available' || key === 'official_booklet_required' ||
             key === 'self_made_documentation_allowed' || key === 'digital_allowed' || key === 'required') {
    obj.documentation[key] = value === 'true' || value === 'tak';
  } else {
    obj[key] = value;
  }
}

function appendToArray(obj, field, value) {
  if (Array.isArray(obj[field])) {
    obj[field].push(value);
  } else if (obj.documentation && field in obj.documentation) {
    // skip
  }
}

function formatBadgeAsTs(b) {
  return '\n' + JSON.stringify(b, null, 6)
    .replace(/"(\w+)":/g, '$1:')
    .replace(/"/g, '"')
    .split('\n')
    .map(line => '    ' + line)
    .join('\n');
}
