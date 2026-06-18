# Bundle Builder

React + Vite prototype for the multi-step security-system bundle builder take-home.

## Run

```bash
npm install
npm run dev
```

Run the Node save/restore API in a second terminal:

```bash
npm run api
```

For a production build:

```bash
npm run build
npm run preview
```

## Notes

- The UI is fully data-driven from [`src/data/catalog.js`](./src/data/catalog.js).
- Variant quantities are tracked independently per product variant and stay in sync with the review panel.
- "Save my system for later" stores the current configuration through the Node API and keeps `localStorage` as a fallback.
- Product imagery is stored under `public/images` and referenced from the catalog.
