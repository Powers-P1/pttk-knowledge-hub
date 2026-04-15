#!/usr/bin/env node
/**
 * Health-check źródeł — Odznaki PTTK Knowledge Hub
 *
 * Sprawdza dostępność wszystkich URL-i z sourceOfTruth:
 *   - primary_sources, secondary_sources, legacy_or_stale_sources (odznaki)
 *   - sources (książeczki)
 *   - sources (sklepy)
 *
 * Użycie:
 *   node scripts/health-check.mjs [--json] [--fix-confidence]
 *
 * Flagi:
 *   --json              Wynik w formacie JSON
 *   --fix-confidence    Zaproponuj obniżenie source_confidence dla rekordów z martwymi źródłami tier 1
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const fixConfidence = args.includes('--fix-confidence');

// ─── Load source data ───
const sourceFile = resolve(import.meta.dirname, '..', 'src', 'data', 'sourceOfTruth.ts');
const raw = readFileSync(sourceFile, 'utf-8');

// Quick extraction: parse exported object from TS
// We re-use a simple approach: extract the JSON-like structure
function extractData() {
  // We'll use a dynamic import approach via a temp file
  // Instead, let's parse the URLs directly with regex — simpler and no TS dependency
  const urls = new Map(); // url -> { owner, type, tier }

  // Extract badge sources
  const badgeBlocks = raw.matchAll(/id:\s*"(\w+)"[\s\S]*?(?=\n    \{|\n  \],)/g);
  for (const match of badgeBlocks) {
    const id = match[1];
    const block = match[0];

    extractUrls(block, /primary_sources:\s*\[([\s\S]*?)\]/g, id, 'primary', urls);
    extractUrls(block, /secondary_sources:\s*\[([\s\S]*?)\]/g, id, 'secondary', urls);
    extractUrls(block, /legacy_or_stale_sources:\s*\[([\s\S]*?)\]/g, id, 'legacy', urls);
  }

  // Extract booklet sources
  const bookletBlocks = raw.matchAll(/id:\s*"(\w+_booklet)"[\s\S]*?(?=\n    \{|\n  \],)/g);
  for (const match of bookletBlocks) {
    const id = match[1];
    const block = match[0];
    extractUrls(block, /sources:\s*\[([\s\S]*?)\]/g, id, 'booklet_source', urls);
  }

  // Extract shop sources
  const shopBlocks = raw.matchAll(/id:\s*"(\w+_shop\w*)"[\s\S]*?(?=\n    \{|\n  \],)/g);
  for (const match of shopBlocks) {
    const id = match[1];
    const block = match[0];
    extractUrls(block, /sources:\s*\[([\s\S]*?)\]/g, id, 'shop_source', urls);
  }

  return urls;
}

function extractUrls(block, regex, ownerId, type, map) {
  for (const m of block.matchAll(regex)) {
    const inner = m[1];
    for (const urlMatch of inner.matchAll(/"(https?:\/\/[^"]+)"/g)) {
      const url = urlMatch[1];
      if (!map.has(url)) {
        map.set(url, []);
      }
      map.get(url).push({ owner: ownerId, type });
    }
  }
}

// ─── Check URLs ───
async function checkUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'PTTK-HealthCheck/1.0 (automated source verification)'
      }
    });
    clearTimeout(timeout);

    return {
      url,
      status: res.status,
      ok: res.ok,
      redirected: res.redirected,
      finalUrl: res.url !== url ? res.url : null,
      error: null,
    };
  } catch (err) {
    clearTimeout(timeout);

    // Some servers reject HEAD, try GET
    try {
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 15000);
      const res = await fetch(url, {
        method: 'GET',
        signal: controller2.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'PTTK-HealthCheck/1.0 (automated source verification)',
          'Range': 'bytes=0-1024',
        }
      });
      clearTimeout(timeout2);

      return {
        url,
        status: res.status,
        ok: res.ok,
        redirected: res.redirected,
        finalUrl: res.url !== url ? res.url : null,
        error: null,
        note: 'HEAD rejected, used GET'
      };
    } catch (err2) {
      return {
        url,
        status: null,
        ok: false,
        redirected: false,
        finalUrl: null,
        error: err2.cause?.code || err2.message || 'unknown',
      };
    }
  }
}

// ─── Tier classification ───
const TIER1_DOMAINS = ['kartoteki.pttk.pl', 'pttk.pl', 'kkraj.pttk.pl', 'ktg.pttk.pl', 'ktmzg.pttk.pl'];
const TIER2_DOMAINS = ['sklepcotg.pttk.pl', 'sklep.pttk.pl'];

function getTier(url) {
  try {
    const host = new URL(url).hostname;
    if (TIER1_DOMAINS.some(d => host === d || host.endsWith('.' + d))) return 1;
    if (TIER2_DOMAINS.some(d => host === d || host.endsWith('.' + d))) return 2;
    return 3;
  } catch {
    return 3;
  }
}

// ─── Main ───
async function main() {
  const urlMap = extractData();
  const allUrls = [...urlMap.keys()];

  if (!jsonOutput) {
    console.log(`\n🔍 Sprawdzanie ${allUrls.length} unikalnych URL-i...\n`);
  }

  // Check in batches of 5 to avoid flooding
  const results = [];
  const batchSize = 5;
  for (let i = 0; i < allUrls.length; i += batchSize) {
    const batch = allUrls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);

    if (!jsonOutput) {
      for (const r of batchResults) {
        const icon = r.ok ? '✅' : r.status === 403 ? '🔒' : '❌';
        const status = r.status ? `${r.status}` : r.error;
        const owners = urlMap.get(r.url).map(o => `${o.owner}(${o.type})`).join(', ');
        console.log(`  ${icon} [${status}] ${r.url}`);
        console.log(`     → ${owners}`);
        if (r.redirected && r.finalUrl) {
          console.log(`     ↳ Redirect → ${r.finalUrl}`);
        }
        if (r.note) {
          console.log(`     ⚠ ${r.note}`);
        }
      }
    }
  }

  // ─── Summary ───
  const ok = results.filter(r => r.ok);
  const dead = results.filter(r => !r.ok);
  const tier1Dead = dead.filter(r => getTier(r.url) === 1);

  if (jsonOutput) {
    const report = {
      timestamp: new Date().toISOString(),
      total: allUrls.length,
      ok: ok.length,
      dead: dead.length,
      tier1_dead: tier1Dead.length,
      results: results.map(r => ({
        ...r,
        tier: getTier(r.url),
        owners: urlMap.get(r.url),
      })),
    };

    if (fixConfidence) {
      report.confidence_suggestions = [];
      for (const r of tier1Dead) {
        const owners = urlMap.get(r.url);
        for (const o of owners) {
          if (o.type === 'primary') {
            report.confidence_suggestions.push({
              badge: o.owner,
              reason: `Marte źródło tier 1: ${r.url} (${r.status || r.error})`,
              suggestion: 'Obniż source_confidence lub oznacz review_needed: true',
            });
          }
        }
      }
    }

    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📊 PODSUMOWANIE`);
    console.log(`   Sprawdzono:     ${allUrls.length} URL-i`);
    console.log(`   ✅ Dostępne:    ${ok.length}`);
    console.log(`   ❌ Niedostępne: ${dead.length}`);
    console.log(`   🔴 Tier 1 martwe: ${tier1Dead.length}`);

    if (dead.length > 0) {
      console.log(`\n❌ NIEDOSTĘPNE ŹRÓDŁA:`);
      for (const r of dead) {
        const tier = getTier(r.url);
        const owners = urlMap.get(r.url).map(o => o.owner).join(', ');
        console.log(`   [tier ${tier}] ${r.url}`);
        console.log(`     Status: ${r.status || r.error} | Używany przez: ${owners}`);
      }
    }

    if (fixConfidence && tier1Dead.length > 0) {
      console.log(`\n⚠️  SUGESTIE OBNIŻENIA source_confidence:`);
      for (const r of tier1Dead) {
        const owners = urlMap.get(r.url).filter(o => o.type === 'primary');
        for (const o of owners) {
          console.log(`   → ${o.owner}: martwe źródło tier 1 (${r.url})`);
          console.log(`     Sugestia: source_confidence → "medium" lub review_needed: true`);
        }
      }
    }

    if (dead.length === 0) {
      console.log(`\n🎉 Wszystkie źródła dostępne!`);
    }
  }

  // Exit code
  process.exit(tier1Dead.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Błąd health-check:', err);
  process.exit(2);
});
