import { useState } from 'react';
import { SITE_LABEL } from '../data/defaults';

type FloorManagerProps = {
  floors: string[];
  onAddFloor: (label: string) => void;
  onRemoveFloor: (label: string) => void;
};

const FloorManager = ({ floors, onAddFloor, onRemoveFloor }: FloorManagerProps) => {
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const next = label.trim();
    if (!next) {
      setError('Enter a floor label.');
      return;
    }
    if (next.toUpperCase() === SITE_LABEL) {
      setError('SITE is reserved.');
      return;
    }
    if (floors.includes(next)) {
      setError('That floor already exists.');
      return;
    }
    onAddFloor(next);
    setLabel('');
    setError('');
  };

  return (
    <section className="rounded-xl border border-tru-sage bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-tru-blue">Floors</h2>
          <p className="text-xs text-tru-grey">SITE is pinned and used for building-level items.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="w-32 rounded-lg border border-tru-grey px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-tru-teal"
            placeholder="Add floor"
            aria-label="Add floor label"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-tru-blue px-4 py-2 text-sm font-semibold text-tru-cloud focus-visible:ring-2 focus-visible:ring-tru-teal"
          >
            + Add floor
          </button>
        </div>
      </div>
      {error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-tru-teal bg-tru-sage px-3 py-1 text-xs font-semibold text-tru-blue">
          {SITE_LABEL}
        </span>
        {floors.map((floor) => (
          <span
            key={floor}
            className="flex items-center gap-2 rounded-full border border-tru-grey bg-tru-cloud px-3 py-1 text-xs font-semibold text-tru-blue"
          >
            {floor}
            <button
              type="button"
              onClick={() => onRemoveFloor(floor)}
              className="rounded-full border border-tru-grey px-2 py-0.5 text-[10px] font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
              aria-label={`Remove ${floor} floor`}
            >
              Remove
            </button>
          </span>
        ))}
      </div>
    </section>
  );
};

export default FloorManager;
