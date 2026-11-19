import "./styles/main.css";
import { HUB_CONFIG, type ProjectCategory, type ProjectItem } from "./data/hub";

const CATEGORIES: Array<"All" | ProjectCategory> = [
  "All",
  "macOS Apps",
  "Browser Games",
  "Extensions",
  "CLI Tools",
];

let activeCategory: "All" | ProjectCategory = "All";
let searchQuery = "";
let toastTimer: number | undefined;

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
  }, 2000);
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
    <article class="project-card">
      <div>
        <div class="card-top">
          <div class="card-title-row">
            <h3 class="card-title">${escapeHtml(project.name)}</h3>
            <span class="${statusBadgeClass(project.status)}">${escapeHtml(project.status)}</span>
          </div>
          <span class="card-category">${escapeHtml(project.category)}</span>
        </div>
        <p class="card-tagline">${escapeHtml(project.tagline)}</p>
        <p class="card-desc">${escapeHtml(project.description)}</p>
        <div class="tag-list">${tags}</div>
      </div>
      <div class="card-footer">
        <div class="card-links">
          <a class="card-link" href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener noreferrer">GitHub ${getIcon("external")}</a>
          ${liveLink}
        </div>
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
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    if (!matchesCategory) return false;
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

function renderApp(): void {
  const root = document.getElementById("app");
  if (!root) return;

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
        <a href="#top" class="brand">
          <span class="brand-mark">&gt;_</span>
          <span>${escapeHtml(HUB_CONFIG.brand)}</span>
        </a>
        <nav class="nav-links" aria-label="Primary">
          <a href="#projects">Projects</a>
          <a href="#homebrew">Homebrew</a>
          <a href="#principles">Principles</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Links</a>
        </nav>
        <div class="header-actions">
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
          <a href="#projects" class="btn btn-primary">Explore Projects</a>
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

      <section id="projects" class="section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Selected Projects</h2>
            <p class="section-subtitle" id="projects-count"></p>
          </div>
        </div>
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
      <span>Built with Vite & TypeScript · Hosted on GitHub Pages</span>
    </footer>

    <div id="toast" class="toast" role="status" aria-live="polite"></div>
  `;

  applyTheme(getInitialTheme());
  renderFilteredProjects();
  bindEvents();
}

function bindEvents(): void {
  const root = document.getElementById("app");
  if (!root) return;

  root.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    const themeBtn = target.closest<HTMLButtonElement>("#theme-toggle");
    if (themeBtn) {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      applyTheme(current === "dark" ? "light" : "dark", true);
      return;
    }

    const tab = target.closest<HTMLButtonElement>(".filter-tab");
    if (tab) {
      const cat = tab.dataset.category as "All" | ProjectCategory | undefined;
      if (cat) {
        activeCategory = cat;
        root.querySelectorAll(".filter-tab").forEach((el) => el.classList.remove("active"));
        tab.classList.add("active");
        renderFilteredProjects();
      }
      return;
    }

    const copyBtn = target.closest<HTMLElement>("[data-copy]");
    if (copyBtn?.dataset.copy) {
      void copyText(copyBtn.dataset.copy);
    }
  });

  const searchInput = document.getElementById("project-search") as HTMLInputElement | null;
  searchInput?.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderFilteredProjects();
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "/" &&
      document.activeElement?.tagName !== "INPUT" &&
      document.activeElement?.tagName !== "TEXTAREA"
    ) {
      event.preventDefault();
      searchInput?.focus();
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
