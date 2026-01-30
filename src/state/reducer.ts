import type { BuildingAudit, Config, Matrix, MatrixCell } from '../data/types';
import { createDefaultConfig, SITE_LABEL } from '../data/defaults';
import { createEmptyMatrix } from '../data/matrix';

export type ToastState = {
  message: string;
  undoId?: string;
  visible: boolean;
};

export type AppState = {
  buildingName: string;
  address: string;
  config: Config;
  matrix: Matrix;
  audits: BuildingAudit[];
  savedCount: number;
  errors: { buildingName?: string };
  toast: ToastState;
  online: boolean;
  focusKey: number;
  csvSnapshot: string;
};

export type Action =
  | {
      type: 'INIT';
      payload: { config: Config; matrix: Matrix; audits: BuildingAudit[]; csvSnapshot: string };
    }
  | { type: 'SET_FIELD'; payload: { field: 'buildingName' | 'address'; value: string } }
  | { type: 'SET_CONFIG'; payload: { config: Config; matrix: Matrix } }
  | { type: 'SET_MATRIX'; payload: { matrix: Matrix } }
  | { type: 'TOGGLE_CELL'; payload: { feature: string; floor: string } }
  | { type: 'UPDATE_CELL'; payload: { feature: string; floor: string; updates: Partial<MatrixCell> } }
  | { type: 'SET_AUDITS'; payload: { audits: BuildingAudit[] } }
  | { type: 'RESET_FORM'; payload: { matrix: Matrix } }
  | { type: 'SET_ERRORS'; payload: { errors: { buildingName?: string } } }
  | { type: 'SHOW_TOAST'; payload: { message: string; undoId?: string } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_ONLINE'; payload: { online: boolean } }
  | { type: 'SET_CSV'; payload: { csvSnapshot: string } }
  | { type: 'INCREMENT_FOCUS' };

const defaultConfig = createDefaultConfig();

export const initialState: AppState = {
  buildingName: '',
  address: '',
  config: defaultConfig,
  matrix: createEmptyMatrix(defaultConfig.features, [SITE_LABEL, ...defaultConfig.floors]),
  audits: [],
  savedCount: 0,
  errors: {},
  toast: { message: '', visible: false },
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  focusKey: 0,
  csvSnapshot: ''
};

export const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'INIT': {
      return {
        ...state,
        config: action.payload.config,
        matrix: action.payload.matrix,
        audits: action.payload.audits,
        savedCount: action.payload.audits.length,
        csvSnapshot: action.payload.csvSnapshot
      };
    }
    case 'SET_FIELD': {
      const nextErrors = { ...state.errors };
      if (action.payload.field === 'buildingName') {
        delete nextErrors.buildingName;
      }
      return {
        ...state,
        [action.payload.field]: action.payload.value,
        errors: nextErrors
      };
    }
    case 'SET_CONFIG': {
      return {
        ...state,
        config: action.payload.config,
        matrix: action.payload.matrix
      };
    }
    case 'SET_MATRIX': {
      return {
        ...state,
        matrix: action.payload.matrix
      };
    }
    case 'TOGGLE_CELL': {
      const { feature, floor } = action.payload;
      const row = state.matrix[feature] ?? {};
      const existingCell = row[floor] ?? { present: false };
      const updatedRow = { ...row, [floor]: { ...existingCell, present: !existingCell.present } };
      return {
        ...state,
        matrix: { ...state.matrix, [feature]: updatedRow }
      };
    }
    case 'UPDATE_CELL': {
      const { feature, floor, updates } = action.payload;
      const row = state.matrix[feature] ?? {};
      const existingCell = row[floor] ?? { present: false };
      const nextCell = { ...existingCell, ...updates };
      const updatedRow = { ...row, [floor]: nextCell };
      return {
        ...state,
        matrix: { ...state.matrix, [feature]: updatedRow }
      };
    }
    case 'SET_AUDITS': {
      return {
        ...state,
        audits: action.payload.audits,
        savedCount: action.payload.audits.length
      };
    }
    case 'RESET_FORM': {
      return {
        ...state,
        buildingName: '',
        address: '',
        matrix: action.payload.matrix,
        errors: {},
        focusKey: state.focusKey + 1
      };
    }
    case 'SET_ERRORS': {
      return {
        ...state,
        errors: action.payload.errors
      };
    }
    case 'SHOW_TOAST': {
      return {
        ...state,
        toast: { message: action.payload.message, undoId: action.payload.undoId, visible: true }
      };
    }
    case 'HIDE_TOAST': {
      return {
        ...state,
        toast: { message: '', visible: false }
      };
    }
    case 'SET_ONLINE': {
      return {
        ...state,
        online: action.payload.online
      };
    }
    case 'SET_CSV': {
      return {
        ...state,
        csvSnapshot: action.payload.csvSnapshot
      };
    }
    case 'INCREMENT_FOCUS': {
      return {
        ...state,
        focusKey: state.focusKey + 1
      };
    }
    default:
      return state;
  }
};
