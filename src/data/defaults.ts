import type { Config, FeatureLabel, FloorLabel } from './types';

export const CONFIG_VERSION = 2;

export const SITE_LABEL: FloorLabel = 'SITE';

export const DEFAULT_FLOORS: FloorLabel[] = ['B2', 'B1', '1', '2', '3', '4'];

export const DEFAULT_FEATURES: FeatureLabel[] = [
  'Step-free entrance',
  'Automatic door',
  'Ramp available',
  'Elevator/lift',
  'Accessible washroom',
  'Braille/tactile signage',
  'High-contrast signage',
  'Hearing loop / assistive listening',
  'Visual alarm / strobe',
  'Accessible seating area',
  'Quiet/sensory-friendly space',
  'Gender-inclusive washroom',
  'Lactation/parent room',
  'Service animal relief area nearby',
  'Accessible parking nearby'
];

export const RECOMMENDED_SITE_FEATURES = new Set<FeatureLabel>([
  'Step-free entrance',
  'Automatic door',
  'Ramp available',
  'Service animal relief area nearby',
  'Accessible parking nearby'
]);

export const FEATURE_DEFINITIONS: Record<
  FeatureLabel,
  { definition: string; presentIf: string; recommended: 'SITE' | 'Floors' }
> = {
  'Step-free entrance': {
    definition:
      'At least one public entrance has an accessible route without stairs (level entry or ramped route).',
    presentIf:
      'An entrance can be used by a wheelchair/mobility aid user without needing stairs.',
    recommended: 'SITE'
  },
  'Automatic door': {
    definition: 'Door opens automatically or via accessible push-button.',
    presentIf:
      'Main/public door has powered opener OR accessible actuator at usable height.',
    recommended: 'SITE'
  },
  'Ramp available': {
    definition: 'A ramp exists where a level change would otherwise require stairs.',
    presentIf: 'A ramped route is available for public access (permanent or reliable fixed ramp).',
    recommended: 'SITE'
  },
  'Elevator/lift': {
    definition: 'Elevator/lift provides step-free vertical access between floors.',
    presentIf: 'A user can reach multiple levels without stairs (at least floors audited).',
    recommended: 'Floors'
  },
  'Accessible washroom': {
    definition: 'Washroom includes accessible stall/fixtures (space, grab bars, turning radius).',
    presentIf:
      'At least one washroom on the floor/building meets accessibility needs (as observed or signed).',
    recommended: 'Floors'
  },
  'Braille/tactile signage': {
    definition:
      'Signage includes braille and/or tactile lettering for wayfinding (rooms, washrooms, elevators).',
    presentIf: 'Common wayfinding signs include tactile/braille features.',
    recommended: 'Floors'
  },
  'High-contrast signage': {
    definition:
      'Signage uses high contrast between text and background; legible font; clear visibility.',
    presentIf: 'Prominent wayfinding signs appear high-contrast and readable.',
    recommended: 'Floors'
  },
  'Hearing loop / assistive listening': {
    definition: 'Assistive listening system available in key spaces (lecture halls, service counters).',
    presentIf: 'Posted availability or installed system is observed.',
    recommended: 'Floors'
  },
  'Visual alarm / strobe': {
    definition: 'Fire/emergency alarms include flashing strobes (not audio-only).',
    presentIf: 'Strobes are observed on the floor/building.',
    recommended: 'Floors'
  },
  'Accessible seating area': {
    definition:
      'Seating accommodates mobility devices and accessible routes (e.g., spaces for wheelchairs, companion seating).',
    presentIf:
      'Clear, designated accessible seating exists in common areas/classrooms as applicable.',
    recommended: 'Floors'
  },
  'Quiet/sensory-friendly space': {
    definition:
      'A quieter low-stimulation area exists (e.g., designated quiet room or low-sensory study zone).',
    presentIf: 'A designated quiet/sensory space is available and discoverable.',
    recommended: 'Floors'
  },
  'Gender-inclusive washroom': {
    definition: 'At least one gender-inclusive washroom exists (single-user or all-gender).',
    presentIf: 'Clear labeling/signage indicates gender-inclusive option.',
    recommended: 'Floors'
  },
  'Lactation/parent room': {
    definition: 'Dedicated lactation/parent room exists for feeding/expressing milk/care needs.',
    presentIf: 'Room is designated/posted or listed onsite.',
    recommended: 'Floors'
  },
  'Service animal relief area nearby': {
    definition: 'A nearby outdoor relief area suitable for service animals is available.',
    presentIf: 'There is a practical relief location near entrance (signed or obviously designated).',
    recommended: 'SITE'
  },
  'Accessible parking nearby': {
    definition: 'Accessible parking stalls exist near primary accessible route/entrance.',
    presentIf: 'Signed accessible stalls are observed close to the building access route.',
    recommended: 'SITE'
  },
  AED: {
    definition: 'Automated external defibrillator available and accessible.',
    presentIf: 'An AED cabinet or sign indicates an AED nearby.',
    recommended: 'Floors'
  },
  'Naloxone kit': {
    definition: 'Naloxone kit available for overdose response.',
    presentIf: 'A kit is visible or signage indicates availability.',
    recommended: 'Floors'
  },
  'Emergency intercom / emergency call': {
    definition: 'Emergency intercom or call box available.',
    presentIf: 'A call button or intercom is installed and labeled.',
    recommended: 'Floors'
  },
  'Fire extinguisher cabinet': {
    definition: 'Fire extinguisher stored in a cabinet or marked location.',
    presentIf: 'A cabinet or marked extinguisher location is visible and accessible.',
    recommended: 'Floors'
  },
  'Emergency wayfinding / guiding signage': {
    definition: 'Wayfinding signage for emergency exits or routes.',
    presentIf: 'Emergency route or exit signage is posted and visible.',
    recommended: 'Floors'
  },
  'Menstrual product dispenser': {
    definition: 'Menstrual product dispenser available in washrooms or common areas.',
    presentIf: 'A dispenser is visible and stocked or signed.',
    recommended: 'Floors'
  },
  'Infant change table': {
    definition: 'Infant change table available in a washroom or care space.',
    presentIf: 'A change table is installed and usable.',
    recommended: 'Floors'
  },
  'Wheelchair accessible shower': {
    definition: 'Shower with accessible entry and clear maneuvering space.',
    presentIf: 'A roll-in or accessible shower is present or clearly signed.',
    recommended: 'Floors'
  },
  ATM: {
    definition: 'ATM available on site.',
    presentIf: 'An ATM is installed and accessible.',
    recommended: 'Floors'
  },
  'Water fountain(s)': {
    definition: 'Drinking water fountain or bottle filler available.',
    presentIf: 'A fountain or bottle filler is present and usable.',
    recommended: 'Floors'
  },
  'Battery recycling': {
    definition: 'Battery recycling drop-off available.',
    presentIf: 'A labeled battery recycling bin is present.',
    recommended: 'Floors'
  },
  'Sharps disposal': {
    definition: 'Sharps disposal container available.',
    presentIf: 'A labeled sharps container is installed.',
    recommended: 'Floors'
  },
  'Scent-free area': {
    definition: 'Designated scent-free area to reduce allergens and sensitivities.',
    presentIf: 'Signage indicates a scent-free zone.',
    recommended: 'Floors'
  },
  'Prayer space': {
    definition: 'Dedicated prayer or reflection space available.',
    presentIf: 'A room is labeled or listed for prayer.',
    recommended: 'Floors'
  },
  'Ablution / wudu station': {
    definition: 'Ablution or wudu station for washing before prayer.',
    presentIf: 'A station or signage indicates an ablution area.',
    recommended: 'Floors'
  },
  'Kitchen/lounge / student commons': {
    definition: 'Shared kitchen, lounge, or student commons space available.',
    presentIf: 'A common space is available and labeled.',
    recommended: 'Floors'
  }
};

