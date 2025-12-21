import { Fragment } from 'react';
import type { Matrix } from '../data/types';
import { FEATURE_CATEGORIES, FEATURE_DEFINITIONS, RECOMMENDED_SITE_FEATURES } from '../data/defaults';

type MatrixTableProps = {
  features: string[];
  floors: string[];
  matrix: Matrix;
  onToggle: (feature: string, floor: string) => void;
  onOpenDetails: (feature: string, floor: string) => void;
};

const MatrixTable = ({ features, floors, matrix, onToggle, onOpenDetails }: MatrixTableProps) => {
  const categoryStartMap = new Map<string, string>();
  for (const category of FEATURE_CATEGORIES) {
    const firstFeature = category.features.find((feature) => features.includes(feature));
    if (firstFeature) {
      categoryStartMap.set(firstFeature, category.label);
    }
  }

  return (
    <section className="rounded-xl border border-tru-sage bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-tru-blue">Floors x Features Matrix</h2>
          <p className="text-xs text-tru-grey">
            Tap a dot to mark present. Recommended locations appear in the info tooltips.
          </p>
        </div>
        <span className="rounded-full border border-tru-grey bg-tru-cloud px-3 py-1 text-xs font-semibold text-tru-blue">
          Tap targets are 44x44
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-max border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-20 bg-white px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-tru-grey"
              >
                Feature
              </th>
              {floors.map((floor) => (
                <th
                  key={floor}
                  scope="col"
                  className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-tru-grey"
                >
                  {floor}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => {
              const categoryLabel = categoryStartMap.get(feature);
              const info = FEATURE_DEFINITIONS[feature];
              const recommended = info?.recommended ??
                (RECOMMENDED_SITE_FEATURES.has(feature) ? 'SITE' : 'Floors');

              return (
                <Fragment key={feature}>
                  {categoryLabel ? (
                    <tr key={`${feature}-category`}>
                      <td
                        colSpan={floors.length + 1}
                        className="bg-tru-sage/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-tru-blue"
                      >
                        {categoryLabel}
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-sm font-semibold text-tru-blue"
                    >
                      <div className="flex items-center gap-2">
                        <span>{feature}</span>
                        <details className="relative">
                          <summary
                            className="list-none cursor-pointer"
                            aria-label={`Info for ${feature}`}
                          >
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-tru-grey text-[11px] font-semibold text-tru-blue">
                              ?
                            </span>
                          </summary>
                          <div className="absolute left-0 top-6 z-20 w-64 rounded-lg border border-tru-sage bg-white p-3 text-xs text-tru-blue shadow-soft">
                            <p className="font-semibold text-tru-blue">Definition</p>
                            <p className="mt-1">{info?.definition ?? 'Custom feature.'}</p>
                            <p className="mt-2 font-semibold text-tru-blue">Present if</p>
                            <p className="mt-1">{info?.presentIf ?? 'Observed as available.'}</p>
                            <p className="mt-2 font-semibold text-tru-blue">Recommended</p>
                            <p className="mt-1">{recommended}</p>
                          </div>
                        </details>
                      </div>
                    </th>
                    {floors.map((floor) => {
                      const present = matrix[feature]?.[floor]?.present ?? false;
                      return (
                        <td key={`${feature}-${floor}`} className="px-4 py-2 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onToggle(feature, floor)}
                              aria-pressed={present}
                              aria-label={`${feature} on ${floor}: ${present ? 'Present' : 'Absent'}`}
                              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border-2 transition focus-visible:ring-2 focus-visible:ring-tru-teal ${
                                present
                                  ? 'border-tru-blue bg-tru-teal text-white shadow-[0_0_0_4px_rgba(0,176,185,0.2)]'
                                  : 'border-tru-grey bg-white text-tru-grey'
                              }`}
                            >
                              <span
                                className={`h-4 w-4 rounded-full ${
                                  present ? 'bg-white' : 'border border-tru-grey'
                                }`}
                                aria-hidden="true"
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenDetails(feature, floor)}
                              className="rounded-full border border-tru-grey px-2 py-0.5 text-[10px] font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
                              aria-label={`Add notes or photos for ${feature} on ${floor}`}
                            >
                              Notes
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MatrixTable;
