# AMFI-Disable.github.io

Personal developer hub and portfolio website for **AMFI-Disable**, built with **Vite + TypeScript** and configured for automated deployment to **GitHub Pages**.

## Features

- **Centralized Data Config**: Update your bio, links, projects, Homebrew commands, and tech stack from a single file (`src/data/hub.ts`).
- **Interactive Project Explorer**: Filter projects by category (`macOS Apps`, `Browser Games`, `Extensions`, `CLI Tools`) or search by name/technology (press `/` to focus).
- **One-Click Copy**: Clickable `brew tap` and `brew install` pills with clipboard toast feedback.
- **Dark & Light Themes**: Automatic system preference detection with a persisted theme toggle.
- **Zero-Bloat Bundle**: Vanilla TypeScript and CSS with no runtime framework overhead.

## Project Structure

```text
.
├── .github/workflows/deploy.yml  # GitHub Actions build & Pages deployment
├── public/
│   ├── .nojekyll                 # Bypasses Jekyll processing on GitHub Pages
│   └── favicon.svg               # Site icon
├── src/
│   ├── data/hub.ts               # Editable profile, projects, and links data
│   ├── styles/main.css           # Theme tokens, layout, and component styles
│   └── main.ts                   # App rendering, filtering, and interactions
├── index.html                    # HTML entry point & OpenGraph metadata
├── package.json
├── tsconfig.json
└── vite.config.ts                # Configured with base: "/" for <username>.github.io
```

## Local Development

```bash
# Install dependencies
npm install

# Start the Vite dev server
npm run dev

# Type-check and build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview
```

## Customizing Your Content

1. Open `src/data/hub.ts` and edit `HUB_CONFIG`:
   - Update `brand`, `role`, `availability`, `headline`, and `bio`.
   - Add, remove, or reorder entries in `projects`, `principles`, `stack`, and `links`.
2. Update `<title>` and `<meta>` tags in `index.html` if you change your site title or domain.

## Deploying to GitHub Pages

This repository includes `.github/workflows/deploy.yml`, which automatically builds `dist/` and deploys it on every push to `main`:

1. Create a public GitHub repository named `AMFI-Disable.github.io`.
2. Push this repository to `main`:
   ```bash
   git remote add origin https://github.com/AMFI-Disable/AMFI-Disable.github.io.git
   git push -u origin main
   ```
3. In your GitHub repository **Settings → Pages**, set **Source** to **GitHub Actions**.
4. Your site will be live at `https://amfi-disable.github.io/`.

## License

[MIT](LICENSE)
