You are Codex. Build a production-ready, mobile-first web app (PWA) for a “TRU Inclusive \& Accessible Spaces Audit”. The app must be hostable on GitHub (GitHub Pages) and usable on a phone in a browser, including offline.



This repo is intended to be cloned, run locally, and deployed to GitHub Pages. The UX must be simple, clean, and fast for on-the-move auditing.



---



\## 0) Primary user story

As an auditor walking campus, I want to:

\- Enter a building name (required) and optional address

\- Go building-by-building, floor-by-floor

\- See a matrix/table where columns = floors and rows = accessibility/inclusion features

\- Tap a dot in any cell to toggle present/absent (clickable + unclickable)

\- Press Save to store that building’s audit and clear the form for the next building

\- Press Export to download the full dataset as a CSV onto the mobile device (and ideally allow sharing via native share sheet when supported)

\- Work offline (cache the app and store audits locally until export)



Important: the user specifically wants “Save” to “send the data to a CSV”. On the web, direct file append is not universally supported. Implement this as:

\- Canonical storage = local persistent DB (IndexedDB preferred)

\- On Save, also regenerate and persist a CSV string snapshot (so we truly “send to CSV” on every Save, even if it’s virtual until export)

\- Export writes the CSV snapshot to an actual .csv file on-device (via download or Web Share API with file attachment)



---



\## 1) Tech choices (must use)

\- Vite + React + TypeScript

\- TailwindCSS for styling

\- PWA support (manifest + service worker) using vite-plugin-pwa

\- Local persistence: IndexedDB (preferred) using a tiny helper (idb-keyval OK) OR a minimal custom wrapper.

\- CSV export: implement yourself or use a small lib (PapaParse acceptable). Must support UTF-8 and proper CSV escaping.



Keep dependencies light. No heavy state-management frameworks.



---



\## 2) Repo requirements

Create a GitHub-ready repository with:

\- README.md with:

&nbsp; - Quickstart (npm install, npm run dev)

&nbsp; - Build (npm run build)

&nbsp; - Deploy to GitHub Pages (via provided GitHub Actions workflow)

&nbsp; - Phone usage instructions (Add to Home Screen)

&nbsp; - Offline usage note

&nbsp; - Data/export explanation

\- LICENSE (MIT)

\- .gitignore

\- A GitHub Actions workflow for deploying to GitHub Pages on push to main

\- Sensible project structure with typed modules and minimal, clean components



---



\## 3) UX / UI requirements (mobile-first, clean)

Single-page app with these sections:



\### A) Header

\- Title: “TRU Accessibility Audit”

\- Subtitle: “Building-by-building, floor-by-floor”

\- Small status: “Saved entries: N”

\- Optional: small offline indicator (e.g. “Offline mode” when navigator.onLine is false)



\### B) Building form

Fields:

\- Building Name (required text input)

\- Address (optional text input)



Validation:

\- On Save, if building name is empty, show inline error and do not save.

\- Autofocus Building Name on first load and after Save.

\- Provide a small note: “Data is saved locally on this device until export.”



\### C) Floors × Features matrix

Layout:

\- Columns = floors (plus a special building/site column: "SITE")

\- Rows = features

\- Each cell contains a circular dot toggle



Behavior:

\- Tapping/clicking a dot toggles between:

&nbsp; - Present = filled dot (or filled ring)

&nbsp; - Absent = empty dot (or outline)

\- Must be keyboard accessible:

&nbsp; - Dot is a <button> with aria-pressed="true/false"

&nbsp; - Space/Enter toggles

\- Must be screen-reader friendly:

&nbsp; - Each dot has aria-label like:

&nbsp;   “{Feature} on {Floor}: Present”

&nbsp;   “{Feature} on {Floor}: Absent”

\- Mobile ergonomics:

&nbsp; - Each dot has minimum 44x44 px tap target

&nbsp; - Table should allow horizontal scroll if many floors

&nbsp; - Keep the left feature column sticky if feasible (nice-to-have, but aim to do it)



Matrix state:

\- Boolean per (feature, floor). Default false.

