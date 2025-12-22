import { clear, createStore, del, entries, get, set } from 'idb-keyval';
import type { BuildingAudit, Config, Matrix, MatrixCell, PhotoAsset } from './types';
import { createDefaultConfig, CONFIG_VERSION } from './defaults';

const DB_NAME = 'tru-audit-db';
const AUDIT_STORE = createStore(DB_NAME, 'audits');
const CONFIG_STORE = createStore(DB_NAME, 'config');
const META_STORE = createStore(DB_NAME, 'meta');
const PHOTO_STORE = createStore(DB_NAME, 'photos');

const CONFIG_KEY = 'config';
const CSV_KEY = 'csvSnapshot';

const STORE_NAMES = ['audits', 'config', 'meta', 'photos'];
let initPromise: Promise<void> | null = null;

const openDatabase = (version?: number): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = typeof version === 'number'
      ? indexedDB.open(DB_NAME, version)
      : indexedDB.open(DB_NAME);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const storeName of STORE_NAMES) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      }
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

const ensureStores = async (): Promise<void> => {
  if (typeof indexedDB === 'undefined') {
    return;
  }
  let db = await openDatabase();
  const missing = STORE_NAMES.filter((storeName) => !db.objectStoreNames.contains(storeName));
  if (missing.length === 0) {
    db.close();
    return;
  }
  const nextVersion = db.version + 1;
  db.close();
  db = await openDatabase(nextVersion);
  db.close();
};

