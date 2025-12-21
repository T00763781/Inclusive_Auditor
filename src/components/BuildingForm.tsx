import { useEffect, useRef } from 'react';

type BuildingFormProps = {
  buildingName: string;
  address: string;
  error?: string;
  focusKey: number;
  onChange: (field: 'buildingName' | 'address', value: string) => void;
};

const BuildingForm = ({ buildingName, address, error, focusKey, onChange }: BuildingFormProps) => {
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, [focusKey]);

  return (
    <section className="rounded-xl border border-tru-sage bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-tru-blue" htmlFor="buildingName">
            Building Name
          </label>
          <input
            id="buildingName"
            name="buildingName"
            ref={nameRef}
            value={buildingName}
            onChange={(event) => onChange('buildingName', event.target.value)}
            className={`mt-2 w-full rounded-lg border px-3 py-2 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-tru-teal ${
              error ? 'border-rose-400' : 'border-tru-grey'
            }`}
            placeholder="Old Main Building"
            autoComplete="off"
            required
          />
          {error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}
        </div>
        <div>
          <label className="text-sm font-semibold text-tru-blue" htmlFor="address">
            Address (optional)
          </label>
          <input
            id="address"
            name="address"
            value={address}
            onChange={(event) => onChange('address', event.target.value)}
            className="mt-2 w-full rounded-lg border border-tru-grey px-3 py-2 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-tru-teal"
            placeholder="123 Campus Drive"
            autoComplete="off"
          />
        </div>
      </div>
      <p className="mt-4 text-xs text-tru-grey">Data is saved locally on this device until export.</p>
    </section>
  );
};

export default BuildingForm;
