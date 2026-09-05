// Does an occurrence-derived envelope behave sanely inside the real engine?
//
// Fitting quantiles is the easy half. The half that decides whether the feature
// ships is what scoring.js does with them at a real site, next to the curated
// EcoCrop envelopes it already carries. This scores every fitted species and
// every Brazilian-native EcoCrop species at six sites whose right answer is
// known from field practice, and prints them side by side.
//
// Run: node test/score_proto.mjs
import { readFileSync, existsSync } from "node:fs";
import { scoreSpecies, aggregateClimate, grade } from "../scoring.js";

const url = p => new URL(p, import.meta.url);
const proto = JSON.parse(readFileSync(url("../data/envelopes_proto.json")));
const ecocrop = JSON.parse(readFileSync(url("../data/species.json")));
const natives = JSON.parse(readFileSync(url("../data/natives.json")));

const SITES = [
  ["Curitiba PR (Araucaria forest, frost)", -25.43, -49.27],
  ["Sao Paulo SP (Atlantic Forest, seasonal)", -23.55, -46.63],
  ["Brasilia DF (Cerrado)", -15.79, -47.88],
  ["Ilheus BA (wet Atlantic Forest)", -14.79, -39.05],
  ["Petrolina PE (Caatinga, semi-arid)", -9.39, -40.5],
  ["Manaus AM (Amazon)", -3.12, -60.02],
];

const CACHE = url("../data/cache/era5_sites.json");

async function climate() {
  if (existsSync(CACHE)) return JSON.parse(readFileSync(CACHE));
  const out = {};
  for (const [name, lat, lng] of SITES) {
    const u = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat.toFixed(4)}` +
      `&longitude=${lng.toFixed(4)}&start_date=2015-01-01&end_date=2024-12-31` +
      `&daily=temperature_2m_mean,temperature_2m_min,precipitation_sum&timezone=auto`;
    for (let a = 0; a < 6; a++) {
      const r = await fetch(u);
      if (r.ok) { out[name] = { ...aggregateClimate((await r.json()).daily), lat }; break; }
      await new Promise(s => setTimeout(s, 20000 * (a + 1)));
    }
    await new Promise(s => setTimeout(s, 2000));
  }
  const { writeFileSync } = await import("node:fs");
  writeFileSync(CACHE, JSON.stringify(out));
  return out;
}

// An occurrence-derived record becomes a species.json-shaped object. Everything
// scoring.js needs and the fit cannot supply (pH, photoperiod, cycle) is null,
// which the engine already treats as "no data" rather than as a pass or a zero.
const asSpecies = r => ({
  sci: r.sci, temp: r.temp, rain: r.rain, ph: null, ktmp: null, ktmpr: r.ktmpr,
  photo: null, cycle: [null, null], gclass: "tropical_medium", src: "fitted",
});

const fitted = proto.species.filter(r => r.temp).map(asSpecies);
const brNative = ecocrop.filter(s => (natives[String(s.id)] || []).includes("BR") &&
  s.lifo === "tree").map(s => ({ ...s, src: "ecocrop" }));
const pool = [...fitted, ...brNative];

const sites = await climate();
for (const [name] of SITES) {
  const site = sites[name];
  if (!site) { console.log(`\n${name}: no climate`); continue; }
  const scored = pool.map(s => ({ s, ...scoreSpecies(s, site) }))
    .sort((a, b) => b.score - a.score || b.fit - a.fit);
  const live = scored.filter(x => x.score > 0);
  const nf = live.filter(x => x.s.src === "fitted").length;
  console.log(`\n${name}`);
  console.log(`  annual ${site.meanTemp.toFixed(1)} C, ${site.annualRain.toFixed(0)} mm, ` +
    `coldest monthly min ${Math.min(...site.tmin).toFixed(1)} C, record low ${site.absMin.toFixed(1)} C`);
  console.log(`  scoring > 0: ${live.length}/${pool.length}  ` +
    `(fitted ${nf}/${fitted.length}, ecocrop ${live.length - nf}/${brNative.length})`);
  console.log("  top 8: " + scored.slice(0, 8)
    .map(x => `${x.s.sci}${x.s.src === "fitted" ? "*" : ""} ${x.score.toFixed(2)}`).join(", "));
  const zeroed = scored.filter(x => x.s.src === "fitted" && x.score === 0);
  if (zeroed.length) {
    console.log("  fitted at zero: " + zeroed.map(x => {
      const f = x.factors;
      const why = f.annual === 0 ? "annual temp outside envelope"
        : f.frost === 0 ? "frost" : f.temp === 0 ? "temp" : f.rain === 0 ? "rain" : "?";
      return `${x.s.sci} (${why})`;
    }).join(", "));
  }
}

// The comparability question: an EcoCrop upper temperature bound above the
// hottest annual mean on Earth (about 31 C) can never bite, while a fitted p98
// bites all the time. Count how often each provenance is actually bounded.
const unbounded = brNative.filter(s => s.temp[3] > 31).length;
console.log(`\nEcoCrop Brazilian natives whose absolute max temp (${"temp[3]"}) exceeds ` +
  `31 C, the hottest annual mean anywhere on Earth, so it can never bind: ` +
  `${unbounded}/${brNative.length}`);
console.log(`Fitted species with the same property: ` +
  `${fitted.filter(s => s.temp[3] > 31).length}/${fitted.length}`);