\- The matrix uses a stable internal keying that matches the feature label strings and floor label strings exactly.



\### D) Floors list (defaults + editing)

The floor column headers are user-configurable.



Default floors:

\- The UI must always include a pinned, non-removable first column:

&nbsp; - "SITE"

\- Then default floors:

&nbsp; \["B2","B1","1","2","3","4"]



Provide controls near the matrix:

\- “+ Add floor” (prompts for a label, or uses an inline input)

\- Ability to remove a floor label (but never remove "SITE")

\- Optional: reordering floors (nice-to-have, not required)



Persist the user’s floors configuration between sessions.



\### E) Features list (defaults, definitions, and audit guidance)

Features are represented as human-readable labels.



The app must start with the following EXACT default feature strings (in this exact spelling/casing), in this order:



1\. Step-free entrance

2\. Automatic door

3\. Ramp available

4\. Elevator/lift

5\. Accessible washroom

6\. Braille/tactile signage

7\. High-contrast signage

8\. Hearing loop / assistive listening

9\. Visual alarm / strobe

10\. Accessible seating area

11\. Quiet/sensory-friendly space

12\. Gender-inclusive washroom

13\. Lactation/parent room

14\. Service animal relief area nearby

15\. Accessible parking nearby



\#### Feature definitions (used for tooltips/help + consistency)

In the UI, provide an optional “?” info affordance that shows a short definition and what counts as “present” for each feature. Use these definitions:



\- Step-free entrance

&nbsp; - Definition: At least one public entrance has an accessible route without stairs (level entry or ramped route).

&nbsp; - Present if: An entrance can be used by a wheelchair/mobility aid user without needing stairs.



\- Automatic door

&nbsp; - Definition: Door opens automatically or via accessible push-button.

&nbsp; - Present if: Main/public door has powered opener OR accessible actuator at usable height.



\- Ramp available

&nbsp; - Definition: A ramp exists where a level change would otherwise require stairs.

&nbsp; - Present if: A ramped route is available for public access (permanent or reliable fixed ramp).



\- Elevator/lift

&nbsp; - Definition: Elevator/lift provides step-free vertical access between floors.

&nbsp; - Present if: A user can reach multiple levels without stairs (at least floors audited).



\- Accessible washroom

&nbsp; - Definition: Washroom includes accessible stall/fixtures (space, grab bars, turning radius).

&nbsp; - Present if: At least one washroom on the floor/building meets accessibility needs (as observed or signed).



\- Braille/tactile signage

&nbsp; - Definition: Signage includes braille and/or tactile lettering for wayfinding (rooms, washrooms, elevators).

&nbsp; - Present if: Common wayfinding signs include tactile/braille features.



\- High-contrast signage

&nbsp; - Definition: Signage uses high contrast between text and background; legible font; clear visibility.

&nbsp; - Present if: Prominent wayfinding signs appear high-contrast and readable.



\- Hearing loop / assistive listening

&nbsp; - Definition: Assistive listening system available in key spaces (lecture halls, service counters).

&nbsp; - Present if: Posted availability or installed system is observed.



\- Visual alarm / strobe

&nbsp; - Definition: Fire/emergency alarms include flashing strobes (not audio-only).

&nbsp; - Present if: Strobes are observed on the floor/building.



\- Accessible seating area

&nbsp; - Definition: Seating accommodates mobility devices and accessible routes (e.g., spaces for wheelchairs, companion seating).

&nbsp; - Present if: Clear, designated accessible seating exists in common areas/classrooms as applicable.



\- Quiet/sensory-friendly space

&nbsp; - Definition: A quieter low-stimulation area exists (e.g., designated quiet room or low-sensory study zone).

&nbsp; - Present if: A designated quiet/sensory space is available and discoverable.



\- Gender-inclusive washroom

&nbsp; - Definition: At least one gender-inclusive washroom exists (single-user or all-gender).

&nbsp; - Present if: Clear labeling/signage indicates gender-inclusive option.



\- Lactation/parent room

&nbsp; - Definition: Dedicated lactation/parent room exists for feeding/expressing milk/care needs.

