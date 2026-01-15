# TRU Accessibility Audit

## What this app is
TRU Accessibility Audit is a mobile-first tool for building-by-building, floor-by-floor accessibility and inclusion audits. It is designed for campus walkthroughs where speed, clarity, and offline reliability matter. The app helps auditors capture observations, notes, and photos in a consistent matrix so results can be exported and reviewed.

## Why it exists
Accessibility improvements depend on evidence that is easy to collect and defend. This app makes it simple to capture standardized observations in the field, even without internet access, and export them in a structured format.

## What data is stored and where
- Stored locally on this device: building names, addresses, matrix selections, notes, photos, and optional location captured per feature.
- Exported data: CSV and ZIP files are created on demand and saved or shared by you.
- No cloud storage: there are no accounts, no uploads, and no background sync.

## How to create an audit
1. Enter a Building Name (required) and optional Address.
2. Choose a tab (Inclusivity & Accessibility, Student Supports & Services, or Campus Culture & Landmarks).
3. Use the matrix to mark features as Present or Absent by tapping the dot.
4. Add notes or photos by using the Notes button for any feature and floor.
5. Tap Save building to store the audit locally.

## Feature list
- The default feature list is comprehensive and organized by section.
- Use Manage features to add or remove items for your audit.
- Tabs are defined by Markdown specs in the project root (TAB1_Inclusivity_and_Accessibility.md, TAB2_Student_Supports_and_Services.md, TAB3_Campus_Culture_and_Landmarks.md).
- Campus Culture & Landmarks items should be marked on SITE when they refer to buildings or outdoor landmarks.

## Using notes and photos
- Notes are added per cell (feature + floor).
- Use the Notes button next to a feature to add notes or photos for a specific floor.
- Photos are attached per cell and stored locally on this device.
- Photos are included in ZIP export only when they are referenced by audits.

### Location capture
- Location is captured when you tap a grid dot (best-effort, permission required).
- Location is stored with that single feature and floor cell.

### Where photos live
- Photos are stored in the browser's local IndexedDB storage.
- They are not written to the filesystem.
- They become files only when exported via ZIP.
- Clearing browser data deletes them.

## Saving buildings
- Tap Save building to store the current building audit.
- The form clears for the next building.
- A confirmation toast shows that the building was saved locally.

## Exporting CSV
- Tap Export CSV to download a CSV file containing all saved audits.
- The CSV includes one row per feature and floor.
- Use CSV export for analysis, reporting, or import into other tools.

## Exporting ZIP (CSV + photos)
- Tap Export ZIP (CSV + photos) to download a single ZIP file.
- The ZIP always includes audit.csv and a photos folder.
- Photos are organized by building and named by feature and floor.
- This is the best option for sharing evidence with teams.

## Offline behavior
- The app works offline after the first load.
- All audits, notes, and photos are stored locally until export.
- Exports also work offline.

## Mobile usage guidance
- Add the app to your Home Screen for a full-screen experience.
- Use the sticky action bar at the bottom for Save and Export actions.
- The matrix scrolls horizontally and vertically for quick checks on site.

## Privacy statement
- No accounts, no server, no cloud storage.
- All data stays on this device until you export it.
- Location is captured on grid tap.
- Location is stored locally and never transmitted.
- Location is optional per feature.

## Limitations
- Browser storage is limited. Very large photo sets may exceed storage limits.
- Clearing browser data or uninstalling the PWA removes local audits.
- Photos are not synced anywhere automatically. Export is required for backups.

## Intended use
This app supports inclusive and accessible space audits for campus facilities. It is intended for structured observations and evidence gathering, not as a compliance certification tool.
