import "./styles/main.css";
import { HUB_CONFIG, type HubId, type ProjectCategory, type ProjectItem } from "./data/hub";

const CATEGORIES: Array<"All" | ProjectCategory> = [
  "All",
  "Browser Games",
  "macOS Apps",
  "Extensions",
  "CLI Tools",
];

const HUB_TO_CATEGORY: Record<HubId, "All" | ProjectCategory> = {
  all: "All",
  arcade: "Browser Games",
  studio: "macOS Apps",
  hangar: "Extensions",
  terminal: "CLI Tools",
};

const CATEGORY_TO_HUB: Record<"All" | ProjectCategory, HubId> = {
  All: "all",
  "Browser Games": "arcade",
  "macOS Apps": "studio",
  Extensions: "hangar",
  "CLI Tools": "terminal",
};

let activeHub: HubId = "all";
let activeCategory: "All" | ProjectCategory = "All";
let searchQuery = "";
let toastTimer: number | undefined;
let hangarMode: "mv3" | "userscript" = "mv3";
const studioBundle = new Set<string>(["juicer", "brewstore"]);
let terminalLog = [
  "AMFI Terminal Sandbox — type 'help', 'brew-ghost scan', or 'omnisuite search' below.",
];

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getIcon(name: string): string {
  switch (name) {
    case "shield":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    case "cpu":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`;
    case "package":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>`;
    case "copy":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
    case "external":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
    case "sun":
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    case "moon":
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    default:
      return "";
  }
}

function showToast(message: string): void {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2200);
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied: ${text}`);
  } catch {
    showToast("Copy failed — clipboard unavailable");
  }
}

const colorSchemeMedia = window.matchMedia("(prefers-color-scheme: light)");

const ALL_REPOS_ENCODED =
  "amfi-disable%2Famfi-disable%2Camfi-disable%2Famfi-disable.github.io%2Camfi-disable%2Fbrew-ghost%2Camfi-disable%2Fbrewstore%2Camfi-disable%2Ffmg_free-mapgenie%2Camfi-disable%2Fgeofs_extension%2Camfi-disable%2Fgeofs_liveryselector%2Camfi-disable%2Fgimsell_gimkit-seller%2Camfi-disable%2Fhomebrew-brewstore%2Camfi-disable%2Fhomebrew-juicer%2Camfi-disable%2Fhomebrew-tap%2Camfi-disable%2Fjuicer%2Camfi-disable%2Flichess-autoplayer%2Camfi-disable%2Fomnisuite%2Camfi-disable%2Fpathdeck%2Camfi-disable%2Ftorntools%2Cbigbraindevbros%2F.github%2Cbigbraindevbros%2Ffaceoff%2Cbigbraindevbros%2Frenying%2Cbigbraindevbros%2Fvantage";

function updateThemedGraphs(theme: "dark" | "light"): void {
  const starImg = document.getElementById("star-history-img") as HTMLImageElement | null;
  if (starImg) {
    const themeParam = theme === "dark" ? "&theme=dark" : "";
    starImg.src = `https://api.star-history.com/chart?repos=${ALL_REPOS_ENCODED}&type=date${themeParam}&legend=top-left`;
  }
  const hexImg = document.getElementById("hexagon-graph-img") as HTMLImageElement | null;
  if (hexImg) {
    hexImg.src = `https://raw.githubusercontent.com/AMFI-Disable/AMFI-Disable/main/assets/contribution-hexagon-${theme}.svg`;
  }
}

