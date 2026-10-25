/**
 * Content model for the portfolio. All profile information lives in
 * `src/data/profile.ts` — components only read from these structures.
 */

export interface Profile {
  name: string;
  monogram: string;
  title: string;
  role: string;
  affiliation: string;
  projectAssociation: string;
  location: string;
  institution: string;
  institutionShort: string;
  degree: string;
  primaryDomain: string;
  platforms: string;
  research: string;
  email: string;
  /** Only set when a real profile URL has been supplied. Empty string hides LinkedIn links. */
  linkedinUrl: string;
  portrait: {
    src: string;
    srcSmall: string;
    fallback: string;
    alt: string;
    width: number;
    height: number;
  };
  /**
   * Path to a real résumé PDF inside /public. The download button stays disabled
   * until a file is actually served from this path (checked at runtime).
   */
  resumePdfUrl: string;
}

export interface ProjectHotspot {
  id: string;
  label: string;
  detail: string;
}

export interface Project {
  id: string;
  number: string;
  kind: string;
  title: string;
  description: string;
  context: string;
  competencies: string[];
  viz: 'coil' | 'link' | 'site';
  hotspots: ProjectHotspot[];
  integrityNote?: string;
}

export interface ChainNode {
  id: string;
  short: string;
  /** Compact label for the chain diagram. */
  label: string;
  name: string;
  side: 'tx' | 'path' | 'rx' | 'network';
  role: string;
  parameters: string[];
  installation: string[];
  troubleshooting: string[];
}

export interface ExpertiseCategory {
  id: 'microwave' | 'operations' | 'infrastructure' | 'research';
  code: string;
  title: string;
  summary: string;
  items: { name: string; note: string }[];
}

export interface ExperienceItem {
  id: string;
  organization: string;
  role: string;
  type: 'Current' | 'Previous' | 'Internship';
  context?: string;
  points: string[];
  systems?: string[];
}
