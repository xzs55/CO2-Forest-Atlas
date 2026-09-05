import { readFileSync } from "node:fs";
import { scoreSpecies } from "../scoring.js";

const url = p => new URL(p, import.meta.url);
const species = JSON.parse(readFileSync(url("../data/species.json")));
const namesTr = JSON.parse(readFileSync(url("../data/names_tr.json")));

console.log(`Loaded ${species.length} species from species.json.`);

// 1. Verify Zea mays (Maize ID 2175)
const maize = species.find(s => s.id === 2175);
if (!maize) throw new Error("FAIL: Zea mays (id 2175) is missing from species.json");
if (maize.sci !== "Zea mays") throw new Error(`FAIL: Unexpected scientific name ${maize.sci}`);
if (maize.porte !== "grass") throw new Error(`FAIL: Expected porte grass, got ${maize.porte}`);
if (maize.tree !== false) throw new Error(`FAIL: Expected tree false, got ${maize.tree}`);
if (maize.annual !== true) throw new Error(`FAIL: Expected annual true, got ${maize.annual}`);
if (!maize.uses.includes("food")) throw new Error(`FAIL: Expected food use for maize, got ${maize.uses}`);
console.log("PASS: Zea mays (ID 2175) metadata and flags verified.");

// 2. Verify Sweet Potato (Ipomoea batatas ID 1265)
const sweetPotato = species.find(s => s.id === 1265);
if (!sweetPotato) throw new Error("FAIL: Ipomoea batatas (id 1265) missing");
if (!sweetPotato.uses.includes("food")) throw new Error("FAIL: Sweet potato missing food use");
console.log("PASS: Ipomoea batatas (ID 1265) verified.");

// 3. Verify Sugarcane (Saccharum officinarum ID 1884)
const sugarcane = species.find(s => s.id === 1884);
if (!sugarcane) throw new Error("FAIL: Saccharum officinarum (id 1884) missing");
if (!sugarcane.uses.includes("food")) throw new Error("FAIL: Sugarcane missing food use");
console.log("PASS: Saccharum officinarum (ID 1884) verified.");

// 4. Verify Chir Pine (Pinus roxburghii ID 8653)
const chirPine = species.find(s => s.id === 8653);
if (!chirPine) throw new Error("FAIL: Pinus roxburghii (id 8653) missing");
if (chirPine.porte !== "tree" || chirPine.tree !== true || chirPine.wood !== "conifer") {
  throw new Error(`FAIL: Incorrect habit for Pinus roxburghii: ${JSON.stringify(chirPine)}`);
}
console.log("PASS: Pinus roxburghii (ID 8653) verified.");

// 5. Verify Turkish names mapping
if (namesTr[String(maize.id)]?.nome !== "mısır") {
  throw new Error(`FAIL: Turkish name for maize expected 'mısır', got ${namesTr[String(maize.id)]?.nome}`);
}
if (namesTr[String(sweetPotato.id)]?.nome !== "tatlı patates") {
  throw new Error(`FAIL: Turkish name for sweet potato expected 'tatlı patates', got ${namesTr[String(sweetPotato.id)]?.nome}`);
}
if (namesTr[String(sugarcane.id)]?.nome !== "şeker kamışı") {
  throw new Error(`FAIL: Turkish name for sugarcane expected 'şeker kamışı', got ${namesTr[String(sugarcane.id)]?.nome}`);
}
console.log("PASS: Turkish localization verified for recovered taxa.");

// 6. Verify scoring engine execution for recovered taxa
const mockSite = {
  tavg: [6.5, 7.8, 10.5, 15.2, 20.1, 24.8, 28.2, 28.0, 23.5, 17.8, 12.4, 8.0],
  tmin: [2.1, 3.2, 5.5, 9.2, 13.5, 17.8, 21.0, 21.2, 17.0, 12.0, 7.2, 3.5],
  prec: [90, 75, 60, 45, 35, 15, 5, 5, 20, 50, 80, 100],
  ph: 6.8,
  lat: 37.0,
  absMin: -2.0,
};

for (const sp of [maize, sweetPotato, sugarcane, chirPine]) {
  const res = scoreSpecies(sp, mockSite);
  if (typeof res.score !== "number" || Number.isNaN(res.score)) {
    throw new Error(`FAIL: Invalid score for ${sp.sci}: ${JSON.stringify(res)}`);
  }
}
console.log("PASS: Scoring engine successfully scored all recovered species.");

console.log("\nall recovery tests passed");
