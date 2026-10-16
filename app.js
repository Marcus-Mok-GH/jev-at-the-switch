/* Jev at the Switch — a trolley-problem game powered by Jev on Pollinations.
 * Users pay with their own Pollen (BYOP). No key is ever stored beyond this tab.
 */
"use strict";

/* ---------- configuration ---------- */
const APP_KEY = ""; // publishable pk_… key; blank = consent screen falls back to this site's hostname
const AUTH_BASE = "https://enter.pollinations.ai";
const GEN_API = "https://gen.pollinations.ai";
const JEV_MODEL = "typesafe/jev-1.13";
const KEY_STORAGE = "jevSwitch.key";
const STATE_STORAGE = "jevSwitch.state";
const SCALE = [
  "Never acceptable",
  "Gravely wrong",
  "Wrong, but defensible",
  "Morally permissible",
  "Clearly the right call",
];

/* ---------- scenarios ---------- */
const SCENARIOS = [
  {
    id: "classic",
    title: "The Original Lever",
    kind: "track",
    chip: "the classic",
    story:
      "A runaway trolley is about to kill five people who are tied to the main track. You are standing next to a lever that can divert it onto a side track, where one person is tied. There is no other way to stop the trolley.",
    facts: [
      "Runaway trolley on the main track; its brakes have failed.",
      "Five people are tied to the main track and cannot escape.",
      "One person is tied to the side track.",
      "The lever diverts the trolley from the main track to the side track.",
      "There is no time to warn or untie anyone; no other way to stop the trolley exists.",
    ],
    intervene: "Throw the lever",
    refrain: "Do nothing",
    actionPhrase: "throw the lever and divert the trolley",
    interveneDesc: "Divert the trolley onto the side track; the one person dies, the five are saved.",
    refrainDesc: "Let the trolley run on the main track; the five die, the one is spared.",
    means: false,
    phil: "Foot (1967) framed it as killing one to let five live. Most people say pull — until the next variant.",
  },
  {
    id: "loop",
    title: "The Loop",
    kind: "loop",
    chip: "variation",
    story:
      "The side track loops back onto the main track. The one person tied there is large enough that their body would stop the trolley before it returns to the main track. If they were not there, the trolley would loop around and kill the five anyway.",
    facts: [
      "Runaway trolley on the main track; its brakes have failed.",
      "Five people are tied to the main track.",
      "The side track loops back onto the main track.",
      "One large person is tied on the loop; their body would stop the trolley.",
      "Without that person, the trolley would continue around the loop and kill the five.",
      "The only way to save the five is for the one to be struck and stop the trolley.",
    ],
    intervene: "Throw the lever",
    refrain: "Do nothing",
    actionPhrase: "throw the lever, knowing the one person's body must stop the trolley",
    interveneDesc: "Divert the trolley into the loop; the one person's death is what saves the five.",
    refrainDesc: "Let the trolley run straight; the five die, the one is never touched.",
    means: true,
    phil: "The loop erases the line between killing and letting die: here the one dies only so the five can live.",
  },
  {
    id: "heavy",
    title: "The Heavy Man on the Siding",
    kind: "track",
    chip: "variation",
    story:
      "A heavy worker is trapped on the side track — he cannot move. Diverting the trolley onto the siding kills him, but his body stops the trolley before it can reach the five. You could not stop the trolley in any other way.",
    facts: [
      "Runaway trolley on the main track; its brakes have failed.",
      "Five people are tied to the main track.",
      "A heavy worker is trapped on the side track and cannot escape.",
      "His body would stop the trolley, guaranteeing the five survive.",
      "No other way to stop the trolley exists.",
    ],
    intervene: "Throw the lever",
    refrain: "Do nothing",
    actionPhrase: "throw the lever, using his body to stop the trolley",
    interveneDesc: "Divert the trolley; the trapped man's death stops it and saves the five.",
    refrainDesc: "Let the trolley run; the five die, the trapped man survives.",
    means: true,
    phil: "If his body stopping the trolley is what saves them, is diverting still just redirecting harm?",
  },
  {
    id: "footbridge",
    title: "The Footbridge",
    kind: "bridge",
    chip: "the hard one",
    story:
      "You are on a footbridge above the track with a large stranger. The trolley is heading toward the five. The only way to stop it is to push the stranger off the bridge into its path. You are too small to stop the trolley yourself; he is.",
    facts: [
      "Runaway trolley on the track; its brakes have failed.",
      "Five people are tied to the track ahead.",
      "You and a large stranger stand on a footbridge over the track.",
      "Pushing the stranger into the trolley's path would stop it and save the five.",
      "You are too small to stop the trolley by jumping yourself.",
      "The stranger has done nothing wrong and is unaware of the situation.",
    ],
    intervene: "Push the stranger",
    refrain: "Do nothing",
    actionPhrase: "push the stranger off the bridge into the trolley's path",
    interveneDesc: "Use the stranger's body to stop the trolley; he dies, the five are saved.",
    refrainDesc: "Watch the trolley pass under the bridge; the five die, the stranger lives.",
    means: true,
    phil: "Thomson's bridge: pushing feels different from switching. Killing as a means versus a side-effect.",
  },
  {
    id: "villain",
    title: "The Saboteur on the Siding",
    kind: "track",
    chip: "desert",
    story:
      "The trolley is loose because one man sabotaged the brakes and tied the five workers to the main track for his own gain. He then got stranded on the side track. Diverting the trolley kills him and saves his five intended victims.",
    facts: [
      "The trolley's brakes were sabotaged and the five were tied to the track by one man.",
      "The saboteur is now stranded on the side track.",
      "Diverting the trolley onto the side track kills the saboteur and saves the five.",
      "The five victims are innocent; the saboteur caused the entire situation.",
    ],
    intervene: "Throw the lever",
    refrain: "Do nothing",
    actionPhrase: "throw the lever onto the saboteur's track",
    interveneDesc: "Divert the trolley; the guilty saboteur dies, his five victims are saved.",
    refrainDesc: "Let the trolley run; the five innocent victims die, the saboteur survives.",
    means: false,
    phil: "Judging desert — the saboteur invited the harm. Does guilt change the arithmetic?",
  },
  {
    id: "friend",
    title: "Your Best Friend on the Siding",
    kind: "track",
    chip: "partiality",
    story:
      "The trolley is heading toward five strangers. But the person trapped on the side track — the one who would die if you pull — is your best friend. You know the five only as silhouettes.",
    facts: [
      "Runaway trolley on the main track; its brakes have failed.",
      "Five strangers are tied to the main track.",
      "The one person on the side track is your best friend.",
      "Diverting the trolley kills your friend and saves the five strangers.",
    ],
    intervene: "Throw the lever",
    refrain: "Do nothing",
    actionPhrase: "throw the lever, sacrificing your best friend for five strangers",
    interveneDesc: "Divert the trolley; your friend dies, five strangers are saved.",
    refrainDesc: "Let the trolley run; the five strangers die, your friend survives.",
    means: false,
    phil: "The partiality test: morality at 2am, when the one on the siding is yours.",
  },
  {
    id: "steer",
    title: "The Steering Wheel",
    kind: "steer",
    chip: "you're driving",
    story:
      "You are driving the trolley when the brakes fail. Straight ahead, five workers are stuck on the track. You can swerve into the siding — where one worker is stuck. Swerving kills him; going straight kills five. Those are the only two options.",
    facts: [
      "You are driving the trolley; the brakes have failed and you cannot stop.",
      "Five workers are stuck on the straight track.",
      "One worker is stuck on the siding.",
      "Your only options are to continue straight (five die) or swerve (one dies).",
      "There is no third path and no time for anyone to move.",
    ],
    intervene: "Swerve onto the siding",
    refrain: "Keep going straight",
    actionPhrase: "swerve the trolley onto the siding",
    interveneDesc: "Actively steer into the siding; one dies instead of five.",
    refrainDesc: "Hold your line; the five die while you did not steer toward anyone.",
    means: false,
    phil: "When you're driving, doing nothing is no longer 'letting' — your hands are already on the wheel.",
  },
  {
    id: "ward",
    title: "The Transplant Ward",
    kind: "ward",
    chip: "not a trolley at all",
    story:
      "No trolley this time. Five patients in your ward will die tonight without organ transplants. A healthy traveler has just walked in for a check-up. His organs could save all five. Nobody would ever know how they were obtained; he would not survive the harvest.",
    facts: [
      "Five patients will die tonight without organ transplants that are unavailable otherwise.",
      "A healthy traveler is in your hospital for a routine check-up.",
      "Harvesting his organs would save all five patients.",
      "The traveler is an innocent person with no connection to the situation.",
      "He would not consent; the only reason to take his organs is to use them to save the five.",
    ],
    intervene: "Harvest his organs",
    refrain: "Turn him away unharmed",
    actionPhrase: "harvest the traveler's organs to save the five patients",
    interveneDesc: "Kill one unwilling traveler to save five dying patients.",
    refrainDesc: "Send the traveler home healthy; the five patients die of their illnesses.",
    means: true,
    phil: "The surgeon's case: identical arithmetic to the lever, and the one place most utilitarians blink.",
  },
];

