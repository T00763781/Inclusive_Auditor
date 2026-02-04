type ActionBarProps = {
  onSave: () => void;
  onExport: () => void;
  onExportZip: () => void;
};

const ActionBar = ({ onSave, onExport, onExportZip }: ActionBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-tru-cloud/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-10px_30px_rgba(0,62,81,0.12)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-row gap-2 sm:justify-end sm:px-6">
        <button
          type="button"
          onClick={onSave}
          aria-label="Save building"
          className="flex-1 rounded-lg bg-ol-green px-2 py-2.5 text-xs font-semibold leading-tight text-white shadow-soft focus-visible:ring-2 focus-visible:ring-tru-teal sm:flex-none sm:px-4 sm:py-3 sm:text-base"
        >
          <span className="sm:hidden">Save</span>
          <span className="hidden sm:inline">Save building</span>
        </button>
        <button
          type="button"
          onClick={onExport}
          aria-label="Export CSV"
          className="flex-1 rounded-lg border border-tru-grey bg-white px-2 py-2.5 text-xs font-semibold leading-tight text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal sm:flex-none sm:px-4 sm:py-3 sm:text-base"
        >
          <span className="sm:hidden">CSV</span>
          <span className="hidden sm:inline">Export CSV</span>
        </button>
        <button
          type="button"
          onClick={onExportZip}
          aria-label="Export ZIP (CSV + photos)"
          className="flex-1 rounded-lg border border-tru-grey bg-white px-2 py-2.5 text-xs font-semibold leading-tight text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal sm:flex-none sm:px-4 sm:py-3 sm:text-base"
        >
          <span className="sm:hidden">ZIP</span>
          <span className="hidden sm:inline">Export ZIP (CSV + photos)</span>
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
