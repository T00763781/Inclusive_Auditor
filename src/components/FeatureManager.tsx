import { useEffect, useState } from 'react';

type FeatureManagerProps = {
  open: boolean;
  features: string[];
  onAddFeature: (label: string) => void;
  onRemoveFeature: (label: string) => void;
  onResetDefaults: () => void;
  onClose: () => void;
};

const FeatureManager = ({
  open,
  features,
  onAddFeature,
  onRemoveFeature,
  onResetDefaults,
  onClose
}: FeatureManagerProps) => {
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setLabel('');
      setError('');
    }
  }, [open]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (open) {
      window.addEventListener('keydown', handler);
    }
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleAdd = () => {
    const next = label.trim();
    if (!next) {
      setError('Enter a feature label.');
      return;
    }
    if (features.includes(next)) {
      setError('That feature already exists.');
      return;
    }
    onAddFeature(next);
    setLabel('');
    setError('');
  };

  const handleRemove = (labelToRemove: string) => {
    if (window.confirm(`Remove "${labelToRemove}"?`)) {
      onRemoveFeature(labelToRemove);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset features to defaults?')) {
      onResetDefaults();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Manage features"
        className="w-full max-w-xl rounded-xl border border-tru-sage bg-white p-5 shadow-soft"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-tru-blue">Manage features</h2>
            <p className="text-xs text-tru-grey">Add, remove, or reset the list of features.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-tru-grey px-3 py-1 text-xs font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="flex-1 rounded-lg border border-tru-grey px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tru-teal"
            placeholder="New feature label"
            aria-label="New feature label"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-tru-blue px-4 py-2 text-sm font-semibold text-tru-cloud focus-visible:ring-2 focus-visible:ring-tru-teal"
          >
            Add feature
          </button>
        </div>
        {error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-tru-grey px-3 py-2 text-xs font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
          >
            Reset to defaults
          </button>
        </div>

        <div className="mt-5 max-h-64 overflow-y-auto rounded-lg border border-tru-sage bg-tru-cloud p-3">
          <ul className="flex flex-col gap-2 text-sm">
            {features.map((feature) => (
              <li key={feature} className="flex items-center justify-between gap-3">
                <span className="text-tru-blue">{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(feature)}
                  className="rounded-full border border-tru-grey px-2 py-1 text-[10px] font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
                  aria-label={`Remove ${feature}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeatureManager;