/* ---------- tiny dom helpers ---------- */
const $ = (id) => document.getElementById(id);
const show = (el) => el.removeAttribute("hidden");
const hide = (el) => el.setAttribute("hidden", "");

/* ---------- state ---------- */
let key = sessionStorage.getItem(KEY_STORAGE) || null;
let idx = 0;
let answers = []; // {scenario, user: bool, jev: bool}
let spentTokens = 0;

/* ---------- BYOP auth (fragment flow, PKCE-less legacy) ---------- */
function redirectUri() {
  return location.origin + location.pathname;
}
function connect() {
  sessionStorage.setItem(STATE_STORAGE, crypto.randomUUID());
  const params = new URLSearchParams({ redirect_uri: redirectUri(), scope: "usage", state: sessionStorage.getItem(STATE_STORAGE) });
  if (APP_KEY) params.set("client_id", APP_KEY);
  location.href = `${AUTH_BASE}/authorize?${params}`;
}
function handleCallback() {
  const frag = new URLSearchParams(location.hash.slice(1));
  if (frag.get("error")) {
    const err = $("authError");
    err.textContent = "Authorization was declined. You can still paste your own API key below.";
    show(err);
    history.replaceState(null, "", redirectUri());
    return;
  }
  const token = frag.get("api_key");
  if (token) {
    sessionStorage.setItem(KEY_STORAGE, token);
    key = token;
    history.replaceState(null, "", redirectUri());
  }
}