async function refreshTotalStars(): Promise<void> {
  const el = document.getElementById("total-stars-count");
  if (!el) return;
  try {
    const [userRes, orgRes] = await Promise.all([
      fetch("https://api.github.com/users/AMFI-Disable/repos?per_page=100"),
      fetch("https://api.github.com/orgs/BigBrainDevBros/repos?per_page=100"),
    ]);
    if (!userRes.ok && !orgRes.ok) return;
    const sumStars = async (res: Response) => {
      if (!res.ok) return 0;
      const repos = (await res.json()) as Array<{ stargazers_count?: number }>;
      return repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
    };
    const [userTotal, orgTotal] = await Promise.all([sumStars(userRes), sumStars(orgRes)]);
    const publicTotal = userTotal + orgTotal;
    if (publicTotal > 0) {
      el.textContent = `${publicTotal} total stars`;
    }
  } catch {
    // Keep initial fallback count when offline or rate-limited
  }
}

function getInitialTheme(): "dark" | "light" {
  const stored = localStorage.getItem("hub-theme");
  if (stored === "light" || stored === "dark") return stored;
  return colorSchemeMedia.matches ? "light" : "dark";
}

function applyTheme(theme: "dark" | "light", persist = false): void {
  document.documentElement.setAttribute("data-theme", theme);
  const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = theme === "light" ? "#F6F8FA" : "#0B0E14";
  }
  if (persist) {
    localStorage.setItem("hub-theme", theme);
  }
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.innerHTML = `${getIcon(theme === "dark" ? "sun" : "moon")}<span>${theme === "dark" ? "Light" : "Dark"}</span>`;
    btn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  }
  updateThemedGraphs(theme);
}

function syncDisplayContext(): void {
  const root = document.documentElement;
  const w = window.innerWidth;
  root.setAttribute("data-viewport", w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop");
  root.setAttribute("data-dpr", window.devicePixelRatio >= 2 ? "hidpi" : "standard");
  root.setAttribute("data-pointer", window.matchMedia("(pointer: coarse)").matches ? "coarse" : "fine");
  const ua = navigator.userAgent.toLowerCase();
  const os = ua.includes("mac") ? "macos" : ua.includes("win") ? "windows" : ua.includes("linux") ? "linux" : "other";
  root.setAttribute("data-os", os);
}

function recordHubVisit(hub: HubId): void {
  if (hub === "all") return;
  try {
    const raw = localStorage.getItem("amfi-visited-hubs");
    const visited = new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
    visited.add(hub);
    localStorage.setItem("amfi-visited-hubs", JSON.stringify([...visited]));
  } catch {
    // ignore storage errors
  }
  updateExplorerStamp();
}

function updateExplorerStamp(): void {
  const el = document.getElementById("explorer-stamp");
  if (!el) return;
  try {
    const raw = localStorage.getItem("amfi-visited-hubs");
    const count = raw ? (JSON.parse(raw) as string[]).length : 0;
    el.textContent = `Explorer Passport: ${count}/4 Hubs Visited`;
  } catch {
    el.textContent = "Explorer Passport: 0/4 Hubs Visited";
  }
}

function setActiveHub(hub: HubId, updateHash = true): void {
  activeHub = hub;
  activeCategory = HUB_TO_CATEGORY[hub];
  const district = HUB_CONFIG.hubs.find((h) => h.id === hub);
  if (district) {
    document.documentElement.style.setProperty("--accent", district.accent);
    recordHubVisit(hub);
  } else {
    document.documentElement.style.removeProperty("--accent");
  }
  if (updateHash) {
    const targetHash = hub === "all" ? "#projects" : `#${hub}`;
    if (window.location.hash !== targetHash) {
      history.replaceState(null, "", targetHash);
    }
  }
  document.querySelectorAll<HTMLElement>(".hub-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.hub === hub);
  });
  document.querySelectorAll<HTMLElement>(".filter-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === activeCategory);
  });
  renderHubInteractive();
  renderFilteredProjects();
}

