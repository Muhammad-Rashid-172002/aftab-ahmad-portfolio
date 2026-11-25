import type {
  ChainNode,
  ExperienceItem,
  ExpertiseCategory,
  Profile,
  Project,
} from '../types/portfolio';

/* ------------------------------------------------------------------------ */
/*  PROFILE — single source of truth for identity & contact information     */
/* ------------------------------------------------------------------------ */

export const profile: Profile = {
  name: 'Aftab Ahmed',
  monogram: 'AA',
  title: 'Telecommunications Engineer',
  role: 'Site Engineer / Project Specialist',
  affiliation: 'Huawei Pakistan',
  projectAssociation: 'Jazz Telecom Rollout',
  location: 'Pakistan',
  institution: 'University of Engineering & Technology (UET) Mardan',
  institutionShort: 'UET Mardan',
  degree: 'B.Sc. Telecommunications Engineering',
  primaryDomain: 'Microwave Transmission',
  platforms: 'Huawei RTN 905 / 950 / 980',
  research: 'Sub-MHz Wireless Power Transfer for Implantable Neurostimulators',
  email: 'aftabahmedmp456@gmail.com',
  // Carried over from the existing project configuration. Replace with the
  // exact public profile URL, or set to '' to hide every LinkedIn link.
  linkedinUrl: 'https://linkedin.com/in/aftab-ahmed-telecom',
  portrait: {
    src: '/assets/aistudio/aftab-portrait.webp',
    srcSmall: '/assets/aistudio/aftab-portrait-sm.webp',
    fallback: '/assets/aistudio/image_a8426a3e.png',
    alt: 'Portrait of Aftab Ahmed, Telecommunications Engineer, wearing a navy suit and tie',
    width: 826,
    height: 1062,
  },
  // Generated from this file by `npm run cv` (scripts/generate-cv.ts).
  resumePdfUrl: '/Aftab-Ahmed-CV.pdf',
  resumePdfFilename: 'Aftab-Ahmed-CV.pdf',
};

export const hero = {
  headline: ['Connecting Networks.', 'Engineering Possibilities.'],
  description:
    "I'm Aftab Ahmed, a Telecommunications Engineer working across microwave transmission, telecom infrastructure, network operations, and wireless power transfer research.",
};

export const navItems = [
  { id: 'work', label: 'Work' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'contact', label: 'Contact' },
] as const;

