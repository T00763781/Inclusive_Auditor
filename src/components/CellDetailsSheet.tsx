import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { MatrixCell, PhotoAsset } from '../data/types';
import { addPhotoAsset, deletePhotoAsset, getPhotoAssets } from '../data/storage';

type PhotoPreview = {
  id: string;
  url: string;
  asset: PhotoAsset;
};

type CellDetailsSheetProps = {
  open: boolean;
  feature: string;
  floor: string;
  cell: MatrixCell;
  onClose: () => void;
  onTogglePresent: () => void;
  onUpdateCell: (updates: Partial<MatrixCell>) => void;
};

const CellDetailsSheet = ({
  open,
  feature,
  floor,
  cell,
  onClose,
  onTogglePresent,
  onUpdateCell
}: CellDetailsSheetProps) => {
  const [notes, setNotes] = useState(cell.notes ?? '');
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setNotes(cell.notes ?? '');
    }
  }, [open, cell.notes]);

  useEffect(() => {
    if (!open) {
      return;
    }
    let active = true;
    const photoIds = cell.photoIds ?? [];
    const load = async () => {
      const assets = await getPhotoAssets(photoIds);
      if (!active) {
        return;
      }
      const previews = assets.map((asset) => ({
        id: asset.id,
        url: URL.createObjectURL(asset.blob),
        asset
      }));
      setPhotos((prev) => {
        prev.forEach((item) => URL.revokeObjectURL(item.url));
        return previews;
      });
    };
    load();
    return () => {
      active = false;
      setPhotos((prev) => {
        prev.forEach((item) => URL.revokeObjectURL(item.url));
        return [];
      });
    };
  }, [open, cell.photoIds]);

  if (!open) {
    return null;
  }

  const handleNotesChange = (value: string) => {
    setNotes(value);
    const next = value.trim().length > 0 ? value : undefined;
    onUpdateCell({ notes: next });
  };

  const handleAddPhoto = async (file?: File) => {
    if (!file) {
      return;
    }
    const id = crypto.randomUUID();
    const asset: PhotoAsset = {
      id,
      blob: file,
      mimeType: file.type || 'image/jpeg',
      createdAt: new Date().toISOString(),
      size: file.size,
      filename: file.name
    };
    await addPhotoAsset(asset);
    const nextPhotoIds = [...(cell.photoIds ?? []), id];
    onUpdateCell({ photoIds: nextPhotoIds });
    const url = URL.createObjectURL(file);
    setPhotos((prev) => [...prev, { id, url, asset }]);
  };

  const handleRemovePhoto = async (id: string) => {
    await deletePhotoAsset(id);
    const nextPhotoIds = (cell.photoIds ?? []).filter((photoId) => photoId !== id);
    onUpdateCell({ photoIds: nextPhotoIds.length ? nextPhotoIds : undefined });
    setPhotos((prev) => {
      const next = prev.filter((photo) => photo.id !== id);
      const removed = prev.find((photo) => photo.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return next;
    });
  };

  const handleFileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    await handleAddPhoto(file ?? undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${feature} on ${floor}`}
        className="w-full max-w-xl rounded-t-2xl border border-tru-sage bg-white p-5 shadow-soft sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tru-grey">
              {floor}
            </p>
            <h3 className="text-lg font-semibold text-tru-blue">{feature}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-tru-grey px-3 py-1 text-xs font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              cell.present ? 'bg-tru-teal text-tru-blue' : 'border border-tru-grey text-tru-grey'
            }`}
          >
            {cell.present ? 'Present' : 'Absent'}
          </span>
          <button
            type="button"
            onClick={onTogglePresent}
            className="rounded-full border border-tru-teal px-3 py-1 text-xs font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
          >
            Toggle
          </button>
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold text-tru-blue" htmlFor="cell-notes">
            Notes
          </label>
          <textarea
            id="cell-notes"
            value={notes}
            onChange={(event) => handleNotesChange(event.target.value)}
            rows={4}
            className="mt-2 w-full rounded-lg border border-tru-grey px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tru-teal"
            placeholder="Add observations, details, or follow-ups..."
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-tru-blue">Photos</h4>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-tru-yellow px-3 py-1 text-xs font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
            >
              Add photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
          {photos.length === 0 ? (
            <p className="mt-2 text-xs text-tru-grey">No photos added yet.</p>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-lg border border-tru-sage bg-tru-cloud p-2"
                >
                  <img
                    src={photo.url}
                    alt={`${feature} on ${floor}`}
                    className="h-20 w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="mt-2 w-full rounded-full border border-tru-grey px-2 py-1 text-[10px] font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CellDetailsSheet;
