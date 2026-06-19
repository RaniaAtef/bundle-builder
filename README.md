# Bundle Builder

React + Vite prototype for the multi-step security-system bundle builder take-home.

## Run

```bash
npm install
npm run api
```

Run the frontend in a second terminal:

```bash
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Notes

- Product and step data live in [`src/data/catalog.json`](./src/data/catalog.json).
- The Node API serves the shared catalog from `GET /api/catalog`; the frontend uses the bundled JSON as a fallback when the API is unavailable.
- Variant quantities are tracked independently per product variant and stay in sync with the review panel.
- "Save my system for later" stores the current configuration through the Node API and keeps `localStorage` as a fallback.
- Product imagery is stored under `public/images` and referenced from the catalog.

## What we used

- **React:** `react` and `react-dom` for component-driven UI.
- **Vite:** fast dev server and build tool.
- **Tailwind CSS:** utility-first styling.
- **lucide-react:** lightweight SVG icon components used in some UI bits.
- **Node:** minimal API for serving the catalog and persisting bundles (invoked via `npm run api`).
- **LocalStorage:** client-side fallback persistence (see `STORAGE_KEY` in `src/data/seed.js`).
