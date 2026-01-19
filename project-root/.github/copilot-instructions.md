# Copilot / AI Agent Instructions for this repository

Purpose
- Help AI coding agents be immediately productive editing this static multi-page site.

Big picture
- This is a simple static site: HTML pages live under `pages/`; shared assets live under `assets/` (css, js, imgs).
- There is no build tool or bundler present — pages reference assets with relative paths (e.g., `../assets/css/index.css`).

Key files and patterns
- Entry pages: [pages/index.html](pages/index.html) — pages contain full HTML (headers/footers are in-page, not auto-included).
- Global styles: [assets/css/common.css](assets/css/common.css), [assets/css/index.css](assets/css/index.css), [assets/css/variables.css](assets/css/variables.css).
- Page-local styles/scripts: many pages include their own CSS/JS alongside HTML, e.g. [pages/myPage/myPage.html](pages/myPage/myPage.html) and [pages/myPage/myPage.js](pages/myPage/myPage.js).
- Global JS: [assets/js/common.js](assets/js/common.js).
- Reusable component fragments exist under [assets/components/](assets/components/) but are currently empty/unused — edits should prefer updating the page files directly unless you add a build/include step.

Editing guidance (practical)
- To change the header/navigation, edit the header markup inside the individual page (e.g., [pages/index.html](pages/index.html)).
- To update site-wide styles, modify files in [assets/css/](assets/css/). Use `variables.css` for theme variables.
- To change shared JS behavior, update [assets/js/common.js](assets/js/common.js) — avoid adding transpilation tooling unless coordinated.
- Image assets live in [assets/imgs/](assets/imgs/) and are referenced by relative paths from pages (watch `../` levels).

Local preview and debugging
- No build step: serve the repo root over HTTP to preview pages and ensure assets load correctly.
- Quick commands (run from the repository root):

```powershell
# Python (works on Windows if Python installed)
python -m http.server 8000

# Node (if you prefer http-server)
npx http-server -p 8000
```

- Open http://localhost:8000/pages/index.html in the browser and use DevTools to inspect CSS/JS issues.

Conventions & gotchas discovered
- Pages contain duplicated header/footer markup (no SSI). If you centralize fragments under `assets/components/`, leave a migration note and add a build step — do not silently change markup structure.
- Relative paths are significant: files under `pages/*` typically use `../assets/...`. When moving files, update paths accordingly.
- There are per-page CSS/JS files (e.g., `pages/cart/cart.css` and `pages/cart/cart.html`) — prefer editing the page's CSS for page-scoped styling.

When to propose stronger changes
- If you add a templating or bundling step (e.g., Nunjucks, eleventy, webpack), include a README explaining the new build commands and update all HTML includes to use the new template partials.

If you're unsure or the change is cross-cutting
- Open a short PR describing the intended restructuring and include a local preview link (screenshot or instructions to serve). Point reviewers at the specific pages you changed (use file links in the PR description).

Questions / feedback
- If any of these notes are unclear or you'd like me to include examples for a migration (e.g., adding a simple include/build step), tell me what transformation you want and I'll draft the patch and commands.
