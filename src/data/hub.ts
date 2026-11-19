export type ProjectCategory =
  | "macOS Apps"
  | "Browser Games"
  | "Extensions"
  | "CLI Tools";

export interface ProjectItem {
  id: string;
  name: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  stack: string[];
  repoUrl: string;
  liveUrl?: string;
  installCmd?: string;
  featured?: boolean;
  status: "Active" | "Playable" | "Completed";
}

export interface PrincipleItem {
  title: string;
  summary: string;
  icon: string;
}

export interface StackGroup {
  label: string;
  items: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  detail: string;
}

export const HUB_CONFIG = {
  brand: "AMFI-Disable",
  role: "Open-Source Software & Systems Hub",
  availability: "Active Open-Source Repositories",
  headline: "Local-first macOS apps, browser games, and sharp developer tools.",
  bio: "Repository hub for AMFI-Disable—native SwiftUI utilities, zero-backend WebGL/WebRTC browser games, Manifest V3 extensions, and Python CLI workstations.",
  githubUrl: "https://github.com/AMFI-Disable",
  brewTapCmd: "brew tap AMFI-Disable/tap",
  brewInstalls: [
    { label: "Juicer (macOS Suite)", cmd: "brew install --cask juicer" },
    { label: "BrewStore (Homebrew GUI)", cmd: "brew install --cask brewstore" },
    { label: "Brew-Ghost (Cleanup CLI)", cmd: "brew install brew-ghost" },
  ],
  principles: [
    {
      icon: "shield",
      title: "Local-First Privacy",
      summary:
        "Zero telemetry, zero third-party trackers, and full client-side ownership of your data and workflows.",
    },
    {
      icon: "cpu",
      title: "Native & Fast",
      summary:
        "Built close to the platform—SwiftUI & AppKit on macOS, WebGL 2 & Canvas in the browser, Textual in the terminal.",
    },
    {
      icon: "package",
      title: "End-to-End Delivery",
      summary:
        "Every project is packaged for real use—distributed via Homebrew taps, GitHub Pages, or self-contained extension bundles.",
    },
  ] satisfies PrincipleItem[],
  stack: [
    {
      label: "Languages",
      items: ["Swift", "TypeScript", "JavaScript", "Python", "C++", "Ruby", "Shell"],
    },
    {
      label: "macOS & Desktop",
      items: ["SwiftUI", "AppKit", "Combine", "XcodeGen", "launchd"],
    },
    {
      label: "Web, Games & Extensions",
      items: ["Three.js", "HTML5 Canvas", "WebRTC", "Manifest V3", "WXT", "Vite"],
    },
    {
      label: "CLI, Infra & Tooling",
      items: ["Textual", "uv", "Docker", "Cloudflare Workers", "GitHub Actions", "Homebrew"],
    },
  ] satisfies StackGroup[],
  projects: [
    {
      id: "juicer",
      name: "Juicer",
      category: "macOS Apps",
      tagline: "All-in-one local-first macOS utility suite",
      description:
        "Consolidates app uninstallers, orphan file cleaners, launchd service editors, developer cache pruners, Gatekeeper tools, and system tweakers across 16 native SwiftUI workspaces.",
      stack: ["Swift", "SwiftUI", "AppKit"],
      repoUrl: "https://github.com/AMFI-Disable/Juicer",
      liveUrl: "https://amfi-disable.github.io/Juicer/",
      installCmd: "brew install --cask AMFI-Disable/tap/juicer",
      featured: true,
      status: "Active",
    },
    {
      id: "brewstore",
      name: "BrewStore",
      category: "macOS Apps",
      tagline: "Native macOS GUI & CLI companion for Homebrew",
      description:
        "Search 10,000+ formulae and casks in under 20ms with preview-first dry-run safety, Time Machine rollback snapshots, and live daemon telemetry.",
      stack: ["Swift", "SwiftUI", "AppKit"],
      repoUrl: "https://github.com/AMFI-Disable/BrewStore",
      liveUrl: "https://amfi-disable.github.io/BrewStore/",
      installCmd: "brew install --cask AMFI-Disable/tap/brewstore",
      featured: true,
      status: "Active",
    },
    {
      id: "pathdeck",
      name: "PathDeck",
      category: "macOS Apps",
      tagline: "Visual shell PATH, alias & environment studio",
      description:
        "Native macOS utility to visually inspect, reorder, deduplicate, and safely back up your shell configurations, PATH entries, aliases, and environment variables.",
      stack: ["Swift", "SwiftUI"],
      repoUrl: "https://github.com/AMFI-Disable/PathDeck",
      liveUrl: "https://amfi-disable.github.io/PathDeck/",
      featured: false,
      status: "Active",
    },
    {
      id: "renying",
      name: "RenYing",
      category: "Browser Games",
      tagline: "Ink-wash martial-arts duel with WebRTC P2P",
      description:
        "Fast-paced 1v1 browser fighting game featuring 16 heroes, custom HTML5 Canvas rendering, serverless WebRTC peer-to-peer netplay, and an optional Cloudflare Worker backend.",
      stack: ["JavaScript", "HTML5 Canvas", "WebRTC", "Cloudflare Workers"],
      repoUrl: "https://github.com/AMFI-Disable/RenYing",
      liveUrl: "https://amfi-disable.github.io/RenYing/",
      featured: true,
      status: "Playable",
    },
    {
      id: "dustiii",
      name: "DustIII",
      category: "Browser Games",
      tagline: "Browser-native 5v5 bomb defusal on de_dust2",
      description:
        "Static-site 3D tactical shooter built with Three.js featuring MR12 competitive rules, CS2-style economy, buy menu, spray patterns, wallbangs, and four bot tiers.",
      stack: ["JavaScript", "Three.js", "WebGL 2"],
      repoUrl: "https://github.com/AMFI-Disable/DustIII",
      liveUrl: "https://amfi-disable.github.io/DustIII/",
      featured: true,
      status: "Playable",
    },
    {
      id: "geofs-extension",
      name: "GeoFS_Extension",
      category: "Extensions",
      tagline: "All-in-one flight deck companion for GeoFS",
      description:
        "Unified Manifest V3 Chrome extension monorepo (plus archived legacy userscripts) enhancing GeoFS V3.9 and V4.0 with cockpit instruments and flight utilities.",
      stack: ["TypeScript", "JavaScript", "Vite", "Vitest", "Manifest V3"],
      repoUrl: "https://github.com/AMFI-Disable/GeoFS_Extension",
      liveUrl: "https://amfi-disable.github.io/GeoFS_Extension/",
      featured: true,
      status: "Active",
    },
    {
      id: "lichess-autoplayer",
      name: "Lichess-AutoPlayer",
      category: "Extensions",
      tagline: "Stockfish WASM userscript & companion",
      description:
        "In-page browser userscript powered by Stockfish 16 WebAssembly for automated Lichess quick-pairing, dynamic search budgets, and an optional native mouse companion server.",
      stack: ["JavaScript", "C++", "Stockfish WASM", "Node.js"],
      repoUrl: "https://github.com/AMFI-Disable/Lichess-AutoPlayer",
      liveUrl: "https://amfi-disable.github.io/Lichess-AutoPlayer/",
      featured: false,
      status: "Active",
    },
    {
      id: "gimsell",
      name: "GimSell_Gimkit-Seller",
      category: "Extensions",
      tagline: "Client-side duplicate cosmetic seller for Gimkit",
      description:
        "Tampermonkey/Violentmonkey userscript with a collapsible floating widget that automates selling duplicate Gims, trails, and stickers in the Gimkit Locker.",
      stack: ["JavaScript", "Userscript"],
      repoUrl: "https://github.com/AMFI-Disable/GimSell_Gimkit-Seller",
      liveUrl: "https://amfi-disable.github.io/GimSell_Gimkit-Seller/",
      featured: false,
      status: "Completed",
    },
    {
      id: "omnisuite",
      name: "OmniSuite",
      category: "CLI Tools",
      tagline: "Terminal workstation for debate & forensics",
      description:
        "High-fidelity CLI and Textual TUI engineered for competitive debate and forensics to store, filter, and rapidly retrieve AFF/NEG cards during crossfire.",
      stack: ["Python", "Textual", "uv", "Docker"],
      repoUrl: "https://github.com/AMFI-Disable/OmniSuite",
      liveUrl: "https://amfi-disable.github.io/OmniSuite/",
      featured: true,
      status: "Active",
    },
    {
      id: "brew-ghost",
      name: "Brew-Ghost",
      category: "CLI Tools",
      tagline: "Behavioral shell-history cleanup for Homebrew",
      description:
        "Analyzes your Bash and Zsh shell history to safely identify and purge abandoned Homebrew packages that have sat unused for over 90 days.",
      stack: ["Python", "Bash / Zsh", "Homebrew"],
      repoUrl: "https://github.com/AMFI-Disable/Brew-Ghost",
      liveUrl: "https://amfi-disable.github.io/Brew-Ghost/",
      installCmd: "brew install AMFI-Disable/tap/brew-ghost",
      featured: false,
      status: "Active",
    },
  ] satisfies ProjectItem[],
  links: [
    {
      label: "GitHub",
      href: "https://github.com/AMFI-Disable",
      detail: "@AMFI-Disable",
    },
    {
      label: "Homebrew Tap",
      href: "https://github.com/AMFI-Disable/Homebrew-Tap",
      detail: "AMFI-Disable/tap",
    },
    {
      label: "Play RenYing",
      href: "https://amfi-disable.github.io/RenYing/",
      detail: "Live on GitHub Pages",
    },
    {
      label: "Play DustIII",
      href: "https://amfi-disable.github.io/DustIII/",
      detail: "Live on GitHub Pages",
    },
  ] satisfies SocialLink[],
};
