import type { FeatureLabel, FloorLabel, Matrix, MatrixCell } from './types';

export const createEmptyMatrix = (
  features: FeatureLabel[],
  floors: FloorLabel[]
): Matrix => {
  const matrix: Matrix = {};
  for (const feature of features) {
    const row: Record<FloorLabel, MatrixCell> = {};
    for (const floor of floors) {
      row[floor] = { present: false };
    }
    matrix[feature] = row;
  }
  return matrix;
};

export const reconcileMatrix = (
  existing: Matrix,
  features: FeatureLabel[],
  floors: FloorLabel[]
): Matrix => {
  const next: Matrix = {};
  for (const feature of features) {
    const row: Record<FloorLabel, MatrixCell> = {};
    const existingRow = existing[feature] ?? {};
    for (const floor of floors) {
      const existingCell = existingRow[floor];
      row[floor] = existingCell
        ? { ...existingCell, present: Boolean(existingCell.present) }
        : { present: false };
    }
    next[feature] = row;
  }
  return next;
};
