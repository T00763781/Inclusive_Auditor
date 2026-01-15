import type { BuildingAudit } from './types';

const CSV_HEADER = [
  'building_id',
  'building_name',
  'address',
  'created_at',
  'floor',
  'feature',
  'present',
  'notes',
  'photo_count',
  'latitude',
  'longitude'
];

const escapeCsv = (value: string): string => {
  const needsQuotes = /[",\n\r]/.test(value) || /^\s|\s$/.test(value);
  if (!needsQuotes) {
    return value;
  }
  return `"${value.replace(/"/g, '""')}"`;
};

const formatValue = (value: string | number | boolean | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

export const auditsToCsvLong = (audits: BuildingAudit[]): string => {
  const rows: string[] = [CSV_HEADER.join(',')];
  for (const audit of audits) {
    for (const feature of audit.features) {
      const row = audit.matrix[feature] ?? {};
      for (const floor of audit.floors) {
        const cell = row[floor];
        const present = cell?.present ? 'true' : 'false';
        const notes = cell?.notes ?? '';
        const photoCount = cell?.photoIds?.length ?? 0;
        const latitude = cell?.geo?.lat;
        const longitude = cell?.geo?.lon;
        const columns = [
          audit.id,
          audit.buildingName,
          audit.address ?? '',
          audit.createdAt,
          floor,
          feature,
          present,
          notes,
          photoCount,
          latitude,
          longitude
        ].map((value) => escapeCsv(formatValue(value)));
        rows.push(columns.join(','));
      }
    }
  }
  return rows.join('\n');
};
