# TRU Accessibility Audit (PWA)

Mobile-first PWA for building-by-building, floor-by-floor accessibility and inclusion auditing. Built for offline-first campus walkthroughs and GitHub Pages hosting.

## Quickstart

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow that builds and deploys the `dist/` folder on every push to `main`.

1. Push to `main`.
2. In GitHub, go to **Settings** -> **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Wait for the workflow to finish; your site will be available at:
   `https://t00763781.github.io/Inclusive_Auditor/`

Vite is configured with `base: "/Inclusive_Auditor/"` to match this repo name.

## Phone usage (Add to Home Screen)

1. Open the deployed URL on your phone.
2. Use the browser menu and choose **Add to Home Screen**.
3. Launch the app from the new icon for a full-screen experience.

## Offline usage

The app caches the shell and assets after first load. You can continue auditing offline; saved audits stay on the device until export.

## Data + export

- Audits are stored locally in IndexedDB.
- On every **Save**, the app regenerates and stores a CSV snapshot.
- **Export CSV** downloads the snapshot or shares it through the native share sheet when available.
- Export format (long): `building_id, building_name, address, created_at, floor, feature, present, notes, photo_count`.

## Scripts

- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run preview` - preview the build

## Notes

- Floors and features are configurable and persist between sessions.
- The "SITE" column is pinned to capture building-level items.
