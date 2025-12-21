type ActionBarProps = {
  onSave: () => void;
  onExport: () => void;
};

const ActionBar = ({ onSave, onExport }: ActionBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-tru-cloud/95 px-4 py-3 shadow-[0_-10px_30px_rgba(0,62,81,0.12)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:flex-row sm:justify-end sm:px-6">
        <button
          type="button"
          onClick={onSave}
          className="w-full rounded-lg bg-ol-green px-4 py-3 text-base font-semibold text-white shadow-soft focus-visible:ring-2 focus-visible:ring-tru-teal sm:w-auto"
        >
          Save building
        </button>
        <button
          type="button"
          onClick={onExport}
          className="w-full rounded-lg border border-tru-grey bg-white px-4 py-3 text-base font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal sm:w-auto"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
