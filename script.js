"use strict";

const STORAGE_KEY = "hearthAndCrumbDataV1";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const state = {
  data: loadData(),
  currentView: "starters",
  activeStarterId: null,
  readiness: { bubbles: "active", smell: "fruity", surface: "domed", redFlag: "none", texture: "elastic", rise: 100 }
};

const recipes = [
  {
    id: "country-loaf",
    category: "savory",
    tag: "Classic",
    title: "Beginner Country Loaf",
    subtitle: "A simple crusty loaf for learning the sourdough basics.",
    image: "assets/recipes/classicsourdough.jpg",
    imageAlt: "Classic sourdough loaf with golden crust and airy crumb",
    time: "About 18-24 hours total, mostly resting",
    feeds: "1 medium loaf, about 8-10 slices",
    difficulty: "Beginner",
    ingredients: [
      "100g active bubbly starter",
      "375g room-temperature water",
      "500g bread flour",
      "10g fine sea salt",
      "Extra flour for shaping"
    ],
    steps: [
      "Mix starter and water in a large bowl until cloudy.",
      "Add flour and salt, then mix until no dry flour remains.",
      "Rest for 30 minutes, then do 3-4 rounds of stretch and folds over 2 hours.",
      "Cover and let bulk ferment until the dough looks airy and has risen about 50-75%.",
      "Shape into a round loaf, place seam-side up in a floured towel-lined bowl, and refrigerate overnight.",
      "Bake in a preheated Dutch oven at 450°F / 230°C for 20 minutes covered, then 20-25 minutes uncovered."
    ],
    storage: "Cool completely, then store cut-side down on a board for 1 day or in a paper bag for 2-3 days. Freeze slices for longer storage.",
    beginnerTip: "Use your readiness checker first: this loaf works best when the starter is bubbly, domed, and fruity."
  },
  {
    id: "garden-focaccia",
    category: "savory",
    tag: "No-fuss",
    title: "Olive Oil Garden Focaccia",
    subtitle: "A golden pan bread with olive oil, tomatoes, rosemary, and bubbly dimples.",
    image: "assets/recipes/focacciabread.jpg",
    imageAlt: "Golden focaccia bread with savory toppings",
    time: "About 12-18 hours total",
    feeds: "One 9x13 inch pan, about 8 pieces",
    difficulty: "Easy",
    ingredients: [
      "100g active starter",
      "400g water",
      "500g bread flour",
      "10g salt",
      "35g olive oil, plus more for the pan",
      "Cherry tomatoes, olives, rosemary, and flaky salt"
    ],
    steps: [
      "Mix starter, water, flour, salt, and olive oil into a sticky dough.",
      "Rest for 30 minutes, then do 3 stretch-and-fold rounds over 90 minutes.",
      "Let rise until jiggly and bubbly, then spread into a generously oiled pan.",
      "Rest until puffy, then dimple the dough with oily fingers.",
      "Top with tomatoes, olives, rosemary, and flaky salt.",
      "Bake at 425°F / 220°C for 22-28 minutes until deeply golden."
    ],
    storage: "Best the same day. Store leftovers airtight for 2 days and rewarm in the oven or toaster.",
    beginnerTip: "This is forgiving because it does not need perfect shaping. If your starter is almost ready, focaccia is a friendly choice."
  },
  {
    id: "cheddar-jalapeno",
    category: "savory",
    tag: "Melty",
    title: "Cheddar & Jalapeño Sourdough",
    subtitle: "A rustic loaf with melty cheddar pockets and a gentle jalapeño kick.",
    image: "assets/recipes/cheddarandjalapenosourdough.jpg",
    imageAlt: "Cheddar and jalapeño sourdough loaf with visible cheese and peppers",
    time: "About 18-24 hours total, mostly resting",
    feeds: "1 medium loaf, about 8-10 slices",
    difficulty: "Beginner-friendly",
    ingredients: [
      "100g active starter",
      "360g water",
      "500g bread flour",
      "10g salt",
      "120g cheddar, cut into small cubes",
      "1 small jalapeño, finely diced",
      "Optional: 2 tablespoons chopped chives or parsley",
      "Optional: 1/2 teaspoon cracked black pepper"
    ],
    steps: [
      "Mix starter, water, flour, and salt into a shaggy dough.",
      "Rest for 30 minutes, then do the first stretch and fold.",
      "During the second fold, gently tuck in cheddar cubes and diced jalapeño.",
      "Continue 2 more folds, keeping the cheese inside the dough as much as possible.",
      "Bulk ferment until airy, shape gently, and refrigerate overnight.",
      "Bake at 450°F / 230°C in a Dutch oven for 20 minutes covered, then 22-28 minutes uncovered."
    ],
    storage: "Cool fully before slicing so the cheese sets. Store airtight for 2 days or freeze slices with parchment between them.",
    beginnerTip: "Remove the jalapeño seeds for a milder loaf, and use small cheddar cubes for visible melty pockets."
  },
  {
    id: "chocolate-chunk",
    category: "sweet",
    tag: "Sweet",
    title: "Chocolate Swirl Sourdough",
    subtitle: "A lightly sweet sourdough with rich chocolate streaks and dark chocolate pieces.",
    image: "assets/recipes/chocolatesourdough.jpg",
    imageAlt: "Chocolate swirl sourdough with visible chocolate streaks",
    time: "About 18-24 hours total",
    feeds: "1 loaf, about 8 slices",
    difficulty: "Cozy beginner",
    ingredients: [
      "100g active starter",
      "340g water",
      "500g bread flour",
      "35g brown sugar",
      "9g salt",
      "90g chocolate-hazelnut spread or soft chocolate spread",
      "60g dark chocolate chunks",
      "Optional: 1 tablespoon cocoa powder"
    ],
    steps: [
      "Mix starter, water, flour, brown sugar, and salt.",
      "Rest for 30 minutes, then begin stretch and folds.",
      "After the first rise, gently stretch the dough into a rectangle and spread on a thin layer of chocolate spread.",
      "Scatter chocolate chunks over the spread, then roll or fold the dough so chocolate streaks run through the loaf.",
      "Bulk ferment until puffy and soft, but not collapsed.",
      "Shape gently and cold proof overnight.",
      "Bake at 430°F / 220°C for 20 minutes covered, then 20-25 minutes uncovered."
    ],
    storage: "Store wrapped at room temperature for 2 days. Toast slices gently so the chocolate streaks soften again.",
    beginnerTip: "Use a mature starter, not a hungry acetone-smelling one, so the flavor stays gently tangy instead of sharp."
  },
  {
    id: "cinnamon-swirl",
    category: "sweet",
    tag: "Brunch",
    title: "Cinnamon Swirl Sourdough",
    subtitle: "A cozy sourdough loaf with warm cinnamon ribbons through the crumb.",
    image: "assets/recipes/cinnamonsourdough.jpg",
    imageAlt: "Cinnamon sourdough loaf sliced open on a wooden board",
    time: "About 16-22 hours total",
    feeds: "1 loaf, about 10 slices",
    difficulty: "Beginner with one shaping step",
    ingredients: [
      "100g active starter",
      "280g milk or water",
      "450g bread flour",
      "40g softened butter",
      "35g sugar",
      "8g salt",
      "For swirl: 50g brown sugar + 2 teaspoons cinnamon"
    ],
    steps: [
      "Mix starter, milk or water, flour, butter, sugar, and salt.",
      "Rest, then do 3 gentle stretch and folds over 2 hours.",
      "Let the dough rise until puffy and relaxed.",
      "Roll into a rectangle, sprinkle cinnamon sugar over it, and roll up tightly.",
      "Place in a loaf pan or banneton, seam-side down, and proof until puffy.",
      "Bake at 375°F / 190°C for 35-42 minutes, until golden and cooked through."
    ],
    storage: "Store wrapped for 3 days. It makes especially good toast and French toast.",
    beginnerTip: "Keep the cinnamon sugar away from the very edge so the loaf seals better."
  },
  {
    id: "apple-crunch",
    category: "sweet",
    tag: "Discard",
    title: "Apple Crunch Sourdough Bake",
    subtitle: "A tender discard bake with apple chunks, cinnamon, oats, and crunchy topping.",
    image: "assets/recipes/applesourdough.jpg",
    imageAlt: "Apple sourdough bake with warm apple flavor",
    time: "About 1 hour 15 minutes",
    feeds: "One 8x8 inch pan, about 9 squares",
    difficulty: "Very easy",
    ingredients: [
      "150g sourdough discard",
      "2 apples, peeled or unpeeled, diced",
      "160g flour",
      "100g brown sugar",
      "90g melted butter",
      "1 egg",
      "1 teaspoon cinnamon",
      "1 teaspoon baking powder",
      "Pinch of salt",
      "For topping: 40g oats + 30g brown sugar + 25g butter"
    ],
    steps: [
      "Heat oven to 350°F / 175°C and grease an 8x8 inch pan.",
      "Mix discard, egg, melted butter, and brown sugar.",
      "Stir in flour, cinnamon, baking powder, salt, and diced apples.",
      "Spread into the pan.",
      "Mix oats, brown sugar, and butter, then crumble over the top.",
      "Bake for 35-45 minutes until golden and set in the middle."
    ],
    storage: "Store covered at room temperature for 1 day or refrigerated for 4 days. Warm slices before serving.",
    beginnerTip: "This one is perfect when you have discard but your starter is not quite ready for bread."
  }
];

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved?.starters) && Array.isArray(saved.feedings) && Array.isArray(saved.readinessChecks)) {
      if (typeof saved.companionName !== "string") saved.companionName = "";
      saved.starters = saved.starters.map(starter => ({ source: "kit", ...starter }));
      return saved;
    }
  } catch (error) {
    console.warn("Saved Hearth & Crumb data could not be read.", error);
  }
  return { companionName: "", starters: [], feedings: [], readinessChecks: [] };
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  } catch (error) {
    console.error("Hearth & Crumb data could not be saved.", error);
    toast("I could not save that just now. Please check your browser storage settings.");
  }
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function toLocalInput(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function validDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(dateValue, options = { month: "short", day: "numeric", year: "numeric" }) {
  const date = validDate(dateValue);
  return date ? new Intl.DateTimeFormat(undefined, options).format(date) : "Unknown date";
}

function formatTime(dateValue) {
  const date = validDate(dateValue);
  return date ? new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date) : "Unknown time";
}

