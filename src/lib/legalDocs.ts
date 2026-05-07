import termsHtml from '../content/legal/terms.html?raw';
import privacyHtml from '../content/legal/privacy.html?raw';
import dpaHtml from '../content/legal/dpa.html?raw';
import acceptableUseHtml from '../content/legal/acceptable-use.html?raw';
import cookiesHtml from '../content/legal/cookies.html?raw';
import subProcessorsHtml from '../content/legal/sub-processors.html?raw';
import lawEnforcementHtml from '../content/legal/law-enforcement.html?raw';
import transparencyHtml from '../content/legal/transparency.html?raw';
import complaintsHtml from '../content/legal/complaints.html?raw';
import slaHtml from '../content/legal/sla.html?raw';

export interface LegalDoc {
  slug: string;
  title: string;
  href: string;
  description: string;
  sourceName: string;
  html: string;
}

export const legalDocs = {
  terms: {
    slug: 'terms',
    title: 'Terms of Service',
    href: '/terms',
    description: 'The terms that govern use of the Beebeeb service.',
    sourceName: '01 Terms of Service',
    html: termsHtml,
  },
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    href: '/privacy',
    description: 'How Beebeeb processes personal data and what our zero-knowledge architecture means for privacy.',
    sourceName: '02 Privacy Policy',
    html: privacyHtml,
  },
  dpa: {
    slug: 'dpa',
    title: 'Data Processing Agreement',
    href: '/dpa',
    description: 'GDPR Article 28 data processing terms for business customers.',
    sourceName: '03 Data Processing Agreement',
    html: dpaHtml,
  },
  acceptableUse: {
    slug: 'aup',
    title: 'Acceptable Use Policy',
    href: '/aup',
    description: 'Rules for lawful and acceptable use of the Beebeeb service.',
    sourceName: '04 Acceptable Use Policy',
    html: acceptableUseHtml,
  },
  cookies: {
    slug: 'cookies',
    title: 'Cookie Statement',
    href: '/cookies',
    description: 'Which cookies and similar technologies Beebeeb uses.',
    sourceName: '05 Cookie Statement',
    html: cookiesHtml,
  },
  subProcessors: {
    slug: 'sub-processors',
    title: 'Sub-processor List',
    href: '/sub-processors',
    description: 'The current list of service providers and sub-processors used by Beebeeb.',
    sourceName: '06 Sub-processor List',
    html: subProcessorsHtml,
  },
  lawEnforcement: {
    slug: 'law-enforcement',
    title: 'Law Enforcement Guidelines',
    href: '/law-enforcement',
    description: 'How Beebeeb handles requests from authorities and what data we can and cannot provide.',
    sourceName: '07 Law Enforcement Guidelines',
    html: lawEnforcementHtml,
  },
  transparency: {
    slug: 'transparency',
    title: 'Transparency Report',
    href: '/transparency',
    description: 'Aggregated reporting on government and third-party requests.',
    sourceName: '08 Transparency Report',
    html: transparencyHtml,
  },
  complaints: {
    slug: 'complaints',
    title: 'Complaints Procedure DSA',
    href: '/complaints',
    description: 'Internal complaint handling under Article 20 of the Digital Services Act.',
    sourceName: '10 Complaints Procedure DSA',
    html: complaintsHtml,
  },
  sla: {
    slug: 'sla',
    title: 'Service Level Agreement',
    href: '/sla',
    description: 'Availability and support commitments for eligible business customers.',
    sourceName: '11 Service Level Agreement',
    html: slaHtml,
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
