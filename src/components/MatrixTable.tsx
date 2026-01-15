import { Fragment, useEffect, useMemo, useState } from 'react';
import type { TabSpec, TabSubsection } from '../data/tabSpecs';
import type { Matrix } from '../data/types';
import { FEATURE_DEFINITIONS, RECOMMENDED_SITE_FEATURES } from '../data/defaults';
import Tooltip from './Tooltip';

type MatrixTableProps = {
  tabs: TabSpec[];
  allFeatures: string[];
  floors: string[];
  matrix: Matrix;
  onToggle: (feature: string, floor: string) => void;
  onOpenDetails: (feature: string, floor: string) => void;
};

const CUSTOM_SECTION_LABEL = 'Custom Features';

const flattenTabFeatures = (tabs: TabSpec[]): string[] => {
  const features: string[] = [];
  for (const tab of tabs) {
    for (const section of tab.sections) {
      features.push(...section.features);
      if (section.subsections) {
        for (const subsection of section.subsections) {
          features.push(...subsection.features);
        }
      }
    }
  }
  return features;
};

const MatrixTable = ({
  tabs,
  allFeatures,
  floors,
  matrix,
  onToggle,
  onOpenDetails
}: MatrixTableProps) => {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? '');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [collapsedSubsections, setCollapsedSubsections] = useState<Record<string, boolean>>({});

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  useEffect(() => {
    if (!activeTab && tabs[0]) {
      setActiveTabId(tabs[0].id);
    }
  }, [activeTab, tabs]);

  const canonicalFeatureSet = useMemo(
    () => new Set(flattenTabFeatures(tabs)),
    [tabs]
  );

  const customFeatures = useMemo(
    () => allFeatures.filter((feature) => !canonicalFeatureSet.has(feature)),
    [allFeatures, canonicalFeatureSet]
  );

  const sections = useMemo(() => {
    const baseSections = activeTab?.sections ?? [];
    if (customFeatures.length === 0) {
      return baseSections;
    }
    return [...baseSections, { label: CUSTOM_SECTION_LABEL, features: customFeatures }];
  }, [activeTab, customFeatures]);

  const getSectionKey = (sectionLabel: string) => `${activeTab?.id ?? 'tab'}:${sectionLabel}`;
  const getSubsectionKey = (sectionLabel: string, subsectionLabel: string) =>
    `${getSectionKey(sectionLabel)}:${subsectionLabel}`;

  const toggleSection = (sectionLabel: string) => {
    const key = getSectionKey(sectionLabel);
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSubsection = (sectionLabel: string, subsectionLabel: string) => {
    const key = getSubsectionKey(sectionLabel, subsectionLabel);
    setCollapsedSubsections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderFeatureRow = (
    feature: string,
    options?: { indent?: boolean; keyPrefix?: string }
  ) => {
    const info = FEATURE_DEFINITIONS[feature];
    const recommended = info?.recommended ??
      (RECOMMENDED_SITE_FEATURES.has(feature) ? 'SITE' : 'Floors');
    const rowKey = `${options?.keyPrefix ?? 'feature'}-${feature}`;
    const indentClass = options?.indent ? 'pl-8' : '';

    return (
      <tr key={rowKey}>
        <th
          scope="row"
          className={`sticky left-0 z-10 bg-white px-4 py-3 text-left text-sm font-semibold text-tru-blue ${indentClass}`}
        >
          <div className="flex items-center gap-2">
            <span>{feature}</span>
            <button
              type="button"
              onClick={() => onOpenDetails(feature, floors[0])}
              className="rounded-full border border-tru-grey px-2 py-0.5 text-[10px] font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
              aria-label={`Add notes or photos for ${feature}`}
            >
              Notes
            </button>
            <Tooltip
              placement="right"
              content={
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-tru-blue">Definition</p>
                    <p className="mt-1">{info?.definition ?? 'Custom feature.'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-tru-blue">Present if</p>
                    <p className="mt-1">{info?.presentIf ?? 'Observed as available.'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-tru-blue">Recommended</p>
                    <p className="mt-1">{recommended}</p>
                  </div>
                </div>
              }
            >
              <button
                type="button"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-tru-grey text-[11px] font-semibold text-tru-blue focus-visible:ring-2 focus-visible:ring-tru-teal"
                aria-label={`Info for ${feature}`}
              >
                ?
              </button>
            </Tooltip>
          </div>
        </th>
        {floors.map((floor) => {
          const present = matrix[feature]?.[floor]?.present ?? false;
          return (
            <td key={`${feature}-${floor}`} className="px-4 py-2 text-center">
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
            </td>
          );
        })}
      </tr>
    );
  };

  const renderSubsection = (subsection: TabSubsection, sectionLabel: string) => {
    const key = getSubsectionKey(sectionLabel, subsection.label);
    const collapsed = Boolean(collapsedSubsections[key]);

    return (
      <Fragment key={`${sectionLabel}-${subsection.label}`}>
        <tr>
          <td
            colSpan={floors.length + 1}
            className="bg-tru-cloud px-6 py-2 text-xs font-semibold text-tru-blue"
          >
            <button
              type="button"
              onClick={() => toggleSubsection(sectionLabel, subsection.label)}
              className="flex w-full items-center justify-between"
              aria-expanded={!collapsed}
            >
              <span>{subsection.label}</span>
              <span className="text-[10px] font-semibold">
                {collapsed ? 'Show' : 'Hide'}
              </span>
            </button>
          </td>
        </tr>
        {!collapsed
          ? subsection.features.map((feature) =>
              renderFeatureRow(feature, {
                indent: true,
                keyPrefix: `${sectionLabel}-${subsection.label}`
              })
            )
          : null}
      </Fragment>
    );
  };

  return (
    <section className="rounded-xl border border-tru-sage bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-tru-blue">Floors x Features Matrix</h2>
          <p className="text-xs text-tru-grey">
            Tap a dot to mark present. Use Notes next to a feature to add notes or photos.
          </p>
        </div>
        <span className="rounded-full border border-tru-grey bg-tru-cloud px-3 py-1 text-xs font-semibold text-tru-blue">
          Tap targets are 44x44
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTabId(tab.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-tru-teal ${
              tab.id === activeTab?.id
                ? 'border-tru-blue bg-tru-teal text-tru-blue'
                : 'border-tru-grey text-tru-blue'
            }`}
            aria-pressed={tab.id === activeTab?.id}
          >
            {tab.label}
          </button>
        ))}
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
            {sections.map((section) => {
              const key = getSectionKey(section.label);
              const collapsed = Boolean(collapsedSections[key]);
              const subsectionBlocks = section.subsections ?? [];

              return (
                <Fragment key={`${activeTab?.id ?? 'tab'}-${section.label}`}>
                  <tr>
                    <td
                      colSpan={floors.length + 1}
                      className="bg-tru-sage/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-tru-blue"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(section.label)}
                        className="flex w-full items-center justify-between"
                        aria-expanded={!collapsed}
                      >
                        <span>{section.label}</span>
                        <span className="text-[10px] font-semibold">
                          {collapsed ? 'Show' : 'Hide'}
                        </span>
                      </button>
                    </td>
                  </tr>
                  {!collapsed ? (
                    <>
                      {section.features.map((feature) =>
                        renderFeatureRow(feature, { keyPrefix: section.label })
                      )}
                      {subsectionBlocks.map((subsection) =>
                        renderSubsection(subsection, section.label)
                      )}
                    </>
                  ) : null}
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
