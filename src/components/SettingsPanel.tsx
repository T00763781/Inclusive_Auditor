import type { BuildingAudit } from '../data/types';
import SavedEntriesList from './SavedEntriesList';

type SettingsPanelProps = {
  audits: BuildingAudit[];
  onClearAll: () => void;
  onResetDefaults: () => void;
};

const SettingsPanel = ({ audits, onClearAll, onResetDefaults }: SettingsPanelProps) => {
  return (
    <section className="rounded-xl border border-tru-sage bg-white p-5 shadow-soft">
      <details>
        <summary className="cursor-pointer text-base font-semibold text-tru-blue">Settings</summary>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-tru-blue">View saved entries</h3>
            <SavedEntriesList audits={audits} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onClearAll}
              className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 focus-visible:ring-2 focus-visible:ring-tru-teal"
            >
              Clear all data
            </button>
            <button
              type="button"
              onClick={onResetDefaults}
              className="rounded-lg border border-tru-grey px-3 py-2 text-xs font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
            >
              Reset floors/features to defaults
            </button>
          </div>
        </div>
      </details>
    </section>
  );
};

export default SettingsPanel;
