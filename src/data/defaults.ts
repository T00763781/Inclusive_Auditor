import type { Config, FeatureLabel, FloorLabel } from './types';
import type { TabSpec } from './tabSpecs';
import { ALL_TAB_FEATURES, TAB_SPECS } from './tabSpecs';

export const CONFIG_VERSION = 4;

export const SITE_LABEL: FloorLabel = 'SITE';

export const DEFAULT_FLOORS: FloorLabel[] = ['B2', 'B1', '1', '2', '3', '4'];

export const DEFAULT_FEATURES: FeatureLabel[] = [...ALL_TAB_FEATURES];

const flattenTabFeatures = (tab: TabSpec): FeatureLabel[] =>
  tab.sections.flatMap((section) => [
    ...section.features,
    ...(section.subsections?.flatMap((subsection) => subsection.features) ?? [])
  ]);

const cultureTab = TAB_SPECS.find((tab) => tab.id === 'culture');
const CULTURE_FEATURES = cultureTab ? flattenTabFeatures(cultureTab) : [];

export const RECOMMENDED_SITE_FEATURES = new Set<FeatureLabel>([
  ...CULTURE_FEATURES,
  'Step-free entrance',
  'Accessible entrance clearly signed',
  'Automatic / power-assisted door',
  'Door width fits mobility devices',
  'Threshold / lip minimized',
  'Entrance lighting adequate',
  'Weather protection at entrance (awning/vestibule)',
  'Ramp available where needed',
  'Ramp slope manageable',
  'Ramp has handrails',
  'Ramp landing space adequate',
  'Accessible parking nearby',
  'Accessible drop-off zone nearby',
  'Curb cuts present and aligned',
  'Exterior pathways smooth and wide',
  'Exterior lighting adequate',
  'Service animal relief area nearby'
]);

const BASE_FEATURE_DEFINITIONS: Record<
  FeatureLabel,
  { definition: string; presentIf: string; recommended: 'SITE' | 'Floors' }