export const FEATURE_CATEGORIES: Array<{ label: string; features: FeatureLabel[] }> = [
  {
    label: 'Access & Entry',
    features: ['Step-free entrance', 'Automatic door', 'Ramp available', 'Elevator/lift']
  },
  {
    label: 'Washrooms & Care',
    features: ['Accessible washroom', 'Gender-inclusive washroom', 'Lactation/parent room']
  },
  {
    label: 'Wayfinding & Signage',
    features: ['Braille/tactile signage', 'High-contrast signage']
  },
  {
    label: 'Hearing & Vision Supports',
    features: ['Hearing loop / assistive listening', 'Visual alarm / strobe']
  },
  {
    label: 'Space Inclusivity',
    features: ['Accessible seating area', 'Quiet/sensory-friendly space']
  },
  {
    label: 'Exterior & Mobility',
    features: ['Service animal relief area nearby', 'Accessible parking nearby']
  }
];

export const RECOMMENDED_EXTRAS: FeatureLabel[] = [
  'Accessible service counter',
  'Automatic door on interior main routes',
  'Accessible drinking fountain',
  'Accessible route signage',
  'Accessible classroom/lecture seating',
  'Area of refuge / emergency egress signage',
  'Elevator has audible floor indicator',
  'Elevator has tactile/braille buttons',
  'Stair handrails (both sides)',
  'Non-slip flooring on main routes',
  'Wide corridors / turning space',
  'Accessible door hardware (lever handles)',
  'Accessible power outlets/charging',
  'Quiet waiting area',
  'Low-glare lighting',
  'Captioning/AV accessibility support posted',
  'Accessible lab/workstation',
  'Accessible library study desk',
  'Accessible vending machine reach',
  'Accessible intercom/call button'
];

export const CAMPUS_AUDIT_EXTRAS: FeatureLabel[] = [
  'AED',
  'Naloxone kit',
  'Emergency intercom / emergency call',
  'Fire extinguisher cabinet',
  'Emergency wayfinding / guiding signage',
  'Menstrual product dispenser',
  'Infant change table',
  'Wheelchair accessible shower',
  'ATM',
  'Water fountain(s)',
  'Battery recycling',
  'Sharps disposal',
  'Scent-free area',
  'Prayer space',
  'Ablution / wudu station',
  'Kitchen/lounge / student commons'
];

export const createDefaultConfig = (): Config => ({
  floors: [...DEFAULT_FLOORS],
  features: [...DEFAULT_FEATURES],
  version: CONFIG_VERSION
});
