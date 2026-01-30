export type FloorLabel = string;
export type FeatureLabel = string;

export type MatrixCell = {
  present: boolean;
  notes?: string;
  photoIds?: string[];
  geo?: {
    lat: number;
    lon: number;
    accuracy?: number;
    capturedAt: string;
  };
};

export type Matrix = Record<FeatureLabel, Record<FloorLabel, MatrixCell>>;

export interface PhotoAsset {
  id: string;
  blob: Blob;
  mimeType: string;
  createdAt: string;
  size: number;
  filename?: string;
}

export interface BuildingAudit {
  id: string;
  buildingName: string;
  address?: string;
  floors: FloorLabel[];
  features: FeatureLabel[];
  matrix: Matrix;
  createdAt: string;
  updatedAt: string;
}

export interface Config {
  floors: FloorLabel[];
  features: FeatureLabel[];
  version: number;
}