> = {
  'Step-free entrance': {
    definition:
      'At least one public entrance has an accessible route without stairs (level entry or ramped route).',
    presentIf:
      'An entrance can be used by a wheelchair or mobility aid user without stairs.',
    recommended: 'SITE'
  },
  'Accessible entrance clearly signed': {
    definition: 'Accessible entry is identified with clear signage from approach paths.',
    presentIf: 'Signs or wayfinding direct users to the accessible entrance.',
    recommended: 'SITE'
  },
  'Automatic / power-assisted door': {
    definition: 'Entrance door opens automatically or via power-assisted actuator.',
    presentIf: 'Powered opener or push-button at usable height is present and works.',
    recommended: 'SITE'
  },
  'Door width sufficient for mobility devices': {
    definition: 'Entrance doorway provides clear width for wheelchairs and scooters.',
    presentIf: 'Clear opening appears wide enough for mobility devices to pass.',
    recommended: 'SITE'
  },
  'Threshold / lip minimized': {
    definition: 'Entry threshold is low and does not create a barrier.',
    presentIf: 'No significant lip or step is present at the doorway.',
    recommended: 'SITE'
  },
  'Ramp available': {
    definition: 'A ramp exists where a level change would otherwise require stairs.',
    presentIf: 'A ramped route is available for public access.',
    recommended: 'SITE'
  },
  'Elevator / lift': {
    definition: 'Elevator or lift provides step-free vertical access between floors.',
    presentIf: 'A user can reach multiple levels without stairs.',
    recommended: 'Floors'
  },
  'Ramp slope compliant': {
    definition: 'Ramp slope is gentle and aligns with accessibility guidance.',
    presentIf: 'Ramp appears to be a safe, compliant incline.',
    recommended: 'SITE'
  },
  'Handrails present on ramp': {
    definition: 'Ramp includes handrails for support and stability.',
    presentIf: 'Handrails are installed on the ramp.',
    recommended: 'SITE'
  },
  'Entrance lighting adequate': {
    definition: 'Entrance area is well lit for visibility and safety.',
    presentIf: 'Lighting provides clear visibility at the entrance.',
    recommended: 'SITE'
  },
  'Weather protection at entrance': {
    definition: 'Awning or overhang provides shelter at the entrance.',
    presentIf: 'A canopy or overhang shields users from weather.',
    recommended: 'SITE'
  },
  'Elevator / lift available': {
    definition: 'Elevator or lift provides step-free vertical access between floors.',
    presentIf: 'A user can reach multiple levels without stairs.',
    recommended: 'Floors'
  },
  'Elevator reachable from accessible entrance': {
    definition: 'Accessible route connects the entrance to the elevator.',
    presentIf: 'A step-free route leads from the accessible entrance to the elevator.',
    recommended: 'Floors'
  },
  'Elevator door width adequate': {
    definition: 'Elevator door provides sufficient clear width for mobility devices.',
    presentIf: 'Door opening appears wide enough for wheelchair access.',
    recommended: 'Floors'
  },
  'Elevator braille / tactile controls': {
    definition: 'Elevator controls include braille or tactile markings.',
    presentIf: 'Buttons are labeled with braille or tactile indicators.',
    recommended: 'Floors'
  },
  'Elevator audible floor announcements': {
    definition: 'Elevator announces floors audibly.',
    presentIf: 'Voice or tone announcements indicate floor changes.',
    recommended: 'Floors'
  },
  'Elevator visual floor indicator': {
    definition: 'Elevator provides a visual floor indicator.',
    presentIf: 'A display or indicator shows the current floor.',
    recommended: 'Floors'
  },
  'Stair handrails both sides': {
    definition: 'Main stairs have handrails on both sides.',
    presentIf: 'Handrails are present on both sides of stairways.',
    recommended: 'Floors'
  },
  'Stair edge contrast / nosing visible': {
    definition: 'Stair nosings are visible with contrasting edge treatment.',
    presentIf: 'Edges are clearly visible or have contrast markings.',
    recommended: 'Floors'
  },
  'Accessible washroom': {
    definition: 'Washroom includes accessible stall/fixtures (space, grab bars, turning radius).',
    presentIf:
      'At least one washroom on the floor/building meets accessibility needs (as observed or signed).',
    recommended: 'Floors'
  },
  'Universal / family washroom': {
    definition: 'Single-user or family washroom accessible to all genders.',
    presentIf: 'Universal or family washroom is posted or available.',
    recommended: 'Floors'
  },
  'Gender-inclusive washroom': {
    definition: 'At least one gender-inclusive washroom exists (single-user or all-gender).',
    presentIf: 'Clear labeling/signage indicates gender-inclusive option.',
    recommended: 'Floors'
  },
  'Wheelchair accessible shower': {
    definition: 'Shower with accessible entry and clear maneuvering space.',
    presentIf: 'A roll-in or accessible shower is present or clearly signed.',
    recommended: 'Floors'
  },
  'Adult change table': {
    definition: 'Adult-sized change table is available and accessible.',
    presentIf: 'A fixed adult change table is installed and usable.',
    recommended: 'Floors'
  },
  'Infant change table': {
    definition: 'Infant change table available in a washroom or care space.',
    presentIf: 'A change table is installed and usable.',
    recommended: 'Floors'
  },
  'Grab bars present and compliant': {
    definition: 'Grab bars are installed at accessible fixtures.',
    presentIf: 'Grab bars are present and appear properly positioned.',
    recommended: 'Floors'
  },
  'Sink clearance adequate': {
    definition: 'Sink area provides knee and toe clearance for seated users.',
    presentIf: 'Clearance under sink appears sufficient for wheelchair access.',
    recommended: 'Floors'
  },
  'Mirror reachable from seated position': {
    definition: 'Mirror height allows viewing from a seated position.',
    presentIf: 'Mirror height or tilt is usable from a seated position.',
    recommended: 'Floors'
  },
  'Braille / tactile signage': {
    definition:
      'Signage includes braille and tactile lettering for wayfinding (rooms, washrooms, elevators).',
    presentIf: 'Common wayfinding signs include tactile or braille features.',
    recommended: 'Floors'
  },
  'High-contrast signage': {
    definition:
      'Signage uses high contrast between text and background; legible font; clear visibility.',
    presentIf: 'Prominent wayfinding signs appear high-contrast and readable.',
    recommended: 'Floors'
  },
  'Consistent wayfinding language': {
    definition: 'Wayfinding uses consistent terms, icons, and destinations.',
    presentIf: 'Directional language appears consistent across signs.',
    recommended: 'Floors'
  },
  'Accessible maps / directories': {
    definition: 'Maps or directories are available in accessible formats.',
    presentIf: 'Directory is readable at accessible height or has accessible formats.',
    recommended: 'Floors'
  },
  'Directional signage to accessible routes': {
    definition: 'Signs direct users to accessible routes, entrances, or elevators.',
    presentIf: 'Directional signage indicates accessible routes.',
    recommended: 'Floors'
  },
  'Emergency wayfinding / guiding signage': {
    definition: 'Wayfinding signage for emergency exits or routes.',
    presentIf: 'Emergency route or exit signage is posted and visible.',
    recommended: 'Floors'
  },
  'Hearing loop / assistive listening system': {
    definition: 'Assistive listening system is available in key spaces.',
    presentIf: 'System is installed or posted as available.',
    recommended: 'Floors'
  },
  'Assistive listening clearly signed': {
    definition: 'Signage indicates assistive listening availability.',
    presentIf: 'Signs show assistive listening support is available.',
    recommended: 'Floors'
  },
  'Captioned displays / media': {
    definition: 'Public displays or media provide captions.',
    presentIf: 'Captions are enabled or available on public media.',
    recommended: 'Floors'
  },
  'Visual alarm / strobe': {
    definition: 'Fire/emergency alarms include flashing strobes (not audio-only).',
    presentIf: 'Strobes are observed on the floor/building.',
    recommended: 'Floors'
  },
  'Audible alarms present': {
    definition: 'Alarms include audible signals.',
    presentIf: 'Audible alarms are present or indicated.',
    recommended: 'Floors'
  },
  'Accessible seating area': {
    definition:
      'Seating accommodates mobility devices and accessible routes (e.g., spaces for wheelchairs, companion seating).',
    presentIf:
      'Clear, designated accessible seating exists in common areas/classrooms as applicable.',
    recommended: 'Floors'
  },
  'Seating with armrests available': {
    definition: 'Seating with armrests is available in common areas.',
    presentIf: 'Chairs with armrests are available.',
    recommended: 'Floors'
  },
  'Space for mobility devices in common areas': {
    definition: 'Common areas provide space for mobility devices.',
    presentIf: 'Clear floor space or designated areas exist.',
    recommended: 'Floors'
  },
  'Quiet / sensory-friendly space': {
    definition:
      'A quieter low-stimulation area exists (e.g., designated quiet room or low-sensory study zone).',
    presentIf: 'A designated quiet or sensory space is available and discoverable.',
    recommended: 'Floors'
  },
  'Low-stimulation waiting area': {
    definition: 'Waiting area reduces sensory stimulation.',
    presentIf: 'A designated low-stimulation waiting area is present.',
    recommended: 'Floors'
  },
  'Lactation / parent room': {
    definition: 'Dedicated lactation/parent room exists for feeding or care needs.',
    presentIf: 'Room is designated, posted, or listed onsite.',
    recommended: 'Floors'
  },
  'Prayer / reflection space': {
    definition: 'Dedicated prayer or reflection space available.',
    presentIf: 'A room is labeled or listed for prayer or reflection.',
    recommended: 'Floors'
  },
  'Ablution / wudu station': {
    definition: 'Ablution or wudu station for washing before prayer.',
    presentIf: 'A station or signage indicates an ablution area.',
    recommended: 'Floors'
  },
  'Accessible parking nearby': {
    definition: 'Accessible parking stalls exist near primary accessible route/entrance.',
    presentIf: 'Signed accessible stalls are observed close to the building access route.',
    recommended: 'SITE'
  },
  'Accessible drop-off zone': {
    definition: 'Designated accessible drop-off zone is available.',
    presentIf: 'Drop-off zone is signed or marked and provides step-free access.',
    recommended: 'SITE'
  },
  'Curb cuts present and aligned': {
    definition: 'Curb cuts are present and aligned with crossings.',
    presentIf: 'Curb ramps exist and line up with crosswalks or pathways.',
    recommended: 'SITE'
  },
  'Exterior pathways smooth and wide': {
    definition: 'Exterior pathways are smooth and wide enough for mobility devices.',
    presentIf: 'Paths appear even, stable, and wide for wheelchairs.',
    recommended: 'SITE'
  },
  'Exterior lighting adequate': {
    definition: 'Exterior lighting provides safe visibility.',
    presentIf: 'Pathways and entrances are well lit.',
    recommended: 'SITE'
  },
  'Service animal relief area nearby': {
    definition: 'A nearby outdoor relief area suitable for service animals is available.',
    presentIf: 'There is a practical relief location near entrance (signed or designated).',
    recommended: 'SITE'
  },
  'Emergency intercom / call button': {
    definition: 'Emergency intercom or call button is available.',
    presentIf: 'A call button or intercom is installed and labeled.',
    recommended: 'Floors'
  },
  'Area of refuge / rescue assistance': {
    definition: 'Area of refuge or rescue assistance location is designated.',
    presentIf: 'Area of refuge signage or designated location is present.',
    recommended: 'Floors'
  },
  'Emergency procedures in accessible format': {
    definition: 'Emergency procedures are provided in accessible formats.',
    presentIf: 'Procedures are posted in accessible text or alternate formats.',
    recommended: 'Floors'
  },
  'AED present': {
    definition: 'Automated external defibrillator available and accessible.',
    presentIf: 'An AED cabinet or sign indicates an AED nearby.',
    recommended: 'Floors'
  },
  'Naloxone kit present': {
    definition: 'Naloxone kit available for overdose response.',
    presentIf: 'A kit is visible or signage indicates availability.',
    recommended: 'Floors'
  },
  'Fire extinguisher cabinet accessible': {
    definition: 'Fire extinguisher cabinet is accessible and reachable.',
    presentIf: 'A cabinet or marked extinguisher location is visible and accessible.',
    recommended: 'Floors'
  },
  'Emergency exits accessible': {
    definition: 'Emergency exits are accessible and have step-free routes.',
    presentIf: 'Exit routes are accessible and clearly signed.',
    recommended: 'Floors'
  },
  'Water fountain(s) accessible': {
    definition: 'Drinking water fountain or bottle filler is accessible.',
    presentIf: 'A fountain or bottle filler is present at accessible height.',
    recommended: 'Floors'
  },
  'Bottle filling station accessible': {
    definition: 'Bottle filling station is available and reachable.',
    presentIf: 'Bottle filler is present at accessible height.',
    recommended: 'Floors'
  },
  'ATM accessible': {
    definition: 'ATM is accessible for users with mobility devices.',
    presentIf: 'ATM is reachable with clear floor space.',
    recommended: 'Floors'
  },
  'Kitchen / lounge / student commons accessible': {
    definition: 'Shared kitchen, lounge, or student commons is accessible.',
    presentIf: 'Common space is available and usable with step-free access.',
    recommended: 'Floors'
  },
  'Kitchen / lounge / student commons': {
    definition: 'Shared kitchen, lounge, or student commons space is available.',
    presentIf: 'Common space is available and labeled.',
    recommended: 'Floors'
  },
  'Menstrual product dispenser': {
    definition: 'Menstrual product dispenser available in washrooms or common areas.',
    presentIf: 'A dispenser is visible and stocked or signed.',
    recommended: 'Floors'
  },
  'Gender-neutral signage present': {
    definition: 'Washroom signage indicates gender-neutral use.',
    presentIf: 'Gender-neutral signage is posted at the washroom entrance.',
    recommended: 'Floors'
  },
  'Signage clearly visible from corridor': {
    definition: 'Signage is visible from the corridor or approach.',
    presentIf: 'Signage can be seen clearly before entering the washroom.',
    recommended: 'Floors'
  },
  'Signage uses inclusive language': {
    definition: 'Signage uses inclusive and respectful language.',
    presentIf: 'Signage wording reflects inclusive language.',
    recommended: 'Floors'
  },
  'Single-user washroom labeled gender-neutral': {
    definition: 'Single-user washroom is labeled as gender-neutral.',
    presentIf: 'Labeling indicates the single-user washroom is gender-neutral.',
    recommended: 'Floors'
  },
  'Accessibility + gender-neutral signage combined correctly': {
    definition: 'Accessible and gender-neutral signage are combined correctly.',
    presentIf: 'Signage reflects both accessibility and gender-neutral status.',
    recommended: 'Floors'
  },
  'Sharps disposal': {
    definition: 'Sharps disposal container available.',
    presentIf: 'A labeled sharps container is installed.',
    recommended: 'Floors'
  },
  'Scent-free area identified': {
    definition: 'Designated scent-free area to reduce allergens and sensitivities.',
    presentIf: 'Signage indicates a scent-free zone.',
    recommended: 'Floors'
  },
  'Battery recycling': {
    definition: 'Battery recycling drop-off available.',
    presentIf: 'A labeled battery recycling bin is present.',
    recommended: 'Floors'
  },
  'Accessible service counter height': {
    definition: 'Service counter includes an accessible-height section.',
    presentIf: 'Counter has a lower section or reachable surface.',
    recommended: 'Floors'
  },
  'Assistive technology loaners available': {
    definition: 'Assistive technology loaners are available.',
    presentIf: 'Signage or staff indicate loaners are available.',
    recommended: 'Floors'
  },
  'Public computers accessible': {
    definition: 'Public computers are accessible and usable with assistive needs.',
    presentIf: 'Accessible workstation or setup is available.',
    recommended: 'Floors'
  },
  'Charging outlets reachable': {
    definition: 'Charging outlets are reachable from a seated position.',
    presentIf: 'Outlets are located at accessible height and clear space.',
    recommended: 'Floors'
  },
  'Accessibility Services': {
    definition: 'Accessibility Services location is available for student support.',
    presentIf: 'A physical Accessibility Services space is present or signed.',
    recommended: 'Floors'
  },
  'Academic Advising': {
    definition: 'Academic Advising location is available for student guidance.',
    presentIf: 'Academic Advising space is present or signed.',
    recommended: 'Floors'
  },
  'Assessment Centre': {
    definition: 'Assessment Centre location is available for testing support.',
    presentIf: 'Assessment Centre space is present or signed.',
    recommended: 'Floors'
  },
  'Supplemental Learning': {
    definition: 'Supplemental Learning support location is available.',
    presentIf: 'Supplemental Learning space is present or signed.',
    recommended: 'Floors'
  },
  'Writing Centre': {
    definition: 'Writing Centre location is available for writing support.',
    presentIf: 'Writing Centre space is present or signed.',
    recommended: 'Floors'
  },
  'Language Learning Centre': {
    definition: 'Language Learning Centre location is available for language support.',
    presentIf: 'Language Learning Centre space is present or signed.',
    recommended: 'Floors'
  },
  'Math Help Centre': {
    definition: 'Math Help Centre location is available for math support.',
    presentIf: 'Math Help Centre space is present or signed.',
    recommended: 'Floors'
  },
  'TRU Library': {
    definition: 'Library location is available for student use and support.',
    presentIf: 'Library space is present or signed.',
    recommended: 'Floors'
  },
  'Counselling Services': {
    definition: 'Counselling Services location is available for student support.',
    presentIf: 'Counselling Services space is present or signed.',
    recommended: 'Floors'
  },
  'Wellness Centre / Medical Clinic': {
    definition: 'Wellness Centre or Medical Clinic location is available.',
    presentIf: 'Wellness Centre or Medical Clinic space is present or signed.',
    recommended: 'Floors'
  },
  'Student Awards & Financial Aid': {
    definition: 'Student Awards and Financial Aid location is available.',
    presentIf: 'Awards and Financial Aid space is present or signed.',
    recommended: 'Floors'
  },
  'Student Services / Student Affairs': {
    definition: 'Student Services or Student Affairs location is available.',
    presentIf: 'Student Services or Student Affairs space is present or signed.',
    recommended: 'Floors'
  },
  "Cplul'kw'ten Indigenous Centre": {
    definition: 'Indigenous Centre location is available for student support.',
    presentIf: 'Indigenous Centre space is present or signed.',
    recommended: 'Floors'
  },
  'Career & Experiential Learning Services': {
    definition: 'Career and Experiential Learning Services location is available.',
    presentIf: 'Career and Experiential Learning space is present or signed.',
    recommended: 'Floors'
  },
  'Early Alert / Student Referral Support': {
    definition: 'Early Alert or Student Referral Support location is available.',
    presentIf: 'Early Alert or Student Referral Support space is present or signed.',
    recommended: 'Floors'
  },
  // Legacy feature labels used in older audits.
  'Automatic door': {
    definition: 'Door opens automatically or via accessible push-button.',
    presentIf: 'Main/public door has powered opener or accessible actuator at usable height.',
    recommended: 'SITE'
  },
  'Elevator/lift': {
    definition: 'Elevator/lift provides step-free vertical access between floors.',
    presentIf: 'A user can reach multiple levels without stairs (at least floors audited).',
    recommended: 'Floors'
  },
  'Braille/tactile signage': {
    definition:
      'Signage includes braille and/or tactile lettering for wayfinding (rooms, washrooms, elevators).',
    presentIf: 'Common wayfinding signs include tactile/braille features.',
    recommended: 'Floors'
  },
  'Hearing loop / assistive listening': {
    definition: 'Assistive listening system available in key spaces (lecture halls, service counters).',
    presentIf: 'Posted availability or installed system is observed.',
    recommended: 'Floors'
  },
  'Quiet/sensory-friendly space': {
    definition:
      'A quieter low-stimulation area exists (e.g., designated quiet room or low-sensory study zone).',
    presentIf: 'A designated quiet/sensory space is available and discoverable.',
    recommended: 'Floors'
  },
  'Lactation/parent room': {
    definition: 'Dedicated lactation/parent room exists for feeding/expressing milk/care needs.',
    presentIf: 'Room is designated/posted or listed onsite.',
    recommended: 'Floors'
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
  'Kitchen/lounge / student commons': {
    definition: 'Shared kitchen, lounge, or student commons space available.',
    presentIf: 'A common space is available and labeled.',
    recommended: 'Floors'
  }
};

const buildFeatureDefinitions = (): Record<
  FeatureLabel,
  { definition: string; presentIf: string; recommended: 'SITE' | 'Floors' }
> => {
  const definitions: Record<
    FeatureLabel,
    { definition: string; presentIf: string; recommended: 'SITE' | 'Floors' }
  > = { ...BASE_FEATURE_DEFINITIONS };

  for (const feature of ALL_TAB_FEATURES) {
    if (!definitions[feature]) {
      const recommended = RECOMMENDED_SITE_FEATURES.has(feature) ? 'SITE' : 'Floors';
      definitions[feature] = {
        definition: `${feature} is available or clearly indicated.`,
        presentIf: 'Observed as available.',
        recommended
      };
    }
  }

  return definitions;
};

export const FEATURE_DEFINITIONS = buildFeatureDefinitions();

export const createDefaultConfig = (): Config => ({
  floors: [...DEFAULT_FLOORS],
  features: [...DEFAULT_FEATURES],
  version: CONFIG_VERSION
});
