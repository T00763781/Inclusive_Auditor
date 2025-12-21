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

export const getConfig = async (): Promise<Config> => {
  const config = (await get(CONFIG_KEY, CONFIG_STORE)) as Config | undefined;
  if (!config) {
    const fresh = createDefaultConfig();
    await setConfig(fresh);
    return fresh;
  }
  if (config.version === CONFIG_VERSION) {
    return config;
  }
  if (config.version && config.version < CONFIG_VERSION) {
    const migrated = { ...config, version: CONFIG_VERSION };
    await setConfig(migrated);
    return migrated;
  }
  const fresh = createDefaultConfig();
  await setConfig(fresh);
  return fresh;
};

export const setConfig = async (config: Config): Promise<void> => {
  await set(CONFIG_KEY, config, CONFIG_STORE);
};

export const resetConfig = async (): Promise<Config> => {
  const fresh = createDefaultConfig();
  await setConfig(fresh);
  return fresh;
};

export const addAudit = async (audit: BuildingAudit): Promise<void> => {
  await set(audit.id, audit, AUDIT_STORE);
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
  return {
    present: Boolean(candidate.present),
    notes,
    photoIds: photoIds && photoIds.length > 0 ? photoIds : undefined
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
      const rawObj = rawCell && typeof rawCell === 'object' && !Array.isArray(rawCell)
        ? (rawCell as MatrixCell)
        : undefined;
      const rawPhotoIds = rawObj?.photoIds ?? [];
      const normalizedPhotoIds = normalized.photoIds ?? [];
      const cellChanged =
        typeof rawCell === 'boolean' ||
        rawCell === undefined ||
        rawCell === null ||
        !rawObj ||
        rawObj.present !== normalized.present ||
        rawObj.notes !== normalized.notes ||
        !arraysEqual(rawPhotoIds, normalizedPhotoIds);
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
  const all = await entries<BuildingAudit>(AUDIT_STORE);
  const audits = all
    .map((entry) => entry[1])
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
  await del(id, AUDIT_STORE);
};

export const clearAudits = async (): Promise<void> => {
  await clear(AUDIT_STORE);
};

export const getCsvSnapshot = async (): Promise<string> => {
  const snapshot = (await get(CSV_KEY, META_STORE)) as string | undefined;
  return snapshot ?? '';
};

export const setCsvSnapshot = async (snapshot: string): Promise<void> => {
  await set(CSV_KEY, snapshot, META_STORE);
};

export const clearCsvSnapshot = async (): Promise<void> => {
  await del(CSV_KEY, META_STORE);
};

export const addPhotoAsset = async (asset: PhotoAsset): Promise<void> => {
  await set(asset.id, asset, PHOTO_STORE);
};

export const getPhotoAsset = async (id: string): Promise<PhotoAsset | undefined> => {
  return (await get(id, PHOTO_STORE)) as PhotoAsset | undefined;
};

export const getPhotoAssets = async (ids: string[]): Promise<PhotoAsset[]> => {
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
  await del(id, PHOTO_STORE);
};

export const clearPhotoAssets = async (): Promise<void> => {
  await clear(PHOTO_STORE);
};