function buildBundleCommand(): string {
  const parts: string[] = [];
  if (studioBundle.has("juicer")) parts.push("--cask juicer");
  if (studioBundle.has("brewstore")) parts.push("--cask brewstore");
  if (studioBundle.has("brew-ghost")) parts.push("brew-ghost");
  if (parts.length === 0) return "brew tap AMFI-Disable/tap";
  const casks = parts.filter((p) => p.startsWith("--cask"));
  const formulae = parts.filter((p) => !p.startsWith("--cask"));
  const cmds = ["brew tap AMFI-Disable/tap"];
  if (casks.length) cmds.push(`brew install ${casks.join(" ")}`);
  if (formulae.length) cmds.push(`brew install ${formulae.join(" ")}`);
  return cmds.join(" && ");
}

function runTerminalCommand(raw: string): void {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return;
  terminalLog.push(`$ ${raw.trim()}`);
  if (cmd === "help") {
    terminalLog.push("Available commands: brew-ghost scan | omnisuite search | clear | help");
  } else if (cmd === "clear") {
    terminalLog = ["Terminal cleared. Type 'help' for commands."];
  } else if (cmd.startsWith("brew-ghost")) {
    terminalLog.push(
      "[brew-ghost] Scanning ~/.zsh_history (90-day window)...",
      "  idle 142d  ffmpeg-legacy   (184 MB)",
      "  idle 108d  hugo-0.110      ( 62 MB)",
      "Run 'brew-ghost exorcise --dry-run' to preview safe cleanup."
    );
  } else if (cmd.startsWith("omnisuite")) {
    terminalLog.push(
      "[OmniSuite] Indexed 412 AFF / 389 NEG cards (SQLite FTS).",
      "  [1] AFF-Grid-04  :: Heat-pump deployment elasticity (2025)",
      "  [2] NEG-Cap-12   :: Municipal substation bottleneck (2024)"
    );
  } else {
    terminalLog.push(`Unknown command '${raw.trim()}'. Try 'help', 'brew-ghost scan', or 'omnisuite search'.`);
  }
  const out = document.getElementById("terminal-output");
  if (out) {
    out.textContent = terminalLog.join("\n");
    out.scrollTop = out.scrollHeight;
  }
}

