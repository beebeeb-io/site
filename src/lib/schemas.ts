/**
 * JSON-LD structured data helpers for SEO.
 * Each function returns a plain object ready for JSON.stringify.
 */

const SITE_URL = 'https://beebeeb.io';

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Beebeeb',
    url: SITE_URL,
    description: 'End-to-end encrypted, zero-knowledge cloud storage. Made in Europe.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/support?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Beebeeb',
    legalName: 'Initlabs B.V.',
    url: SITE_URL,
    description: 'End-to-end encrypted, zero-knowledge cloud storage. Made in Europe.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kelvinstraat 34A',
      addressLocality: 'Wijchen',
      postalCode: '6601 HE',
      addressCountry: 'NL',
    },
    sameAs: ['https://github.com/beebeeb-io'],
  };
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Beebeeb',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Windows, macOS, Linux, iOS, Android, Web',
    description: 'End-to-end encrypted, zero-knowledge cloud storage. Made in Europe.',
    url: SITE_URL,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '0',
      highPrice: '109.90',
      offerCount: '3',
    },
  };
}

export interface ArticleSchemaOpts {
  headline: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  url?: string;
}

export function articleSchema(opts: ArticleSchemaOpts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    ...(opts.description && { description: opts.description }),
    datePublished: opts.datePublished,
    ...(opts.dateModified && { dateModified: opts.dateModified }),
    author: {
      '@type': 'Person',
      name: opts.authorName || 'Beebeeb Team',
    },
    publisher: organizationSchema(),
    ...(opts.image && { image: opts.image }),
    ...(opts.url && { url: opts.url }),
  };
}

export interface ProductSchemaOpts {
  name: string;
  description?: string;
  priceCurrency?: string;
  price: string;
  url?: string;
}

export function productSchema(opts: ProductSchemaOpts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    ...(opts.description && { description: opts.description }),
    offers: {
      '@type': 'Offer',
      priceCurrency: opts.priceCurrency || 'EUR',
      price: opts.price,
      availability: 'https://schema.org/InStock',
    },
    ...(opts.url && { url: opts.url }),
  };
}