/* ------------------------------------------------------------------------ */
/*  SELECTED ENGINEERING PROJECTS                                           */
/* ------------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    id: 'wpt',
    number: '01',
    kind: 'Academic Research · UET Mardan',
    title: 'Wireless Power Transfer for Implantable Neurostimulators',
    description:
      'Academic engineering research conducted at UET Mardan exploring low-frequency inductive wireless power transmission for powering implantable neurostimulators without percutaneous wiring.',
    context:
      'An external transmitter coil and an implanted receiver coil exchange energy through a shared, time-varying magnetic field. Both sides are tuned to the same resonant frequency so that energy transfer holds up across tissue, separation and misalignment.',
    competencies: [
      'Near-field magnetic resonance',
      'Mutual inductance modeling',
      'Planar spiral coil optimization',
      'Electromagnetic simulation and analytical modeling',
    ],
    viz: 'coil',
    hotspots: [
      {
        id: 'tx',
        label: 'Transmitter coil',
        detail:
          'External planar spiral driven by an AC source at the resonant frequency. Its geometry — turns, pitch, inner/outer diameter — sets self-inductance and the field profile reaching the implant.',
      },
      {
        id: 'rx',
        label: 'Receiving coil',
        detail:
          'Compact planar spiral inside the implant. Size is constrained by the device, so the design trades coil area against coupling to the external transmitter.',
      },
      {
        id: 'gap',
        label: 'Coupling distance',
        detail:
          'Axial separation through tissue. Mutual inductance — and with it the coupling factor k — falls rapidly as the gap grows relative to coil radius.',
      },
      {
        id: 'angle',
        label: 'Angular alignment',
        detail:
          'Tilt between the coil planes reduces the flux that threads the receiver. Misalignment tolerance is a key practical design constraint for implants.',
      },
      {
        id: 'tank',
        label: 'Resonant circuit',
        detail:
          'Compensation capacitors form LC tanks on both sides, cancelling coil reactance at the operating frequency so the link transfers real power efficiently.',
      },
    ],
    integrityNote:
      'Academic research and simulation model. Not a clinically validated or commercially deployed device.',
  },
  {
    id: 'microwave',
    number: '02',
    kind: 'Field Engineering · Huawei Pakistan',
    title: 'Microwave Transmission & Link Operations',
    description:
      'Hands-on field engineering involving Huawei RTN microwave transmission platforms supporting Jazz mobile network infrastructure.',
    context:
      'Point-to-point microwave links carry mobile backhaul traffic between sites. Each link depends on an unobstructed path, precisely aligned antennas, correctly configured radio equipment and coordinated cutover with the network operations team.',
    competencies: [
      'Huawei RTN 905 / 950 / 980 commissioning',
      'Antenna azimuth and elevation alignment',
      'Receive Signal Level (RSL) optimization',
      'Line-of-Sight and Fresnel-zone assessment',
    ],
    viz: 'link',
    hotspots: [
      {
        id: 'idu',
        label: 'RTN indoor unit',
        detail:
          'Huawei RTN 905 / 950 / 980 equipment handling service interfaces, cross-connect and radio configuration — provisioned and diagnosed through WebLCT.',
      },
      {
        id: 'if',
        label: 'IF cable',
        detail:
          'Coaxial run between indoor and outdoor units in split-mount installations. Connector quality, weatherproofing and grounding are frequent fault points.',
      },
      {
        id: 'odu',
        label: 'Outdoor radio unit',
        detail:
          'RF transceiver mounted at the antenna. Frequency, sub-band, polarization and transmit power must match the link plan on both ends.',
      },
      {
        id: 'dish',
        label: 'Parabolic antenna',
        detail:
          'High-gain directional dish. Azimuth and elevation are panned on the main lobe until the measured RSL meets the planned value.',
      },
      {
        id: 'path',
        label: 'LOS / Fresnel zone',
        detail:
          'The first Fresnel zone around the direct path should be clear of terrain, buildings and vegetation to avoid diffraction loss.',
      },
    ],
  },
  {
    id: 'site',
    number: '03',
    kind: 'Telecom Infrastructure · Project Delivery',
    title: 'Telecom Site Deployment & Acceptance',
    description:
      'Telecommunications site deployment and acceptance activities spanning physical infrastructure, equipment integration, quality verification, and project documentation.',
    context:
      'A site is only accepted when every physical element — antennas, radio units, interconnects, grounding and cabinet — matches the design and is documented. Acceptance work links field execution to the project record.',
    competencies: [
      'ISDP digital delivery documentation',
      'Sector azimuth verification',
      'Electrical and mechanical tilt checks',
      'RRU / BBU jumper interconnection',
    ],
    viz: 'site',
    hotspots: [
      {
        id: 'sectors',
        label: 'Antenna sectors',
        detail:
          'Sector antennas are checked against the planned azimuth and mechanical / electrical tilt using compass and inclinometer readings.',
      },
      {
        id: 'rru',
        label: 'RRU',
        detail:
          'Remote radio units mounted near the antennas. RF jumpers connect each RRU to its sector antenna; connectors are torqued and weather-sealed.',
      },
      {
        id: 'fiber',
        label: 'Fiber & power runs',
        detail:
          'Optical fiber links each RRU to the baseband unit; DC power feeds run alongside. Routing, clamping and bend radius are inspected.',
      },
      {
        id: 'bbu',
        label: 'BBU & cabinet',
        detail:
          'Baseband unit and power equipment inside the cabinet. Port mapping and labeling are verified against the design.',
      },
      {
        id: 'ground',
        label: 'Grounding',
        detail:
          'Equipment, feeders and the tower are bonded to the site earthing system. Grounding points are photographed for acceptance records.',
      },
      {
        id: 'isdp',
        label: 'ISDP record',
        detail:
          'Inspection photos and checklists are uploaded to ISDP so the site can move through digital acceptance.',
      },
    ],
  },
];

/* ------------------------------------------------------------------------ */
/*  HUAWEI RTN MICROWAVE TRANSMISSION CHAIN                                 */
/* ------------------------------------------------------------------------ */

