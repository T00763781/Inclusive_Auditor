import JSZip from 'jszip';
import type { BuildingAudit, PhotoAsset } from '../data/types';
import { getPhotoAsset } from '../data/storage';

const sanitizeFileSegment = (value: string, fallback: string): string => {
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

const resolvePhotoExtension = (asset: PhotoAsset): string => {
  const fromName = extensionFromFilename(asset.filename);
  const fromMime = extensionFromMime(asset.mimeType);
  return sanitizeExtension(fromName || fromMime);
};

const exportBlobFile = async (blob: Blob, filename: string): Promise<void> => {
  const canShareFiles =
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    typeof File !== 'undefined';

  if (canShareFiles) {
    let file: File | null = null;
    try {
      file = new File([blob], filename, { type: blob.type || 'application/zip' });
    } catch {
      file = null;
    }

    if (file) {
      let canShare = false;
      try {
        canShare = navigator.canShare({ files: [file] });
      } catch {
        canShare = false;
      }

      if (canShare) {
        try {
          await navigator.share({
            files: [file],
            title: 'TRU Accessibility Audit',
            text: 'Audit export'
          });
          return;
        } catch {
          // Fall back to download.
        }
      }
    }
  }

  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    throw new Error('export-not-supported');
  }

  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch {
    throw new Error('export-not-supported');
  }
};

export const buildZipFilename = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `tru-accessibility-audit_${year}-${month}-${day}.zip`;
};

export const exportZipFile = async (
  audits: BuildingAudit[],
  csv: string,
  filename: string
): Promise<void> => {
  const zip = new JSZip();
  zip.file('audit.csv', csv);

  const photosRoot = zip.folder('photos');
  const seenPhotoIds = new Set<string>();

  for (const audit of audits) {
    const buildingName = sanitizeFileSegment(audit.buildingName, 'building');
    const buildingFolderName = `${audit.id}_${buildingName}`;
    const buildingFolder = photosRoot?.folder(buildingFolderName);
    if (!buildingFolder) {
      continue;
    }

    for (const feature of audit.features) {
      const safeFeature = sanitizeFileSegment(feature, 'feature');
      const row = audit.matrix[feature] ?? {};
      for (const floor of audit.floors) {
        const safeFloor = sanitizeFileSegment(floor, 'floor');
        const cell = row[floor];
        const photoIds = cell?.photoIds ?? [];
        for (const photoId of photoIds) {
          if (seenPhotoIds.has(photoId)) {
            continue;
          }
          seenPhotoIds.add(photoId);

          const asset = await getPhotoAsset(photoId);
          if (!asset) {
            continue;
          }
          const extension = resolvePhotoExtension(asset);
          const photoName = `${safeFeature}__${safeFloor}__${photoId}.${extension}`;
          buildingFolder.file(photoName, asset.blob, { binary: true });
        }
      }
    }
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  await exportBlobFile(zipBlob, filename);
};
