export type HubId = "all" | "arcade" | "studio" | "hangar" | "terminal";

export type ProjectCategory =
  | "macOS Apps"
  | "Browser Games"
  | "Extensions"
  | "CLI Tools";

export interface HubDistrict {
  id: Exclude<HubId, "all">;
  name: string;
  category: ProjectCategory;
  accent: string;
  tagline: string;
  badge: string;
}

export interface ProjectItem {
  id: string;
  hub: Exclude<HubId, "all">;
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
  hubs: [
    {
      id: "arcade",
      name: "AMFI Arcade",
      category: "Browser Games",
      accent: "#E53935",
      tagline: "Zero-backend WebGL & Canvas browser games—insert coin and play instantly.",
      badge: "Playable Now",
    },
    {
      id: "studio",
      name: "AMFI Studio",
      category: "macOS Apps",
      accent: "#2EA3F2",
      tagline: "Native SwiftUI desktop utilities and Homebrew companions built for macOS.",
      badge: "macOS 14+",
    },
    {
      id: "hangar",
      name: "AMFI Hangar",
      category: "Extensions",
      accent: "#66BB6A",
      tagline: "Manifest V3 browser extensions and Stockfish/automation userscripts.",
      badge: "Browser Loadout",
    },
    {
      id: "terminal",
      name: "AMFI Terminal",
      category: "CLI Tools",
      accent: "#FBC02D",
      tagline: "Fast Python CLIs and Textual TUIs for debate research and Homebrew hygiene.",
      badge: "CLI & TUI",
    },
  ] satisfies HubDistrict[],
  projects: [
    {
      id: "juicer",
      hub: "studio",
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
      hub: "studio",
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
      hub: "studio",
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
      hub: "arcade",
      name: "RenYing",
      category: "Browser Games",
      tagline: "Ink-wash martial-arts duel with WebRTC P2P",
      description:
        "Fast-paced 1v1 browser fighting game featuring 36 heroes, custom HTML5 Canvas rendering, serverless WebRTC peer-to-peer netplay, and an optional Cloudflare Worker backend.",
      stack: ["JavaScript", "HTML5 Canvas", "WebRTC", "Cloudflare Workers"],
      repoUrl: "https://github.com/BigBrainDevBros/RenYing",
      liveUrl: "https://bigbraindevbros.github.io/RenYing/",
      featured: true,
      status: "Playable",
    },
    {
      id: "faceoff",
      hub: "arcade",
      name: "FaceOff",
      category: "Browser Games",
      tagline: "First-to-nine arena duels",
      description:
        "Choose one of four arenas and a bot difficulty for timed one-on-one rounds. The final 20 seconds reveal player positions.",
      stack: ["JavaScript", "Three.js", "WebGL 2"],
      repoUrl: "https://github.com/BigBrainDevBros/FaceOff",
      liveUrl: "https://bigbraindevbros.github.io/FaceOff/",
      featured: true,
      status: "Playable",
    },
    {
      id: "vantage",
      hub: "arcade",
      name: "VANTAGE",
      category: "Browser Games",
      tagline: "Procedural city shooter by HilbertQiu",
      description:
        "Explore a city in this standalone browser game by HilbertQiu. Choose the map and its size, then start a solo match with bots.",
      stack: ["Three.js", "PeerJS"],
      repoUrl: "https://github.com/BigBrainDevBros/VANTAGE",
      liveUrl: "https://bigbraindevbros.github.io/VANTAGE/",
      status: "Playable",
    },
    {
      id: "geofs-extension",
      hub: "hangar",
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
      hub: "hangar",
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
      hub: "hangar",
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
      hub: "terminal",
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
      hub: "terminal",
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
      label: "BigBrainDevBros",
      href: "https://github.com/BigBrainDevBros",
      detail: "Organization",
    },
    {
      label: "Homebrew Tap",
      href: "https://github.com/AMFI-Disable/Homebrew-Tap",
      detail: "AMFI-Disable/tap",
    },
    {
      label: "Play RenYing",
      href: "https://bigbraindevbros.github.io/RenYing/",
      detail: "Live on GitHub Pages",
    },
    {
      label: "Play FaceOff",
      href: "https://bigbraindevbros.github.io/FaceOff/",
      detail: "Live on GitHub Pages",
    },
  ] satisfies SocialLink[],
};