function renderHubInteractive(): void {
  const container = document.getElementById("hub-interactive");
  if (!container) return;

  if (activeHub === "all") {
    container.innerHTML = `
      <div class="hub-interactive-head">
        <h3>Explore by AMFI District</h3>
        <button type="button" class="btn btn-secondary" id="surprise-me-btn">Surprise Me (Random Project)</button>
      </div>
      <p style="margin:0;color:var(--text-muted);font-size:0.9rem;">
        Select <strong>AMFI Arcade</strong>, <strong>AMFI Studio</strong>, <strong>AMFI Hangar</strong>, or <strong>AMFI Terminal</strong> above to unlock each hub's interactive launcher, bundle builder, or CLI sandbox.
      </p>
    `;
    return;
  }

  if (activeHub === "arcade") {
    container.innerHTML = `
      <div class="hub-interactive-head">
        <h3>AMFI Arcade — Insert Coin</h3>
        <button type="button" class="btn btn-primary" id="random-match-btn">Random Match</button>
      </div>
      <p style="margin:0;color:var(--text-muted);font-size:0.9rem;">
        Play <strong>RenYing</strong> for martial arts, <strong>FaceOff</strong> for first-to-nine arena duels, or <strong>VANTAGE</strong> for a city match against bots.
      </p>
    `;
    return;
  }

  if (activeHub === "studio") {
    const cmd = buildBundleCommand();
    container.innerHTML = `
      <div class="hub-interactive-head">
        <h3>AMFI Studio — Homebrew Bundle Builder</h3>
        <button type="button" class="card-copy-btn" data-copy="${escapeHtml(cmd)}">${getIcon("copy")} Copy Bundle</button>
      </div>
      <div class="bundle-checks">
        <label class="bundle-check"><input type="checkbox" data-bundle="juicer" ${studioBundle.has("juicer") ? "checked" : ""} /> Juicer (macOS Suite)</label>
        <label class="bundle-check"><input type="checkbox" data-bundle="brewstore" ${studioBundle.has("brewstore") ? "checked" : ""} /> BrewStore (Homebrew GUI)</label>
        <label class="bundle-check"><input type="checkbox" data-bundle="brew-ghost" ${studioBundle.has("brew-ghost") ? "checked" : ""} /> Brew-Ghost (Cleanup CLI)</label>
      </div>
      <div class="brew-row">
        <code id="bundle-cmd-text">${escapeHtml(cmd)}</code>
      </div>
    `;
    return;
  }

  if (activeHub === "hangar") {
    const steps =
      hangarMode === "mv3"
        ? "1. Build or download dist/ · 2. Open chrome://extensions · 3. Enable Developer Mode & Load unpacked."
        : "1. Install Tampermonkey or Violentmonkey · 2. Import the .user.js file · 3. Open the target web app.";
    container.innerHTML = `
      <div class="hub-interactive-head">
        <h3>AMFI Hangar — Loadout Setup Guide</h3>
        <div style="display:flex;gap:8px;">
          <button type="button" class="filter-tab ${hangarMode === "mv3" ? "active" : ""}" data-hangar-mode="mv3">Chrome MV3</button>
          <button type="button" class="filter-tab ${hangarMode === "userscript" ? "active" : ""}" data-hangar-mode="userscript">Userscript</button>
        </div>
      </div>
      <p style="margin:0;color:var(--text-muted);font-size:0.9rem;">${steps}</p>
    `;
    return;
  }

  container.innerHTML = `
    <div class="hub-interactive-head">
      <h3>AMFI Terminal — Interactive CLI Sandbox</h3>
      <div class="terminal-presets">
        <button type="button" class="card-copy-btn" data-term-cmd="brew-ghost scan">brew-ghost scan</button>
        <button type="button" class="card-copy-btn" data-term-cmd="omnisuite search">omnisuite search</button>
        <button type="button" class="card-copy-btn" data-term-cmd="clear">clear</button>
      </div>
    </div>
    <div class="terminal-box">
      <pre id="terminal-output" class="terminal-output">${escapeHtml(terminalLog.join("\n"))}</pre>
      <div class="terminal-input-row">
        <span class="prompt-prefix">$</span>
        <input id="terminal-input" class="terminal-input" type="text" placeholder="Type a command (e.g. brew-ghost scan) and press Enter..." />
      </div>
    </div>
  `;
}

function statusBadgeClass(status: ProjectItem["status"]): string {
  if (status === "Playable") return "badge badge-playable";
  if (status === "Completed") return "badge badge-completed";
  return "badge badge-active";
}

function renderProjectCard(project: ProjectItem): string {
  const tags = project.stack
    .map((tech) => `<span class="tag">${escapeHtml(tech)}</span>`)
    .join("");

  const liveLabel = project.category === "Browser Games" ? "Play Live" : "Website";
  const liveLink = project.liveUrl
    ? `<a class="card-link" href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer">${liveLabel} ${getIcon("external")}</a>`
    : "";

  const installBtn = project.installCmd
    ? `<button type="button" class="card-copy-btn" data-copy="${escapeHtml(project.installCmd)}" title="Copy Homebrew install command">${getIcon("copy")} brew install</button>`
    : "";

  return `
    <article class="card">
      <div class="card-top">
        <div>
          <h3 class="card-title">${escapeHtml(project.name)}</h3>
          <p class="card-tagline">${escapeHtml(project.tagline)}</p>
        </div>
        <span class="${statusBadgeClass(project.status)}">${escapeHtml(project.status)}</span>
      </div>
      <p class="card-desc">${escapeHtml(project.description)}</p>
      <div class="tag-list">${tags}</div>
      <div class="card-actions">
        <a class="card-link" href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener noreferrer">
          Repo ${getIcon("external")}
        </a>
        ${liveLink}
        ${installBtn}
      </div>
    </article>
  `;
}

