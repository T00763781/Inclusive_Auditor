import { useEffect, useReducer, useRef, useState } from 'react';
import ActionBar from './components/ActionBar';
import AppShell from './components/AppShell';
import BuildingForm from './components/BuildingForm';
import CellDetailsSheet from './components/CellDetailsSheet';
import FeatureManager from './components/FeatureManager';
import FloorManager from './components/FloorManager';
import MatrixTable from './components/MatrixTable';
import SettingsPanel from './components/SettingsPanel';
import Toast from './components/Toast';
import { auditsToCsvLong } from './data/csv';
import { CAMPUS_AUDIT_EXTRAS, DEFAULT_FEATURES, RECOMMENDED_EXTRAS, SITE_LABEL } from './data/defaults';
import { createEmptyMatrix, reconcileMatrix } from './data/matrix';
import {
  addAudit,
  clearAudits,
  clearCsvSnapshot,
  clearPhotoAssets,
  deletePhotoAsset,
  deleteAudit,
  getConfig,
  getCsvSnapshot,
  listAudits,
  resetConfig,
  setConfig,
  setCsvSnapshot
} from './data/storage';
import type { BuildingAudit, Config, MatrixCell } from './data/types';
import { appReducer, initialState } from './state/reducer';
import { buildCsvFilename, exportCsvFile } from './utils/exportCsv';

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [featureManagerOpen, setFeatureManagerOpen] = useState(false);
  const [detailCell, setDetailCell] = useState<{ feature: string; floor: string } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const init = async () => {
      const config = await getConfig();
      const floorsWithSite = [SITE_LABEL, ...config.floors];
      const matrix = createEmptyMatrix(config.features, floorsWithSite);
      const audits = await listAudits();
      const csvSnapshot = await getCsvSnapshot();
      dispatch({ type: 'INIT', payload: { config, matrix, audits, csvSnapshot } });
    };
    init();
  }, []);

  useEffect(() => {
    const handleStatus = () => {
      dispatch({ type: 'SET_ONLINE', payload: { online: navigator.onLine } });
    };
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const updateConfig = async (nextConfig: Config) => {
    await setConfig(nextConfig);
    const floorsWithSite = [SITE_LABEL, ...nextConfig.floors];
    const nextMatrix = reconcileMatrix(state.matrix, nextConfig.features, floorsWithSite);
    dispatch({ type: 'SET_CONFIG', payload: { config: nextConfig, matrix: nextMatrix } });
  };

  const refreshAudits = async () => {
    const audits = await listAudits();
    const csvSnapshot = auditsToCsvLong(audits);
    await setCsvSnapshot(csvSnapshot);
    dispatch({ type: 'SET_AUDITS', payload: { audits } });
    dispatch({ type: 'SET_CSV', payload: { csvSnapshot } });
  };

  const handleSave = async () => {
    if (!state.buildingName.trim()) {
      dispatch({ type: 'SET_ERRORS', payload: { errors: { buildingName: 'Building name is required.' } } });
      return;
    }

    const now = new Date().toISOString();
    const floorsWithSite = [SITE_LABEL, ...state.config.floors];
    const audit: BuildingAudit = {
      id: crypto.randomUUID(),
      buildingName: state.buildingName.trim(),
      address: state.address.trim() || undefined,
      floors: [...floorsWithSite],
      features: [...state.config.features],
      matrix: structuredClone(state.matrix),
      createdAt: now,
      updatedAt: now
    };

    await addAudit(audit);
    await refreshAudits();

    dispatch({
      type: 'RESET_FORM',
      payload: { matrix: createEmptyMatrix(state.config.features, floorsWithSite) }
    });

    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current);
    }

    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Saved', undoId: audit.id } });
    undoTimerRef.current = window.setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 10000);
  };

  const collectPhotoIds = (audit: BuildingAudit): string[] => {
    const ids: string[] = [];
    for (const feature of audit.features) {
      const row = audit.matrix[feature] ?? {};
      for (const floor of audit.floors) {
        const cell = row[floor];
        if (cell?.photoIds?.length) {
          ids.push(...cell.photoIds);
        }
      }
    }
    return Array.from(new Set(ids));
  };

  const handleUndo = async () => {
    if (!state.toast.undoId) {
      return;
    }
    const auditToRemove = state.audits.find((audit) => audit.id === state.toast.undoId);
    if (auditToRemove) {
      const photoIds = collectPhotoIds(auditToRemove);
      for (const id of photoIds) {
        await deletePhotoAsset(id);
      }
    }
    await deleteAudit(state.toast.undoId);
    await refreshAudits();
    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current);
    }
    dispatch({ type: 'HIDE_TOAST' });
  };

  const handleExport = async () => {
    if (state.savedCount === 0) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'No saved entries to export.' } });
      undoTimerRef.current = window.setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, 5000);
      return;
    }

    const csvSnapshot = state.csvSnapshot || auditsToCsvLong(state.audits);
    if (!state.csvSnapshot) {
      await setCsvSnapshot(csvSnapshot);
      dispatch({ type: 'SET_CSV', payload: { csvSnapshot } });
    }
    const filename = buildCsvFilename();
    try {
      await exportCsvFile(csvSnapshot, filename);
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Exported CSV' } });
      undoTimerRef.current = window.setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, 5000);
    } catch (error) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Export failed. Try download.' } });
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all saved audits? This cannot be undone.')) {
      return;
    }
    await clearAudits();
    await clearCsvSnapshot();
    await clearPhotoAssets();
    dispatch({ type: 'SET_AUDITS', payload: { audits: [] } });
    dispatch({ type: 'SET_CSV', payload: { csvSnapshot: '' } });
  };

  const handleResetAll = async () => {
    if (!window.confirm('Reset floors and features to defaults?')) {
      return;
    }
    const fresh = await resetConfig();
    const floorsWithSite = [SITE_LABEL, ...fresh.floors];
    const matrix = createEmptyMatrix(fresh.features, floorsWithSite);
    dispatch({ type: 'SET_CONFIG', payload: { config: fresh, matrix } });
  };

  const handleAddFloor = async (label: string) => {
    const nextConfig = { ...state.config, floors: [...state.config.floors, label] };
    await updateConfig(nextConfig);
  };

  const handleRemoveFloor = async (label: string) => {
    if (!window.confirm(`Remove floor ${label}?`)) {
      return;
    }
    const nextFloors = state.config.floors.filter((floor) => floor !== label);
    const nextConfig = { ...state.config, floors: nextFloors };
    await updateConfig(nextConfig);
  };

  const handleAddFeature = async (label: string) => {
    const nextConfig = { ...state.config, features: [...state.config.features, label] };
    await updateConfig(nextConfig);
  };

  const handleRemoveFeature = async (label: string) => {
    const nextFeatures = state.config.features.filter((feature) => feature !== label);
    const nextConfig = { ...state.config, features: nextFeatures };
    await updateConfig(nextConfig);
  };

  const handleResetFeatures = async () => {
    const nextConfig = { ...state.config, features: [...DEFAULT_FEATURES] };
    await updateConfig(nextConfig);
  };

  const handleAddRecommended = async () => {
    const existing = new Set(state.config.features);
    const additions = RECOMMENDED_EXTRAS.filter((feature) => !existing.has(feature));
    if (additions.length === 0) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'All recommended features already added.' } });
      undoTimerRef.current = window.setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, 4000);
      return;
    }
    const nextConfig = { ...state.config, features: [...state.config.features, ...additions] };
    await updateConfig(nextConfig);
  };

  const handleAddCampusExtras = async () => {
    const existing = new Set(state.config.features);
    const additions = CAMPUS_AUDIT_EXTRAS.filter((feature) => !existing.has(feature));
    if (additions.length === 0) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Campus extras already added.' } });
      undoTimerRef.current = window.setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, 4000);
      return;
    }
    const nextConfig = { ...state.config, features: [...state.config.features, ...additions] };
    await updateConfig(nextConfig);
  };

  const handleUpdateCell = (feature: string, floor: string, updates: Partial<MatrixCell>) => {
    dispatch({ type: 'UPDATE_CELL', payload: { feature, floor, updates } });
  };

  const floorsWithSite = [SITE_LABEL, ...state.config.floors];

  return (
    <>
      <AppShell savedCount={state.savedCount} online={state.online}>
        <main className="flex flex-col gap-6 motion-safe:animate-fade-up">
          <BuildingForm
            buildingName={state.buildingName}
            address={state.address}
            error={state.errors.buildingName}
            focusKey={state.focusKey}
            onChange={(field, value) => dispatch({ type: 'SET_FIELD', payload: { field, value } })}
          />

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <FloorManager
              floors={state.config.floors}
              onAddFloor={handleAddFloor}
              onRemoveFloor={handleRemoveFloor}
            />
            <section className="flex h-full flex-col justify-between rounded-xl border border-tru-sage bg-white p-5 shadow-soft">
              <div>
                <h2 className="text-base font-semibold text-tru-blue">Feature list</h2>
                <p className="mt-1 text-xs text-tru-grey">
                  Manage the feature list, add recommended extras, or reset to defaults.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFeatureManagerOpen(true)}
                className="mt-4 rounded-lg bg-tru-blue px-4 py-2 text-sm font-semibold text-tru-cloud focus-visible:ring-2 focus-visible:ring-tru-teal"
              >
                Manage features
              </button>
            </section>
          </div>

          <MatrixTable
            features={state.config.features}
            floors={floorsWithSite}
            matrix={state.matrix}
            onToggle={(feature, floor) =>
              dispatch({ type: 'TOGGLE_CELL', payload: { feature, floor } })
            }
            onOpenDetails={(feature, floor) => setDetailCell({ feature, floor })}
          />

          <SettingsPanel audits={state.audits} onClearAll={handleClearAll} onResetDefaults={handleResetAll} />
        </main>
      </AppShell>

      <FeatureManager
        open={featureManagerOpen}
        features={state.config.features}
        onAddFeature={handleAddFeature}
        onRemoveFeature={handleRemoveFeature}
        onResetDefaults={handleResetFeatures}
        onAddRecommended={handleAddRecommended}
        onAddCampusExtras={handleAddCampusExtras}
        onClose={() => setFeatureManagerOpen(false)}
      />

      {detailCell ? (
        <CellDetailsSheet
          open={Boolean(detailCell)}
          feature={detailCell.feature}
          floor={detailCell.floor}
          cell={state.matrix[detailCell.feature]?.[detailCell.floor] ?? { present: false }}
          onClose={() => setDetailCell(null)}
          onTogglePresent={() =>
            dispatch({
              type: 'TOGGLE_CELL',
              payload: { feature: detailCell.feature, floor: detailCell.floor }
            })
          }
          onUpdateCell={(updates) =>
            handleUpdateCell(detailCell.feature, detailCell.floor, updates)
          }
        />
      ) : null}

      <Toast
        message={state.toast.message}
        visible={state.toast.visible}
        onUndo={state.toast.undoId ? handleUndo : undefined}
      />

      <ActionBar onSave={handleSave} onExport={handleExport} />
    </>
  );
};

export default App;