export const chainNodes: ChainNode[] = [
  {
    id: 'tx-idu',
    short: 'IDU',
    label: 'TX terminal / IDU',
    name: 'Transmitting terminal / IDU',
    side: 'tx',
    role: 'Indoor equipment (Huawei RTN 905 / 950 / 980) where traffic enters the radio link. Handles service ports, cross-connections and radio configuration.',
    parameters: ['Service interfaces (Ethernet / TDM per configuration)', 'Modulation & channel bandwidth per link plan', 'NE IP / DCN management addressing'],
    installation: ['Rack mounting and power feed', 'Board / port allocation per design', 'WebLCT provisioning of services and radio parameters'],
    troubleshooting: ['Active alarms in WebLCT', 'Port / service configuration mismatch', 'Loopback tests to isolate faults'],
  },
  {
    id: 'tx-if',
    short: 'IF',
    label: 'IF cable',
    name: 'IF connection',
    side: 'tx',
    role: 'Coaxial cable between indoor and outdoor units in a split-mount installation, carrying the IF signal, ODU power and management signalling.',
    parameters: ['Cable type and length per installation', 'Connector type and termination quality'],
    installation: ['Proper connector crimping', 'Weatherproofing of outdoor connectors', 'Grounding kits and surge protection'],
    troubleshooting: ['Water ingress at connectors', 'Damaged or over-bent cable', 'IF-related alarms on the IDU'],
  },
  {
    id: 'tx-odu',
    short: 'ODU',
    label: 'TX radio / ODU',
    name: 'Outdoor radio unit / ODU',
    side: 'tx',
    role: 'RF transceiver at the antenna that converts the IF signal to the microwave carrier and amplifies it for transmission.',
    parameters: ['Frequency band and sub-band', 'Tx / Rx frequency pairing', 'Transmit power / ATPC settings'],
    installation: ['Secure mounting to antenna interface', 'Polarization matched to far end', 'Weather-sealed connections'],
    troubleshooting: ['Wrong sub-band or frequency pair', 'Tx power alarms', 'Hardware fault indications'],
  },
  {
    id: 'tx-ant',
    short: 'ANT',
    label: 'TX antenna',
    name: 'Parabolic dish antenna',
    side: 'tx',
    role: 'Directional antenna that focuses transmitted energy into a narrow beam toward the far-end site.',
    parameters: ['Dish diameter (reference sizes 0.3 – 1.8 m)', 'Gain, beamwidth and polarization', 'Azimuth / elevation per path plan'],
    installation: ['Rigid mount on the pole / tower', 'Coarse then fine azimuth and elevation pan', 'Lock all adjustment bolts after alignment'],
    troubleshooting: ['Alignment on a side lobe', 'Mount drift from wind loading', 'Polarization mismatch'],
  },
  {
    id: 'path',
    short: 'PATH',
    label: 'MW path',
    name: 'Point-to-point microwave path',
    side: 'path',
    role: 'The line-of-sight radio path between the two antennas. Its clearance and length set propagation losses and fade behaviour.',
    parameters: ['Path length and free-space loss', 'First Fresnel-zone clearance', 'Fade margin in the link budget'],
    installation: ['Line-of-Sight survey', 'Obstruction check along the path profile'],
    troubleshooting: ['New obstructions (buildings, trees)', 'Rain fade at higher bands', 'Multipath / reflection effects'],
  },
  {
    id: 'rx-ant',
    short: 'ANT',
    label: 'RX antenna',
    name: 'Receiving dish antenna',
    side: 'rx',
    role: 'Collects the incoming beam and focuses it into the receiving radio unit. Its alignment directly determines the measured RSL.',
    parameters: ['Matched polarization', 'Azimuth / elevation toward far end'],
    installation: ['Fine alignment while monitoring RSL', 'Mechanical lock-down'],
    troubleshooting: ['RSL below planned value', 'Unstable RSL indicating mount movement'],
  },
  {
    id: 'rx-odu',
    short: 'ODU',
    label: 'RX radio / ODU',
    name: 'Receiving ODU',
    side: 'rx',
    role: 'Receives and down-converts the microwave signal to IF for the indoor unit; reports the receive signal level.',
    parameters: ['Receive Signal Level (RSL)', 'Frequency pairing with far-end ODU'],
    installation: ['Correct polarization orientation', 'Weatherproofed connections'],
    troubleshooting: ['RSL deviation from plan', 'Interference indications', 'Receiver-related alarms'],
  },
  {
    id: 'rx-if',
    short: 'IF',
    label: 'IF cable',
    name: 'Receiving IF connection',
    side: 'rx',
    role: 'Coaxial link from the receiving ODU to the indoor unit.',
    parameters: ['Cable type and length', 'Connector termination'],
    installation: ['Cable routing and clamping', 'Grounding at entry points'],
    troubleshooting: ['Connector faults', 'Moisture or physical damage'],
  },
  {
    id: 'rx-idu',
    short: 'IDU',
    label: 'RX terminal / IDU',
    name: 'Receiving terminal / IDU',
    side: 'rx',
    role: 'Demodulates the radio signal and hands traffic to the local service ports.',
    parameters: ['Matching radio configuration', 'Service mapping to ports'],
    installation: ['WebLCT configuration consistent with far end', 'Service verification'],
    troubleshooting: ['Configuration mismatch between ends', 'Errors or alarms on the radio link'],
  },
  {
    id: 'net',
    short: 'NET',
    label: 'Transport network',
    name: 'Downstream transport network',
    side: 'network',
    role: 'Onward transport toward aggregation and the core network. Management traffic reaches the NOC through the DCN.',
    parameters: ['Service handover to transport', 'DCN reachability for remote management'],
    installation: ['Cutover coordination with NOC', 'End-to-end service verification'],
    troubleshooting: ['NE not reachable over DCN', 'Service not passing end-to-end'],
  },
];

