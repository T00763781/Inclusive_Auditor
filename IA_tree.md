# IA_tree

## Folder structure
- public/
  - icons/ (PWA icons)
- Tab Specs/
  - TAB1_Inclusivity_and_Accessibility.md (authoritative tab 1 feature spec)
  - TAB2_Student_Supports_and_Services.md (authoritative tab 2 feature spec)
  - TAB3_Campus_Culture_and_Landmarks.md (authoritative tab 3 feature spec)
- TAB1_Inclusivity_and_Accessibility.md (runtime copy for tab 1 spec)
- TAB2_Student_Supports_and_Services.md (runtime copy for tab 2 spec)
- TAB3_Campus_Culture_and_Landmarks.md (runtime copy for tab 3 spec)
- src/
  - App.tsx (app shell, state orchestration, save and export handlers)
  - main.tsx (PWA registration and app mount)
  - components/
    - ActionBar.tsx (Save/Export actions)
    - AppShell.tsx (header and layout)
    - BuildingForm.tsx (building name and address)
    - MatrixTable.tsx (feature and floor grid)
    - CellDetailsSheet.tsx (notes and photos per cell)
    - FeatureManager.tsx, FloorManager.tsx, SettingsPanel.tsx, Toast.tsx
  - data/
    - types.ts (domain types)
    - storage.ts (IndexedDB access and normalization)
    - csv.ts (CSV serialization)
    - defaults.ts (feature and floor defaults)
    - matrix.ts (matrix creation and reconciliation)
    - tabSpecs.ts (parses tab specs from Markdown into sections)
  - state/
    - reducer.ts (app state reducer)
  - utils/
    - exportCsv.ts (CSV export and share/download)
    - exportZip.ts (ZIP export with photos)
    - uuid.ts (UUID helper)
- vite.config.ts (PWA and build config)

## Data flow
1) User interaction
- User toggles a matrix dot or adds notes/photos.
- The reducer updates the in-progress matrix state.
- Optional geolocation is captured on dot toggle and stored per cell.
- Notes/photos are opened from the feature-level Notes button, not from the grid tap.
- The matrix UI is split into three tabs using Markdown-defined sections (collapsible).
- Tab 3 (Campus Culture & Landmarks) is intended for SITE-level buildings/landmarks.

2) Save
- App validates building name.
- A BuildingAudit snapshot is created with current config, matrix, and timestamps.
- Audit is stored in IndexedDB.
- CSV snapshot is regenerated and stored.
- Form resets for the next building.

3) Export
- CSV export uses the CSV snapshot or regenerates it from saved audits.
- ZIP export generates audit.csv and bundles referenced photo assets.
- Share is attempted if supported; otherwise a file download is triggered.

## Key invariants
- CSV schema and column order never change without explicit, documented migration.
- The SITE floor is always included in audits and matrix state.
- Building name is required before save.
- All audit data is stored locally and must be retrievable offline.
- Photo assets are referenced by ID from audits and stored in the photos store.
- Exports must be deterministic and work offline on mobile and desktop.
- CSV export includes latitude and longitude columns when location data exists.
- Tab feature lists are loaded from the authoritative Markdown specs.
- Tab 3 building/landmark features are intended for SITE-level capture.
