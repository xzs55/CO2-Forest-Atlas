import { writeFile } from "node:fs/promises";

const OWID_URL = "https://ourworldindata.org/grapher/annual-co2-emissions-per-country.csv?v=1&csvType=full&useColumnShortNames=false";
const WORLD_BANK_URL = "https://api.worldbank.org/v2/country?format=json&per_page=400";

function csvRow(line) {
  const fields = [];
  let value = "", quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') { value += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { fields.push(value); value = ""; }
    else value += char;
  }
  fields.push(value);
  return fields;
}

const [csvResponse, countryResponse] = await Promise.all([
  fetch(OWID_URL, { headers: { "user-agent": "CO2 Forest Atlas data updater/1.0" } }),
  fetch(WORLD_BANK_URL, { headers: { "user-agent": "CO2 Forest Atlas data updater/1.0" } }),
]);
if (!csvResponse.ok) throw new Error(`OWID download failed: ${csvResponse.status}`);
if (!countryResponse.ok) throw new Error(`World Bank country codes failed: ${countryResponse.status}`);

const [csv, countryPayload] = await Promise.all([csvResponse.text(), countryResponse.json()]);
const iso3To2 = new Map(countryPayload[1]
  .filter(country => /^[A-Z]{3}$/.test(country.id) && /^[A-Z]{2}$/.test(country.iso2Code))
  .map(country => [country.id, country.iso2Code]));

const lines = csv.trim().split(/\r?\n/);
const headers = csvRow(lines.shift());
const entityIndex = headers.indexOf("Entity");
const codeIndex = headers.indexOf("Code");
const yearIndex = headers.indexOf("Year");
const valueIndex = headers.findIndex(header => /Annual CO₂ emissions/.test(header));
if ([entityIndex, codeIndex, yearIndex, valueIndex].some(index => index < 0)) throw new Error("OWID CSV schema changed");

const series = {};
let firstYear = Infinity, latestYear = -Infinity;
for (const line of lines) {
  const row = csvRow(line);
  const iso3 = row[codeIndex];
  const key = iso3 === "OWID_WRL" ? iso3 : iso3To2.get(iso3);
  const year = Number(row[yearIndex]);
  const value = Number(row[valueIndex]);
  if (!key || year < 1950 || !Number.isFinite(value)) continue;
  (series[key] ??= []).push([year, Math.round(value)]);
  firstYear = Math.min(firstYear, year);
  latestYear = Math.max(latestYear, year);
}

const output = {
  meta: {
    source: "Our World in Data / Global Carbon Budget",
    sourceUrl: OWID_URL,
    generatedAt: new Date().toISOString().slice(0, 10),
    firstYear,
    latestYear,
    countryCount: Object.keys(series).filter(key => key !== "OWID_WRL").length,
  },
  series,
};

await writeFile(new URL("../data/co2-history.json", import.meta.url), `${JSON.stringify(output)}\n`, "utf8");
console.log(`Wrote ${output.meta.countryCount} countries, ${firstYear}-${latestYear}`);
