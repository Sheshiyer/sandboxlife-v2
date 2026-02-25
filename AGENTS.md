# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds all React source: route pages in `src/pages/`, shared UI in `src/components/`, contexts in `src/context/`, and app logic in `src/utils/`.
- `src/assets/` stores local icon sets; `public/` is for static assets served as-is.
- `docs/` and `.claude/` contain product and architecture documentation.
- `scripts/` hosts one-off utilities like `scripts/test-supabase.mjs`.
- `dist/` is the production build output (generated).

## Architecture Overview
- Frontend is a React 18 SPA built with Vite and Tailwind; routing lives in `src/pages/` via React Router.
- Core game logic (XP, quests, inventory, achievements) is centralized in `src/utils/` to keep UI components lean.
- Supabase provides auth, database, and storage; client setup is in `src/utils/supabase.jsx`.
- Adventure Mode UI is organized under `src/components/game/` and `src/pages/DashboardV2.jsx`.
- For deeper architecture context (and any future diagrams), reference `.claude/SYSTEM_DESIGN.md`.

## Docs Index
- `.claude/steering/README.md` is the primary index for steering docs and workflows.
- `.claude/steering/` contains the authoritative guides for icons, database, and component integration.
- `docs/` holds end-user or feature documentation like the Adventure Mode guides.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server at `http://localhost:5173`.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the built app locally for verification.
- `npm run lint` runs ESLint with a zero-warnings policy.
- `npx vitest` runs the Vitest suite (tests live in `src/**/*.test.jsx`).
- `node scripts/test-supabase.mjs` checks Supabase connectivity and key queries.

## Coding Style & Naming Conventions
- Use 2-space indentation and keep JSX readable with clear component boundaries.
- React components use `PascalCase` (e.g., `QuestCard.jsx`); hooks use `useX` naming.
- Tailwind CSS is the primary styling approach; keep class strings organized and minimal.
- Linting is enforced by ESLint; fix lint errors before committing.

## Testing Guidelines
- Unit/integration tests use Vitest; keep new tests alongside related modules in `src/`.
- Name tests `*.test.jsx` and focus on core UI and progression logic.
- There is no explicit coverage threshold; add tests for new features or bug fixes.

## Commit & Pull Request Guidelines
- Commit messages follow a Conventional Commits style (e.g., `feat:`, `docs:`).
- Keep commits scoped and descriptive; avoid mixing refactors with new behavior.
- PRs should include a concise summary, linked issue/ticket if applicable, and UI screenshots or GIFs for visual changes.

## Security & Configuration Notes
- Supabase credentials are currently hardcoded in `src/utils/supabase.jsx`; if you move them to env vars, update deployment config accordingly.
- Deployment targets Vercel; `vercel.json` configures SPA routing.
