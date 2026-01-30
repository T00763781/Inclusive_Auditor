import type { BuildingAudit } from '../data/types';

type SavedEntriesListProps = {
  audits: BuildingAudit[];
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString();
};

const SavedEntriesList = ({ audits }: SavedEntriesListProps) => {
  if (audits.length === 0) {
    return <p className="mt-2 text-xs text-tru-grey">No saved entries yet.</p>;
  }

  return (
    <ul className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-tru-sage bg-tru-cloud p-3 text-xs">
      {audits.map((audit) => (
        <li key={audit.id} className="border-b border-tru-sage/60 py-2 last:border-b-0">
          <p className="font-semibold text-tru-blue">{audit.buildingName}</p>
          <p className="text-tru-grey">{audit.address ?? 'No address'}</p>
          <p className="text-tru-grey">{formatDate(audit.createdAt)}</p>
        </li>
      ))}
    </ul>
  );
};

export default SavedEntriesList;