function renderFilteredProjects(): void {
  const grid = document.getElementById("projects-grid");
  const countEl = document.getElementById("projects-count");
  if (!grid || !countEl) return;

  const query = searchQuery.trim().toLowerCase();
  const filtered = HUB_CONFIG.projects.filter((project) => {
    const matchesCat = activeCategory === "All" || project.category === activeCategory;
    if (!matchesCat) return false;
    if (!query) return true;
    const haystack = [
      project.name,
      project.tagline,
      project.description,
      project.category,
      ...project.stack,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  countEl.textContent = `${filtered.length} of ${HUB_CONFIG.projects.length} projects`;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">No projects match "<strong>${escapeHtml(searchQuery)}</strong>". Try clearing the filter.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(renderProjectCard).join("");
}

function openCmdPalette(): void {
  const backdrop = document.getElementById("cmd-backdrop");
  const input = document.getElementById("cmd-modal-input") as HTMLInputElement | null;
  if (!backdrop || !input) return;
  backdrop.classList.add("open");
  input.value = "";
  renderCmdResults("");
  input.focus();
}

function closeCmdPalette(): void {
  document.getElementById("cmd-backdrop")?.classList.remove("open");
}

function renderCmdResults(q: string): void {
  const box = document.getElementById("cmd-results");
  if (!box) return;
  const query = q.trim().toLowerCase();
  const hubItems = HUB_CONFIG.hubs
    .filter((h) => !query || h.name.toLowerCase().includes(query) || h.tagline.toLowerCase().includes(query))
    .map(
      (h) => `
      <button type="button" class="cmd-item" data-cmd-hub="${h.id}">
        <strong>${escapeHtml(h.name)}</strong>
        <span>Switch Hub</span>
      </button>`
    );

  const projItems = HUB_CONFIG.projects
    .filter((p) => !query || p.name.toLowerCase().includes(query) || p.tagline.toLowerCase().includes(query))
    .map(
      (p) => `
      <button type="button" class="cmd-item" data-cmd-url="${escapeHtml(p.liveUrl || p.repoUrl)}">
        <strong>${escapeHtml(p.name)}</strong>
        <span>${escapeHtml(p.category)} &rarr;</span>
      </button>`
    );

  box.innerHTML = [...hubItems, ...projItems].join("") || `<div class="empty-state">No matches</div>`;
}

function launchRandomProject(onlyArcade = false): void {
  const pool = onlyArcade
    ? HUB_CONFIG.projects.filter((p) => p.hub === "arcade")
    : HUB_CONFIG.projects;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  if (!pick) return;
  const target = pick.liveUrl || pick.repoUrl;
  showToast(`Launching ${pick.name}...`);
  window.open(target, "_blank", "noopener,noreferrer");
}

function renderApp(): void {
  const root = document.getElementById("app");
  if (!root) return;

  const hubsHtml = HUB_CONFIG.hubs
    .map(
      (hub) => `
      <button type="button" class="hub-card ${activeHub === hub.id ? "active" : ""}" data-hub="${hub.id}" style="--hub-color:${hub.accent}">
        <div class="hub-card-top">
          <h3><span class="hub-dot"></span>${escapeHtml(hub.name)}</h3>
          <span class="hub-badge">${escapeHtml(hub.badge)}</span>
        </div>
        <p>${escapeHtml(hub.tagline)}</p>
      </button>`
    )
    .join("");

  const filterButtons = CATEGORIES.map((cat) => {
    const activeClass = cat === activeCategory ? "active" : "";
    return `<button type="button" class="filter-tab ${activeClass}" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`;
  }).join("");

  const brewRows = HUB_CONFIG.brewInstalls
    .map(
      (item) => `
      <div class="brew-row">
        <code>${escapeHtml(item.cmd)}</code>
        <button type="button" class="card-copy-btn" data-copy="${escapeHtml(item.cmd)}">${getIcon("copy")} Copy</button>
      </div>
    `
    )
    .join("");

  const principlesHtml = HUB_CONFIG.principles
    .map(
      (p) => `
      <div class="principle-card">
        <div class="principle-icon">${getIcon(p.icon)}</div>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.summary)}</p>
      </div>
    `
    )
    .join("");

  const stackHtml = HUB_CONFIG.stack
    .map(
      (group) => `
      <div class="stack-card">
        <h3>${escapeHtml(group.label)}</h3>
        <div class="tag-list" style="margin-bottom:0">
          ${group.items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
        </div>
      </div>
    `
    )
    .join("");

  const linksHtml = HUB_CONFIG.links
    .map(
      (link) => `
      <a class="contact-card" href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">
        <span class="contact-label">${escapeHtml(link.label)}</span>
        <span class="contact-detail">${escapeHtml(link.detail)}</span>
      </a>
    `
    )
    .join("");

  root.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a href="#top" class="brand" data-hub-nav="all">
          <span class="brand-mark">&gt;_</span>
          <span>${escapeHtml(HUB_CONFIG.brand)}</span>
        </a>
        <nav class="nav-links" aria-label="AMFI Hubs">
          <a href="#activity">Star History</a>
          <a href="#arcade" data-hub-nav="arcade">Arcade</a>
          <a href="#studio" data-hub-nav="studio">Studio</a>
          <a href="#hangar" data-hub-nav="hangar">Hangar</a>
          <a href="#terminal" data-hub-nav="terminal">Terminal</a>
        </nav>
        <div class="header-actions">
          <button type="button" id="cmd-open-btn" class="icon-btn" title="Quick Launcher (Ctrl/Cmd+K)">⌘K Search</button>
          <button type="button" id="theme-toggle" class="icon-btn"></button>
        </div>
      </div>
    </header>

    <main id="top" class="container">
      <section class="hero">
        <div class="status-pill">
          <span class="status-dot" aria-hidden="true"></span>
          <span>${escapeHtml(HUB_CONFIG.availability)}</span>
        </div>
        <h1 class="hero-title">${escapeHtml(HUB_CONFIG.headline)}</h1>
        <p class="hero-bio">${escapeHtml(HUB_CONFIG.bio)}</p>
        <div class="hero-actions">
          <a href="#projects" class="btn btn-primary">Explore Hubs</a>
          <a href="${escapeHtml(HUB_CONFIG.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            GitHub Profile ${getIcon("external")}
          </a>
          <button type="button" class="tap-copy-pill" data-copy="${escapeHtml(HUB_CONFIG.brewTapCmd)}" title="Click to copy Homebrew tap command">
            <span class="prompt-prefix">$</span>
            <span>${escapeHtml(HUB_CONFIG.brewTapCmd)}</span>
            ${getIcon("copy")}
          </button>
        </div>
      </section>

      <section id="activity" class="section">
        <div class="stats-header-row">
          <div>
            <h2 class="section-title">GitHub Star History &amp; Activity</h2>
            <p class="section-subtitle">Combined star growth across all AMFI-Disable and BigBrainDevBros repositories alongside personal contribution activity.</p>
          </div>
          <a class="total-stars-pill" href="https://github.com/AMFI-Disable?tab=repositories" target="_blank" rel="noopener noreferrer">
            <span>&#9733;</span>
            <span id="total-stars-count">111 total stars</span>
          </a>
        </div>
        <div class="stats-grid">
          <div class="graph-card">
            <h3>Combined Star History (All Repositories)</h3>
            <a href="https://www.star-history.com/?type=date&repos=${ALL_REPOS_ENCODED}" target="_blank" rel="noopener noreferrer">
              <img id="star-history-img" alt="AMFI-Disable Combined Star History Chart" loading="lazy" />
            </a>
          </div>
          <div class="graph-card">
            <h3>Contribution Hexagon Graph</h3>
            <img id="hexagon-graph-img" alt="AMFI-Disable Hexagonal Contribution Graph" loading="lazy" />
          </div>
        </div>
      </section>

      <section id="projects" class="section">
        <div class="section-header">
          <div>
            <h2 class="section-title">AMFI Ecosystem Hubs</h2>
            <p class="section-subtitle" id="projects-count"></p>
          </div>
          <span id="explorer-stamp" class="explorer-stamp"></span>
        </div>

        <div class="hubs-grid">${hubsHtml}</div>
        <div id="hub-interactive" class="hub-interactive"></div>

        <div class="toolbar">
          <div class="filter-tabs" role="tablist" aria-label="Filter projects by category">
            ${filterButtons}
          </div>
          <div class="search-box">
            <input
              id="project-search"
              class="search-input"
              type="search"
              placeholder="Filter by name or tech..."
              aria-label="Filter projects"
            />
            <span class="search-kbd">/</span>
          </div>
        </div>
        <div id="projects-grid" class="projects-grid"></div>
      </section>

      <section id="homebrew" class="section">
        <div class="brew-panel">
          <div>
            <h2 class="section-title">Homebrew Tap</h2>
            <p class="section-subtitle">
              All macOS casks and CLI formulae are consolidated into a single tap:
              <code>AMFI-Disable/tap</code>.
            </p>
          </div>
          <div class="brew-commands">
            <div class="brew-row">
              <code>${escapeHtml(HUB_CONFIG.brewTapCmd)}</code>
              <button type="button" class="card-copy-btn" data-copy="${escapeHtml(HUB_CONFIG.brewTapCmd)}">${getIcon("copy")} Copy</button>
            </div>
            ${brewRows}
          </div>
        </div>
      </section>

      <section id="principles" class="section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Engineering Principles</h2>
            <p class="section-subtitle">How software is designed and shipped across repositories.</p>
          </div>
        </div>
        <div class="principles-grid">${principlesHtml}</div>
      </section>

      <section id="stack" class="section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Technical Stack</h2>
            <p class="section-subtitle">Core languages, frameworks, and packaging ecosystems.</p>
          </div>
        </div>
        <div class="stack-grid">${stackHtml}</div>
      </section>

      <section id="contact" class="section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Repositories & Links</h2>
            <p class="section-subtitle">${escapeHtml(HUB_CONFIG.role)}</p>
          </div>
        </div>
        <div class="contact-grid">
          ${linksHtml}
        </div>
      </section>
    </main>

    <footer class="container site-footer">
      <span>&copy; ${new Date().getFullYear()} ${escapeHtml(HUB_CONFIG.brand)}. MIT Licensed.</span>
      <span>AMFI Arcade · Studio · Hangar · Terminal</span>
    </footer>

    <div id="cmd-backdrop" class="cmd-backdrop" role="dialog" aria-modal="true" aria-label="Quick Launcher">
      <div class="cmd-modal">
        <input id="cmd-modal-input" class="cmd-modal-input" type="search" placeholder="Jump to project or hub (Arcade, Studio, Hangar, Terminal)..." />
        <div id="cmd-results" class="cmd-results"></div>
      </div>
    </div>

    <div id="toast" class="toast" role="status" aria-live="polite"></div>
  `;

  applyTheme(getInitialTheme());
  void refreshTotalStars();
  updateExplorerStamp();

  const initialHash = window.location.hash.replace("#", "") as HubId;
  if (initialHash && initialHash in HUB_TO_CATEGORY) {
    setActiveHub(initialHash, false);
  } else {
    renderHubInteractive();
    renderFilteredProjects();
  }

  root.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.id === "cmd-backdrop") {
      closeCmdPalette();
      return;
    }

    if (target.closest("#cmd-open-btn")) {
      openCmdPalette();
      return;
    }

    const themeBtn = target.closest<HTMLButtonElement>("#theme-toggle");
    if (themeBtn) {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      applyTheme(current === "dark" ? "light" : "dark", true);
      return;
    }

    const hubNav = target.closest<HTMLElement>("[data-hub-nav]");
    if (hubNav?.dataset.hubNav) {
      const h = hubNav.dataset.hubNav as HubId;
      setActiveHub(h);
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const hubCard = target.closest<HTMLElement>(".hub-card");
    if (hubCard?.dataset.hub) {
      const clicked = hubCard.dataset.hub as HubId;
      setActiveHub(activeHub === clicked ? "all" : clicked);
      return;
    }

    const tab = target.closest<HTMLButtonElement>(".filter-tab[data-category]");
    if (tab?.dataset.category) {
      const cat = tab.dataset.category as "All" | ProjectCategory;
      setActiveHub(CATEGORY_TO_HUB[cat]);
      return;
    }

    const hangarBtn = target.closest<HTMLButtonElement>("[data-hangar-mode]");
    if (hangarBtn?.dataset.hangarMode) {
      hangarMode = hangarBtn.dataset.hangarMode as "mv3" | "userscript";
      renderHubInteractive();
      return;
    }

    const termBtn = target.closest<HTMLButtonElement>("[data-term-cmd]");
    if (termBtn?.dataset.termCmd) {
      runTerminalCommand(termBtn.dataset.termCmd);
      return;
    }

    if (target.closest("#surprise-me-btn")) {
      launchRandomProject(false);
      return;
    }

    if (target.closest("#random-match-btn")) {
      launchRandomProject(true);
      return;
    }

    const cmdHub = target.closest<HTMLButtonElement>("[data-cmd-hub]");
    if (cmdHub?.dataset.cmdHub) {
      setActiveHub(cmdHub.dataset.cmdHub as HubId);
      closeCmdPalette();
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const cmdUrl = target.closest<HTMLButtonElement>("[data-cmd-url]");
    if (cmdUrl?.dataset.cmdUrl) {
      closeCmdPalette();
      window.open(cmdUrl.dataset.cmdUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const copyBtn = target.closest<HTMLElement>("[data-copy]");
    if (copyBtn?.dataset.copy) {
      void copyText(copyBtn.dataset.copy);
    }
  });

  root.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.dataset.bundle) {
      if (target.checked) studioBundle.add(target.dataset.bundle);
      else studioBundle.delete(target.dataset.bundle);
      renderHubInteractive();
    }
  });

  root.addEventListener("keydown", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.id === "terminal-input" && event.key === "Enter") {
      runTerminalCommand(target.value);
      target.value = "";
    }
  });

  const searchInput = document.getElementById("project-search") as HTMLInputElement | null;
  searchInput?.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderFilteredProjects();
  });

  const cmdInput = document.getElementById("cmd-modal-input") as HTMLInputElement | null;
  cmdInput?.addEventListener("input", () => {
    renderCmdResults(cmdInput.value);
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openCmdPalette();
      return;
    }
    if (event.key === "Escape") {
      closeCmdPalette();
      return;
    }
    if (
      event.key === "/" &&
      document.activeElement?.tagName !== "INPUT" &&
      document.activeElement?.tagName !== "TEXTAREA"
    ) {
      event.preventDefault();
      searchInput?.focus();
    }
  });

  window.addEventListener("hashchange", () => {
    const h = window.location.hash.replace("#", "") as HubId;
    if (h && h in HUB_TO_CATEGORY) {
      setActiveHub(h, false);
    }
  });
}

syncDisplayContext();
window.addEventListener("resize", syncDisplayContext, { passive: true });
colorSchemeMedia.addEventListener("change", (event) => {
  if (!localStorage.getItem("hub-theme")) {
    applyTheme(event.matches ? "light" : "dark");
  }
});

renderApp();
