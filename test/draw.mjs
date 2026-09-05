// Interactive draw-tool test via CDP: drop 3 vertices, close with right-click,
// then again with double-click. Verifies the polygon actually closes (the hash
// flips to #p= with 3 pairs). Requires the app served on :8877.
import { spawn } from "node:child_process";
import assert from "node:assert";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;
const APP = "http://localhost:8877/index.html";

const profile = `/tmp/cdp-draw-${process.pid}`;
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, "--headless=new", "--disable-gpu",
  "--window-size=1280,800", `--user-data-dir=${profile}`, APP,
], { stdio: "ignore" });
const die = code => { chrome.kill(); process.exit(code); };

const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 40; i++) {
  try {
    const list = await (await fetch(`http://localhost:${PORT}/json`)).json();
    target = list.find(t => t.type === "page" && t.url.includes("localhost:8877"));
    if (target) break;
  } catch {}
  await sleep(250);
}
if (!target) { console.error("FAIL: chrome target never appeared"); die(1); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let msgId = 0;
const pending = new Map();
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
const send = (method, params = {}) => new Promise(res => {
  const i = ++msgId; pending.set(i, res);
  ws.send(JSON.stringify({ id: i, method, params }));
});
const js = async expr =>
  (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.result?.value;

async function mouse(type, x, y, button = "left", clickCount = 1) {
  await send("Input.dispatchMouseEvent", { type, x, y, button, clickCount });
}
async function click(x, y, button = "left") {
  await mouse("mousePressed", x, y, button);
  await mouse("mouseReleased", x, y, button);
}

// wait for the app to boot (map + species loaded)
for (let i = 0; i < 60; i++) {
  if (await js("!!window.canopy && !!document.getElementById('draw-btn')")) break;
  await sleep(250);
}
assert.ok(await js("!!window.canopy"), "app booted");

async function drawAndClose(closeGesture, label) {
  await js("location.hash = ''; document.getElementById('draw-btn').classList.contains('armed') || document.getElementById('draw-btn').click()");
  await sleep(200);
  await click(420, 300); await sleep(120);
  await click(700, 320); await sleep(120);
  await click(560, 520); await sleep(120);
  await closeGesture();
  let hash = "";
  for (let i = 0; i < 20; i++) {
    hash = await js("location.hash");
    if (hash.startsWith("#p=")) break;
    await sleep(200);
  }
  const pairs = (hash.match(/-?[\d.]+,-?[\d.]+/g) ?? []).length;
  assert.ok(hash.startsWith("#p=") && pairs >= 3, `${label}: polygon closed (hash=${hash.slice(0, 40)}..., pairs=${pairs})`);
  console.log(`ok: ${label} closes the polygon (${pairs} vertices)`);
}

try {
  await drawAndClose(() => click(560, 520, "right"), "right-click");
  // CDP's Input domain does not synthesize dblclick from clickCount:2, so
  // dispatch a real DOM dblclick at the last vertex instead (same code path
  // through Leaflet's listener as a user double-click).
  await drawAndClose(() => js(
    "document.getElementById('map').dispatchEvent(new MouseEvent('dblclick', {bubbles: true, clientX: 561, clientY: 521}))"
  ), "double-click");
  console.log("draw test passed");
  die(0);
} catch (e) {
  console.error("FAIL:", e.message);
  die(1);
}