&nbsp; - Present if: Room is designated/posted or listed onsite.



\- Service animal relief area nearby

&nbsp; - Definition: A nearby outdoor relief area suitable for service animals is available.

&nbsp; - Present if: There is a practical relief location near entrance (signed or obviously designated).



\- Accessible parking nearby

&nbsp; - Definition: Accessible parking stalls exist near primary accessible route/entrance.

&nbsp; - Present if: Signed accessible stalls are observed close to the building access route.



\#### Building-level vs floor-level applicability (important)

Some features are building/site-level rather than floor-specific (e.g., parking, entrance). To keep the UI as a single matrix, implement a special pseudo-floor column:

\- "SITE" (always present, non-removable, pinned as the first column)



Rules:

\- The matrix columns are: \["SITE", ...userFloors]

\- Use "SITE" to record building/site-level items like:

&nbsp; - Step-free entrance

&nbsp; - Automatic door

&nbsp; - Ramp available

&nbsp; - Service animal relief area nearby

&nbsp; - Accessible parking nearby

\- Users can still toggle any feature on any floor if they want, but the UI should hint recommended placement:

&nbsp; - Show a small “Recommended: SITE” or “Recommended: Floors” note in the tooltip.



\#### Optional but recommended: feature categories (for readability)

Keep the matrix rows in the same order as the feature list, but optionally render subtle category labels above groups:

\- Access \& Entry (1–4)

\- Washrooms \& Care (5, 12, 13)

\- Wayfinding \& Signage (6–7)

\- Hearing \& Vision Supports (8–9)

\- Space Inclusivity (10–11)

\- Exterior \& Mobility (14–15)



Categories are display-only; they must not change the underlying feature label strings.



\#### Future-proofing: allow expanding defaults (but do NOT change initial strings)

Add a “Manage features” control (modal/drawer) that lets the user:

\- Add a new feature label

\- Remove an existing feature label (with confirmation)

\- Reset to defaults



Additionally, include a “Add recommended features” button inside Manage Features that appends extra suggested features (not enabled by default). The initial 15 must remain exactly as above until the user explicitly adds more.



Suggested recommended extras to include (appendable via that button):

\- Accessible service counter

\- Automatic door on interior main routes

\- Accessible drinking fountain

\- Accessible route signage

\- Accessible classroom/lecture seating

\- Area of refuge / emergency egress signage

\- Elevator has audible floor indicator

\- Elevator has tactile/braille buttons

\- Stair handrails (both sides)

\- Non-slip flooring on main routes

\- Wide corridors / turning space

\- Accessible door hardware (lever handles)

\- Accessible power outlets/charging

\- Quiet waiting area

\- Low-glare lighting

\- Captioning/AV accessibility support posted

\- Accessible lab/workstation

\- Accessible library study desk

\- Accessible vending machine reach

\- Accessible intercom/call button



Persist the user’s features configuration between sessions.



\### F) Actions (bottom)

Two primary buttons in a bottom Action Bar:

\- Save building

\- Export CSV



Save behavior:

\- Validate building name is non-empty

\- Create a BuildingAudit entry (see data model below)

\- Persist it locally

\- Regenerate the CSV snapshot and persist it locally (so “saved to CSV” is true at every save)

\- Clear building name/address and reset matrix to all false

\- Keep user’s customized floors/features as-is

\- Show a small toast “Saved” with an Undo option for 10 seconds (recommended)



Export behavior:

\- Export the entire stored dataset (all saved buildings) to a CSV file

\- Must save to the phone:

&nbsp; - Preferred: use Web Share API with a CSV file attachment when supported (navigator.canShare + files)

&nbsp; - Fallback: trigger a file download (Blob + <a download>)

\- Filename: tru-access-audit\_YYYY-MM-DD.csv

\- CSV format: implement Option A (LONG format):

&nbsp; Columns: building\_id, building\_name, address, created\_at, floor, feature, present

&nbsp; One row per cell (floor×feature)



Also add a small Settings area (could be a collapsible section) with:

\- “View saved entries” (simple list; optional but recommended)

\- “Clear all data” (requires confirmation)