function timeAgo(dateValue) {
  if (!dateValue) return "Not fed yet";
  const date = validDate(dateValue);
  if (!date) return "Unknown time";
  const diffHours = Math.max(0, (Date.now() - date.getTime()) / 36e5);
  if (diffHours < 1) return `${Math.max(1, Math.round(diffHours * 60))}m ago`;
  if (diffHours < 24) return `${Math.round(diffHours)}h ago`;
  const days = Math.round(diffHours / 24);
  return days < 7 ? `${days}d ago` : `${Math.round(days / 7)}w ago`;
}

function gcd(a, b) {
  a = Math.round(Math.abs(a)); b = Math.round(Math.abs(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function ratioFor(starter, flour, water) {
  const divisor = gcd(gcd(starter, flour), water);
  return `${trimNumber(starter / divisor)}:${trimNumber(flour / divisor)}:${trimNumber(water / divisor)}`;
}

function trimNumber(value) {
  return Number.isInteger(value) ? value : Number(value.toFixed(1));
}

function hydrationFor(flour, water) {
  return flour > 0 ? Math.round((water / flour) * 100) : 0;
}

function estimatePeakHours(starter, flour, water, tempC) {
  const foodRatio = flour / Math.max(starter, 1);
  let midpoint = 6 + Math.log2(Math.max(foodRatio, .5)) * 2.1;
  midpoint += (23 - tempC) * .55;
  const hydration = hydrationFor(flour, water);
  if (hydration < 80) midpoint += .8;
  if (hydration > 120) midpoint -= .5;
  midpoint = Math.min(20, Math.max(3, midpoint));
  return { min: Math.max(2, Math.round(midpoint - 1)), max: Math.round(midpoint + 1) };
}

function getStarter(id) {
  return state.data.starters.find(starter => starter.id === id);
}

function getFeedings(starterId) {
  return state.data.feedings
    .filter(feeding => !starterId || feeding.starterId === starterId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getChecks(starterId) {
  return state.data.readinessChecks
    .filter(check => check.starterId === starterId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function lastFeeding(starterId) {
  return getFeedings(starterId)[0];
}

function starterStatus(starter) {
  if (starter.storage === "fridge") return { key: "fridge", label: "Napping in the fridge 😴" };
  const last = lastFeeding(starter.id);
  if (!last) return { key: "hungry", label: "Ready for my first snack! 🌱" };
  const elapsed = (Date.now() - new Date(last.date)) / 36e5;
  const peak = estimatePeakHours(last.starter, last.flour, last.water, last.temp);
  if (elapsed > peak.max + 5) return { key: "hungry", label: "I'm getting hungry! 🥺" };
  if (elapsed >= peak.min - 1 && elapsed <= peak.max + 1) return { key: "active", label: "Bubbly and ready to bake! 🫧" };
  return { key: "active", label: "Full and happy! 🍞" };
}

function peakInfo(starter) {
  const last = lastFeeding(starter.id);
  if (starter.storage === "fridge") return { label: "Resting", progress: 10 };
  if (!last) return { label: "Waiting for first feed", progress: 0 };
  const peak = estimatePeakHours(last.starter, last.flour, last.water, last.temp);
  const elapsed = Math.max(0, (Date.now() - new Date(last.date)) / 36e5);
  const midpoint = (peak.min + peak.max) / 2;
  const remaining = midpoint - elapsed;
  if (remaining > 1) return { label: `About ${Math.round(remaining)} hrs away`, progress: Math.min(92, (elapsed / midpoint) * 100) };
  if (remaining > -2) return { label: "Peak window now", progress: 100 };
  return { label: "Peak window passed", progress: 100 };
}

function readinessScore(values = state.readiness) {
  const bubbleScores = { none: 0, few: 1, active: 2, vigorous: 3 };
  const smellScores = { mild: 2, fruity: 3, sharp: 1, acetone: 0 };
  const surfaceScores = { flat: 0, rounded: 1, domed: 3 };
  const textureScores = { thin: 1, elastic: 3, collapsed: 0 };
  let score = (bubbleScores[values.bubbles] ?? 0) + (smellScores[values.smell] ?? 0) + (surfaceScores[values.surface] ?? 0) + (textureScores[values.texture] ?? 0);
  if (values.rise >= 80 && values.rise <= 200) score += 3;
  else if (values.rise >= 40) score += 1;
  return score;
}

function readinessResult(values = state.readiness) {
  if (values.redFlag && values.redFlag !== "none") {
    return {
      type: "red-flag",
      ready: false,
      label: "Throw it away and start over!",
      detail: "When in doubt, do not taste it."
    };
  }
  if (["acetone", "sharp"].includes(values.smell)) {
    return {
      type: "hungry",
      ready: false,
      label: "Hungry — Time to Feed!",
      detail: "Keep feeding consistently, keep it warm, and use fresh flour."
    };
  }
  const hasActiveBubbles = ["active", "vigorous"].includes(values.bubbles);
  const hasDomedSurface = values.surface === "domed";
  const hasTangyFruitySmell = values.smell === "fruity";
  const ready = hasActiveBubbles && hasDomedSurface && hasTangyFruitySmell;
  return {
    type: ready ? "ready" : "needs-time",
    ready,
    label: ready ? "Ready to Bake!" : "Needs More Time",
    detail: ready
      ? "Your starter is bubbly, domed, and smells tangy or fruity. It is showing the classic signs beginners should look for."
      : "Look for active bubbles, a domed surface, and a tangy/fruity smell before baking."
  };
}

function readinessMessage(values = state.readiness) {
  const result = readinessResult(values);
  return `${result.label} ${result.detail}`;
}

function showView(view, starterId = null) {
  state.currentView = view;
  if (starterId) state.activeStarterId = starterId;
  $$(".view").forEach(section => section.classList.toggle("active", section.dataset.viewName === view));
  $$("[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === (view === "detail" ? "starters" : view)));
  $("#backButton").classList.toggle("is-hidden", view !== "detail");
  if (view === "starters") renderStarters();
  if (view === "detail") renderDetail();
  if (view === "log") renderLog();
  if (view === "tools") renderTools();
  if (view === "recipes") renderRecipes();
  window.scrollTo({ top: 0, behavior: "smooth" });
  $("#app").focus({ preventScroll: true });
}

function renderAll() {
  renderStarters();
  renderCompanion();
  renderLog();
  renderTools();
  renderRecipes();
  if (state.currentView === "detail") renderDetail();
}

function renderCompanion() {
  const hasStarters = state.data.starters.length > 0;
  $("#addStarterButton").classList.toggle("is-hidden", !hasStarters);
  $(".companion-card").classList.toggle("is-hidden", hasStarters);
  if (!hasStarters) {
    const name = $("#companionName").value.trim();
    $("#companionNameDisplay").textContent = name || "your starter";
  }
}

function renderStarters() {
  const grid = $("#starterGrid");
  if (!state.data.starters.length) {
    grid.innerHTML = "";
    return;
  }
  grid.innerHTML = state.data.starters.map(starter => {
    const last = lastFeeding(starter.id);
    const status = starterStatus(starter);
    const peak = peakInfo(starter);
    const scratchTip = starter.source === "scratch"
      ? `<div class="scratch-tip"><svg><use href="#icon-leaf"></use></svg><span>Keep on the counter. Takes 5-14 days to wake up!</span></div>`
      : "";
    return `
      <article class="starter-card">
        <button class="icon-button starter-delete-button" data-action="delete-starter" data-id="${starter.id}" type="button" aria-label="Delete ${escapeHtml(starter.name)}">
          <svg><use href="#icon-trash"></use></svg>
        </button>
        <div class="starter-card-top">
          <div class="starter-icon"><svg><use href="#icon-${starter.storage === "fridge" ? "jar" : "flask"}"></use></svg></div>
          <div>
            <span class="status-chip ${status.key}"><i class="status-dot"></i>${escapeHtml(status.label)}</span>
            <h2>${escapeHtml(starter.name)}</h2>
            <div class="starter-card-meta"><svg><use href="#icon-clock"></use></svg>${last ? `Fed ${timeAgo(last.date)}` : "No feedings yet"}</div>
          </div>
        </div>
        ${scratchTip}
        <div class="peak-block">
          <div class="peak-label"><span>Estimated peak</span><strong>${peak.label}</strong></div>
          <div class="progress"><span style="width:${peak.progress}%"></span></div>
        </div>
        <div class="starter-actions">
          <button class="button ${status.key === "hungry" ? "button-primary" : "button-quiet"}" data-action="feed" data-id="${starter.id}">${last ? "Log Feed" : "First Feed"}</button>
          <button class="button button-secondary" data-action="details" data-id="${starter.id}">Details</button>
        </div>
      </article>`;
  }).join("");
}

function renderDetail() {
  const starter = getStarter(state.activeStarterId);
  if (!starter) return showView("starters");
  const feedings = getFeedings(starter.id);
  const last = feedings[0];
  const latestCheck = getChecks(starter.id)[0];
  const status = starterStatus(starter);
  const peak = peakInfo(starter);
  const hydration = last ? hydrationFor(last.flour, last.water) : 0;
  const peakHours = last ? estimatePeakHours(last.starter, last.flour, last.water, last.temp) : null;
  const peakDate = last && peakHours ? new Date(new Date(last.date).getTime() + ((peakHours.min + peakHours.max) / 2) * 36e5) : null;
  const latestResult = latestCheck ? readinessResult(latestCheck) : null;
  $("#starterDetail").innerHTML = `
    <div class="detail-header">
      <div class="detail-title">
        <p class="eyebrow">Starter profile</p>
        <h1>${escapeHtml(starter.name)}</h1>
        <p>Started ${formatDate(starter.birthDate)}${last ? ` · Hydration: ${hydration}%` : ""}</p>
        <span class="status-chip ${status.key}"><i class="status-dot"></i>${escapeHtml(status.label)}</span>
      </div>
      <div class="detail-menu">
        <button class="icon-button" data-action="edit-starter" data-id="${starter.id}" title="Edit starter"><svg><use href="#icon-pencil"></use></svg></button>
        <button class="icon-button" data-action="delete-starter" data-id="${starter.id}" title="Delete starter"><svg><use href="#icon-trash"></use></svg></button>
      </div>
    </div>
    <div class="detail-dashboard">
      <article class="card state-card">
        <p class="eyebrow">Current state</p>
        <h2>${status.key === "hungry" ? "Ready for fresh flour" : status.key === "fridge" ? "Resting quietly" : peak.label === "Peak window now" ? "At its lively peak" : "Rising steadily"}</h2>
        <div class="metric-row"><span>Journey to peak</span><strong>${Math.round(peak.progress)}%</strong></div>
        <div class="progress"><span style="width:${peak.progress}%"></span></div>
        <div class="observation-summary">
          <div class="observation-line"><svg><use href="#icon-bubbles"></use></svg><div><span>Latest bubbles</span><strong>${latestCheck ? titleCase(latestCheck.bubbles) : "Not checked yet"}</strong></div></div>
          <div class="observation-line"><svg><use href="#icon-wind"></use></svg><div><span>Aroma</span><strong>${latestCheck ? smellLabel(latestCheck.smell) : "Not checked yet"}</strong></div></div>
          <div class="observation-line"><svg><use href="#icon-leaf"></use></svg><div><span>Texture & rise</span><strong>${latestCheck ? `${titleCase(latestCheck.texture)} · ${latestCheck.rise}%` : "Not checked yet"}</strong></div></div>
        </div>
      </article>
      <article class="card readiness-banner">
        <div><h2>${latestResult ? escapeHtml(latestResult.label) : "Ready to check?"}</h2><p>${latestCheck ? readinessMessage(latestCheck) : "Record bubbles, aroma, texture, and rise."}</p></div>
        <button class="button button-primary" data-action="check-readiness" data-id="${starter.id}">Check Readiness</button>
      </article>
      <article class="card next-feed-card">
        <h2>${last ? "Estimated peak" : "Next step"}</h2>
        <strong>${peakDate ? `${formatDate(peakDate, { weekday: "short", month: "short", day: "numeric" })}, ${formatTime(peakDate)}` : "Log the first feeding"}</strong>
        <p>${last ? `Based on a ${ratioFor(last.starter, last.flour, last.water)} ratio at ${last.temp}°C` : "A feeding gives us enough information to estimate the peak."}</p>
        <p class="discard-tip">Tip: Remember to discard down to 25g before feeding to keep your jar manageable!</p>
        <button class="button button-secondary button-full" data-action="feed" data-id="${starter.id}"><svg><use href="#icon-plus"></use></svg>Log Feeding</button>
      </article>
    </div>
    <div class="section-heading"><h2>Recent Activity</h2>${feedings.length ? `<button class="button button-secondary" data-action="feed" data-id="${starter.id}">Add Feeding</button>` : ""}</div>
    <div class="activity-list">${feedings.length ? feedings.slice(0, 6).map(activityItem).join("") : emptyActivity(starter.id)}</div>`;
}

function activityItem(feeding) {
  const starter = getStarter(feeding.starterId);
  const date = new Date(feeding.date);
  return `
    <article class="card activity-item">
      <div class="date-tile"><span>${formatDate(date, { month: "short" })}</span><strong>${formatDate(date, { day: "numeric" })}</strong></div>
      <div class="activity-copy">
        <h3>${escapeHtml(starter?.name || "Deleted starter")} · ${ratioFor(feeding.starter, feeding.flour, feeding.water)}</h3>
        <p>${feeding.starter}g starter, ${feeding.flour}g flour, ${feeding.water}g water · ${hydrationFor(feeding.flour, feeding.water)}% hydration</p>
        ${feeding.notes ? `<p><em>${escapeHtml(feeding.notes)}</em></p>` : ""}
      </div>
      <div class="activity-meta">
        <span>${formatTime(date)}</span>
        <div class="activity-buttons">
          <button class="icon-button" data-action="edit-feeding" data-id="${feeding.id}" title="Edit feeding"><svg><use href="#icon-pencil"></use></svg></button>
          <button class="icon-button" data-action="delete-feeding" data-id="${feeding.id}" title="Delete feeding"><svg><use href="#icon-trash"></use></svg></button>
        </div>
      </div>
    </article>`;
}

function emptyActivity(starterId) {
  return `<div class="empty-state"><svg><use href="#icon-flask"></use></svg><h2>No feedings yet</h2><p>Once you add a feeding, its ratio, hydration, and estimated peak will appear here.</p><button class="button button-primary" data-action="feed" data-id="${starterId}">Log first feeding</button></div>`;
}

function renderLog() {
  const select = $("#logStarterFilter");
  const previous = select.value;
  select.innerHTML = `<option value="all">All starters</option>${state.data.starters.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("")}`;
  if ([...select.options].some(option => option.value === previous)) select.value = previous;
  const feedings = getFeedings(select.value === "all" ? null : select.value);
  $("#allFeedingLog").innerHTML = feedings.length ? feedings.map(activityItem).join("") :
    `<div class="empty-state"><svg><use href="#icon-clock"></use></svg><h2>No feeding entries yet</h2><p>Your saved feedings will build a useful history here.</p></div>`;
}

function renderTools() {
  const readinessSelect = $("#readinessStarter");
  const previous = readinessSelect.value;
  readinessSelect.innerHTML = state.data.starters.length
    ? state.data.starters.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("")
    : `<option value="">Add a starter first</option>`;
  if ([...readinessSelect.options].some(option => option.value === previous)) readinessSelect.value = previous;
  else if (state.activeStarterId && getStarter(state.activeStarterId)) readinessSelect.value = state.activeStarterId;
  $("#logReadinessButton").disabled = !state.data.starters.length;
  updateCalculator();
  updateReadiness();
}

function renderRecipes() {
  const savoryGrid = $("#savoryRecipeGrid");
  const sweetGrid = $("#sweetRecipeGrid");
  if (!savoryGrid || !sweetGrid) return;
  savoryGrid.innerHTML = recipes.filter(recipe => recipe.category === "savory").map(recipeCard).join("");
  sweetGrid.innerHTML = recipes.filter(recipe => recipe.category === "sweet").map(recipeCard).join("");
}

function recipeCard(recipe) {
  return `
    <article class="recipe-card" data-action="open-recipe" data-id="${recipe.id}" role="button" tabindex="0" aria-label="Open recipe for ${escapeHtml(recipe.title)}">
      ${recipePhoto(recipe)}
      <div class="recipe-card-copy">
        <span class="recipe-tag">${escapeHtml(recipe.tag)}</span>
        <h3>${escapeHtml(recipe.title)}</h3>
        <p>${escapeHtml(recipe.subtitle)}</p>
        <div class="recipe-meta-row">
          <span>${escapeHtml(recipe.time)}</span>
          <span>${escapeHtml(recipe.feeds)}</span>
        </div>
        <button class="recipe-open-button" data-action="open-recipe" data-id="${recipe.id}" type="button">Open full recipe</button>
      </div>
    </article>`;
}

function recipePhoto(recipe) {
  return `
    <div class="recipe-photo">
      <img class="recipe-main-image" src="${recipe.image}" alt="${escapeHtml(recipe.imageAlt)}" loading="lazy" decoding="async">
    </div>`;
}

function openRecipeDialog(recipeId) {
  const recipe = recipes.find(item => item.id === recipeId);
  if (!recipe) return toast("That recipe wandered off. Please try another card.");
  $("#recipeDialogTag").textContent = `${recipe.tag} · ${recipe.difficulty}`;
  $("#recipeDialogTitle").textContent = recipe.title;
  $("#recipeDialogSubtitle").textContent = recipe.subtitle;
  $("#recipeDialogBody").innerHTML = `
    <div class="recipe-detail-layout">
      ${recipePhoto(recipe)}
      <div class="recipe-facts">
        <div><span>Total time</span><strong>${escapeHtml(recipe.time)}</strong></div>
        <div><span>Feeds</span><strong>${escapeHtml(recipe.feeds)}</strong></div>
        <div><span>Level</span><strong>${escapeHtml(recipe.difficulty)}</strong></div>
      </div>
    </div>
    <div class="recipe-detail-grid">
      <section class="recipe-detail-section">
        <h3>Ingredients</h3>
        <ul>${recipe.ingredients.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="recipe-detail-section">
        <h3>Step by step</h3>
        <ol>${recipe.steps.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
      </section>
      <section class="recipe-detail-section">
        <h3>How to store</h3>
        <p>${escapeHtml(recipe.storage)}</p>
      </section>
      <section class="recipe-detail-section recipe-tip">
        <h3>Beginner tip</h3>
        <p>${escapeHtml(recipe.beginnerTip)}</p>
      </section>
    </div>`;
  $("#recipeDialog").showModal();
}

function updateCalculator() {
  const starterCheck = numberFromField("#calcStarter", "Starter amount", { min: 1 });
  const flourCheck = numberFromField("#calcFlour", "Flour", { min: 1 });
  const waterCheck = numberFromField("#calcWater", "Water", { min: 0 });
  if (!starterCheck.ok || !flourCheck.ok || !waterCheck.ok) {
    $("#calcHydration").textContent = "—";
    $("#hydrationMarker").style.left = "0%";
    $("#calcFlourOutput").textContent = "—";
    $("#calcWaterOutput").textContent = "—";
    $("#calcExplanation").textContent = "Flour and water need numbers. Try gram amounts like 25, 50, or 100 so the calculator can help.";
    return;
  }
  const starter = starterCheck.value;
  const flour = flourCheck.value;
  const water = waterCheck.value;
  const hydration = hydrationFor(flour, water);
  $("#calcHydration").textContent = `${hydration}%`;
  const sliderHydration = Math.max(50, Math.min(150, hydration));
  $("#hydrationRange").value = sliderHydration;
  $("#hydrationMarker").style.left = `${sliderHydration - 50}%`;
  $("#calcFlourOutput").textContent = `${flour}g`;
  $("#calcWaterOutput").textContent = `${water}g`;
  const ratio = ratioFor(starter, flour, water);
  let text = `A ${hydration}% hydration (${ratio}) `;
  text += hydration < 75 ? "makes a stiffer starter that usually ferments a little more slowly." :
    hydration > 120 ? "makes a loose starter that can ferment quickly and show bubbles easily." :
    "is balanced, easy to stir, and straightforward to observe.";
  $("#calcExplanation").textContent = text;
}

function updateWaterFromHydrationSlider() {
  const flourCheck = numberFromField("#calcFlour", "Flour", { min: 1 });
  const hydrationCheck = numberFromField("#hydrationRange", "Hydration", { min: 50, max: 150 });
  if (!flourCheck.ok || !hydrationCheck.ok) {
    $("#calcExplanation").textContent = "Please enter a valid flour amount before adjusting hydration.";
    return;
  }
  const water = Math.round((flourCheck.value * hydrationCheck.value) / 100);
  $("#calcWater").value = water;
  updateCalculator();
}

function updateReadiness() {
  $("#riseValue").textContent = `${state.readiness.rise}%`;
  const result = readinessResult();
  $("#readinessGuidance").classList.remove("ready", "needs-time", "hungry", "red-flag");
  $("#readinessGuidance").classList.add(result.type);
  $("#readinessGuidance").innerHTML = `<strong>${result.label}</strong> <span>${result.detail}</span>`;
  updateReadinessVisual(result.type);
}

function updateReadinessVisual(type) {
  const isReady = type === "ready";
  $("#readinessVisual").classList.remove("ready", "needs-time", "hungry", "red-flag");
  $("#readinessVisual").classList.add(type);
  $("#readinessVisual").innerHTML = isReady ? `
    <svg viewBox="0 0 180 150" role="img" aria-label="Domed bubbly starter jar">
      <path class="jar-lid" d="M61 20h58v14H61z"/>
      <path class="jar-body" d="M54 34h72l10 22v60c0 14-11 24-25 24H69c-14 0-25-10-25-24V56l10-22Z"/>
      <path class="starter-fill" d="M53 86c13-18 26-7 38-19 16-16 33-13 39 19v30c0 10-8 18-18 18H68c-10 0-18-8-18-18V91c1-2 2-4 3-5Z"/>
      <circle class="bubble" cx="77" cy="96" r="5"/>
      <circle class="bubble" cx="101" cy="88" r="6"/>
      <circle class="bubble" cx="112" cy="111" r="4"/>
      <path class="face" d="M77 119c8 7 18 7 26 0"/>
      <circle class="face-dot" cx="76" cy="108" r="3"/>
      <circle class="face-dot" cx="105" cy="108" r="3"/>
      <circle class="float-bubble" cx="134" cy="36" r="5"/>
      <circle class="float-bubble" cx="146" cy="24" r="3"/>
    </svg>` : `
    <svg viewBox="0 0 180 150" role="img" aria-label="Flat sluggish starter jar">
      <path class="jar-lid" d="M61 20h58v14H61z"/>
      <path class="jar-body" d="M54 34h72l10 22v60c0 14-11 24-25 24H69c-14 0-25-10-25-24V56l10-22Z"/>
      <path class="starter-fill flat" d="M50 96h80v20c0 10-8 18-18 18H68c-10 0-18-8-18-18V96Z"/>
      <circle class="bubble muted" cx="83" cy="110" r="4"/>
      <circle class="bubble muted" cx="105" cy="116" r="3"/>
      <path class="face" d="M78 121c7-4 18-4 25 0"/>
      <circle class="face-dot" cx="76" cy="109" r="3"/>
      <circle class="face-dot" cx="105" cy="109" r="3"/>
      <path class="sleepy-line" d="M136 52h16M140 42h10"/>
    </svg>`;
}

function openStarterDialog(starter = null) {
  const isEditing = Boolean(starter);
  $("#starterDialogTitle").textContent = isEditing ? "Edit Starter" : "What is your new starter's name?";
  $("#starterDialogSubtitle").textContent = isEditing ? "Update the details for this starter." : "Give your tiny kitchen companion a name so it can start growing.";
  $("#starterId").value = starter?.id || "";
  $("#starterName").value = starter?.name || "";
  setStarterSource("starterSource", starter?.source || "kit");
  $("#starterBirthDate").value = starter?.birthDate || new Date().toISOString().slice(0, 10);
  $("#starterStorage").value = starter?.storage || "counter";
  $("#starterNotes").value = starter?.notes || "";
  $("#starterNameError").textContent = "";
  $("#starterExtraFields").classList.toggle("is-hidden", !isEditing);
  $("#starterSubmitButton span").textContent = isEditing ? "Save Starter" : "Add Starter";
  $("#starterDialog").showModal();
  setTimeout(() => $("#starterName").focus(), 50);
}

function selectedStarterSource(groupName) {
  return $(`input[name="${groupName}"]:checked`)?.value || "kit";
}

function setStarterSource(groupName, source) {
  const value = source === "scratch" ? "scratch" : "kit";
  $$(`input[name="${groupName}"]`).forEach(input => {
    input.checked = input.value === value;
  });
}

function createStarterFromName(name, source = "kit") {
  const starter = {
    id: uid("starter"),
    name,
    source: source === "scratch" ? "scratch" : "kit",
    birthDate: new Date().toISOString().slice(0, 10),
    storage: "counter",
    notes: ""
  };
  state.data.starters.push(starter);
  state.activeStarterId = starter.id;
  saveData();
  renderAll();
  toast(`${starter.name} was added. Time for tiny bubbles! 🌾`);
  return starter;
}

function openFeedingDialog(starterId, feeding = null) {
  const starter = getStarter(starterId || feeding?.starterId);
  if (!starter) return toast("Add a starter before logging a feeding.");
  $("#feedingId").value = feeding?.id || "";
  $("#feedingStarterId").value = starter.id;
  $("#feedingStarterLabel").textContent = starter.name;
  $("#feedStarter").value = feeding?.starter ?? 50;
  $("#feedFlour").value = feeding?.flour ?? 50;
  $("#feedWater").value = feeding?.water ?? 50;
  $("#feedTemp").value = feeding?.temp ?? 23;
  $("#feedingDate").value = feeding ? toLocalInput(new Date(feeding.date)) : toLocalInput();
  $("#feedNotes").value = feeding?.notes || "";
  updateFeedingSummary();
  $("#feedingDialog").showModal();
}

function updateFeedingSummary() {
  const starter = readSafeNumber("#feedStarter", 50, { min: 1 });
  const flour = readSafeNumber("#feedFlour", 50, { min: 1 });
  const water = readSafeNumber("#feedWater", 50, { min: 0 });
  const temp = readSafeNumber("#feedTemp", 23, { min: 5, max: 40 });
  const peak = estimatePeakHours(starter, flour, water, temp);
  $("#feedingRatio").textContent = `Ratio ${ratioFor(starter, flour, water)}`;
  $("#feedingHydration").textContent = `${hydrationFor(flour, water)}% hydration`;
  $("#feedingPeak").textContent = `Estimated peak: ${peak.min}–${peak.max} hours at ${temp}°C`;
}

function readSafeNumber(selector, fallback, rules = {}) {
  const value = Number($(selector).value);
  if (!Number.isFinite(value)) return fallback;
  const min = rules.min ?? -Infinity;
  const max = rules.max ?? Infinity;
  return Math.min(max, Math.max(min, value));
}

function numberFromField(selector, label, rules = {}) {
  const input = $(selector);
  const rawValue = input.value.trim();
  const value = Number(rawValue);
  if (!rawValue || !Number.isFinite(value)) {
    return { ok: false, message: `${label} needs a number.` };
  }
  if (rules.min !== undefined && value < rules.min) {
    return { ok: false, message: `${label} needs to be at least ${rules.min}.` };
  }
  if (rules.max !== undefined && value > rules.max) {
    return { ok: false, message: `${label} needs to be ${rules.max} or lower.` };
  }
  return { ok: true, value };
}

function dateFromField(selector, label) {
  const input = $(selector);
  const date = validDate(input.value);
  if (!date) return { ok: false, message: `${label} needs a valid date.` };
  return { ok: true, value: date };
}

function stopWithFieldMessage(selector, message) {
  const input = $(selector);
  input.focus();
  toast(message);
}

function titleCase(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function smellLabel(value) {
  return ({ mild: "Sweet / milky", fruity: "Fruity / yeasty", sharp: "Sharp vinegar", acetone: "Acetone" })[value] || titleCase(value);
}

let pendingConfirm = null;
function confirmAction(title, message, actionLabel, callback) {
  $("#confirmTitle").textContent = title;
  $("#confirmMessage").textContent = message;
  $("#confirmAction").textContent = actionLabel;
  pendingConfirm = callback;
  $("#confirmDialog").showModal();
}

let toastTimer;
function toast(message, options = {}) {
  const element = $("#toast");
  $("#toastMessage").textContent = message;
  element.classList.toggle("reward", Boolean(options.reward));
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    element.classList.remove("show", "reward");
  }, options.duration || 2600);
}

document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) showView(viewButton.dataset.view);

  const action = event.target.closest("[data-action]");
  if (action) {
    const { action: name, id } = action.dataset;
    if (name === "add-starter") openStarterDialog();
    if (name === "open-recipe") openRecipeDialog(id);
    if (name === "feed") openFeedingDialog(id);
    if (name === "details") showView("detail", id);
    if (name === "check-readiness") {
      state.activeStarterId = id;
      showView("tools");
      $("#readinessStarter").value = id;
      $(".readiness-card").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (name === "edit-starter") openStarterDialog(getStarter(id));
    if (name === "delete-starter") {
      const starter = getStarter(id);
      if (!starter) return toast("That starter could not be found.");
      confirmAction("Are you sure?", "This cannot be undone.", "Delete Starter", () => {
        state.data.starters = state.data.starters.filter(item => item.id !== id);
        state.data.feedings = state.data.feedings.filter(item => item.starterId !== id);
        state.data.readinessChecks = state.data.readinessChecks.filter(item => item.starterId !== id);
        saveData(); showView("starters"); renderAll(); toast("Starter deleted.");
      });
    }
    if (name === "edit-feeding") {
      const feeding = state.data.feedings.find(item => item.id === id);
      if (feeding) openFeedingDialog(feeding.starterId, feeding);
    }
    if (name === "delete-feeding") {
      confirmAction("Delete this feeding?", "This feeding entry will be permanently removed from this browser.", "Delete Feeding", () => {
        state.data.feedings = state.data.feedings.filter(item => item.id !== id);
        saveData(); renderAll(); toast("Feeding deleted.");
      });
    }
  }

  const closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) $(`#${closeButton.dataset.closeDialog}`).close();

  const calcStep = event.target.closest("[data-calc-step]");
  if (calcStep) {
    const input = $(`#calc${titleCase(calcStep.dataset.calcStep)}`);
    const current = Number.isFinite(Number(input.value)) ? Number(input.value) : Number(input.min || 0);
    input.value = Math.max(Number(input.min || 0), current + Number(calcStep.dataset.direction) * 5);
    updateCalculator();
  }

  const feedStep = event.target.closest("[data-feed-step]");
  if (feedStep) {
    const input = $(`#feed${titleCase(feedStep.dataset.feedStep)}`);
    const current = Number.isFinite(Number(input.value)) ? Number(input.value) : Number(input.min || 0);
    input.value = Math.max(Number(input.min || 0), current + Number(feedStep.dataset.direction) * 5);
    updateFeedingSummary();
  }

  const choice = event.target.closest("[data-choice-group] button");
  if (choice) {
    const group = choice.parentElement.dataset.choiceGroup;
    choice.parentElement.querySelectorAll("button").forEach(button => button.classList.toggle("selected", button === choice));
    state.readiness[group] = choice.dataset.value;
    updateReadiness();
  }
});

document.addEventListener("keydown", event => {
  const recipeCard = event.target.matches?.(".recipe-card[data-action='open-recipe']") ? event.target : null;
  if (!recipeCard || !["Enter", " "].includes(event.key)) return;
  event.preventDefault();
  openRecipeDialog(recipeCard.dataset.id);
});

$("#brandButton").addEventListener("click", () => showView("starters"));
$("#backButton").addEventListener("click", () => showView("starters"));
$("#addStarterButton").addEventListener("click", () => openStarterDialog());
$("#logStarterFilter").addEventListener("change", renderLog);
$("#companionName").addEventListener("input", event => {
  const name = event.target.value.slice(0, 40);
  event.target.value = name;
  $("#companionNameDisplay").textContent = name.trim() || "your starter";
  $("#companionNameError").textContent = "";
});
$("#companionAddButton").addEventListener("click", () => {
  const name = $("#companionName").value.trim();
  if (!name) {
    $("#companionNameError").textContent = "Oops! Your tiny companion needs a name to grow! 🌾";
    $("#companionName").focus();
    return;
  }
  createStarterFromName(name, selectedStarterSource("companionSource"));
  $("#companionName").value = "";
  $("#companionNameError").textContent = "";
  setStarterSource("companionSource", "kit");
});

$("#starterForm").addEventListener("submit", event => {
  event.preventDefault();
  const id = $("#starterId").value;
  const name = $("#starterName").value.trim();
  const birthDate = dateFromField("#starterBirthDate", "Started on");
  $("#starterNameError").textContent = "";
  if (!name) {
    $("#starterNameError").textContent = "Oops! Your tiny companion needs a name to grow! 🌾";
    return stopWithFieldMessage("#starterName", "Oops! Your tiny companion needs a name to grow! 🌾");
  }
  if (!id) {
    createStarterFromName(name, selectedStarterSource("starterSource"));
    $("#starterDialog").close();
    return;
  }
  if (!birthDate.ok) return stopWithFieldMessage("#starterBirthDate", birthDate.message);
  const starter = {
    id,
    name,
    source: selectedStarterSource("starterSource"),
    birthDate: $("#starterBirthDate").value,
    storage: $("#starterStorage").value,
    notes: $("#starterNotes").value.trim()
  };
  if (id) state.data.starters = state.data.starters.map(item => item.id === id ? starter : item);
  else state.data.starters.push(starter);
  state.activeStarterId = starter.id;
  saveData();
  $("#starterDialog").close();
  renderAll();
  toast(id ? "Starter updated." : `${starter.name} was added.`);
});

$("#feedingForm").addEventListener("submit", event => {
  event.preventDefault();
  const id = $("#feedingId").value;
  const starterId = $("#feedingStarterId").value;
  if (!getStarter(starterId)) return toast("Please choose a starter before logging a feeding.");
  const starterAmount = numberFromField("#feedStarter", "Starter amount", { min: 5 });
  const flourAmount = numberFromField("#feedFlour", "Flour", { min: 5 });
  const waterAmount = numberFromField("#feedWater", "Water", { min: 0 });
  const roomTemp = numberFromField("#feedTemp", "Room temperature", { min: 5, max: 40 });
  const feedingDate = dateFromField("#feedingDate", "Date and time");
  const checks = [
    ["#feedStarter", starterAmount],
    ["#feedFlour", flourAmount],
    ["#feedWater", waterAmount],
    ["#feedTemp", roomTemp],
    ["#feedingDate", feedingDate]
  ];
  const failed = checks.find(([, result]) => !result.ok);
  if (failed) return stopWithFieldMessage(failed[0], failed[1].message);
  const feeding = {
    id: id || uid("feeding"),
    starterId,
    starter: starterAmount.value,
    flour: flourAmount.value,
    water: waterAmount.value,
    temp: roomTemp.value,
    date: feedingDate.value.toISOString(),
    notes: $("#feedNotes").value.trim()
  };
  if (id) state.data.feedings = state.data.feedings.map(item => item.id === id ? feeding : item);
  else state.data.feedings.push(feeding);
  saveData();
  $("#feedingDialog").close();
  state.activeStarterId = feeding.starterId;
  renderAll();
  showView("detail", feeding.starterId);
  toast(
    id ? "Feeding updated. Looking good! 🌿" : "Feeding logged! Your starter says thank you! ✨",
    id ? {} : { reward: true, duration: 3000 }
  );
});

$("#confirmDialog").addEventListener("close", () => {
  if ($("#confirmDialog").returnValue === "confirm" && pendingConfirm) pendingConfirm();
  pendingConfirm = null;
});

["calcStarter", "calcFlour", "calcWater"].forEach(id => $(`#${id}`).addEventListener("input", updateCalculator));
$("#hydrationRange").addEventListener("input", updateWaterFromHydrationSlider);
["feedStarter", "feedFlour", "feedWater", "feedTemp"].forEach(id => $(`#${id}`).addEventListener("input", updateFeedingSummary));
$("#riseRange").addEventListener("input", event => {
  state.readiness.rise = Number(event.target.value);
  updateReadiness();
});

$("#logReadinessButton").addEventListener("click", () => {
  const starterId = $("#readinessStarter").value;
  if (!starterId) return toast("Add a starter first.");
  state.data.readinessChecks.push({
    id: uid("check"),
    starterId,
    date: new Date().toISOString(),
    ...state.readiness
  });
  state.activeStarterId = starterId;
  saveData();
  renderAll();
  toast("Readiness check saved. You make the final call.");
});

$$(".app-dialog").forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
});

renderAll();