/** Supplied antenna reference specifications — not universal guarantees. */
export const antennaReference = {
  dishSizes: ['0.3 m', '0.6 m', '1.2 m', '1.8 m'],
  gain: 'approx. 32 – 48 dBi, depending on configuration',
  frontToBack: '> 60 dB (supplied reference)',
  xpd: '> 30 dB (supplied reference)',
  beamwidth: 'approx. 1.2° – 2.8°, depending on aperture and model',
};

/* ------------------------------------------------------------------------ */
/*  ENGINEERING EXPERTISE                                                    */
/* ------------------------------------------------------------------------ */

export const expertise: ExpertiseCategory[] = [
  {
    id: 'microwave',
    code: 'A',
    title: 'Microwave Transmission',
    summary: 'Commissioning and optimizing point-to-point radio links on Huawei RTN platforms.',
    items: [
      { name: 'Huawei RTN 905 / 950 / 980', note: 'Hardware setup and configuration of RTN transmission equipment.' },
      { name: 'Microwave radio link commissioning', note: 'Bringing new links into service to the planned configuration.' },
      { name: 'Antenna alignment', note: 'Azimuth and elevation panning onto the main lobe.' },
      { name: 'ODU / IDU / IF cabling', note: 'Split-mount interconnection, sealing and grounding.' },
      { name: 'RSL monitoring', note: 'Comparing measured receive level against the planned value.' },
      { name: 'LOS verification', note: 'Confirming a clear line of sight between sites.' },
      { name: 'Fresnel-zone clearance', note: 'Checking the path profile for obstructions near the beam.' },
      { name: 'Link-budget analysis', note: 'Relating gains, losses and fade margin to expected RSL.' },
      { name: 'WebLCT configuration', note: 'Local NE management, provisioning and diagnostics.' },
      { name: 'Modulation and service provisioning', note: 'Setting radio modulation and mapping services to ports.' },
    ],
  },
  {
    id: 'operations',
    code: 'B',
    title: 'Telecom Operations',
    summary: 'Keeping deployments coordinated with the NOC and moving faults to resolution.',
    items: [
      { name: 'Field deployment coordination', note: 'Aligning field teams, materials and timelines.' },
      { name: 'Network troubleshooting', note: 'Structured fault isolation from physical layer upward.' },
      { name: 'NOC coordination', note: 'Working with operations centre teams during activities.' },
      { name: 'DCN routing exposure', note: 'Management network reachability for network elements.' },
      { name: 'Alarm investigation', note: 'Tracing alarms to their root cause.' },
      { name: 'Service cutover coordination', note: 'Planned switchover of traffic to new paths.' },
      { name: 'Site acceptance and documentation', note: 'Closing activities with complete records.' },
    ],
  },
  {
    id: 'infrastructure',
    code: 'C',
    title: 'Infrastructure & Field Operations',
    summary: 'Physical installation quality — the part of the network you can touch.',
    items: [
      { name: 'Site surveys', note: 'Assessing site readiness and installation constraints.' },
      { name: 'Antenna mounting and sector verification', note: 'Mounts, azimuths and tilts against design.' },
      { name: 'RRU / BBU interconnections', note: 'Fiber and power links between radio and baseband.' },
      { name: 'Cable routing and weatherproofing', note: 'Clean routing, clamping and sealed connectors.' },
      { name: 'Grounding and installation checks', note: 'Bonding to the site earthing system.' },
      { name: 'ISDP documentation', note: 'Digital delivery records for acceptance.' },
    ],
  },
  {
    id: 'research',
    code: 'D',
    title: 'Research & Simulation',
    summary: 'Electromagnetic modeling from the final-year research at UET Mardan.',
    items: [
      { name: 'Resonant inductive coupling', note: 'Energy transfer between tuned LC circuits.' },
      { name: 'Mutual inductance', note: 'How coil geometry and spacing set coupling.' },
      { name: 'Planar spiral coil design', note: 'Turns, pitch and diameter trade-offs.' },
      { name: 'Electromagnetic field analysis', note: 'Field distribution between and around coils.' },
      { name: 'Wireless power transfer', note: 'Near-field power delivery principles.' },
      { name: 'Biomedical device energy-transfer concepts', note: 'Constraints specific to implantable devices.' },
    ],
  },
];