export const initDB = async (): Promise<void> => {
  if (!initPromise) {
    initPromise = ensureStores().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  await initPromise;
};


/* =======================
   CONFIG
======================= */

export const getConfig = async (): Promise<Config> => {
  await initDB();
  const config = (await get(CONFIG_KEY, CONFIG_STORE)) as Config | undefined;

  if (!config) {
    const fresh = createDefaultConfig();
    await setConfig(fresh);
    return fresh;
  }

  if (config.version === CONFIG_VERSION) {
    return config;
  }

  if (config.version < CONFIG_VERSION) {
    const migrated = { ...config, version: CONFIG_VERSION };
    await setConfig(migrated);
    return migrated;
  }

  const fresh = createDefaultConfig();
  await setConfig(fresh);
  return fresh;
};

export const setConfig = async (config: Config): Promise<void> => {
  await initDB();
  await set(CONFIG_KEY, config, CONFIG_STORE);
};

export const resetConfig = async (): Promise<Config> => {
  await initDB();
  const fresh = createDefaultConfig();
  await setConfig(fresh);
  return fresh;
};

/* =======================
   AUDITS
======================= */

export const addAudit = async (audit: BuildingAudit): Promise<void> => {
  await initDB();
  await set(audit.id, audit, AUDIT_STORE);
};

const normalizeGeo = (geo: unknown): MatrixCell['geo'] | undefined => {
  if (!geo || typeof geo !== 'object') {
    return undefined;
  }

  const candidate = geo as {
    lat?: unknown;
    lon?: unknown;
    accuracy?: unknown;
    capturedAt?: unknown;
  };

  const lat =
    candidate && typeof candidate.lat === 'number'
      ? candidate.lat
      : undefined;

  const lon =
    candidate && typeof candidate.lon === 'number'
      ? candidate.lon
      : undefined;

  const capturedAt =
    candidate && typeof candidate.capturedAt === 'string'
      ? candidate.capturedAt
      : undefined;

  if (lat === undefined || lon === undefined || !capturedAt) {
    return undefined;
  }

  const accuracy =
    candidate && typeof candidate.accuracy === 'number'
      ? candidate.accuracy
      : undefined;

  return {
    lat,
    lon,
    accuracy,
    capturedAt
  };
};

const geoEqual = (left?: MatrixCell['geo'], right?: MatrixCell['geo']) => {
  if (!left && !right) {
    return true;
  }
  if (!left || !right) {
    return false;
  }
  return (
    left.lat === right.lat &&
    left.lon === right.lon &&
    left.accuracy === right.accuracy &&
    left.capturedAt === right.capturedAt
  );
};

const normalizeCell = (cell: unknown): MatrixCell => {
  if (typeof cell === 'boolean') {
    return { present: cell };
  }

  if (!cell || typeof cell !== 'object') {
    return { present: false };
  }

  const candidate = cell as Partial<MatrixCell>;

  const notes = typeof candidate.notes === 'string' ? candidate.notes : undefined;

  const photoIds = Array.isArray(candidate.photoIds)
    ? candidate.photoIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
    : undefined;

  const geo = normalizeGeo(candidate.geo);

  return {
    present: Boolean(candidate.present),
    notes,
    photoIds: photoIds && photoIds.length > 0 ? photoIds : undefined,
    geo
  };
};

const normalizeMatrix = (
  matrix: Matrix | Record<string, Record<string, unknown>> | undefined,
  features: string[],
  floors: string[]
): { matrix: Matrix; changed: boolean } => {
  const next: Matrix = {};
  let changed = false;

  const arraysEqual = (a: string[], b: string[]) =>
    a.length === b.length && a.every((value, index) => value === b[index]);

  for (const feature of features) {
    const existingRow = matrix?.[feature] ?? {};
    const row: Record<string, MatrixCell> = {};

    for (const floor of floors) {
      const rawCell = (existingRow as Record<string, unknown>)[floor];
      const normalized = normalizeCell(rawCell);

      const rawObj =
        rawCell && typeof rawCell === 'object' && !Array.isArray(rawCell)
          ? (rawCell as MatrixCell)
          : undefined;

      const rawPhotoIds = rawObj?.photoIds ?? [];
      const normalizedPhotoIds = normalized.photoIds ?? [];

      const cellChanged =
        typeof rawCell === 'boolean' ||
        rawCell == null ||
        !rawObj ||
        rawObj.present !== normalized.present ||
        rawObj.notes !== normalized.notes ||
        !arraysEqual(rawPhotoIds, normalizedPhotoIds) ||
        !geoEqual(rawObj.geo, normalized.geo);

      if (cellChanged) {
        changed = true;
      }

      row[floor] = normalized;
    }

    next[feature] = row;
  }

  return { matrix: next, changed };
};

export const listAudits = async (): Promise<BuildingAudit[]> => {
  await initDB();
  // entries() returns [key, value][] - keys are IDBValidKey, values are BuildingAudit
  const pairs = await entries(AUDIT_STORE);

  const audits = pairs
    .map(([, value]) => value as BuildingAudit)
    .filter((audit): audit is BuildingAudit => Boolean(audit));

  const normalized: BuildingAudit[] = [];

  for (const audit of audits) {
    const { matrix, changed } = normalizeMatrix(
      audit.matrix as Matrix,
      audit.features,
      audit.floors
    );

    const nextAudit = changed ? { ...audit, matrix } : audit;

    if (changed) {
      await set(nextAudit.id, nextAudit, AUDIT_STORE);
    }

    normalized.push(nextAudit);
  }

  return normalized.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const deleteAudit = async (id: string): Promise<void> => {
  await initDB();
  await del(id, AUDIT_STORE);
};

export const clearAudits = async (): Promise<void> => {
  await initDB();
  await clear(AUDIT_STORE);
};

/* =======================
   CSV SNAPSHOT
======================= */

export const getCsvSnapshot = async (): Promise<string> => {
  await initDB();
  const snapshot = (await get(CSV_KEY, META_STORE)) as string | undefined;
  return snapshot ?? '';
};

export const setCsvSnapshot = async (snapshot: string): Promise<void> => {
  await initDB();
  await set(CSV_KEY, snapshot, META_STORE);
};

export const clearCsvSnapshot = async (): Promise<void> => {
  await initDB();
  await del(CSV_KEY, META_STORE);
};

/* =======================
   PHOTOS
======================= */

export const addPhotoAsset = async (asset: PhotoAsset): Promise<void> => {
  await initDB();
  await set(asset.id, asset, PHOTO_STORE);
};

export const getPhotoAsset = async (id: string): Promise<PhotoAsset | undefined> => {
  await initDB();
  return (await get(id, PHOTO_STORE)) as PhotoAsset | undefined;
};

export const getPhotoAssets = async (ids: string[]): Promise<PhotoAsset[]> => {
  await initDB();
  const assets: PhotoAsset[] = [];

  for (const id of ids) {
    const asset = await getPhotoAsset(id);
    if (asset) {
      assets.push(asset);
    }
  }

  return assets;
};

export const deletePhotoAsset = async (id: string): Promise<void> => {
  await initDB();
  await del(id, PHOTO_STORE);
};

export const clearPhotoAssets = async (): Promise<void> => {
  await initDB();
  await clear(PHOTO_STORE);
};
