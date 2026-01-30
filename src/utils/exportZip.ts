import JSZip from 'jszip';
import type { BuildingAudit } from '../data/types';
import { getPhotoAsset } from '../data/storage';
import {
  buildBuildingFolderMap,
  buildPhotoFilename,
  resolvePhotoExtension
} from './exportPaths';

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
  const buildingFolderMap = buildBuildingFolderMap(audits);

  for (const audit of audits) {
    const buildingFolderName =
      buildingFolderMap.get(audit.id) || 'building';
    const buildingFolder = photosRoot?.folder(buildingFolderName);
    if (!buildingFolder) {
      continue;
    }

    for (const feature of audit.features) {
      const row = audit.matrix[feature] ?? {};
      for (const floor of audit.floors) {
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
          const photoName = buildPhotoFilename(feature, floor, photoId, extension);
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