/* ------------------------------------------------------------------------ */
/*  PROFESSIONAL EXPERIENCE (undated — no dates were supplied)              */
/* ------------------------------------------------------------------------ */

export const experience: ExperienceItem[] = [
  {
    id: 'huawei',
    organization: 'Huawei Pakistan',
    role: 'Site Engineer / Project Specialist',
    type: 'Current',
    context: 'Jazz Telecom Infrastructure Projects',
    points: [
      'Microwave link installation and commissioning.',
      'RSL optimization and LOS verification.',
      'Huawei RTN equipment configuration.',
      'WebLCT-based provisioning and diagnostics.',
      'NOC coordination and alarm rectification.',
      'Site surveys, mounting checks, cable routing, and acceptance documentation.',
    ],
    systems: ['Huawei RTN 905 / 950 / 980', 'WebLCT', 'ISDP', 'ODU / IDU', 'RSL / LOS', 'DCN / ECRF'],
  },
  {
    id: 'turnotech',
    organization: 'Turnotech',
    role: 'Telecom & Networking Engineer',
    type: 'Previous',
    points: [
      'Telecom field deployment support.',
      'Site surveys and equipment staging.',
      'RF cabling inspections.',
      'Transmission testing support.',
      'Network quality reporting.',
    ],
  },
  {
    id: 'ntc',
    organization: 'National Telecommunication Corporation (NTC)',
    role: 'Telecommunications Engineering Intern',
    type: 'Internship',
    points: [
      'Telecom backbones and exchange switching exposure.',
      'NOC surveillance workflows.',
      'Fault detection and transmission redundancy.',
      'Enterprise networking infrastructure.',
    ],
  },
  {
    id: 'ptcl',
    organization: 'Pakistan Telecommunication Company Limited (PTCL)',
    role: 'Network Operations Intern',
    type: 'Internship',
    points: [
      'Optical distribution networks.',
      'Fiber splicing and OTDR testing exposure.',
      'FTTN architecture.',
      'Physical-layer maintenance and broadband access networks.',
    ],
  },
];

/* ------------------------------------------------------------------------ */
/*  RESEARCH MODEL — supplied parameters                                    */
/* ------------------------------------------------------------------------ */

export const researchModel = {
  title: 'Sub-MHz Inductive Wireless Power Link for Neurostimulators',
  frequencyKHz: 433,
  separationMm: 14,
  misalignmentDeg: 0,
  coupling: 0.372,
  efficiency: 0.88,
  sar: '0.017 W/kg',
  thermal: '< 0.25 °C',
  disclaimer:
    'Educational engineering visualization based on the supplied research model. Results are illustrative and do not establish clinical safety, medical-device compliance, or validated implant performance.',
};

export const philosophy = [
  { title: 'Precision alignment', text: 'A link is only as good as the last bolt tightened after the antenna is on the main lobe.' },
  { title: 'Systematic fault-finding', text: 'Work from the physical layer upward and change one variable at a time.' },
  { title: 'Quality governance', text: 'If it is not documented and photographed, it has not been accepted.' },
  { title: 'Practical delivery', text: 'Plans meet towers, weather and access windows — execution has to adapt without cutting corners.' },
  { title: 'Analytical thinking', text: 'Research in electromagnetic modeling informs how field problems are reasoned through.' },
];
