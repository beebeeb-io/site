import termsText from '../content/legal/terms.txt?raw';
import privacyText from '../content/legal/privacy.txt?raw';
import dpaText from '../content/legal/dpa.txt?raw';
import acceptableUseText from '../content/legal/acceptable-use.txt?raw';
import cookiesText from '../content/legal/cookies.txt?raw';
import subProcessorsText from '../content/legal/sub-processors.txt?raw';
import lawEnforcementText from '../content/legal/law-enforcement.txt?raw';
import transparencyText from '../content/legal/transparency.txt?raw';
import complaintsText from '../content/legal/complaints.txt?raw';
import slaText from '../content/legal/sla.txt?raw';

export interface LegalDoc {
  slug: string;
  title: string;
  href: string;
  description: string;
  sourceName: string;
  text: string;
}

export const legalDocs = {
  terms: {
    slug: 'terms',
    title: 'Terms of Service',
    href: '/terms',
    description: 'The terms that govern use of the Beebeeb service.',
    sourceName: '01 Terms of Service',
    text: termsText,
  },
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    href: '/privacy',
    description: 'How Beebeeb processes personal data and what our zero-knowledge architecture means for privacy.',
    sourceName: '02 Privacy Policy',
    text: privacyText,
  },
  dpa: {
    slug: 'dpa',
    title: 'Data Processing Agreement',
    href: '/dpa',
    description: 'GDPR Article 28 data processing terms for business customers.',
    sourceName: '03 Data Processing Agreement',
    text: dpaText,
  },
  acceptableUse: {
    slug: 'aup',
    title: 'Acceptable Use Policy',
    href: '/aup',
    description: 'Rules for lawful and acceptable use of the Beebeeb service.',
    sourceName: '04 Acceptable Use Policy',
    text: acceptableUseText,
  },
  cookies: {
    slug: 'cookies',
    title: 'Cookie Statement',
    href: '/cookies',
    description: 'Which cookies and similar technologies Beebeeb uses.',
    sourceName: '05 Cookie Statement',
    text: cookiesText,
  },
  subProcessors: {
    slug: 'sub-processors',
    title: 'Sub-processor List',
    href: '/sub-processors',
    description: 'The current list of service providers and sub-processors used by Beebeeb.',
    sourceName: '06 Sub-processor List',
    text: subProcessorsText,
  },
  lawEnforcement: {
    slug: 'law-enforcement',
    title: 'Law Enforcement Guidelines',
    href: '/law-enforcement',
    description: 'How Beebeeb handles requests from authorities and what data we can and cannot provide.',
    sourceName: '07 Law Enforcement Guidelines',
    text: lawEnforcementText,
  },
  transparency: {
    slug: 'transparency',
    title: 'Transparency Report',
    href: '/transparency',
    description: 'Aggregated reporting on government and third-party requests.',
    sourceName: '08 Transparency Report',
    text: transparencyText,
  },
  complaints: {
    slug: 'complaints',
    title: 'Complaints Procedure DSA',
    href: '/complaints',
    description: 'Internal complaint handling under Article 20 of the Digital Services Act.',
    sourceName: '10 Complaints Procedure DSA',
    text: complaintsText,
  },
  sla: {
    slug: 'sla',
    title: 'Service Level Agreement',
    href: '/sla',
    description: 'Availability and support commitments for eligible business customers.',
    sourceName: '11 Service Level Agreement',
    text: slaText,
  },
} satisfies Record<string, LegalDoc>;

export const legalDocList = [
  legalDocs.terms,
  legalDocs.privacy,
  legalDocs.dpa,
  legalDocs.acceptableUse,
  legalDocs.cookies,
  legalDocs.subProcessors,
  legalDocs.lawEnforcement,
  legalDocs.transparency,
  legalDocs.complaints,
  legalDocs.sla,
];