\- “Reset floors/features to defaults” (confirmation)



---



\## 4) Data model

Define types:



\- FloorLabel: string

\- FeatureLabel: string



BuildingAudit:

\- id: string (uuid)

\- buildingName: string

\- address?: string

\- floors: FloorLabel\[] (snapshot at time of save; includes "SITE" + all configured floors at save time)

\- features: FeatureLabel\[] (snapshot at time of save)

\- matrix: Record<FeatureLabel, Record<FloorLabel, boolean>>

\- createdAt: ISO string

\- updatedAt: ISO string



Config:

\- floors: FloorLabel\[] (user floors excluding "SITE" OR include it—choose one approach and keep consistent)

\- features: FeatureLabel\[]

\- version: number (for future migrations; start at 1)



Persistence:

\- Store BuildingAudit entries in IndexedDB keyed by id

\- Store Config separately

\- Store a derived CSV snapshot string separately (csvSnapshot)

\- Provide simple versioned migration if schema changes (minimal; can be “wipe config if mismatch”)



---



\## 5) Accessibility + inclusive UX rules

\- All interactive elements must be reachable via keyboard

\- Visible focus states

\- High contrast text

\- No reliance on color alone (filled vs outline + optional icon)

\- Respect prefers-reduced-motion

\- Clear labels and consistent wording

\- Buttons must have accessible names

\- Use semantic HTML



---



\## 6) Acceptance criteria (must be met)

1\. Runs locally with: npm install \&\& npm run dev

2\. Builds with: npm run build

3\. Deployed on GitHub Pages via provided Actions workflow

4\. Works well on mobile screen sizes (320px and up)

5\. Dots toggle reliably and are accessible (aria-pressed etc.)

6\. Save adds entry to persisted store and clears the form

7\. Export downloads a correct CSV containing all saved entries

8\. Works offline after first load (PWA caching)

9\. Floors/features customization persists between sessions



---



\## 7) Implementation details (do it)

Architecture:

\- Use React components:

&nbsp; - AppShell

&nbsp; - BuildingForm

&nbsp; - MatrixTable

&nbsp; - FloorManager

&nbsp; - FeatureManager (modal/drawer)

&nbsp; - ActionBar

&nbsp; - Toast

&nbsp; - SettingsPanel (optional)

&nbsp; - SavedEntriesList (optional but recommended; minimal)

\- State management: React useReducer or a small custom store via context (no Redux)

\- Persistence module:

&nbsp; - getConfig / setConfig / resetConfig

&nbsp; - addAudit / listAudits / deleteAudit / clearAudits

&nbsp; - getCsvSnapshot / setCsvSnapshot

\- CSV module:

&nbsp; - auditsToCsvLong(audits: BuildingAudit\[]): string

&nbsp; - Must properly escape commas/quotes/newlines

&nbsp; - Use CRLF or LF consistently; LF is fine



Matrix initialization logic:

\- When floors/features change (in config), ensure the current in-progress matrix is reconciled:

&nbsp; - Add missing keys with false

&nbsp; - Remove keys that no longer exist

\- Always include "SITE" floor in the in-progress matrix and in saved snapshots.



Offline/PWA:

\- Use vite-plugin-pwa

\- Cache app shell and assets

\- No server required; app must function purely client-side



---



\## 8) Deployment details (GitHub Pages)

\- Configure Vite base path properly for GitHub Pages (e.g., base: "/<repo-name>/")

\- Provide a GitHub Actions workflow that:

&nbsp; - Installs deps

&nbsp; - Builds

&nbsp; - Deploys dist to GitHub Pages

\- README must include steps to set repo settings:

&nbsp; - Pages source = GitHub Actions



---



\## 9) Deliverables

Output the complete repository contents:

\- package.json, tsconfig, vite config, tailwind config, PWA config, GitHub Actions workflow

\- All React/TS source files

\- README.md, LICENSE, .gitignore



Output format:

1\) Print the full file tree

2\) Then output each file’s content, one file at a time, with clear separators



Do not omit any required files. Keep code clean, typed, and minimally commented where it aids clarity.



Begin now.



