import type { FeatureLabel } from './types';

const ROOT_SPECS = import.meta.glob('../../TAB*_*.md', { as: 'raw', eager: true }) as Record<
  string,
  string
>;
const FALLBACK_SPECS = import.meta.glob('../../Tab Specs/TAB*_*.md', {
  as: 'raw',
  eager: true
}) as Record<string, string>;

export type TabSubsection = {
  label: string;
  features: FeatureLabel[];
};

export type TabSection = {
  label: string;
  features: FeatureLabel[];
  subsections?: TabSubsection[];
};

export type TabSpec = {
  id: string;
  label: string;
  sections: TabSection[];
};

const unescapeMarkdown = (value: string): string =>
  value.replace(/\\([#\\\-*&/])/g, '$1').trim();

const resolveSpec = (filename: string): string => {
  const rootPath = `../../${filename}`;
  const fallbackPath = `../../Tab Specs/${filename}`;
  const content = ROOT_SPECS[rootPath] ?? FALLBACK_SPECS[fallbackPath];
  if (!content) {
    throw new Error(`Missing tab spec: ${filename}`);
  }
  return content;
};

const getTitleLabel = (title: string): string => {
  const normalized = title.trim();
  const tabMatch = normalized.match(/^Tab\s+\d+\s*[-–—]\s*(.+)$/i);
  const label = tabMatch ? tabMatch[1] : normalized;
  return label.replace(/\s*\([^)]*\)\s*$/, '').trim();
};

const parseTabSpec = (raw: string, id: string): TabSpec => {
  const lines = raw.split(/\r?\n/);
  let label = id;
  const sections: TabSection[] = [];
  let currentSection: TabSection | null = null;
  let currentSubsection: TabSubsection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const normalized = unescapeMarkdown(trimmed);

    const titleMatch = normalized.match(/^#\s+(.+)$/);
    if (titleMatch) {
      label = getTitleLabel(titleMatch[1]);
      continue;
    }

    const sectionMatch = normalized.match(/^##\s+(.+)$/);
    if (sectionMatch) {
      currentSection = {
        label: sectionMatch[1],
        features: [],
        subsections: []
      };
      sections.push(currentSection);
      currentSubsection = null;
      continue;
    }

    const subsectionMatch = normalized.match(/^###\s+(.+)$/);
    if (subsectionMatch) {
      if (!currentSection) {
        continue;
      }
      currentSubsection = {
        label: subsectionMatch[1],
        features: []
      };
      currentSection.subsections?.push(currentSubsection);
      continue;
    }

    const featureMatch = normalized.match(/^-+\s+(.+)$/);
    if (featureMatch) {
      const feature = featureMatch[1];
      if (!feature || !currentSection) {
        continue;
      }
      if (currentSubsection) {
        currentSubsection.features.push(feature);
      } else {
        currentSection.features.push(feature);
      }
    }
  }

  return { id, label, sections };
};

export const TAB_SPECS: TabSpec[] = [
  parseTabSpec(resolveSpec('TAB1_Inclusivity_and_Accessibility.md'), 'inclusive'),
  parseTabSpec(resolveSpec('TAB2_Student_Supports_and_Services.md'), 'supports'),
  parseTabSpec(resolveSpec('TAB3_Campus_Culture_and_Landmarks.md'), 'culture')
];

export const ALL_TAB_FEATURES: FeatureLabel[] = TAB_SPECS.flatMap((tab) =>
  tab.sections.flatMap((section) => [
    ...section.features,
    ...(section.subsections?.flatMap((subsection) => subsection.features) ?? [])
  ])
);
