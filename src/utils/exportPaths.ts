import type { BuildingAudit, PhotoAsset } from '../data/types';

export const sanitizeFileSegment = (value: string, fallback: string): string => {
  const trimmed = value.trim();
  let safe = trimmed.replace(/[^\x20-\x7E]/g, '');
  safe = safe.replace(/[<>:"/\\|?*]+/g, '');
  safe = safe.replace(/\s+/g, '_');
  safe = safe.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  if (!safe) {
    return fallback;
  }
  return safe;
};

const extensionFromFilename = (filename?: string): string | undefined => {
  if (!filename) {
    return undefined;
  }
  const trimmed = filename.trim();
  const lastDot = trimmed.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return undefined;
  }
  return trimmed.slice(lastDot + 1);
};

const extensionFromMime = (mimeType?: string): string | undefined => {
  if (!mimeType) {
    return undefined;
  }
  const lower = mimeType.toLowerCase();
  const mapping: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'image/webp': 'webp'
  };
  if (mapping[lower]) {
    return mapping[lower];
  }
  if (lower.startsWith('image/')) {
    return lower.slice('image/'.length);
  }
  return undefined;
};

const sanitizeExtension = (extension?: string): string => {
  if (!extension) {
    return 'jpg';
  }
  const cleaned = extension.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned || 'jpg';
};

export const resolvePhotoExtension = (asset: PhotoAsset): string => {
  const fromName = extensionFromFilename(asset.filename);
  const fromMime = extensionFromMime(asset.mimeType);
  return sanitizeExtension(fromName || fromMime);
};

export const buildPhotoFilename = (
  feature: string,
  floor: string,
  photoId: string,
  extension: string
): string => {
  const safeFeature = sanitizeFileSegment(feature, 'feature');
  const safeFloor = sanitizeFileSegment(floor, 'floor');
  const safeExtension = sanitizeExtension(extension);
  return `${safeFeature}__${safeFloor}__${photoId}.${safeExtension}`;
};

export const buildBuildingFolderMap = (audits: BuildingAudit[]): Map<string, string> => {
  const map = new Map<string, string>();
  const counts = new Map<string, number>();

  for (const audit of audits) {
    const baseName = sanitizeFileSegment(audit.buildingName, 'building');
    const nextCount = (counts.get(baseName) ?? 0) + 1;
    counts.set(baseName, nextCount);
    const folderName = nextCount === 1 ? baseName : `${baseName}_${nextCount}`;
    map.set(audit.id, folderName);
  }

  return map;
};

export const buildPhotoPath = (
  buildingFolderName: string,
  photoFilename: string,
  separator = '/'
): string => {
  return `photos${separator}${buildingFolderName}${separator}${photoFilename}`;
};