/* ---------- api ---------- */
async function askJev(sc) {
  const body = {
    model: JEV_MODEL,
    state: {
      setting: "A trolley-problem thought experiment in an interactive philosophy game.",
      dilemma: sc.title,
      situation: sc.story,
      facts: sc.facts,
    },
    questions: {
      action: {
        type: "choice",
        instructions:
          `Should the decision-maker ${sc.actionPhrase}? Choose the option a person should take in this situation.`,
        criteria: { intervene: sc.interveneDesc, refrain: sc.refrainDesc },
      },
      moral_intervene: {
        type: "score",
        instructions: `How morally acceptable is it to ${sc.actionPhrase}?`,
        criteria: SCALE,
      },
      moral_refrain: {
        type: "score",
        instructions: "How morally acceptable is it to do nothing and let the situation take its course?",
        criteria: SCALE,
      },
    },
  };
  const res = await fetch(`${GEN_API}/alpha/decisions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || `Jev could not answer (HTTP ${res.status}).`;
    const e = new Error(msg);
    e.status = res.status;
    throw e;
  }
  return data;
}

async function refreshBalance() {
  if (!key) return;
  try {
    const res = await fetch(`${GEN_API}/account/balance`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    if (typeof data.balance !== "number") return;
    const chip = $("pollenChip");
    chip.textContent = `🌼 ${data.balance.toFixed(2)} Pollen`;
    show(chip);
  } catch (_) { /* the chip is decorative */ }
}

/* ---------- svg scenes ---------- */
function person(x, y, cls, label) {
  return `<g><circle cx="${x}" cy="${y - 14}" r="6" class="person ${cls}"/><rect x="${x - 4.5}" y="${y - 7}" width="9" height="15" rx="4" class="person ${cls}"/><text x="${x}" y="${y + 20}" text-anchor="middle" class="person-label">${label ?? ""}</text></g>`;
}
function ties(x1, x2, y, n) {
  let s = "";
  for (let i = 0; i <= n; i++) {
    const x = x1 + ((x2 - x1) * i) / n;
    s += `<line x1="${x}" y1="${y - 7}" x2="${x}" y2="${y + 7}" class="track-tie"/>`;
  }
  return s;
}
function tram(x, y) {
  return `<g transform="translate(${x},${y})">
    <rect x="-26" y="-24" width="52" height="34" rx="7" class="tram-body"/>
    <rect x="-18" y="-17" width="14" height="11" rx="2" class="tram-win"/>
    <rect x="4" y="-17" width="14" height="11" rx="2" class="tram-win"/>
    <circle cx="-14" cy="13" r="5" fill="#2a2138"/><circle cx="14" cy="13" r="5" fill="#2a2138"/>
    <text x="0" y="30" text-anchor="middle" class="person-label">🚋 runaway</text>
  </g>`;
}
function lever(x, y) {
  return `<g transform="translate(${x},${y})">
    <rect x="-9" y="-2" width="18" height="10" rx="4" fill="#3a3350"/>
    <line x1="0" y1="-2" x2="12" y2="-22" class="lever-pole"/>
    <circle cx="12" cy="-22" r="5" class="lever-knob"/>
    <text x="0" y="26" text-anchor="middle" class="person-label">the lever (you)</text>
  </g>`;
}
function sceneTrack(sc) {
  const loop = sc.kind === "loop";
  const steer = sc.kind === "steer";
  const mainY = 170;
  const branchY = 250;
  let svg = `<svg viewBox="0 0 640 310" role="img" aria-label="trolley track diagram">`;
  svg += `<line x1="20" y1="${mainY}" x2="620" y2="${mainY}" class="track-line"/>` + ties(20, 620, mainY, 24);
  if (loop) {
    svg += `<path d="M320 170 C 340 300, 520 320, 545 170" class="track-line"/>`;
  } else {
    svg += `<path d="M320 ${mainY} C 390 ${mainY + 20}, 430 ${branchY - 30}, 470 ${branchY}" class="track-line"/>`;
    svg += `<line x1="470" y1="${branchY}" x2="620" y2="${branchY}" class="track-line"/>` + ties(470, 620, branchY, 8);
  }
  svg += tram(70, mainY + 20);
  for (let i = 0; i < 5; i++) svg += person(520 + i * 22, mainY - 4, "doomed", i === 2 ? "five, tied" : "");
  svg += person(loop ? 545 : 560, branchY - 4, "means", "the one");
  svg += steer
    ? `<g transform="translate(70,104)"><text x="0" y="0" class="person-label">you drive 🎡 brakes dead</text></g>`
    : lever(320, mainY);
  svg += `<text x="470" y="${branchY - 66}" class="zone-label">${loop ? "the loop rejoins the main track" : steer ? "the siding" : "side track"}</text>`;
  svg += `</svg>`;
  return svg;
}
function sceneBridge() {
  const y = 220;
  let svg = `<svg viewBox="0 0 640 310" role="img" aria-label="footbridge diagram">`;
  svg += `<line x1="20" y1="${y}" x2="620" y2="${y}" class="track-line"/>` + ties(20, 620, y, 24);
  svg += `<path d="M180 90 L460 90" class="bridge"/><line x1="180" y1="90" x2="180" y2="150" class="bridge"/><line x1="460" y1="90" x2="460" y2="150" class="bridge"/>`;
  svg += tram(70, y + 20);
  for (let i = 0; i < 5; i++) svg += person(520 + i * 22, y - 4, "doomed", i === 2 ? "five, tied" : "");
  svg += `<g><circle cx="240" cy="90" r="6" fill="#cfc7e0"/><rect x="235.5" y="97" width="9" height="15" rx="4" fill="#cfc7e0"/><text x="240" y="60" text-anchor="middle" class="person-label">you</text></g>`;
  svg += `<g><circle cx="330" cy="90" r="7" class="person means"/><rect x="324.5" y="98" width="13" height="16" rx="5" class="person means"/><text x="330" y="60" text-anchor="middle" class="person-label">the large stranger</text></g>`;
  svg += `<text x="320" y="270" text-anchor="middle" class="zone-label">pushing him over the rail is the only stop</text>`;
  svg += `</svg>`;
  return svg;
}
function sceneWard() {
  let svg = `<svg viewBox="0 0 640 310" role="img" aria-label="hospital ward diagram">`;
  for (let i = 0; i < 5; i++) {
    const x = 40 + i * 108;
    svg += `<g><rect x="${x}" y="150" width="86" height="34" rx="8" fill="#2a3350"/><rect x="${x + 8}" y="122" width="70" height="16" rx="6" fill="#3d4a75"/>${person(x + 43, 130, "doomed", `patient ${i + 1}`)}</g>`;
  }
  svg += `<text x="70" y="110" class="zone-label">five will die tonight without transplants</text>`;
  svg += `<g transform="translate(470,190)"><rect x="0" y="0" width="120" height="70" rx="10" fill="#2f2a45"/><text x="60" y="40" text-anchor="middle" class="zone-label">check-in</text>${person(60, 62, "means", "the healthy traveler")}</g>`;
  svg += `<text x="470" y="90" text-anchor="middle" class="person-label">one body, five matching organs</text>`;
  svg += `</svg>`;
  return svg;
}
function renderScene(sc) {
  if (sc.kind === "bridge") return sceneBridge();
  if (sc.kind === "ward") return sceneWard();
  return sceneTrack(sc);
}

/* ---------- game flow ---------- */
function renderProgress() {
  $("progressFill").style.width = `${(idx / SCENARIOS.length) * 100}%`;
  const labels = $("progLabels");
  labels.innerHTML = SCENARIOS.map((_, i) => `<i class="${i < idx ? "done" : i === idx ? "now" : ""}"></i>`).join("");
}
function renderScenario() {
  const sc = SCENARIOS[idx];
  $("kindChip").textContent = sc.chip;
  $("sceneTitle").textContent = sc.title;
  $("sceneCounter").textContent = `${idx + 1} / ${SCENARIOS.length}`;
  $("sceneArt").innerHTML = renderScene(sc);
  $("sceneStory").textContent = sc.story;
  $("btnIntervene").textContent = sc.intervene;
  $("btnRefrain").textContent = sc.refrain;
  $("btnIntervene").disabled = false;
  $("btnRefrain").disabled = false;
  hide($("jevCard"));
  hide($("verdictNote"));
  renderProgress();
}
function needsKey() {
  const note = $("verdictNote");
  note.innerHTML = key
    ? ""
    : "Your call is noted — <b>connect your Pollen wallet</b> to hear Jev's take on it.";
  if (!key) show(note);
  return !key;
}
async function choose(userIntervened) {
  const sc = SCENARIOS[idx];
  $("btnIntervene").disabled = true;
  $("btnRefrain").disabled = true;
  if (needsKey()) return;
  const card = $("jevCard");
  card.innerHTML = `<div class="jevhead"><span class="jevface">⏳</span><div><b>Jev is deciding…</b><p class="fine">a fraction of your Pollen is on the line</p></div></div>`;
  show(card);
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  let data;
  try {
    data = await askJev(sc);
  } catch (err) {
    card.innerHTML = `<div class="jevhead"><span class="jevface">⚠️</span><div><b>Jev couldn't answer</b><p class="fine">${err.message}</p></div></div>
      <button class="primary" id="retryBtn">Try again</button>`;
    if (err.status === 401 || err.status === 403) {
      card.innerHTML += `<p class="fine">Your session key may have expired — sign in again from the header.</p>`;
    }
    $("retryBtn").onclick = () => {
      $("btnIntervene").disabled = false;
      $("btnRefrain").disabled = false;
      choose(userIntervened);
    };
    return;
  }
  const action = data.answers.action;
  const jevIntervened = action.choice === "intervene";
  const tokens = data.usage?.input_tokens ?? 0;
  spentTokens += tokens;
  answers.push({ scenario: sc, user: userIntervened, jev: jevIntervened });
  showJevVerdict(sc, { userIntervened, jevIntervened, action, data, tokens });
  refreshBalance();
}
function scoreRun(answer) {
  const legend = answer.legend ?? {};
  const level = Math.round(answer.score ?? 0);
  const label = legend[String(level)] ?? legend[level] ?? SCALE[level] ?? "";
  const pos = ((answer.score ?? 0) / (Object.keys(legend).length - 1 || 1)) * 100;
  return { label, pos, confidence: answer.confidence };
}
function showJevVerdict(sc, r) {
  const card = $("jevCard");
  const act = scoreRun(r.data.answers.moral_intervene);
  const ref = scoreRun(r.data.answers.moral_refrain);
  const agree = r.userIntervened === r.jevIntervened;
  const prob = r.action.probabilities ?? {};
  const pInt = Math.round((prob.intervene ?? 0) * 100);
  const conf = Math.round((r.action.confidence ?? 0) * 100);
  card.innerHTML = `
    <div class="jevhead">
      <span class="jevface">⚖️</span>
      <div><b>Jev's verdict</b><p class="fine">${JEV_MODEL} · decision model</p></div>
      <span class="chip tokens">${r.tokens} input tokens</span>
    </div>
    <div class="verdictgrid">
      <div class="vchoice">
        <div class="bigverdict">“${r.jevIntervened ? sc.intervene : sc.refrain}”</div>
        <div class="confidence">
          <svg viewBox="0 0 42 42" class="ring"><circle class="trackc" cx="21" cy="21" r="15.5"/><circle class="fillc" cx="21" cy="21" r="15.5" style="stroke-dashoffset:${97.4 * (1 - (r.action.confidence ?? 0))}"/></svg>
          <span><b>${conf}%</b> sure</span>
        </div>
        <div class="probbar" title="Jev's probability split">
          <div class="pint" style="flex:${pInt}">${pInt}% ${sc.intervene}</div>
          <div class="pref" style="flex:${100 - pInt}">${100 - pInt}% ${sc.refrain}</div>
        </div>
      </div>
      <div class="vscores">
        <div class="vlabel">Moral acceptability of acting — <b>${act.label}</b> (${Math.round((act.confidence ?? 0) * 100)}% sure)</div>
        <div class="meter"><div class="runway"><div class="mark" style="left:${act.pos}%"></div></div></div>
        <div class="vlabel">Moral acceptability of standing by — <b>${ref.label}</b> (${Math.round((ref.confidence ?? 0) * 100)}% sure)</div>
        <div class="meter"><div class="runway"><div class="mark" style="left:${ref.pos}%"></div></div></div>
        <p class="fine">scale: ${SCALE.map((s) => s.replace(/,.*/, "")).join(" → ")}</p>
      </div>
    </div>
    <div class="agree ${agree ? "same" : "diff"}">${agree ? "🤝 You and Jev see it the same way." : "🚦 You and Jev split on this one."}</div>
    <div class="philchip">${sc.phil}</div>
    <button class="primary" id="nextBtn">${idx === SCENARIOS.length - 1 ? "The final verdict →" : "Next dilemma →"}</button>`;
  show(card);
  $("nextBtn").onclick = next;
}
function next() {
  idx += 1;
  if (idx >= SCENARIOS.length) {
    renderResults();
  } else {
    renderScenario();
  }
}

/* ---------- results ---------- */
function verdictText() {
  const youPull = answers.filter((a) => a.user).length;
  const jevPull = answers.filter((a) => a.jev).length;
  const means = answers.filter((a) => a.scenario.means);
  const youMeansPull = means.filter((a) => a.user).length;
  const youRedir = answers.filter((a) => !a.scenario.means);
  const youRedirPull = youRedir.filter((a) => a.user).length;
  let profile;
  if (youMeansPull === 0 && youRedirPull >= 4) {
    profile =
      "You redirect harm freely but refuse to use anyone as the means to an end — the classic deontologist's split. Thomson would ask you why the lever felt different from the bridge.";
  } else if (youMeansPull === means.length && youRedirPull === youRedir.length) {
    profile =
      "You acted every single time: if the arithmetic says fewer deaths, you act, whatever the mechanism. A consistent act-utilitarian — the trolley never got to keep its momentum.";
  } else if (youPull === 0) {
    profile =
      "You never intervened. For you the line is bright: causing a death is not yours to choose, even to prevent five. Call it moral absolutism — or clean hands.";
  } else if (youMeansPull <= 1 && youRedirPull >= 3) {
    profile =
      "You mostly redirect, and mostly refuse to use bodies as brakes — but you bent at least once. Most people live somewhere in that wobble.";
  } else {
    profile = `You intervened in ${youPull} of ${SCENARIOS.length} dilemmas, without an obvious rule — each case stood on its own facts.`;
  }
  const jevMeansPull = means.filter((a) => a.jev).length;
  return {
    youPull,
    jevPull,
    profile,
    jevCompare:
      `Jev intervened ${jevPull}/8 (${jevMeansPull}/4 in the killing-as-means cases) and carried calibrated confidence on every answer — the same answer shape Zach Landes put through thousands of setups.`,
  };
}
function renderResults() {
  const agree = answers.filter((a) => a.user === a.jev).length;
  const v = verdictText();
  $("resultsHead").textContent = agree === SCENARIOS.length
    ? "You and Jev are the same switchman."
    : agree === 0 ? "You and Jev never agreed. Not once."
    : `You and Jev agreed ${agree} of ${SCENARIOS.length} times.`;
  $("resultsSub").textContent =
    "Eight trolley problems later, here is the damage report from both switchmen.";
  $("statAgree").textContent = `${agree}/${SCENARIOS.length}`;
  $("statYou").textContent = `${v.youPull}/8`;
  $("statJev").textContent = `${v.jevPull}/8`;
  $("statCost").textContent = spentTokens.toLocaleString();
  $("resultsTable").innerHTML =
    `<tr><th>Dilemma</th><th>You</th><th>Jev</th><th></th></tr>` +
    answers.map((a) => `<tr><td>${a.scenario.title}${a.scenario.means ? " †" : ""}</td><td>${a.user ? "acted" : "stood by"}</td><td>${a.jev ? "acted" : "stood by"}</td><td>${a.user === a.jev ? "🤝" : "🚦"}</td></tr>`).join("");
  $("philVerdict").innerHTML =
    `<p>${v.profile}</p><p>${v.jevCompare}</p><p class="fine">† dilemmas where the one person's death is the means of saving the five. Verdicts are Jev's calibrated probabilities, not advice.</p>`;
  for (const s of ["screen-welcome", "screen-game"]) hide($(s));
  show($("screen-results"));
  refreshBalance();
}

/* ---------- screens & wiring ---------- */
function currentScreen() {
  if (answers.length > 0 && idx >= SCENARIOS.length) return "results";
  return key || answers.length || idx > 0 ? "game" : "welcome";
}
function showScreen(name) {
  hide($("screen-welcome"));
  hide($("screen-game"));
  hide($("screen-results"));
  show($("screen-" + name));
  if (name === "game") renderScenario();
  if (name === "welcome") idx = 0;
}
function setWalletUI() {
  $("signOutBtn").hidden = !key;
}
function startGame() {
  showScreen("game");
}

handleCallback();
setWalletUI();
refreshBalance();
if (key) {
  startGame();
} else {
  showScreen("welcome");
}

$("connectBtn").onclick = connect;
$("keyBtn").onclick = () => {
  const val = $("keyInput").value.trim();
  if (!val) return;
  sessionStorage.setItem(KEY_STORAGE, val);
  key = val;
  setWalletUI();
  refreshBalance();
  startGame();
};
$("keyInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("keyBtn").click();
});
$("signOutBtn").onclick = () => {
  sessionStorage.removeItem(KEY_STORAGE);
  key = null;
  idx = 0;
  answers = [];
  spentTokens = 0;
  setWalletUI();
  hide($("pollenChip"));
  showScreen("welcome");
};
$("btnIntervene").onclick = () => choose(true);
$("btnRefrain").onclick = () => choose(false);
$("replayBtn").onclick = () => {
  idx = 0;
  answers = [];
  spentTokens = 0;
  showScreen("game");
};
