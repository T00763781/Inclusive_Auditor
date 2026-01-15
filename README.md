# TRU Space Auditor

*A structured field-audit tool for inclusive and accessible campus spaces*

## Overview

**TRU Space Auditor** is a mobile-first, offline-capable tool for conducting **building-by-building and site-level audits** of inclusive and accessible spaces on campus.

It was developed in response to a real process gap encountered during Intercultural Ambassador (ICA) audits: multiple auditors, multiple vocabularies, and no shared structure for merging, verifying, and maintaining results over time.

This tool focuses on **how accessibility and inclusivity data is captured**, not on how it is ultimately displayed.

---

## Purpose and scope

The Space Auditor exists to solve three problems:

1. **Shared language**
   Provide a consistent, structured vocabulary for recording accessibility and inclusion features across auditors, buildings, and years.

2. **Evidence capture in the field**
   Enable fast, reliable data collection during walkthroughs, including notes and photos, even when offline.

3. **Reusable source data**
   Produce clean, structured exports (CSV + optional photo ZIP) that can feed **any downstream interface** (lists, maps, reports, or future tools).

> This app is a **data-capture and export tool**.
> It is **not** a public map, website, or compliance certification system.


## Data model and storage

### What is stored locally

All data is stored **only on the user’s device** until export:

* Building name and optional address
* Feature selections (matrix)
* Per-feature, per-floor notes
* Photos attached to specific features
* Optional location capture (best-effort, permission-based)

### What is exported

* **CSV export:** one row per feature per floor/site
* **ZIP export:** CSV + referenced photos, organized by building

There are:

* No accounts
* No cloud storage
* No background uploads
* No analytics or tracking

Clearing browser data or uninstalling the PWA removes local audits.

---

## Audit structure

### Tabs

Audits are organized into three domains:

1. **Inclusivity & Accessibility**
2. **Student Supports & Services**
3. **Campus Culture & Landmarks**

Each tab represents a **content domain**, not ownership.
Ownership and verification should be determined institutionally.

### Features

* Default feature lists are defined via Markdown specifications:

  * `TAB1_Inclusivity_and_Accessibility.md`
  * `TAB2_Student_Supports_and_Services.md`
  * `TAB3_Campus_Culture_and_Landmarks.md`
* Features can be added or removed to fit the scope of a given audit.
* Outdoor features and landmarks should be recorded at the **SITE** level.

---

## How to conduct an audit

1. Enter a **Building Name** (required) and optional address.
2. Select the appropriate **tab** for the audit domain.
3. Mark features as present or absent using the matrix.
4. Add **notes and/or photos** for specific features and floors.
5. Save the building to store the audit locally.
6. Export CSV or ZIP when ready to share or archive.

---

## Notes, photos, and location capture

* Notes and photos are attached **per feature per floor/site**.
* Photos are stored in browser IndexedDB and included only when exported.
* Location capture occurs when a matrix cell is tapped (permission required).
* Location is stored locally and associated only with that specific record.

---

## Offline use

* Works offline after initial load.
* All auditing, saving, and exporting functions work without internet.
* Ideal for walkthroughs in basements, stairwells, and older buildings.

---

## Privacy and data handling

* No personal data is collected.
* No data leaves the device unless explicitly exported.
* Location capture is optional and never transmitted automatically.

---

## Intended use

The Space Auditor supports **structured observation and evidence gathering** for inclusive and accessible spaces on campus.

It is designed to:

* Support student, staff, and committee-led audits
* Improve continuity across semesters and personnel changes
* Enable clearer review, verification, and decision-making

It is **not** intended to be used as a standalone compliance or certification authority.

---

## Known limitations

* Browser storage limits may constrain very large photo sets
* Clearing browser data deletes local audits
* Data persistence depends on user export discipline
* Long-term institutional use requires defined ownership and review processes

---
