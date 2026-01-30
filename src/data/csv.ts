import type { BuildingAudit, PhotoAsset } from './types';
import { getPhotoAssets } from './storage';
import { buildBuildingFolderMap, buildPhotoFilename, buildPhotoPath, resolvePhotoExtension } from '../utils/exportPaths';

export const CSV_HEADER = [
  'building_id',
  'building_name',
  'address',
  'created_at',
  'floor',
  'feature',
  'present',
  'notes',
  'photo_count',
  'latitude',
  'longitude',
  'photo_paths'
];

const escapeCsv = (value: string): string => {
  const needsQuotes = /[",\n\r]/.test(value) || /^\s|\s$/.test(value);
  if (!needsQuotes) {
    return value;
  }
  return `"${value.replace(/"/g, '""')}"`;
};

const formatValue = (value: string | number | boolean | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

export const getCsvHeaderLine = (): string => CSV_HEADER.join(',');

export const isCsvSnapshotCompatible = (snapshot: string): boolean => {
  return snapshot.startsWith(getCsvHeaderLine());
};

const buildPhotoAssetMap = async (audits: BuildingAudit[]): Promise<Map<string, PhotoAsset>> => {
  const ids = new Set<string>();
  for (const audit of audits) {
    for (const feature of audit.features) {
      const row = audit.matrix[feature] ?? {};
      for (const floor of audit.floors) {
        const cell = row[floor];
        for (const id of cell?.photoIds ?? []) {
          ids.add(id);
        }
      }
    }
  }

  const assets = await getPhotoAssets(Array.from(ids));
  const map = new Map<string, PhotoAsset>();
  for (const asset of assets) {
    map.set(asset.id, asset);
  }
  return map;
};

export const auditsToCsvLong = async (audits: BuildingAudit[]): Promise<string> => {
  const rows: string[] = [getCsvHeaderLine()];
  const buildingFolderMap = buildBuildingFolderMap(audits);
  const photoAssetMap = await buildPhotoAssetMap(audits);
  for (const audit of audits) {
    const buildingFolderName = buildingFolderMap.get(audit.id) || 'building';
    for (const feature of audit.features) {
      const row = audit.matrix[feature] ?? {};
      for (const floor of audit.floors) {
        const cell = row[floor];
        const present = cell?.present ? 'true' : 'false';
        const notes = cell?.notes ?? '';
        const photoIds = cell?.photoIds ?? [];
        const photoCount = photoIds.length;
        const photoPaths = photoIds
          .map((photoId) => {
            const asset = photoAssetMap.get(photoId);
            if (!asset) {
              return undefined;
            }
            const extension = resolvePhotoExtension(asset);
            const photoName = buildPhotoFilename(feature, floor, photoId, extension);
            return buildPhotoPath(buildingFolderName, photoName, '\\');
          })
          .filter((path): path is string => Boolean(path));
        const latitude = cell?.geo?.lat;
        const longitude = cell?.geo?.lon;
        const photoPathsValue = photoPaths.join(';');
        const columns = [
          audit.id,
          audit.buildingName,
          audit.address ?? '',
          audit.createdAt,
          floor,
          feature,
          present,
          notes,
          photoCount,
          latitude,
          longitude,
          photoPathsValue
        ].map((value) => escapeCsv(formatValue(value)));
        rows.push(columns.join(','));
      }
    }
  }
  return rows.join('\n');
};
